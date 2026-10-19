#!/usr/bin/env python3
"""preview.py <draft.md> [out.html] — render a draft as a plain reading page.

Deliberately plain, in the spirit of paulgraham.com: white page, Verdana, one
narrow column, no chrome. No rails, no tabs, no cards, no JavaScript. The page
exists so Prag can read his own writing the way a reader will, and nothing else.

The markdown file is the source of truth. Re-run after every edit.
Markdown subset: paragraphs, h2/h3, **strong**, *em*, `code`, [links](url),
> blockquote, ---, lists. A [?] or [EXAMPLE? ...] marker renders in grey.

A level-2 heading spelled exactly "Companion X post" ends the essay: nothing
after it is rendered. Counts print to the terminal, not onto the page.
"""

import html
import re
import sys
from datetime import date
from pathlib import Path

X_SPLIT = re.compile(r"^##\s+Companion X post\s*$", re.M | re.I)
FLAG = re.compile(r"\[(\?|EXAMPLE\?|TODO\?|NUMBER\?|CHECK\?)([^\]]*)\]")


def parse_frontmatter(text):
    meta = {}
    m = re.match(r"\A---\n(.*?)\n---\n?", text, re.S)
    if not m:
        return meta, text
    for line in m.group(1).splitlines():
        if not line.strip() or line.lstrip().startswith("#") or ":" not in line:
            continue
        k, v = line.split(":", 1)
        meta[k.strip()] = v.strip().strip("'\"")
    return meta, text[m.end():]


def typography(s):
    out = []
    for i, seg in enumerate(s.split("`")):
        if i % 2:
            out.append(seg)
            continue
        seg = re.sub(r'(^|[\s([{<])"', "\\1\u201c", seg)
        seg = seg.replace('"', "\u201d")
        seg = re.sub(r"(\w)'(\w)", "\\1\u2019\\2", seg)
        seg = re.sub(r"(^|[\s([{])'", "\\1\u2018", seg)
        seg = seg.replace("'", "\u2019").replace("...", "\u2026")
        out.append(seg)
    return "`".join(out)


def inline(s):
    s = html.escape(typography(s), quote=False)
    s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', s)
    s = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", s)
    s = FLAG.sub(lambda m: f'<span class="q">[{m.group(1)}{html.escape(m.group(2))}]</span>', s)
    return s


def render(md):
    out = []
    for b in re.split(r"\n\s*\n", md.strip()):
        b = b.strip()
        if not b:
            continue
        if re.fullmatch(r"-{3,}|\*{3,}", b):
            out.append("<hr>")
        elif b.startswith("### "):
            out.append(f"<h3>{inline(b[4:].strip())}</h3>")
        elif b.startswith(("## ", "# ")):
            out.append(f"<h2>{inline(b.lstrip('# ').strip())}</h2>")
        elif all(l.lstrip().startswith(">") for l in b.splitlines()):
            inner = " ".join(l.lstrip().lstrip(">").strip() for l in b.splitlines())
            out.append(f"<blockquote>{inline(inner)}</blockquote>")
        elif all(re.match(r"\s*[-*]\s+", l) for l in b.splitlines()):
            items = [re.sub(r"^\s*[-*]\s+", "", l) for l in b.splitlines()]
            out.append("<ul>" + "".join(f"<li>{inline(i)}</li>" for i in items) + "</ul>")
        elif all(re.match(r"\s*\d+[.)]\s+", l) for l in b.splitlines()):
            items = [re.sub(r"^\s*\d+[.)]\s+", "", l) for l in b.splitlines()]
            out.append("<ol>" + "".join(f"<li>{inline(i)}</li>" for i in items) + "</ol>")
        else:
            out.append(f"<p>{inline(b)}</p>")
    return "\n".join(out)


TEMPLATE = """<title>__TITLE__</title>
<style>
  html{background:#fff}
  body{background:#fff; color:#000; margin:0;
    font:15px/1.5 Verdana,Geneva,Tahoma,sans-serif;}
  .page{max-width:540px; margin:0 auto; padding-left:20px; padding-right:20px;
    padding-block:44px 96px;}
  h1{font-size:19px; font-weight:bold; margin:0 0 4px; line-height:1.3}
  .date{color:#666; font-size:13px; margin:0 0 26px}
  p{margin:0 0 1.15em}
  h2{font-size:15px; font-weight:bold; margin:1.9em 0 .8em}
  h3{font-size:15px; font-weight:bold; margin:1.6em 0 .7em}
  blockquote{margin:1.3em 0 1.3em 1.6em; padding:0}
  ul,ol{margin:0 0 1.15em; padding-left:1.7em}
  li{margin:.3em 0}
  hr{border:0; border-top:1px solid #ddd; margin:2em 0}
  a{color:#00e}
  code{font-family:Menlo,Consolas,monospace; font-size:13px}
  .q{color:#999}
  img{max-width:100%}
</style>

<div class="page">
  <h1>__TITLE__</h1>
  <p class="date">__DATE__</p>
__BODY__
</div>
"""


def build(path, out=None):
    raw = Path(path).read_text(encoding="utf-8")
    meta, body = parse_frontmatter(raw)
    body = re.sub(r"<!--.*?-->", "", body, flags=re.S)
    body = X_SPLIT.split(body)[0]
    body = re.sub(r"\A\s*#\s+.*\n", "", body)

    words = len(re.findall(r"\b[\w'\u2019-]+\b", FLAG.sub("", body)))
    flags = len(FLAG.findall(body))

    page = TEMPLATE
    for token, value in {
        "__TITLE__": html.escape(typography(meta.get("title", "Untitled"))),
        "__DATE__": html.escape(meta.get("date") or date.today().strftime("%B %d, %Y")),
        "__BODY__": render(body),
    }.items():
        page = page.replace(token, value)

    dest = Path(out) if out else Path(path).with_suffix(".html")
    dest.write_text(page, encoding="utf-8")
    return dest, words, flags


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("usage: preview.py <draft.md> [out.html]")
    dest, words, flags = build(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
    print(f"{dest}  ({words} words" + (f", {flags} open markers)" if flags else ")"))
