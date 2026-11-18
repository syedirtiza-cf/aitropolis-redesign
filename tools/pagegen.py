"""Render a content JSON (from tools/extract.py) into a redesigned page body."""
import html, re

E = html.escape
ARROW = '<svg class="ic" aria-hidden="true"><use href="#i-arrow-right"/></svg>'

def ic(n, c=""):
    return f'<svg class="ic{(" " + c) if c else ""}" aria-hidden="true"><use href="#i-{n}"/></svg>'

def slug(t):
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")

def route(href, ids=()):
    """Live-site route -> flat file in the prototype."""
    if not href:
        return ""
    if href.startswith("#"):
        return href if href[1:] in ids else ""
    if href.startswith(("http", "mailto:", "tel:")):
        return href
    path, _, frag = href.partition("#")
    path = path.strip("/")
    out = "index.html" if not path else path.replace("/", "-") + ".html"
    return out + ("#" + frag if frag else "")

def title_case(t):
    return t if not t.isupper() else t.capitalize()

def count(s):
    return len(s["cards"]) + len(s["kv"]) + len(s["bullets"]) + len(s["faq"])

def card(c, ids, i, flat=False):
    h = f'<h3 class="t-tm">{E(c["h"])}</h3>'
    body = "".join((f'<p class="eb" style="padding-top:.5rem">{E(p)}</p>' if len(p) <= 28 and not p.endswith(".") else f'<p class="t-bm muted">{E(p)}</p>') for p in c["p"])
    if c["tags"]:
        body += '<ul class="tags">' + "".join(f"<li>{E(t)}</li>" for t in c["tags"]) + "</ul>"
    if c["kv"]:
        body += '<dl class="spec">' + "".join(f"<div><dt>{E(k)}</dt><dd>{E(v)}</dd></div>" for k, v in c["kv"]) + "</dl>"
    if c["li"]:
        body += '<ul class="ep-list ok">' + "".join(f"<li>{ic('check')}<span>{E(x)}</span></li>" for x in c["li"]) + "</ul>"
    href = route(c.get("href"), ids)
    foot = f'<a class="open-d lnk" href="{E(href)}">{E(c["h"])}</a>' if href and not href.startswith("#") else ""
    return f'<article class="card gcard" data-r style="--d:{(i % 3) * 90}ms">{h}{body}{foot}</article>'

def steps(cards):
    items = "".join(
        f'<li data-r style="--d:{(i % 3) * 90}ms"><span class="gnum">{E(c["n"] or str(i + 1).zfill(2))}</span><div><h3 class="t-tm">{E(c["h"])}</h3>'
        + "".join(f'<p class="t-bm muted">{E(p)}</p>' for p in c["p"]) + "</div></li>"
        for i, c in enumerate(cards))
    return f'<ol class="gsteps">{items}</ol>'

def head(s, icon, lead):
    pill = f'<span class="pill pill-line"><i>{ic(icon)}</i>{E(title_case(s["eyebrow"]))}</span>' if s["eyebrow"] else ""
    ld = "".join(f'<p class="t-bm muted">{E(p)}</p>' for p in lead)
    return f'<div class="shead dash-t"><div>{pill}</div><div class="hd" data-r="fade"><h2 class="h2" data-mask="h">{E(s["h2"])}</h2>{ld}</div></div>'

CTA_RE = re.compile(r"^(book a|talk to an engineer|get in touch|contact us|read the|see )", re.I)

def clean(s):
    s["bullets"] = [b for b in s["bullets"] if re.search(r"[A-Za-z0-9]", b)]
    s["lead"] = [p for p in s["lead"] if not CTA_RE.match(p)]
    return s

def stats(kv):
    return '<div class="gstats">' + "".join(f'<div class="card" data-r style="--d:{i * 90}ms"><p class="num-m">{E(v)}</p><p class="t-bm muted">{E(k)}</p></div>' for i, (k, v) in enumerate(kv)) + "</div>"

def section(s, ids, icon):
    s = clean(s)
    sid = slug(s["eyebrow"] or s["h2"])
    out = [f'<section class="sec px" id="{sid}">']
    if not s["h2"] and not s["faq"] and not s["cards"]:
        if s["kv"] and len(s["kv"]) <= 6:
            out.append(stats(s["kv"]))
        elif s["lead"]:
            big = len(s["lead"][0]) <= 12
            if big:
                out.append(f'<div class="gbig dash-t" data-r><div><p class="num-l">{E(s["lead"][0])}</p>' + (f'<p class="t-tl">{E(s["lead"][1])}</p>' if len(s["lead"]) > 1 else "") + '</div><div>' + "".join(f'<p class="t-bm muted">{E(p)}</p>' for p in s["lead"][2:]) + "</div></div>")
            else:
                out.append('<div class="gbig dash-t" data-r><div></div><div>' + "".join(f'<p class="t-bm muted">{E(p)}</p>' for p in s["lead"]) + "</div></div>")
        out.append("</section>")
        return "".join(out)
    if s["faq"]:
        items = "".join(
            f'<details><summary><span>{E(f["q"])}</span><i aria-hidden="true"></i></summary>' + "".join(f'<p class="t-bm">{E(a)}</p>' for a in f["a"]) + "</details>"
            for f in s["faq"])
        pill = f'<span class="pill pill-line"><i>{ic("circle-help")}</i>{E(title_case(s["eyebrow"]) or "Questions")}</span>'
        out.append(f'<div class="faq dash-t" style="padding-top:2rem"><div data-r="fade">{pill}<h2 class="h2" style="padding-top:1.5rem" data-mask="h">{E(s["h2"])}</h2></div><div class="faqlist">{items}</div></div>')
    else:
        out.append(head(s, icon, s["lead"]))
        cards = s["cards"]
        if cards and all(c["n"] for c in cards):
            out.append(steps(cards))
        elif cards:
            n = len(cards)
            cols = "g3" if n % 3 == 0 else "g2"
            out.append(f'<div class="ggrid {cols}">' + "".join(card(c, ids, i) for i, c in enumerate(cards)) + "</div>")
        if s["kv"]:
            out.append('<div class="card gcard" data-r><dl class="spec">' + "".join(f"<div><dt>{E(k)}</dt><dd>{E(v)}</dd></div>" for k, v in s["kv"]) + "</dl></div>")
        if s["bullets"]:
            out.append('<div class="card gcard gwide" data-r><ul class="ep-list ok">' + "".join(f"<li>{ic('check')}<span>{E(x)}</span></li>" for x in s["bullets"]) + "</ul></div>")
        if s["links"]:
            out.append('<div class="glinks" data-r>' + "".join(f'<a class="btn btn-oi" href="{E(route(h, ids))}">{E(t)}{ARROW}</a>' for t, h in s["links"] if route(h, ids)) + "</div>")
    out.append("</section>")
    return "".join(out)

