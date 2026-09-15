#!/usr/bin/env python3
"""Turn a phrase in a case exhibit into hotspot coordinates on its screenshot.

Run exhibit_shots.py first: it writes geometry.json, which this needs.

Usage:
  python3 exhibit_boxes.py CASE.pdf ASSET_DIR PAGE SPEC [SPEC ...]

A SPEC is one of:
  row:Total Revenue          the whole horizontal band that line sits on
  block:REVENUE..Total Revenue   every band from the first line to the second
  word:$6,002,529            just those words, on the first line carrying them
  word:$6,002,529#2          the second line carrying them
  col:2016                   the column under that heading, down the whole table

Each spec may carry a label after a '=':
  block:REVENUE..Total Revenue=rev

Prints one <button class="hs"> per spec, with --x/--y/--w/--h as percentages of
the screenshot, ready to paste inside <div class="canvas">.
"""
import json, os, re, subprocess, sys
from xml.etree import ElementTree as ET

PAD = 3.0  # points of breathing room around a box


def words_on_page(pdf, page):
    xml = subprocess.run(['pdftotext', '-bbox-layout', '-f', str(page), '-l', str(page),
                          pdf, '-'], capture_output=True, text=True).stdout
    xml = re.sub(r'<!DOCTYPE[^>]*>', '', xml)
    root = ET.fromstring(xml)
    ns = {'x': 'http://www.w3.org/1999/xhtml'}
    pg = root.find('.//x:page', ns) if root.find('.//x:page', ns) is not None else root.find('.//page')
    out = []
    for w in pg.iter():
        if not w.tag.endswith('word'):
            continue
        out.append({'t': (w.text or '').strip(),
                    'x0': float(w.get('xMin')), 'y0': float(w.get('yMin')),
                    'x1': float(w.get('xMax')), 'y1': float(w.get('yMax'))})
    return out, float(pg.get('width')), float(pg.get('height'))


def rows(words, tol=3.0):
    """Group words into horizontal bands, because table columns are separate blocks."""
    out = []
    for w in sorted(words, key=lambda w: (w['y0'], w['x0'])):
        for r in out:
            if abs(r['y0'] - w['y0']) <= tol:
                r['w'].append(w)
                r['y0'] = min(r['y0'], w['y0']); r['y1'] = max(r['y1'], w['y1'])
                break
        else:
            out.append({'y0': w['y0'], 'y1': w['y1'], 'w': [w]})
    for r in out:
        r['w'].sort(key=lambda w: w['x0'])
        r['text'] = ' '.join(x['t'] for x in r['w'])
    return out


def norm(t):
    """Squash case, spaces and punctuation. Ivey exhibits set headings in small caps,
    which pdftotext hands back as 'R EVENUE', so plain string matching misses them."""
    return re.sub(r'[^a-z0-9$]', '', t.lower())


def find_row(rs, phrase):
    """Exact line beats a line that starts with it, which beats one that contains it,
    so block:REVENUE picks the REVENUE heading and not the exhibit title above it."""
    p = norm(phrase)
    exact  = [r for r in rs if norm(r['text']) == p]
    starts = [r for r in rs if norm(r['text']).startswith(p)]
    has    = [r for r in rs if p in norm(r['text'])]
    for bucket in (exact, starts, has):
        if bucket:
            return bucket[0]
    sys.exit(f'Not found on this page: {phrase!r}')


def union(items):
    return (min(i['x0'] for i in items), min(i['y0'] for i in items),
            max(i['x1'] for i in items), max(i['y1'] for i in items))


def resolve(spec, rs):
    kind, _, rest = spec.partition(':')
    if kind == 'row':
        return union(find_row(rs, rest)['w'])
    if kind == 'block':
        a, _, b = rest.partition('..')
        ra = find_row(rs, a)
        # the end anchor is searched only below the start, so a phrase that also
        # appears higher up the page (another account's description, say) is skipped
        below = [r for r in rs if r['y0'] >= ra['y0'] - 1]
        rb = find_row(below, b)
        band = [r for r in below if r['y0'] <= rb['y0'] + 1]
        return union([w for r in band for w in r['w']])
    if kind == 'word':
        # '#2' picks the second occurrence, and matches are kept to one line, so a
        # figure that appears twice on the page does not union into a giant box
        rest, _, nth = rest.partition('#')
        nth = int(nth) if nth else 1
        lines = [[w for w in r['w'] if norm(rest) in norm(w['t'])] for r in rs]
        lines = [l for l in lines if l]
        if len(lines) < nth:
            sys.exit(f'Only {len(lines)} line(s) carry {rest!r} on this page')
        return union(lines[nth - 1])
    if kind == 'col':
        head = [w for r in rs for w in r['w'] if norm(w['t']) == norm(rest)]
        if not head:
            sys.exit(f'No column heading {rest!r} on this page')
        h = head[0]
        cx = (h['x0'] + h['x1']) / 2
        # every word whose centre sits within half a heading width of the heading's
        below = [w for r in rs for w in r['w']
                 if w['y0'] >= h['y0'] - 1 and abs((w['x0'] + w['x1']) / 2 - cx) < 40]
        return union(below + [h])
    sys.exit(f'Unknown spec kind {kind!r}. Use row:, block:, word: or col:')


def main():
    pdf, asset_dir, page = sys.argv[1], sys.argv[2], int(sys.argv[3])
    specs = sys.argv[4:]
    if not specs:
        sys.exit(__doc__)

    geom = json.load(open(os.path.join(asset_dir, 'geometry.json')))[str(page)]
    dpi, (tx, ty, tw, th), bd = geom['dpi'], geom['trim'], geom['border']
    if geom.get('chop_right') or geom.get('chop_bottom'):
        print('<!-- note: this page was chopped before trimming, so x/y may drift '
              'a little. Open the JPG and check the boxes land. -->')
    scale = dpi / 72.0
    fw, fh = tw + 2 * bd, th + 2 * bd

    def pct(x0, y0, x1, y1):
        px0 = (x0 - PAD) * scale - tx + bd
        py0 = (y0 - PAD) * scale - ty + bd
        px1 = (x1 + PAD) * scale - tx + bd
        py1 = (y1 + PAD) * scale - ty + bd
        return (100 * px0 / fw, 100 * py0 / fh,
                100 * (px1 - px0) / fw, 100 * (py1 - py0) / fh)

    for i, spec in enumerate(specs, 1):
        spec, _, label = spec.partition('=')
        x0, y0, x1, y1 = resolve(spec, rows(words_on_page(pdf, page)[0]))
        x, y, w, h = pct(x0, y0, x1, y1)
        label = label or f'h{i}'
        print(f'<button class="hs" data-mark="{label}" aria-label="{spec}"\n'
              f'        style="--x:{x:.1f}%;--y:{y:.1f}%;--w:{w:.1f}%;--h:{h:.1f}%">'
              f'<span class="pin">{i}</span></button>')


if __name__ == '__main__':
    main()
