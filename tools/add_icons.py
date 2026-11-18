#!/usr/bin/env python3
"""Add Lucide icons (ISC) to the inline sprite in assets/icons.js.

  python3 tools/add_icons.py name1 name2 ...

Fetches each icon from the lucide-static package on jsDelivr and appends a
<symbol> for it. Icons already in the sprite are skipped.
"""
import re, sys, urllib.request
from pathlib import Path

JS = Path(__file__).resolve().parent.parent / "assets" / "icons.js"
VER = "0.468.0"

def main(names):
    s = JS.read_text()
    add = ""
    for n in names:
        if f'id=\\"i-{n}\\"' in s:
            continue
        try:
            svg = urllib.request.urlopen(f"https://cdn.jsdelivr.net/npm/lucide-static@{VER}/icons/{n}.svg", timeout=20).read().decode()
        except Exception as e:
            print("missing", n, e); continue
        inner = re.search(r"<svg[^>]*>(.*)</svg>", svg, re.S).group(1)
        inner = re.sub(r"<!--.*?-->", "", inner, flags=re.S)
        inner = re.sub(r"\s+", " ", inner).strip().replace('"', '\\"')
        add += f'<symbol id=\\"i-{n}\\" viewBox=\\"0 0 24 24\\">{inner}</symbol>'
        print("added", n)
    marker = '";document.body.prepend(s)'
    s = s.replace(marker, add + marker, 1)
    JS.write_text(s)

main(sys.argv[1:])
