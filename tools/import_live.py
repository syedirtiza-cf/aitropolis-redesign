#!/usr/bin/env python3
"""One-off: turn a folder of saved live pages into src/content/*.json and src/pages.json.

  python3 tools/import_live.py <folder-with-saved-html>

File names in the folder are the route with slashes turned into dashes
(solutions-systems-erp.html), which is also the output file name.
"""
import html, json, re, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import extract

ROOT = Path(__file__).resolve().parent.parent
ICON = {"systems": "blocks", "foundations": "layers", "intelligence": "brain", "exchange": "hexagon", "signal": "radar", "immersion": "glasses"}

def meta(h, pat):
    m = re.search(pat, h, re.S)
    return html.unescape(m.group(1)).strip() if m else ""

def main(folder):
    out = ROOT / "src" / "content"; out.mkdir(parents=True, exist_ok=True)
    mf = json.loads((ROOT / "src" / "pages.json").read_text()) if (ROOT / "src" / "pages.json").exists() else {}
    for f in sorted(Path(folder).glob("*.html")):
        name = f.stem
        h = f.read_text(encoding="utf-8")
        extract.main(str(f), str(out / f"{name}.json"))
        data = json.loads((out / f"{name}.json").read_text())
        if not data["sections"] or not data["sections"][0]["h1"]:
            print("  !! no hero heading:", name)
        title = re.sub(r"\s*[|·-]\s*Aitropolis.*$", "", meta(h, r"<title[^>]*>(.*?)</title>"))
        desc = meta(h, r'<meta name="description" content="([^"]*)"')
        top = name.split("-")[0]
        active = {"case": "cases", "insights": "insights", "solutions": "solutions", "ai": "solutions", "digital": "solutions"}.get(top, "")
        parts = name.split("-")
        icon = ICON.get(parts[1], "sparkles") if top == "solutions" and len(parts) > 1 else {"case": "briefcase", "insights": "lamp-ceiling", "ai": "brain", "digital": "rocket", "privacy": "lock", "terms": "scale", "accessibility": "eye"}.get(top, "sparkles")
        cfg = mf.get(name, {})
        cfg.update({"title": cfg.get("title") or title, "desc": cfg.get("desc") or desc, "active": cfg.get("active", active), "icon": cfg.get("icon", icon)})
        mf[name] = cfg
    (ROOT / "src" / "pages.json").write_text(json.dumps(mf, indent=1, ensure_ascii=False))
    print(len(mf), "pages in manifest")

main(sys.argv[1])
