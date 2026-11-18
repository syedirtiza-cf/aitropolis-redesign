/* Page audit. Serve the folder (python3 -m http.server 4173), open any page on it,
   paste this into the browser console. It loads every page in a 390px iframe and
   reports: horizontal overflow, h1 count, title and description length, images
   without alt, missing icons, empty sections, duplicate ids, broken internal links
   and "undefined" text. An empty result means every page passed. */
(async () => {
  const man = Object.keys(await (await fetch("src/pages.json?" + Date.now())).json());
  const names = ["index", "solutions", "industries", "case-studies", "insights", "partners", "about", "contact", ...man];
  const have = new Set(names.map(n => n + ".html"));
  const out = {}, add = (n, k) => (out[n] ??= []).push(k);
  for (const n of names) {
    const f = document.createElement("iframe");
    f.style.cssText = "position:fixed;left:0;top:0;width:390px;height:800px;opacity:0;pointer-events:none";
    f.src = n + ".html?" + Date.now(); document.body.append(f);
    await new Promise(r => f.onload = r); await new Promise(r => setTimeout(r, 200));
    const d = f.contentDocument;
    if (d.documentElement.scrollWidth > 392) add(n, "overflow at 390: " + d.documentElement.scrollWidth);
    if (d.querySelectorAll("h1").length !== 1) add(n, "h1 count " + d.querySelectorAll("h1").length);
    if (d.title.length < 15 || d.title.length > 70) add(n, "title length " + d.title.length);
    const md = d.querySelector("meta[name=description]")?.content || "";
    if (md.length < 50 || md.length > 200) add(n, "description length " + md.length);
    d.querySelectorAll("img:not([alt])").forEach(() => add(n, "img without alt"));
    if ([...d.querySelectorAll("use")].some(u => !d.querySelector(u.getAttribute("href")))) add(n, "missing icon");
    d.querySelectorAll("main section.sec,main section.ssec").forEach(s => { if (s.textContent.trim().length < 30) add(n, "empty section " + s.id) });
    const ids = [...d.querySelectorAll("[id]")].map(e => e.id), dup = ids.filter((x, i) => ids.indexOf(x) !== i);
    if (dup.length) add(n, "duplicate ids " + [...new Set(dup)]);
    for (const h of new Set([...d.querySelectorAll("a[href]")].map(a => a.getAttribute("href")))) {
      if (!h || /^(#|http|mailto|tel|javascript)/.test(h)) continue;
      let u = h.split("#")[0]; if (!u) continue;
      if (u[0] === "/") u = (u.slice(1).replace(/\//g, "-") || "index") + ".html";
      if (!have.has(u) && !/^assets|^robots/.test(u)) add(n, "broken link " + h);
    }
    if ([...d.querySelectorAll("main h2,main h3,main p")].some(e => /undefined|\[object|NaN/.test(e.textContent))) add(n, "bad text");
    f.remove();
  }
  console.log(Object.keys(out).length ? out : "All " + names.length + " pages passed");
  return out;
})();
