#!/usr/bin/env python3
"""Dump an .xlsx to plain text with no third-party libraries.

Usage:  python3 xlsx_dump.py file.xlsx [sheet-name-or-index]
Prints every sheet as a tab-separated grid, formulas shown as =FORMULA.
"""
import sys, re, zipfile
from xml.etree import ElementTree as ET

NS = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
REL = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'


def col_to_num(ref):
    letters = re.match(r'[A-Z]+', ref).group(0)
    n = 0
    for ch in letters:
        n = n * 26 + (ord(ch) - 64)
    return n


def shared_strings(z):
    out = []
    if 'xl/sharedStrings.xml' not in z.namelist():
        return out
    for si in ET.fromstring(z.read('xl/sharedStrings.xml')):
        out.append(''.join(t.text or '' for t in si.iter(NS + 't')))
    return out


def sheets(z):
    wb = ET.fromstring(z.read('xl/workbook.xml'))
    rels = {r.get('Id'): r.get('Target')
            for r in ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))}
    out = []
    for s in wb.iter(NS + 'sheet'):
        target = rels[s.get(REL + 'id')].lstrip('/')
        if not target.startswith('xl/'):
            target = 'xl/' + target
        out.append((s.get('name'), target))
    return out


def dump(path, want=None):
    z = zipfile.ZipFile(path)
    ss = shared_strings(z)
    for idx, (name, target) in enumerate(sheets(z)):
        if want is not None and want not in (name, str(idx)):
            continue
        print(f'\n===== SHEET {idx}: {name} =====')
        root = ET.fromstring(z.read(target))
        for row in root.iter(NS + 'row'):
            cells, last = [], 0
            for c in row.iter(NS + 'c'):
                pos = col_to_num(c.get('r'))
                cells += [''] * (pos - last - 1)
                last = pos
                f, v = c.find(NS + 'f'), c.find(NS + 'v')
                if f is not None and f.text:
                    cells.append('=' + f.text)
                elif v is None:
                    cells.append('')
                elif c.get('t') == 's':
                    cells.append(ss[int(v.text)])
                else:
                    cells.append(v.text)
            line = '\t'.join(cells).rstrip()
            if line.strip():
                print(f"{row.get('r'):>4}| {line}")


if __name__ == '__main__':
    dump(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
