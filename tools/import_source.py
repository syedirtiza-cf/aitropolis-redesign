#!/usr/bin/env python3
"""Read the service pages written for the Next.js app (ServiceDetail props) and
write them as content JSON for tools/build.py.

  python3 tools/import_source.py <folder of the app's solutions pages>
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def block(text, name):
    m = re.search(name + r"=\{\[", text)
    if not m: return []
    i = m.end() - 1; d = 0
    for j in range(i, len(text)):
        if text[j] == "[": d += 1
        elif text[j] == "]":
            d -= 1
            if d == 0: break
    raw = text[i:j + 1]
    raw = re.sub(r'([{,]\s*)([a-zA-Z]+):\s*', r'\1"\2": ', raw)
    raw = re.sub(r",(\s*[\]}])", r"\1", raw)
    return json.loads(raw)

def attr(text, name):
    m = re.search(r"\n\s+" + name + r'="((?:[^"\\]|\\.)*)"', text)
    return json.loads('"' + m.group(1) + '"') if m else ""

def sec(**k):
    base = {"eyebrow": "", "h1": "", "h2": "", "lead": [], "links": [], "cards": [], "faq": [], "kv": [], "bullets": [], "tags": []}
    base.update(k); return base

def card(h, p, href="", n=""):
    return {"href": href, "n": n, "h": h, "lvl": "h3", "p": [p] if p else [], "tags": [], "li": [], "kv": [], "a": []}

def main(root):
    mf = json.loads((ROOT / "src" / "pages.json").read_text())
    for f in sorted(Path(root).glob("*/*/page.tsx")):
        t = f.read_text()
        if "<ServiceDetail" not in t: continue
        path = attr(t, "path"); name = path.strip("/").replace("/", "-")
        dist = re.search(r'title: "([^"]+)"', t).group(1)
        secs = [sec(eyebrow=attr(t, "eyebrow"), h1=attr(t, "headline"), lead=[attr(t, "lede")])]
        secs.append(sec(eyebrow="What we do", h2=attr(t, "name") + ": what is included", cards=[card(c["title"], c["body"]) for c in block(t, "capabilities")]))
        secs.append(sec(eyebrow="How it runs", h2="From first call to hand-over", cards=[card(a["step"], a["body"], n=str(i + 1).zfill(2)) for i, a in enumerate(block(t, "approach"))]))
        lim = re.search(r'limitation=\{\{\s*title: "((?:[^"\\]|\\.)*)",\s*body: "((?:[^"\\]|\\.)*)"', t)
        if lim:
            secs.append(sec(eyebrow="Limits", h2="Where this service stops", cards=[card(json.loads('"' + lim.group(1) + '"'), json.loads('"' + lim.group(2) + '"'))]))
        rel = block(t, "related")
        if rel:
            secs.append(sec(eyebrow="Related", h2="Read next", cards=[card(r["title"], "", r["href"]) for r in rel]))
        fq = block(t, "faqs")
        if fq:
            secs.append(sec(eyebrow="Questions", h2=attr(t, "name") + ", answered", faq=[{"q": q["question"], "a": [q["answer"]]} for q in fq]))
        (ROOT / "src" / "content" / f"{name}.json").write_text(json.dumps({"sections": secs}, indent=1, ensure_ascii=False))
        h2 = re.search(r'<h2 className="text-h2 text-max-w-measure">|<h2[^>]*>\{"((?:[^"\\]|\\.)*)"\}</h2>', t)
        cp = re.findall(r'<p className="text-muted text-lg mt-6[^>]*>\{"((?:[^"\\]|\\.)*)"\}</p>', t)
        cfg = mf.get(name, {})
        cfg.update({"title": attr(t, "name"), "desc": attr(t, "lede")[:155], "active": "solutions", "pill": dist + " district",
                    "cta": {"h": json.loads('"' + h2.group(1) + '"') if h2 and h2.group(1) else "", "p": json.loads('"' + cp[0] + '"') if cp else ""}})
        if not cfg["cta"]["h"]: cfg.pop("cta")
        mf[name] = cfg
        print("source", name)
    (ROOT / "src" / "pages.json").write_text(json.dumps(mf, indent=1, ensure_ascii=False))

main(sys.argv[1])
