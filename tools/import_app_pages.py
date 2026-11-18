#!/usr/bin/env python3
"""Build content JSON for the pages that exist only in the Next.js app: six sector
pages (from the sector data in src/industries.js plus each page's headline, lede and
limitation) and Global delivery (written out here from the app page and canon).

  python3 tools/import_app_pages.py <folder of the app's src/app>
"""
import json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def sec(**k):
    b = {"eyebrow": "", "h1": "", "h2": "", "lead": [], "links": [], "cards": [], "faq": [], "kv": [], "bullets": [], "tags": []}
    b.update(k); return b

def card(h, p="", href="", n="", tags=None, kv=None, li=None):
    return {"href": href, "n": n, "h": h, "lvl": "h3", "p": [p] if p else [], "tags": tags or [], "li": li or [], "kv": kv or [], "a": []}

def lst(xs):
    xs = list(xs)
    return xs[0] if len(xs) == 1 else ", ".join(xs[:-1]) + " and " + xs[-1]

def lc(s): return s[:1].lower() + s[1:]
def cap1(s): return s[:1].upper() + s[1:]

def data():
    js = (ROOT / "src" / "industries.js").read_text()
    seg = js[js.index("const S="):js.index('$("#projTotal")')]
    out = subprocess.run(["node", "-e", seg + ";console.log(JSON.stringify({S,I}))"], capture_output=True, text=True, check=True).stdout
    return json.loads(out)

def attr(t, n):
    m = re.search(n + r'="((?:[^"\\]|\\.)*)"', t); return json.loads('"' + m.group(1) + '"') if m else ""

def main(app):
    app = Path(app); d = data(); S = d["S"]
    mf = json.loads((ROOT / "src" / "pages.json").read_text())
    for ind in d["I"]:
        t = (app / "industries" / ind["slug"] / "page.tsx").read_text()
        lim = re.search(r'limitation=\{\{ title: "((?:[^"\\]|\\.)*)", body: "((?:[^"\\]|\\.)*)"', t)
        name = ind["name"]
        svc = [S[k] for k in ind["svc"]]
        secs = [
            sec(eyebrow=name, h1=attr(t, "headline"), lead=[attr(t, "lede")]),
            sec(eyebrow="Where it hurts", h2="What the sector asks of its systems", bullets=ind["hurts"]),
            sec(eyebrow="What we deliver", h2="The work we take on", bullets=ind["does"]),
            sec(eyebrow="Technology", h2="What we lean on", cards=[card("Technology focus", tags=ind["tech"])]),
            sec(eyebrow="Services", h2="Where we start", cards=[card(n, href=h) for n, h in svc]),
        ]
        if lim:
            secs.append(sec(eyebrow="Where it does not fit", h2="A limit worth knowing", cards=[card(json.loads('"' + lim.group(1) + '"'), json.loads('"' + lim.group(2) + '"'))]))
        if ind["cases"]:
            secs.append(sec(eyebrow="Published work", h2="Projects in this sector", cards=[card(c[1], c[2], "/case-studies/" + c[0]) for c in ind["cases"]]))
        faq = [{"q": f"Which {name.lower()} problems do you work on?", "a": [cap1(lst(lc(x) for x in ind["hurts"])) + "."]},
               {"q": f"Which services do {name.lower()} clients use?", "a": [cap1(lst(lc(n) for n, _ in svc)) + "."]}]
        if ind["cases"]:
            faq.append({"q": f"What {name.lower()} work have you published?", "a": [lst(f"{c[1]} ({c[2]})" for c in ind["cases"]) + "."]})
        secs.append(sec(eyebrow="Questions", h2=f"{name}, answered", faq=faq))
        key = "industries-" + ind["slug"]
        (ROOT / "src" / "content" / f"{key}.json").write_text(json.dumps({"sections": secs}, indent=1, ensure_ascii=False))
        mf[key] = {**mf.get(key, {}), "title": f"{name} IT Solutions", "desc": ind["desc"], "active": "industries", "icon": ind["icon"], "pill": "Industries"}
        mf[key]["cta"] = {"h": "Start with the system that blocks you most", "p": "Book an assessment and name the platform that causes the most trouble. An engineer will say where to begin."}
        print("sector", key)
    offices = json.loads(subprocess.run(["node", "-e", "console.log(JSON.stringify(require(process.argv[1]).offices))", str(app.parent.parent / "content" / "canon.json")], capture_output=True, text=True, check=True).stdout)
    cities = [o["city"] for o in offices]
    city_list = ", ".join(cities[:-1]) + " and " + cities[-1]
    secs = [
        sec(eyebrow="Global delivery", h1="A project should not stop when one office closes",
            lead=["Studios in four time zones pass work to each other at the end of each local day, so a fix or a build can move overnight instead of waiting for the next morning."],
            links=[["Talk to an engineer, not a form", "/contact"]]),
        sec(eyebrow="Four studios", h2="Where the work is done",
            cards=[card(o["city"], ", ".join([o["region"], o["country"]] + ([o["detail"]] if len(o["detail"].split()) > 3 else [])) + ".", kv=[["Time zone", o["timezone"]]]) for o in offices]),
        sec(eyebrow="How a handover works", h2="Five habits that keep it from dropping work", cards=[card(h, b, n=str(i + 1).zfill(2)) for i, (h, b) in enumerate([
            ("One owner per workstream", "A named person is accountable for each piece of work, whichever studio is awake."),
            ("A written handover each day", "What was done, what is blocked and what the next studio should pick up first."),
            ("One backlog, one tracker", "Every studio works from the same list, so nothing lives in a private inbox."),
            ("Overlap windows for decisions", "Where two working days overlap, questions that need a conversation are held for that window."),
            ("A named lead for escalation", "Problems go to a person with authority to decide, not into a queue.")])]),
        sec(eyebrow="Where it does not fit", h2="A limit worth knowing", cards=[card("Tightly coupled work wants overlap", "Work that needs constant conversation between a few people, such as early architecture, is slower when it is passed between time zones. We keep those teams in overlapping hours and use the handover model for work that can be split cleanly.")]),
        sec(eyebrow="Related", h2="Read next", cards=[card("Offshore IT teams", href="/solutions/offshore-it-teams"), card("Managed services", href="/solutions/foundations/managed-services"), card("About Aitropolis", href="/about")]),
        sec(eyebrow="Questions", h2="Global delivery, answered", faq=[
            {"q": "Where are your studios?", "a": [f"{city_list}. Dubai is the global head office."]},
            {"q": "How does follow-the-sun delivery work?", "a": ["Each studio works its own local day. At the end of it, the team writes a handover and passes open work to the next studio, so progress continues while the first team is offline."]},
            {"q": "Will someone be available in our time zone?", "a": ["Working hours and response times are agreed per engagement. Overlap with your day is one of the things we plan for at the start, not something we promise for every project in advance."]},
            {"q": "Is every service covered around the clock?", "a": ["No. Round-the-clock cover is set in the service agreement for services such as managed operations. Project work follows the studio working days agreed for it."]}]),
    ]
    (ROOT / "src" / "content" / "global-delivery.json").write_text(json.dumps({"sections": secs}, indent=1, ensure_ascii=False))
    mf["global-delivery"] = {**mf.get("global-delivery", {}), "title": "Global Delivery: Follow-the-Sun Studios", "desc": "Four studios in four time zones hand work to each other at the end of each local day, so projects keep moving overnight.", "active": "about", "icon": "globe", "pill": "Global delivery"}
    (ROOT / "src" / "pages.json").write_text(json.dumps(mf, indent=1, ensure_ascii=False))
    print("global-delivery")

main(sys.argv[1])
