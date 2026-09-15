#!/usr/bin/env python3
"""Create a Gmail draft with both plain-text and HTML bodies via gws."""

from __future__ import annotations

import argparse
import base64
import html
import json
import re
import subprocess
import sys
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from urllib.parse import urlparse

BARE_URL_RE = re.compile(r"^https?://\S+$")
LIST_ITEM_RE = re.compile(r"^\s*[-*]\s+(?P<text>.+)$")
INLINE_TOKEN_RE = re.compile(r"\[([^\]]+)\]\((https?://[^)\s]+)\)|(https?://[^\s<>()]+)")


def _read_body(path: Path) -> str:
    text = path.read_text()
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    return text.strip()


def _split_blocks(text: str) -> list[list[str]]:
    blocks: list[list[str]] = []
    current: list[str] = []

    for raw_line in text.split("\n"):
        line = raw_line.rstrip()
        if not line.strip():
            if current:
                blocks.append(current)
                current = []
            continue
        current.append(line)

    if current:
        blocks.append(current)

    return blocks


def _parse_list_items(lines: list[str]) -> list[list[str]] | None:
    items: list[list[str]] = []
    current: list[str] | None = None

    for line in lines:
        match = LIST_ITEM_RE.match(line)
        if match:
            current = [match.group("text").strip()]
            items.append(current)
            continue

        if current is None:
            return None

        current.append(line.strip())

    return items if items else None


def _collapse_lines(lines: list[str]) -> str:
    collapsed: list[str] = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        if BARE_URL_RE.match(stripped) and collapsed:
            collapsed[-1] = f"{collapsed[-1]} ({stripped})"
            continue

        collapsed.append(stripped)

    return " ".join(collapsed)


def _label_for_url(url: str) -> str:
    parsed = urlparse(url)
    host = parsed.netloc.removeprefix("www.")
    path_parts = [part for part in parsed.path.split("/") if part]

    if host == "x.com" and path_parts:
        return f"{host}/{path_parts[0]}"

    return host or url


def _render_plain_inline(text: str) -> str:
    def replace(match: re.Match[str]) -> str:
        label = match.group(1)
        markdown_url = match.group(2)
        bare_url = match.group(3)

        if label and markdown_url:
            return f"{label} ({markdown_url})"

        return bare_url or ""

    return INLINE_TOKEN_RE.sub(replace, text)


def _render_html_inline(text: str) -> str:
    parts: list[str] = []
    last = 0

    for match in INLINE_TOKEN_RE.finditer(text):
        parts.append(html.escape(text[last:match.start()]))

        label = match.group(1)
        markdown_url = match.group(2)
        bare_url = match.group(3)
        url = markdown_url or bare_url or ""
        anchor_label = label or _label_for_url(url)

        parts.append(
            f'<a href="{html.escape(url, quote=True)}">{html.escape(anchor_label)}</a>'
        )
        last = match.end()

    parts.append(html.escape(text[last:]))
    return "".join(parts)


def _render_plain_text(text: str) -> str:
    rendered_blocks: list[str] = []

    for block in _split_blocks(text):
        items = _parse_list_items(block)
        if items is not None:
            rendered_blocks.append(
                "\n".join(f"- {_render_plain_inline(_collapse_lines(item))}" for item in items)
            )
            continue

        rendered_blocks.append(_render_plain_inline(_collapse_lines(block)))

    return "\n\n".join(rendered_blocks).strip()


def _render_html(text: str) -> str:
    rendered_blocks: list[str] = []

    for block in _split_blocks(text):
        items = _parse_list_items(block)
        if items is not None:
            list_items = "".join(
                f"<li>{_render_html_inline(_collapse_lines(item))}</li>" for item in items
            )
            rendered_blocks.append(f"<ul>{list_items}</ul>")
            continue

        rendered_blocks.append(f"<p>{_render_html_inline(_collapse_lines(block))}</p>")

    return "<div>" + "".join(rendered_blocks) + "</div>"


def _set_headers(msg: MIMEMultipart, args: argparse.Namespace) -> None:
    msg["Subject"] = args.subject
    if args.to:
        msg["To"] = args.to
    if args.cc:
        msg["Cc"] = args.cc
    if args.bcc:
        msg["Bcc"] = args.bcc
    if args.from_address:
        msg["From"] = args.from_address
    if args.reply_to:
        msg["Reply-To"] = args.reply_to


def _attach_files(msg: MIMEMultipart, paths: list[str]) -> None:
    for raw_path in paths:
        path = Path(raw_path)
        part = MIMEBase("application", "octet-stream")
        part.set_payload(path.read_bytes())
        encoders.encode_base64(part)
        part.add_header("Content-Disposition", "attachment", filename=path.name)
        msg.attach(part)


def _build_raw_message(args: argparse.Namespace, plain_text: str, html_body: str) -> str:
    alternative = MIMEMultipart("alternative")
    alternative.attach(MIMEText(plain_text, "plain", "utf-8"))
    alternative.attach(MIMEText(html_body, "html", "utf-8"))

    if args.attach:
        message = MIMEMultipart("mixed")
        _set_headers(message, args)
        message.attach(alternative)
        _attach_files(message, args.attach)
    else:
        message = alternative
        _set_headers(message, args)

    raw = message.as_bytes()
    return base64.urlsafe_b64encode(raw).decode("ascii").rstrip("=")


def _build_command(args: argparse.Namespace, raw_message: str) -> list[str]:
    cmd = [
        args.gws_bin,
        "gmail",
        "users",
        "drafts",
        "create",
        "--params",
        json.dumps({"userId": args.user_id}),
        "--json",
        json.dumps({"message": {"raw": raw_message}}),
    ]

    if args.dry_run:
        cmd.append("--dry-run")

    return cmd


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Create a Gmail draft from a markdown-like email body while preserving "
            "paragraphs, bullets, and links in Gmail."
        )
    )
    parser.add_argument("--subject", required=True, help="Draft subject line.")
    parser.add_argument(
        "--body-file",
        required=True,
        type=Path,
        help="Path to the source email body (.md or .txt).",
    )
    parser.add_argument("--to", help="Comma-separated recipients.")
    parser.add_argument("--cc", help="Comma-separated CC recipients.")
    parser.add_argument("--bcc", help="Comma-separated BCC recipients.")
    parser.add_argument(
        "--user-id",
        default="me",
        help="Gmail userId for gws. Defaults to me (the authenticated account).",
    )
    parser.add_argument("--reply-to", help="Reply-To header address.")
    parser.add_argument(
        "--from-address",
        help="Send-from alias. Maps to the From header.",
    )
    parser.add_argument(
        "--attach",
        action="append",
        default=[],
        help="Attachment path. Repeat for multiple attachments.",
    )
    parser.add_argument("--gws-bin", default="gws", help="Path to gws binary.")
    parser.add_argument("--dry-run", action="store_true", help="Pass --dry-run to gws.")
    return parser.parse_args()


def main() -> int:
    args = _parse_args()
    source_text = _read_body(args.body_file)
    plain_text = _render_plain_text(source_text)
    html_body = _render_html(source_text)
    raw_message = _build_raw_message(args, plain_text, html_body)
    cmd = _build_command(args, raw_message)
    result = subprocess.run(cmd, check=False)
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())
