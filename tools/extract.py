#!/usr/bin/env python3
"""Turn a saved copy of a live page into content JSON for tools/build.py.

  python3 tools/extract.py <saved.html> <out.json>

Only the text and structure inside <main> is kept. Navigation, footer and the
closing call-to-action are dropped: the redesign supplies its own.
"""
import json, re, sys
from html.parser import HTMLParser

TEXT = {"div", "h1", "h2", "h3", "h4", "p", "span", "li", "a", "summary", "dt", "dd", "td", "th"}

STEMS = "virtual|container|optim|organ|custom|modern|util|standard|central|personal|digit|author|categor|minim|maxim|summar|recogn|final|initial|synchron|mobil|monet|token|normal|visual|special|priorit|harmon|capital|emphas|real|local|global|general|critic|commercial|industrial|prioriti|operation|commodit|scal|generali|contextual|fertil|memor|stabil|sensit|crystal|jeopard|fraternal".split("|")
IZ = re.compile(r"\b(" + "|".join(sorted(set(STEMS), key=len, reverse=True)) + r")iz(e|ed|es|ing|ation|ations|ational|er|ers)\b", re.I)
WORDS = {"behavior": "behaviour", "behaviors": "behaviours", "analyze": "analyse", "analyzed": "analysed", "analyzes": "analyses", "analyzing": "analysing", "favor": "favour", "color": "colour", "colors": "colours", "labor": "labour", "catalog": "catalogue", "defense": "defence", "license": "licence", "fulfill": "fulfil", "enrollment": "enrolment", "program-based": "programme-based"}
WRE = re.compile(r"\b(" + "|".join(WORDS) + r")\b", re.I)

def uk(t):
    if not isinstance(t, str): return t
    t = IZ.sub(lambda m: m.group(1) + "is" + m.group(2), t)
    return WRE.sub(lambda m: WORDS[m.group(1).lower()] if m.group(1).islower() else WORDS[m.group(1).lower()].capitalize(), t)

class X(HTMLParser):
    def __init__(s):
        super().__init__(convert_charrefs=True)
        s.in_main = False
        s.secs = []
        s.sec = None
        s.stack = []          # open text elements: [tag, classes, buf, has_child, href]
        s.details = 0
        s.skip = 0
    def start_sec(s):
        s.sec = {"t": []}
        s.secs.append(s.sec)
    def handle_starttag(s, t, a):
        a = dict(a)
        if t == "main":
            s.in_main = True
        if not s.in_main:
            return
        if t in ("script", "style", "svg"):
            s.skip += 1
        if t in ("section", "header") or (t == "div" and "prose" in a.get("class", "")):
            s.start_sec()
        if t == "details" and s.sec is not None:
            s.sec["t"].append(["faq_start"])
        if t in TEXT and not s.skip:
            if s.stack:
                s.stack[-1][3] = True
            s.stack.append([t, a.get("class", ""), "", False, a.get("href", ""), [], None])
        if t == "br" and s.stack:
            s.stack[-1][2] += " "
    def emit(s, tok):
        if len(tok) > 1:
            if isinstance(tok[1], str): tok[1] = uk(tok[1])
            elif tok[0] == "row": tok[1] = [uk(x) for x in tok[1]]
        if s.sec is not None:
            s.sec["t"].append(tok)
    def handle_endtag(s, t):
        if not s.in_main:
            return
        if t in ("script", "style", "svg") and s.skip:
            s.skip -= 1
            return
        if t == "main":
            s.in_main = False
        if t == "details" and s.sec is not None:
            s.emit(["faq_end"])
        if not (t in TEXT and s.stack and s.stack[-1][0] == t):
            return
        tag, cls, buf, hc, href, kids, lastrow = s.stack.pop()
        text = re.sub(r"\s+", " ", buf).strip()
        parent = s.stack[-1][0] if s.stack else ""
        if tag == "li" and len(kids) >= 2:
            parts = kids[1:] if re.fullmatch(r"\d{1,2}", kids[0]) else kids
            real = [k for k in parts if re.search(r"[A-Za-z0-9]", k)]
            if len(real) >= 2:
                s.emit(["row", real, "", ""])
                return
        if tag == "div":
            # a div holding only short text-leaves is a row: (label, note, value)
            if kids and not text:
                if lastrow is not None:
                    lastrow[1].extend(kids)   # a value beside a (label, note) row belongs to that row
                    if s.stack and s.stack[-1][0] == "div": s.stack[-1][6] = lastrow
                    return
                if len(kids) == 1:
                    s.emit(["span", kids[0], "", ""])
                else:
                    tok = ["row", kids, "", ""]
                    s.emit(tok)
                    if s.stack and s.stack[-1][0] == "div": s.stack[-1][6] = tok
                return
            if lastrow is not None and not kids and not text:
                if s.stack and s.stack[-1][0] == "div": s.stack[-1][6] = lastrow
                return
            if text and not hc:
                if parent == "div":
                    s.stack[-1][5].append(text)
                else:
                    s.emit(["span", text, cls, ""])
            elif text:
                s.emit(["p", text, cls, ""])
            return
        block_in_li = False
        if parent == "li":
            ent = s.stack[-1]
            if tag in ("h3", "h4"):
                block_in_li = True; ent[6] = True            # a titled item: keep number, title and text apart
            elif tag == "p" and (re.fullmatch(r"\d{1,2}", text) or ent[6]):
                block_in_li = True
        if not block_in_li and (parent in ("h1", "h2", "h3", "h4", "p", "summary", "li", "dt", "dd") or (parent == "a" and tag not in ("h3", "h4", "p"))):
            if text != "+":
                s.stack[-1][2] += " " + text + (" " if buf[-1:].isspace() else "")
                if parent == "li" and tag == "span":
                    s.stack[-1][5].append(text)
        elif text:
            if not href:
                href = next((e[4] for e in reversed(s.stack) if e[0] == "a" and e[4]), "")
            s.emit([tag, text, cls, href])
    def handle_data(s, d):
        if s.stack and not s.skip:
            s.stack[-1][2] += d

