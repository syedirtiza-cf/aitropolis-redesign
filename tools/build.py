#!/usr/bin/env python3
"""Build the generated pages from src/.

  python3 tools/build.py

Each page is src/<name>.html: a few `key: value` lines, a `---` line, then the
page body. Optional src/<name>.js is inlined as the page script. The shared
header, footer, header bar, menu sheet and script tags come from src/shell.html
and src/header.html. index.html and solutions.html are hand-written and are not
generated.
"""
import json, re, sys, time
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import pagegen

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
PAGES = ["industries", "case-studies", "insights", "partners", "about", "contact"]
VERSION = time.strftime("%Y%m%d%H%M")

def nav(active):
    chev = '<svg class="ic chev" aria-hidden="true"><use href="#i-chevron-down"/></svg>'
    on = lambda k: ' class="on" aria-current="page"' if active == k else ""
    return (
        f'<button class="nav-sol{" on" if active == "solutions" else ""}" type="button" aria-expanded="false" aria-haspopup="dialog" aria-controls="mega-sol">Solutions{chev}</button>'
        f'<a{on("industries")} href="industries.html">Industries</a>'
        f'<a{on("cases")} href="case-studies.html">Case studies</a>'
        f'<a{on("insights")} href="insights.html">Insights</a>'
        f'<a{on("partners")} href="partners.html">Partners</a>'
        f'<a{on("about")} href="about.html">About</a>'
    )

def render(text, ctx):
    for k, v in ctx.items():
        text = text.replace("{{" + k + "}}", v)
    return text

def main():
    shell = (SRC / "shell.html").read_text()
    header = (SRC / "header.html").read_text()
    manifest = json.loads((SRC / "pages.json").read_text()) if (SRC / "pages.json").exists() else {}
    for name, cfg in manifest.items():
        data = json.loads((SRC / "content" / f"{name}.json").read_text())
        body = pagegen.build(data, cfg)
        ctx = {"v": VERSION, "nav": nav(cfg.get("active", "")), "on_contact": ""}
        ctx["header"] = render(header, ctx)
        body = render(body, ctx)
        out = render(shell, {**ctx, "title": cfg["title"], "desc": cfg["desc"], "content": body,
                             "page_script": f"<script>\n{(SRC / '_page.js').read_text()}\n</script>"})
        (ROOT / (name + ".html")).write_text(out)
        print("built", name + ".html", len(out), "bytes")
    for name in PAGES:
        if not (SRC / f"{name}.html").exists():
            print("skip", name, "(no source yet)")
            continue
        raw = (SRC / f"{name}.html").read_text()
        meta, body = raw.split("\n---\n", 1)
        m = dict(re.findall(r"^(\w+):\s*(.*)$", meta, re.M))
        active = m.get("active", "")
        ctx = {
            "v": VERSION,
            "nav": nav(active),
            "on_contact": " on" if active == "contact" else "",
        }
        ctx["header"] = render(header, ctx)
        body = render(body, ctx)
        js = SRC / f"{name}.js"
        page_script = f"<script>\n{js.read_text()}\n</script>" if js.exists() else ""
        out = render(shell, {**ctx, "title": m["title"], "desc": m["desc"], "content": body, "page_script": page_script})
        (ROOT / f"{name}.html").write_text(out)
        print("built", f"{name}.html", len(out), "bytes")

main()
