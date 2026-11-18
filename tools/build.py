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
# service pages (solutions-<district>-<service>) use the side-rail layout
SERVICE_LAYOUT = "service pages: solutions-<district>-<service>"
# case-study pages (case-studies-*) use the story layout
CASE_LAYOUT = "every case-studies-* page"
# insight articles (insights-*) use the editorial layout
ARTICLE_LAYOUT = "every insights-* article"
# the six district hubs use the hub layout
HUB_LAYOUT = {"solutions-" + d for d in ("systems", "foundations", "intelligence", "exchange", "signal", "immersion")}
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
    def trim(t, n=120):
        if len(t) <= n: return t
        cut = t[:n].rsplit(" ", 1)[0].rstrip(" ,.;:")
        return cut + "…"
    def group(n):
        if n.startswith("case-studies-"): return "case-studies-"
        if n.startswith("insights-"): return "insights-"
        if n.startswith("industries-"): return "industries-"
        parts = n.split("-")
        if parts[0] == "solutions" and len(parts) > 2 and parts[1] in pagegen.DIST: return f"solutions-{parts[1]}-"
        return ""
    def rel_for(n):
        g = group(n)
        if not g: return []
        sibs = [k for k in manifest if group(k) == g]
        if n not in sibs or len(sibs) < 2: return []
        i = sibs.index(n)
        out = []
        for k in (sibs[(i + j) % len(sibs)] for j in range(1, min(4, len(sibs)))):
            c = manifest[k]
            out.append({"title": pagegen.short(c["title"]), "desc": trim(c["desc"] or ""), "href": k + ".html", "icon": c.get("icon", "sparkles")})
        return out
    for name, cfg in manifest.items():
        cfg = {**cfg, "related": rel_for(name), "svc_list": [(pagegen.short(c["title"]), k) for k, c in manifest.items() if name.count("-") == 1 and k.startswith(name + "-")], "svc_desc": {k + ".html": trim(c["desc"] or "", 130) for k, c in manifest.items() if group(k).startswith("solutions-")}}
        if name.startswith("case-studies-"): cfg["related_h"] = "More published work."
        elif name.startswith("insights-"): cfg["related_h"] = "More to read."
        elif name.startswith("industries-"): cfg["related_h"] = "Other sectors."
        elif group(name).startswith("solutions-"): cfg["related_h"] = "Other services in this district."
        data = json.loads((SRC / "content" / f"{name}.json").read_text())
        cfg = {**cfg, "name": name, "prose": name in ("privacy", "terms", "accessibility"), "case": name.startswith("case-studies-"), "article": name.startswith("insights-"), "hub": name in HUB_LAYOUT, "service": len(name.split("-")) > 2 and name.split("-")[0] == "solutions" and name.split("-")[1] in pagegen.DIST}
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