def group(sec):
    """Ordered tokens -> intro + cards + kv pairs + faq."""
    out = {"eyebrow": "", "h1": "", "h2": "", "lead": [], "links": [], "cards": [], "faq": [], "kv": [], "bullets": [], "tags": []}
    toks = sec["t"]
    card = None
    num = ""
    in_faq = False
    faq = None
    i = 0
    while i < len(toks):
        k = toks[i]
        tag = k[0]
        if tag == "row":
            kids = k[1]
            if re.match(r"^[\d$<>~+-]", kids[0]) and len(kids) == 2 and not re.match(r"^[\d$<>~+-]", kids[1]):
                kids = kids[::-1]
            (card["kv"] if card else out["kv"]).append([" · ".join(kids[:-1]), kids[-1]]); i += 1; continue
        if tag == "faq_start":
            in_faq = True; faq = {"q": "", "a": []}; i += 1; continue
        if tag == "faq_end":
            if faq and faq["q"]: out["faq"].append(faq)
            in_faq = False; faq = None; i += 1; continue
        text, cls, href = k[1], k[2], k[3]
        if in_faq:
            if tag == "summary": faq["q"] = text
            elif tag in ("p", "li", "span"): faq["a"].append(text)
            i += 1; continue
        if tag in ("span", "li", "div", "p") and re.fullmatch(r"\d{1,2}", text) and i + 1 < len(toks) and toks[i + 1][0] in ("h3", "h4"):
            num = text.zfill(2); i += 1; continue
        if tag == "p" and "eyebrow" in cls:
            out["eyebrow"] = text
        elif tag == "h1":
            out["h1"] = text
        elif tag == "h2":
            out["h2"] = text; card = None
        elif tag == "h3" and re.fullmatch(r"\d{1,2}", text):
            num = text
        elif tag in ("h3", "h4"):
            card = {"href": href, "n": num, "h": text, "lvl": tag, "p": [], "tags": [], "li": [], "kv": [], "a": []}
            out["cards"].append(card); num = ""
        elif tag == "a":
            (card["a"] if card else out["links"]).append([text, href])
        elif tag == "span" and "badge" in cls:
            (card["tags"] if card else out["tags"]).append(text)
        elif tag == "span":
            # label/value pair: muted span followed by a tabular span
            nxt = toks[i + 1] if i + 1 < len(toks) else None
            if nxt and nxt[0] == "span" and "tabular" in nxt[2] and "tabular" not in cls:
                (card["kv"] if card else out["kv"]).append([text, nxt[1]]); i += 2; continue
            (card["li"] if card else out["bullets"]).append(text)
        elif tag in ("li", "dd", "td", "th", "dt"):
            (card["li"] if card else out["bullets"]).append(text)
        elif tag == "p":
            (card["p"] if card else out["lead"]).append(text)
        i += 1
    return out

def main(src, dst):
    x = X(); x.feed(open(src, encoding="utf-8").read())
    secs = []
    parts = []
    for s in x.secs:
        cur = []; seen = False
        for k in s["t"]:
            if k[0] == "h2" and seen:
                # a second heading opens a new section; its eyebrow goes with it
                carry = []
                if cur and cur[-1][0] == "p" and "eyebrow" in cur[-1][2]:
                    carry = [cur.pop()]
                parts.append({"t": cur}); cur = carry
            if k[0] == "h2": seen = True
            cur.append(k)
        parts.append({"t": cur})
    for s in parts:
        g = group(s)
        if not any([g["eyebrow"], g["h1"], g["h2"], g["lead"], g["cards"], g["faq"], g["bullets"], g["kv"]]):
            continue
        secs.append(g)
    # the closing call-to-action is replaced by the redesign's own
    if secs and not secs[-1]["cards"] and not secs[-1]["faq"] and len(secs) > 2 and any("Book" in l[0] or "assessment" in l[0].lower() or "engineer" in l[0].lower() for l in secs[-1]["links"]):
        secs.pop()
    json.dump({"sections": secs}, open(dst, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    print(dst, len(secs), "sections")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
