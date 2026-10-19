#!/usr/bin/env python3
"""Draft (or send) Gmail email through gws as HTML so Gmail never hard-wraps it.

Gmail hard-wraps plain-text-only messages at about 70 characters when they are
sent, which leaves a narrow column of text. This script turns a plain body file
into an HTML fragment and calls gws's +send / +reply / +reply-all helpers with
--html. It saves a draft by default; pass --send to deliver immediately.

Body file format (plain text with light markdown):
  - Blank lines separate paragraphs. Single newlines inside a paragraph are
    joined, so wrapping in the source file never shows up in the email.
  - A line that is only a URL stays on its own line and becomes a link.
  - Lines starting with "- " or "* " form a bulleted list; "1. " a numbered list.
  - [label](https://url) becomes a link; **bold** becomes bold.
  - Indented lines under a list item continue that item; an unindented line
    that is not a list marker ends the list and starts a paragraph.
  - A sign-off block such as "Thanks,\nPrag" (2-4 short lines starting with a
    common closing like Thanks, Best, Regards, Cheers) keeps its line breaks.
"""

from __future__ import annotations

import argparse
import html
import json
import re
import subprocess
import sys
from pathlib import Path

URL_ONLY = re.compile(r"^<?(https?://[^\s<>]+?)>?$")
BULLET = re.compile(r"^\s*[-*\u2022]\s+(.*)$")
NUMBERED = re.compile(r"^\s*\d+[.)]\s+(.*)$")
INLINE = re.compile(
    r"\[([^\]]+)\]\((https?://(?:[^()\s]|\([^()\s]*\))+)\)"   # [label](url), url may hold (..)
    r"|\*\*(.+?)\*\*"                        # **bold**
    r"|(https?://[^\s<>]+)"                   # bare url (trimmed below)
)
SHORT_LINE = 40
SIGN_OFF = re.compile(
    r"^(thanks|thank you|many thanks|thanks again|best|best regards|kind regards|regards|"
    r"warm regards|warmly|cheers|sincerely|all the best|talk soon|take care|appreciate it)[,.!]?$",
    re.IGNORECASE,
)
TRAILING = ".,;:!?'\""


def trim_url(url: str) -> tuple[str, str]:
    """Split trailing punctuation and unbalanced ')' off a bare URL."""
    tail = ""
    while url:
        last = url[-1]
        if last in TRAILING or (last == ")" and url.count(")") > url.count("(")):
            tail = last + tail
            url = url[:-1]
        else:
            break
    return url, tail


def inline(text: str) -> str:
    out, last = [], 0
    for m in INLINE.finditer(text):
        out.append(html.escape(text[last:m.start()]))
        label, url, bold, bare = m.groups()
        if url:
            out.append(f'<a href="{html.escape(url, quote=True)}">{html.escape(label)}</a>')
        elif bold:
            out.append(f"<b>{html.escape(bold)}</b>")
        else:
            url, tail = trim_url(bare)
            out.append(f'<a href="{html.escape(url, quote=True)}">{html.escape(url)}</a>{html.escape(tail)}')
        last = m.end()
    out.append(html.escape(text[last:]))
    return "".join(out)


def blocks(text: str) -> list[list[str]]:
    result, cur = [], []
    for line in text.replace("\r\n", "\n").replace("\r", "\n").split("\n"):
        if line.strip():
            cur.append(line.rstrip())
        elif cur:
            result.append(cur)
            cur = []
    if cur:
        result.append(cur)
    return result


def segments(lines: list[str]) -> list[tuple[str, list[str]]]:
    """Split a block into ('ul'|'ol', items) and ('p', lines) runs."""
    segs: list[tuple[str, list[str]]] = []
    for line in lines:
        b, n = BULLET.match(line), NUMBERED.match(line)
        kind = "ul" if b else "ol" if n else None
        if kind:
            item = (b or n).group(1).strip()
            if segs and segs[-1][0] == kind:
                segs[-1][1].append(item)
            else:
                segs.append((kind, [item]))
        elif segs and segs[-1][0] in ("ul", "ol") and line[:1].isspace():
            segs[-1][1][-1] += " " + line.strip()   # indented continuation
        elif segs and segs[-1][0] == "p":
            segs[-1][1].append(line)
        else:
            segs.append(("p", [line]))
    return segs