def build(data, cfg):
    secs = data["sections"]
    hero, rest = secs[0], secs[1:]
    ids = {slug(s["eyebrow"] or s["h2"]) for s in rest}
    icon = cfg.get("icon", "sparkles")
    lead = hero["lead"][0] if hero["lead"] else cfg.get("desc", "")
    sec_link = next(((t, route(h, ids)) for t, h in hero["links"] if route(h, ids) and "contact" not in h), None)
    alt = f'<a class="btn btn-o" href="{E(sec_link[1])}">{E(sec_link[0])}</a>' if sec_link else f'<a class="btn btn-o" href="#{slug(rest[0]["eyebrow"] or rest[0]["h2"]) if rest else "start"}">See what is covered</a>'
    sized = [s for s in rest if count(s) and s["h2"] and not s["faq"]]
    mx = max([count(s) for s in sized] or [1])
    bars = [[(title_case(s["eyebrow"]) or s["h2"])[:22], count(s)] for s in sized][:7]
    total = sum(count(s) for s in rest if not s["faq"])
    sub = cfg.get("stat", "Topics on this page")
    hero_html = f'''<section id="top" class="hero px">
  <div class="ht" aria-hidden="true"><div data-par=".35" style="position:absolute;inset:0"><canvas id="ht"></canvas></div></div>
  <div class="hero-in">
    {{{{header}}}}
    <div class="hero-copy">
      <div data-h style="--d:0ms"><span class="pill pill-glass"><i>{ic(icon)}</i>{E(cfg.get("pill") or title_case(hero["eyebrow"]))}</span></div>
      <h1 class="h1" data-mask="hero">{E(hero["h1"])}</h1>
      <p class="lead t-bl" data-h style="--d:420ms">{E(lead)}</p>
      <div class="acts" data-h style="--d:520ms">
        <a class="btn btn-p" href="#" data-book>Book a 15-minute assessment{ARROW}</a>
        {alt}
      </div>
    </div>
    <div class="dash-wrap" data-par=".15"><div data-hd>
      <div class="dash dash-sol" id="dash">
        <div class="dash-l">
          <div>
            <p class="t-bs" style="color:var(--on-soft)">{E(sub)}</p>
            <p class="num-l" data-count>{len(sized)}</p>
            <div style="padding-top:1rem"><span class="stat-pill">{ic("arrow-up-right")}<span>{total} items listed across them</span></span></div>
          </div>
          <dl class="rows">
            <div class="dash-t d" style="padding-top:1rem"><dt>Founded</dt><dd data-canon="founded">2010</dd></div>
            <div class="dash-t d"><dt>Deployments</dt><dd data-canon="deployments">200+</dd></div>
            <div class="dash-t d"><dt>Countries</dt><dd data-canon="countries">30+</dd></div>
          </dl>
        </div>
        <div class="dash-r">
          <div class="dash-head"><p class="t-bs" style="color:var(--on-soft)">Items listed in each section</p></div>
          <div class="bars" id="bars" data-stage data-bars="{E(__import__("json").dumps(bars))}" data-max="{mx}"></div>
          <div class="legend"><span><i></i>Items on this page</span><span><i class="l"></i>Largest section</span></div>
        </div>
      </div>
    </div></div>
  </div>
</section>'''
    body = [hero_html] + [section(s, ids, icon) for s in rest]
    cta = cfg.get("cta", {})
    body.append(f'''<section class="sec px" id="start">
  <div class="close" data-r>
    <canvas id="flow3" aria-hidden="true"></canvas>
    <div class="in">
      <img class="th-logo" src="assets/aitropolis-symbol-pearl-white.svg" alt="" width="72" height="66" aria-hidden="true">
      <h2 class="h2">{E(cta.get("h", "Bring the problem. An engineer will say where to begin."))}</h2>
      <p class="t-bl">{E(cta.get("p", "Tell us what you are running today and what has to change. You will get a straight answer on scope, risk and a first step."))}</p>
      <div class="acts"><a class="btn btn-p" href="#" data-book>Book a 15-minute assessment{ARROW}</a><a class="btn btn-o" href="contact.html">Write to us</a></div>
    </div>
  </div>
</section>''')
    return "\n".join(body)
