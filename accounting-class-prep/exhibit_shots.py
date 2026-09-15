#!/usr/bin/env python3
"""Render the exhibit pages of a case PDF to trimmed JPGs.

Usage:
  python3 exhibit_shots.py CASE.pdf OUT_DIR [--pages 5,6,7] [--dpi 170]
                           [--width 1200] [--chop-right 110] [--chop-bottom 60]

With no --pages it finds every page whose text has a line starting "Exhibit".
Writes OUT_DIR/exhibit-<page>.jpg and prints a <figure> block per shot,
plus the exhibit title it read off the page. Also writes OUT_DIR/geometry.json,
which exhibit_boxes.py needs to turn PDF coordinates into hotspot percentages,
so run this before you ask for clickable highlights.

--chop-right shaves the sideways Ivey copyright rail off the right edge and
--chop-bottom shaves the page-number footer, both in pixels at the chosen dpi.
Always open the JPG and look at it before deciding whether you need them.

Needs pdftotext + pdftoppm (poppler) and magick (ImageMagick).
"""
import argparse, json, os, re, subprocess, sys


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True).stdout


def find_pages(pdf):
    text = run(['pdftotext', '-layout', pdf, '-'])
    found = []
    for i, page in enumerate(text.split('\f'), 1):
        for line in page.splitlines():
            s = line.strip()
            if re.match(r'^Exhibit\s+\d+', s):
                found.append((i, re.sub(r'\s{2,}', ' ', s)))
                break
    return found


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pdf')
    ap.add_argument('out_dir')
    ap.add_argument('--pages', default='')
    ap.add_argument('--dpi', type=int, default=170)
    ap.add_argument('--width', type=int, default=1200)
    ap.add_argument('--chop-right', type=int, default=0)
    ap.add_argument('--chop-bottom', type=int, default=0)
    a = ap.parse_args()

    os.makedirs(a.out_dir, exist_ok=True)
    if a.pages:
        pages = [(int(p), '') for p in a.pages.split(',')]
    else:
        pages = find_pages(a.pdf)
    if not pages:
        sys.exit('No exhibit pages found. Pass --pages explicitly.')

    geom = {}
    for page, title in pages:
        raw = os.path.join(a.out_dir, f'raw-{page}.png')
        subprocess.run(['pdftoppm', '-f', str(page), '-l', str(page),
                        '-r', str(a.dpi), '-png', '-singlefile', a.pdf,
                        raw[:-4]], check=True)
        # trim box, measured before we crop, so PDF points can be mapped back
        tb = subprocess.run(['magick', raw, '-format', '%@', 'info:'],
                            capture_output=True, text=True).stdout.strip()
        m = re.match(r'(\d+)x(\d+)\+(-?\d+)\+(-?\d+)', tb)
        tw, th, tx, ty = (int(g) for g in m.groups()) if m else (0, 0, 0, 0)
        border = 18
        geom[str(page)] = {'dpi': a.dpi, 'trim': [tx, ty, tw, th], 'border': border,
                           'chop_right': a.chop_right, 'chop_bottom': a.chop_bottom}

        jpg = os.path.join(a.out_dir, f'exhibit-{page}.jpg')
        chop = []
        if a.chop_right:
            chop += ['-gravity', 'East', '-chop', f'{a.chop_right}x0']
        if a.chop_bottom:
            chop += ['-gravity', 'South', '-chop', f'0x{a.chop_bottom}']
        subprocess.run(['magick', raw, *chop, '-trim', '+repage',
                        '-bordercolor', 'white', '-border', str(border),
                        '-resize', f'{a.width}x', '-quality', '82', jpg], check=True)
        os.remove(raw)
        kb = os.path.getsize(jpg) // 1024
        rel = os.path.basename(a.out_dir) + '/' + os.path.basename(jpg)
        print(f'\n<!-- p.{page}  {title}  {kb}KB -->')
        print(f'<figure class="shot">\n  <img src="{rel}" alt="{title or f"Exhibit, page {page}"}">\n'
              f'  <figcaption>{title or ""} · case p.{page}</figcaption>\n</figure>')


    with open(os.path.join(a.out_dir, 'geometry.json'), 'w') as fh:
        json.dump(geom, fh, indent=2)
    print(f"\n<!-- geometry.json written, {len(geom)} page(s). "
          f"Feed it to exhibit_boxes.py for clickable highlights. -->")


if __name__ == '__main__':
    main()