def paragraph(lines: list[str]) -> str:
    if (2 <= len(lines) <= 4 and SIGN_OFF.match(lines[0].strip())
            and all(len(l.strip()) < SHORT_LINE for l in lines)):
        return "<br>".join(inline(l.strip()) for l in lines)  # sign-offs, addresses
    parts: list[str] = []
    for line in lines:
        s = line.strip()
        m = URL_ONLY.match(s)
        if m:
            url, tail = trim_url(m.group(1))
            link = f'<a href="{html.escape(url, quote=True)}">{html.escape(url)}</a>{html.escape(tail)}'
            parts.append(("<br>" if parts else "") + link)
            continue
        if parts and parts[-1].startswith(("<br><a", "<a")) and "</a>" in parts[-1]:
            parts.append("<br>" + inline(s))
        else:
            parts.append((" " if parts else "") + inline(s))
    return "".join(parts)


def to_html(text: str) -> str:
    out = []
    for b in blocks(text.strip()):
        for kind, items in segments(b):
            if kind == "p":
                out.append(f"<p>{paragraph(items)}</p>")
            else:
                out.append(f"<{kind}>" + "".join(f"<li>{inline(i)}</li>" for i in items) + f"</{kind}>")
    return "<div>" + "".join(out) + "</div>"


def parse() -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="mode", required=True)

    def common(sp: argparse.ArgumentParser) -> None:
        sp.add_argument("--body-file", required=True, type=Path)
        sp.add_argument("--cc")
        sp.add_argument("--bcc")
        sp.add_argument("--from", dest="from_addr")
        sp.add_argument("-a", "--attach", action="append", default=[])
        sp.add_argument("--send", action="store_true", help="Send now. Default saves a draft.")
        sp.add_argument("--replace-draft", metavar="DRAFT_ID", help="Delete this older draft after the new one is saved.")
        sp.add_argument("--dry-run", action="store_true")
        sp.add_argument("--preview", action="store_true", help="Print the HTML and exit without calling gws.")
        sp.add_argument("--gws-bin", default="gws")

    new = sub.add_parser("new", help="New email (gws gmail +send)")
    new.add_argument("--to", required=True)
    new.add_argument("--subject", required=True)
    common(new)

    rep = sub.add_parser("reply", help="Reply in thread (gws gmail +reply / +reply-all)")
    rep.add_argument("--message-id", required=True, help="Gmail message id being replied to")
    rep.add_argument("--all", action="store_true", help="Reply-all")
    rep.add_argument("--to", help="Extra To recipients")
    common(rep)
    return p.parse_args()


def main() -> int:
    a = parse()
    body = to_html(a.body_file.read_text())
    if a.preview:
        print(body)
        return 0
    for path in a.attach:
        if not Path(path).is_file():
            print(f"attachment not found: {path}", file=sys.stderr)
            return 2

    if a.mode == "new":
        cmd = [a.gws_bin, "gmail", "+send", "--to", a.to, "--subject", a.subject]
    else:
        cmd = [a.gws_bin, "gmail", "+reply-all" if a.all else "+reply", "--message-id", a.message_id]
        if a.to:
            cmd += ["--to", a.to]
    cmd += ["--body", body, "--html"]
    for flag, val in (("--cc", a.cc), ("--bcc", a.bcc), ("--from", a.from_addr)):
        if val:
            cmd += [flag, val]
    for path in a.attach:
        cmd += ["-a", path]
    if not a.send:
        cmd.append("--draft")
    if a.dry_run:
        cmd.append("--dry-run")

    res = subprocess.run(cmd, capture_output=True, text=True)
    out = res.stdout
    sys.stdout.write(out)
    if res.returncode != 0:
        sys.stderr.write(res.stderr)
        return res.returncode

    if a.replace_draft and not a.dry_run:
        rm = subprocess.run(
            [a.gws_bin, "gmail", "users", "drafts", "delete",
             "--params", json.dumps({"userId": "me", "id": a.replace_draft})],
            capture_output=True, text=True,
        )
        if rm.returncode != 0:
            sys.stderr.write(f"new draft saved, but deleting {a.replace_draft} failed:\n{rm.stderr}")
            return rm.returncode
    return 0


if __name__ == "__main__":
    sys.exit(main())
