#!/bin/bash
# Render a cover letter HTML to PDF and verify it against the skill's rules.
#
#   build.sh <input.html> [output.pdf]
#
# Exits non-zero if the letter runs past one page, is missing Times New Roman,
# or contains an em dash. Fix what it reports and run it again.

set -euo pipefail

IN="${1:?usage: build.sh <input.html> [output.pdf]}"
OUT="${2:-${IN%.html}.pdf}"

[ -f "$IN" ] || { echo "no such file: $IN" >&2; exit 1; }

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [ ! -x "$CHROME" ]; then
  for c in "/Applications/Chromium.app/Contents/MacOS/Chromium" \
           "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
           "$(command -v chromium 2>/dev/null || true)"; do
    [ -n "$c" ] && [ -x "$c" ] && CHROME="$c" && break
  done
fi
[ -x "$CHROME" ] || { echo "need a Chrome-family browser to render the PDF" >&2; exit 1; }

# Chrome needs an absolute file:// URL.
ABS_IN="$(cd "$(dirname "$IN")" && pwd)/$(basename "$IN")"

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$OUT" "file://$ABS_IN" >/dev/null 2>&1

[ -f "$OUT" ] || { echo "render produced no file" >&2; exit 1; }

FAIL=0

# 1. One page.
if command -v pdfinfo >/dev/null 2>&1; then
  PAGES="$(pdfinfo "$OUT" | awk '/^Pages:/ {print $2}')"
  if [ "$PAGES" != "1" ]; then
    echo "FAIL  $PAGES pages. Cut sentences first, then tighten line-height toward 1.25 and margins toward 0.85in." >&2
    if command -v pdftotext >/dev/null 2>&1; then
      echo "      spilling onto page 2:" >&2
      pdftotext -f 2 -l 2 "$OUT" - 2>/dev/null | sed '/^$/d' | sed 's/^/        /' >&2
    fi
    FAIL=1
  else
    echo "ok    1 page"
  fi
fi

# 2. Times New Roman, embedded.
if command -v pdffonts >/dev/null 2>&1; then
  if pdffonts "$OUT" | grep -qi "times"; then
    echo "ok    Times New Roman embedded"
  else
    echo "FAIL  Times New Roman is not in the PDF. The font-family fell through to a substitute." >&2
    FAIL=1
  fi
fi

# 3. No em dashes. Check the rendered text, not just the source.
# macOS ships bash 3.2, where $'—' is not an escape and silently becomes a
# literal backslash-u string, so build the character from its UTF-8 bytes instead.
EMDASH="$(printf '\xe2\x80\x94')"
if command -v pdftotext >/dev/null 2>&1; then
  N="$(pdftotext "$OUT" - 2>/dev/null | grep -c "$EMDASH" || true)"
  if [ "${N:-0}" -gt 0 ] 2>/dev/null; then
    echo "FAIL  $N line(s) contain an em dash. Rewrite as two sentences, or use a comma or colon." >&2
    pdftotext "$OUT" - 2>/dev/null | grep -n "$EMDASH" | sed 's/^/        /' >&2
    FAIL=1
  else
    echo "ok    no em dashes"
  fi
fi

if [ "$FAIL" -ne 0 ]; then
  echo "" >&2
  echo "$OUT was written but does not pass. Do not send it." >&2
  exit 2
fi

echo ""
echo "$OUT"
echo "Look at it before sending:  pdftoppm -png -r 90 -f 1 -l 1 \"$OUT\" preview"
