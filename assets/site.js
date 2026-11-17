(()=>{
"use strict";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const html=document.documentElement;
const REDUCED=matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE=matchMedia("(hover:hover) and (pointer:fine) and (min-width:1025px)").matches;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const smooth=v=>{const t=clamp(v);return t*t*(3-2*t)};
const ease3=x=>1-Math.pow(1-x,3);
const easeIO=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const mk=(t,c)=>{const e=document.createElement(t);if(c)e.className=c;return e};
const NS="http://www.w3.org/2000/svg";

/* ---- Facts. In the Next.js build these come from content/canon.json. ---- */
const CANON={specialists:"100+",deployments:"200+",countries:"30+",onTime:"99.5%",founded:"2010",
  studios:[{city:"Dubai",tz:"Asia/Dubai",role:"Global HQ"},{city:"London",tz:"Europe/London",role:"Europe"},{city:"Islamabad",tz:"Asia/Karachi",role:"South Asia"},{city:"Singapore",tz:"Asia/Singapore",role:"APAC"}],
  booking:"https://koalendar.com/e/meet-with-AitropolisTechnologies"};
$$("[data-canon]").forEach(el=>{const v=CANON[el.dataset.canon];if(v)el.textContent=v});
$$("[data-book]").forEach(a=>{a.href=CANON.booking;a.target="_blank";a.rel="noopener noreferrer"});

/* ---- Smooth scroll + lock ---- */
let lenis=null;
if(window.Lenis&&!REDUCED){lenis=new Lenis({smoothWheel:true});const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf)}
let lockN=0;
const lock=()=>{if(lockN++===0){lenis&&lenis.stop();html.style.overflow="hidden"}};
const unlock=()=>{if(--lockN<=0){lockN=0;lenis&&lenis.start();html.style.overflow=""}};
const scrollToEl=el=>{if(lenis)lenis.scrollTo(el);else el.scrollIntoView({behavior:"smooth"})};
$$('a[href^="#"]').forEach(a=>{const h=a.getAttribute("href");if(h.length<2||a.hasAttribute("data-book"))return;a.addEventListener("click",e=>{const t=$(h);if(!t)return;e.preventDefault();scrollToEl(t)})});

/* ---- Ticker ---- */
const subs=new Set();let raf=0;
const loop=t=>{subs.forEach(f=>f(t));raf=subs.size?requestAnimationFrame(loop):0};
const tick=f=>{subs.add(f);if(!raf)raf=requestAnimationFrame(loop);return()=>{subs.delete(f)}};
/** Run fn(dt) every frame while el is within 25% of the viewport. */
const whileVisible=(el,fn)=>{let off=null,last=0;new IntersectionObserver(([e])=>{if(e.isIntersecting&&!off){last=performance.now();off=tick(t=>{const dt=Math.min(.1,(t-last)/1000);last=t;fn(dt,t/1000)})}else if(!e.isIntersecting&&off){off();off=null}},{rootMargin:"25% 0px"}).observe(el)};
const inView=(el,cb,margin="0px 0px -6% 0px")=>{const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){io.disconnect();cb()}},{rootMargin:margin});io.observe(el)};

/* ---- Build: coverage chart, stack, studio tiles, clocks, districts, footer wordmark ---- */
const offset=(tz,at)=>{const n=new Intl.DateTimeFormat("en-GB",{timeZone:tz,timeZoneName:"shortOffset"}).formatToParts(at).find(p=>p.type==="timeZoneName")?.value||"GMT";const m=n.match(/GMT([+-]\d+)(?::(\d+))?/);return m?Number(m[1])+(m[2]?Math.sign(Number(m[1]))*Number(m[2])/60:0):0};
const NOW=new Date();
const rowsData=CANON.studios.map(s=>{const o=offset(s.tz,NOW);return{...s,off:o,start:9-o,end:18-o}}).sort((a,b)=>a.start-b.start);
(()=>{
  const cov=$("#cov");if(!cov)return;const rows=mk("div","cov-rows");const pct=h=>`${h/24*100}%`;
  rowsData.forEach((r,i)=>{const row=mk("div","cov-row");const b=mk("b");b.textContent=r.city;const trk=mk("div","cov-track");
    const bar=mk("span","cov-bar");bar.style.left=pct(Math.max(0,r.start));bar.style.width=`${(Math.min(24,r.end)-Math.max(0,r.start))/24*100}%`;bar.style.setProperty("--g",0);bar.style.transition=`transform 1.1s var(--ease) ${.9+i*.08}s`;bar.dataset.g="1";trk.append(bar);row.append(b,trk);rows.append(row)});
  /* overlap row: where two or more studios are online */
  const ov=mk("div","cov-row");const ob=mk("b");ob.textContent="Overlap";const ot=mk("div","cov-track");
  const segs=[];for(let h=0;h<24;h+=.25){const n=rowsData.filter(r=>h>=r.start&&h<r.end).length;const on=n>=2;if(on){if(segs.length&&segs[segs.length-1][1]===h)segs[segs.length-1][1]=h+.25;else segs.push([h,h+.25])}}
  segs.forEach(([a,b],i)=>{const s=mk("span","cov-bar ov");s.style.left=pct(a);s.style.width=`${(b-a)/24*100}%`;s.style.setProperty("--g",0);s.style.transition=`transform 1.1s var(--ease) ${1.3+i*.08}s`;s.dataset.g="1";ot.append(s)});
  ov.append(ob,ot);rows.append(ov);
  const grid=mk("div","cov-grid");[0,6,12,18,24].forEach(h=>{const i=mk("i");i.style.left=pct(h);if(h===24)i.style.left="calc(100% - 1px)";grid.append(i)});
  const axis=mk("div","cov-axis");axis.append(mk("div"));const ax=mk("div");[0,6,12,18,24].forEach(h=>{const s=mk("span");s.style.left=pct(h);s.textContent=String(h).padStart(2,"0");ax.append(s)});axis.append(ax);
  const nowEl=mk("div","cov-now");const tip=mk("div","cov-tip");tip.textContent="Now";nowEl.append(tip);
  const nowWrap=mk("div");nowWrap.style.cssText="position:absolute;top:0;bottom:2.25rem;left:6.5rem;right:0;pointer-events:none";nowWrap.append(nowEl);
  cov.append(rows,axis,grid,nowWrap);
  const clockEl=$("#covClock");
  const upd=()=>{const d=new Date();const h=d.getUTCHours()+d.getUTCMinutes()/60;nowEl.style.left=pct(h);const t=`${String(d.getUTCHours()).padStart(2,"0")}:${String(d.getUTCMinutes()).padStart(2,"0")}`;tip.textContent=`Now · ${t} GMT`;clockEl.textContent=`GMT ${t}`;
    tip.style.transform=h<4?"translateX(-10%)":h>20?"translateX(-90%)":"translateX(-50%)"};
  upd();setInterval(upd,30000);
  inView($("#dash"),()=>$$("[data-g]",cov).forEach(b=>b.style.setProperty("--g",1)),"0px");
  if(REDUCED)$$("[data-g]",cov).forEach(b=>b.style.setProperty("--g",1));
})();
(()=>{const st=$("#stack");if(!st)return;const top=[64,112,90,154,48,102,176];top.forEach((h,i)=>{const c=mk("div");c.style.setProperty("--d",`${i*80}ms`);const a=mk("b");a.style.setProperty("--h",h/16);const u=mk("u");c.append(a,u);st.append(c)});
  const f=mk("span","floor");f.style.setProperty("--d","560ms");const t=mk("span","tag");t.style.setProperty("--d","760ms");t.textContent="Approved scope";st.append(f,t)})();
(()=>{const ol=$("#studs");if(!ol)return;const h=NOW.getUTCHours()+NOW.getUTCMinutes()/60;
  rowsData.forEach((r,i)=>{const li=mk("li");li.style.setProperty("--d",`${100+i*70}ms`);const sm=mk("small");sm.textContent=r.city.slice(0,3).toUpperCase();const sp=mk("span");
    const on=h>=r.start&&h<r.end;sp.className=on?"now":(h<r.start?"next":"off");sp.textContent=on?"Online":(h<r.start?"Next":"Off");li.append(sm,sp);ol.append(li)})})();
(()=>{const ul=$("#clocks");if(!ul)return;const items=CANON.studios.map(s=>{const li=mk("li");const l=mk("div");const c=mk("span","city");c.textContent=s.city;const sm=mk("small");sm.textContent=s.role;l.append(c,sm);const t=mk("time");li.append(l,t);ul.append(li);return{tz:s.tz,t}});
  const upd=()=>{items.forEach(({tz,t})=>{const p=new Intl.DateTimeFormat("en-GB",{timeZone:tz,hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date());t.textContent=p});};
  upd();setInterval(upd,15000)})();
(()=>{const m=$("#mega");if(!m)return;[..."Aitropolis"].forEach(c=>{const s=mk("span");s.textContent=c;m.append(s)})})();

/* ---- District cards with procedural pixel art ---- */
const DISTRICTS=[
 {n:"Systems",icon:"blocks",sub:"ERP, CRM and business intelligence",plat:"Oracle EBS, Oracle Cloud, SAP, D365, Odoo",start:"ERP assessment",art:"blocks",g:"a",k:"01"},
 {n:"Foundations",icon:"layers",sub:"Cloud and infrastructure",plat:"AWS, Azure, GCP, VMware, OpenShift",start:"Cloud migration",art:"slabs",g:"b",k:"02"},
 {n:"Intelligence",icon:"brain",sub:"AI, machine learning and custom software",plat:"LLMs, MLOps, data engineering",start:"Generative AI",art:"burst",g:"c",k:"03"},
 {n:"Exchange",icon:"hexagon",sub:"Blockchain and fintech",plat:"Smart contracts, DeFi, tokenisation",start:"Smart contracts",art:"hex",g:"b",k:"04"},
 {n:"Signal",icon:"radar",sub:"AI-powered go-to-market and growth",plat:"SEO, paid media, automation",start:"Enterprise SEO",art:"waves",g:"c",k:"05"},
 {n:"Immersion",icon:"glasses",sub:"AR/VR, AV and experiences",plat:"AV integration, XR, smart rooms",start:"AV integration",art:"gem",g:"a",k:"06"}];
const ART={
 blocks:(c,r)=>c>=8&&c<=22&&r>=3&&r<=17&&((c-8)%5<4)&&((r-3)%5<4),
 slabs:(c,r)=>{const i=Math.floor((r-4)/4);return r>=4&&r<=17&&(r-4)%4<3&&c>=9+i*0&&c<=22-(3-i)*0&&c>=(8+i*1)&&c<=(23-i*1)},
 burst:(c,r)=>{const d=Math.hypot(c-15.5,r-10.5);return Math.abs(d-7)<1.05||d<2.1||(Math.abs(d-3.8)<.6&&((c+r)%2===0))},
 hex:(c,r)=>{const dx=c-15.5,dy=r-10.5;const v=Math.max(Math.abs(dy),Math.abs(dx)*.866+Math.abs(dy)*.5);return v<=7.2&&v>=5.9||(Math.hypot(dx,dy)<1.6)},
 waves:(c,r)=>{const dx=c-15.5,dy=r-15;const d=Math.hypot(dx,dy*1.15);return dy<=.6&&d<13&&(d%4)<1.7&&d>1.5||Math.hypot(dx,dy)<1.3},
 gem:(c,r)=>{const d=Math.abs(c-15.5)+Math.abs(r-10.5);return (d<=7.4&&d>=5.7)||d<=1.6||(Math.abs(c-15.5)<.6&&Math.abs(r-10.5)<7.4&&d>2.5&&d<5.7)}
};
const ORDER={blocks:(c,r)=>c+r,slabs:(c,r)=>-r,burst:(c,r)=>Math.hypot(c-15.5,r-10.5),hex:(c,r)=>(Math.atan2(c-15.5,-(r-10.5))/(2*Math.PI)+1)%1,waves:(c,r)=>Math.hypot(c-15.5,r-15),gem:(c,r)=>{const s=Math.sin((c*12.9898+r*78.233))*43758.5453;return s-Math.floor(s)}};
const arts=[];
window.AIT={ART,ORDER,smooth,easeIO,clamp,mk,inView,NS,REDUCED,whileVisible,tick};
(()=>{const grid=$("#dgrid");if(!grid)return;
 DISTRICTS.forEach((d,i)=>{
  const card=mk("article","card dcard");card.dataset.r="";card.style.setProperty("--d",`${(i%3)*90}ms`);
  const tile=mk("div",`dtile ${d.g}`);const svg=document.createElementNS(NS,"svg");svg.setAttribute("viewBox","0 0 448 308");svg.setAttribute("aria-hidden","true");svg.setAttribute("fill","#fff");
  const dots=[],px=[];
  for(let r=0;r<22;r++)for(let c=0;c<32;c++){const cx=c*14+7,cy=r*14+7;const on=ART[d.art](c,r);const e=document.createElementNS(NS,"circle");e.setAttribute("cx",cx);e.setAttribute("cy",cy);e.setAttribute("r",1);e.setAttribute("fill-opacity",.4);svg.append(e);if(on)px.push({e,k:ORDER[d.art](c,r)})}
  const ks=px.map(p=>p.k);const lo=Math.min(...ks),rg=Math.max(1e-6,Math.max(...ks)-lo);px.forEach(p=>p.s=((p.k-lo)/rg)*.6);
  tile.append(svg);
  const body=mk("div","dbody");
  body.innerHTML=`<div class="dtop"><h3 class="t-tm dname"><span class="mico">${`<svg class="ic" aria-hidden="true"><use href="#i-${d.icon}"/></svg>`}</span>${d.n}</h3><p class="num-m" style="font-size:var(--t-m)">${d.k}</p></div><p class="t-bm muted" style="padding-top:.25rem">${d.sub}</p><dl class="dash-t" style="margin-top:1.25rem"><div class="dash-b"><dt>Platforms</dt><dd style="text-align:right;max-width:13rem">${d.plat}</dd></div><div><dt>Start with</dt><dd>${d.start}</dd></div></dl>`;
  card.append(tile,body);grid.append(card);
  const draw=p=>px.forEach(o=>{const g=smooth((p-o.s)/.4);o.e.setAttribute("r",1+4*g);o.e.setAttribute("fill-opacity",.4+.6*g)});
  if(REDUCED)draw(1);else{draw(0);arts.push({svg,draw,played:false})}
 });
 arts.forEach(a=>inView(a.svg,()=>{const t0=performance.now()+250;const f=()=>{const p=clamp((performance.now()-t0)/1400);a.draw(easeIO(p));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)},"0px 0px -10% 0px"));
})();

/* ---- Reveal, masks, counters ---- */
if(!REDUCED){
  $$("[data-r]").forEach(el=>{new IntersectionObserver(([e],io)=>{if(e.isIntersecting){el.classList.add("in");io.disconnect()}},{rootMargin:"0px 0px -4% 0px"}).observe(el)});
  $$("[data-stage]").forEach(el=>inView(el,()=>el.classList.add("in")));
  $$(".steps li").forEach((li,i)=>{li.style.setProperty("--d","60ms");inView(li,()=>li.classList.add("in"))});
}
const maskLines=(el,{delay=60,stagger=90}={})=>{
  const src=[...el.childNodes].map(n=>n.cloneNode(true));const words=[];const out=[];
  for(const n of src){if(n.nodeType!==3){out.push(n);continue}
    for(const bit of n.textContent.split(/(\s+)/)){if(!bit)continue;if(/^\s+$/.test(bit)){out.push(document.createTextNode(bit));continue}
      const m=mk("span","mw"),i=mk("span","mi");i.textContent=bit;m.append(i);words.push({m,i});out.push(m)}}
  el.replaceChildren(...out);
  return{play(){const tops=[];words.forEach(({m,i})=>{const t=Math.round(m.offsetTop);let l=tops.findIndex(x=>Math.abs(x-t)<4);if(l<0)l=tops.push(t)-1;i.style.transitionDelay=`${delay+l*stagger}ms`;requestAnimationFrame(()=>requestAnimationFrame(()=>i.classList.add("in")))})}}
};
const heroMask=!REDUCED&&$('[data-mask="hero"]')?maskLines($('[data-mask="hero"]'),{delay:60,stagger:90}):null;
if(!REDUCED)$$('[data-mask="h"]').forEach(h=>{const m=maskLines(h);inView(h.parentElement,()=>m.play())});
const countUp=(el,wait)=>{
  const raw=el.textContent;const m=/^(\D*)([\d.,]+)(\D*)$/.exec(raw);if(!m)return;const [,pre,num,suf]=m;const dec=(num.split(".")[1]||"").length;const total=parseFloat(num.replace(/,/g,""));
  const fmt=v=>pre+(dec?v.toFixed(dec):Math.round(v).toLocaleString("en-GB"))+suf;
  if(REDUCED)return;el.textContent=fmt(total*.55);
  const go=()=>{const t0=performance.now();const f=()=>{const p=clamp((performance.now()-t0)/1100);el.textContent=fmt(total*(.55+.45*ease3(p)));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
  inView(el,go,"0px 0px -6% 0px")};
$$("[data-count]").forEach(el=>countUp(el));

/* ---- Preloader, then hero entrance ---- */
let heroGo=()=>{$("#top").classList.add("go");heroMask&&heroMask.play()};
(()=>{
  const pre=$("#pre");if(!html.hasAttribute("data-preloader")||REDUCED){heroGo();return}
  clearTimeout(window.__pt);lock();
  const sym=$("#preSym"),num=$("#preNum");let finished=false;
  const done=()=>{if(finished)return;finished=true;html.removeAttribute("data-preloader");pre.classList.remove("out");unlock();heroGo()};
  const out=()=>{if(finished||pre.classList.contains("out"))return;pre.classList.add("out");heroGo();setTimeout(done,900)};
  sym.style.transition="opacity .8s var(--ease),transform 1s var(--ease)";requestAnimationFrame(()=>{sym.style.opacity=1;sym.style.transform="none"});
  const t0=performance.now()+300;const total=200;
  const f=()=>{const p=clamp((performance.now()-t0)/1500);num.textContent=Math.round(total*ease3(p))+(p>=1?"+":"");if(p<1)requestAnimationFrame(f);else setTimeout(out,420)};requestAnimationFrame(f);
  ["keydown","wheel","touchstart","pointerdown"].forEach(ev=>window.addEventListener(ev,out,{once:true,passive:true}));
})();

/* ---- Parallax (hero halftone 0.35, dashboard 0.15) ---- */
$$("[data-par]").forEach(el=>{if(REDUCED)return;const lag=Number(el.dataset.par);const max=el.classList.contains("dash-wrap")?5:0;let last=-1;
  const run=()=>{const raw=Math.max(0,scrollY)*lag;const rem=parseFloat(getComputedStyle(html).fontSize);const m=max?max*rem*(innerWidth<=560?.1:innerWidth<=1024?.15:.25):0;const y=Math.round((m?m*(1-Math.exp(-raw/m)):raw)*100)/100;if(y===last)return;last=y;el.style.translate=y>0?`0 ${y}px`:""};
  whileVisible($("#top"),run)});

/* ---- Hero halftone: a ring of dots, pulsing, with a cursor lens and click ripples ---- */
(()=>{
  const cv=$("#ht"),sec=$("#top");if(REDUCED||!cv||!sec)return;const ctx=cv.getContext("2d");let W=0,H=0,dpr=1,dots=[],pointer=null;const ripples=[];let now=0;
  const build=()=>{const r=sec.getBoundingClientRect();W=r.width;H=Math.min(r.height,940*(W/1440>1?W/1440:1));dpr=Math.min(2,devicePixelRatio||1);cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+"px";cv.style.height=H+"px";
    const remPx=parseFloat(getComputedStyle(html).fontSize);const rem=remPx/16;const clearTop=remPx*5.75,clearLen=remPx*9;const pitch=Math.max(14,22*rem*1.0);dots=[];const cx=W/2,cy=H*.52;const R=Math.min(W*.52,H*.66),band=R*.22;
    for(let y=pitch/2;y<H;y+=pitch)for(let x=pitch/2;x<W;x+=pitch){const row=Math.round(y/pitch);const xx=x+(row%2?pitch/2:0);const d=Math.hypot(xx-cx,(y-cy)*1.15);const s=Math.exp(-(((d-R)/band)**2));if(s<.06)continue;const fade=clamp(1-y/(H*.98));const tf=smooth((y-clearTop)/clearLen);if(tf<.02)continue;dots.push({x:xx,y,r:(.7+4.4*s)*rem,o:(.12+.6*s)*(.35+.65*fade)*tf,sc:1,bo:0,li:0,px:0,py:0})}};
  const draw=dt=>{ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);const cx=W/2,cy=H*.52;const k=1-Math.pow(1-.16,dt*60);
    for(let i=ripples.length-1;i>=0;i--)if(now-ripples[i].t>1.5)ripples.splice(i,1);
    for(const d of dots){const sh=.9+.1*Math.sin(now*.8-d.x*.006-d.y*.004);let ts=1,tb=0,tl=0,tx=0,ty=0;
      const dx=d.x-cx,dy=d.y-cy,dist=Math.hypot(dx,dy),ang=Math.atan2(dy,dx);const wob=16*Math.sin(ang*3+now*.6)+9*Math.sin(ang*5-now*.9);
      const ph=((dist+wob-now*150)/280)*Math.PI*2;const crest=Math.pow((Math.cos(ph)+1)/2,10),echo=Math.pow((Math.cos(ph+.9)+1)/2,14);const fade=Math.max(0,1-dist/1100);const b=Math.min(1,(crest+.4*echo)*(.35+.65*fade));ts+=.9*b;tb+=.4*b;
      if(pointer){const px=d.x-pointer.x,py=d.y-pointer.y,pd=Math.hypot(px,py);if(pd<260){const f=Math.exp(-((pd/130)**2));ts+=1.1*f;tb+=.4*f;tl=f>.72?(f-.72)/.28:0;const pu=7*f/Math.max(pd,1);tx=px*pu;ty=py*pu}}
      for(const rp of ripples){const age=now-rp.t,pd=Math.hypot(d.x-rp.x,d.y-rp.y);const bd=Math.exp(-(((pd-age*520)/36)**2))*(1-age/1.5);ts+=1.3*bd;tb+=.5*bd;if(bd>.6)tl=Math.max(tl,(bd-.6)/.4)}
      d.sc+=(ts-d.sc)*k;d.bo+=(tb-d.bo)*k;d.li+=(tl-d.li)*k;d.px+=(tx-d.px)*k;d.py+=(ty-d.py)*k;
      const a=Math.min(1,d.o*sh+d.bo*Math.max(d.o*2.2,.25));if(a<.01)continue;ctx.globalAlpha=a;ctx.fillStyle=d.li>.5?"#ddf545":"#fff";ctx.beginPath();ctx.arc(d.x+d.px,d.y+d.py,d.r*d.sc,0,6.2832);ctx.fill()}
    ctx.globalAlpha=1};
  build();new ResizeObserver(build).observe(sec);
  whileVisible(sec,(dt,t)=>{now=t;draw(dt)});
  if(FINE){sec.addEventListener("pointermove",e=>{const r=cv.getBoundingClientRect();pointer={x:e.clientX-r.left,y:e.clientY-r.top}});sec.addEventListener("pointerleave",()=>pointer=null)}
  sec.addEventListener("pointerdown",e=>{if(e.target.closest("a,button,input"))return;const r=cv.getBoundingClientRect();ripples.push({x:e.clientX-r.left,y:e.clientY-r.top,t:now})});
})();

/* ---- Dashboard tilt: rests tilted back, flattens as it scrolls in ---- */
(()=>{
  const card=$("#dash");if(REDUCED||!card){return}
  const top=()=>{let y=0;for(let n=card;n;n=n.offsetParent)y+=n.offsetTop;return y};
  const apply=k=>card.style.setProperty("--k",String(k));apply(1);
  const vh=innerHeight;
  if(top()+card.offsetHeight<=vh){const t0=performance.now();const wait=()=>{if(html.hasAttribute("data-preloader")){requestAnimationFrame(wait);return}const s=performance.now()+700;const f=()=>{const p=clamp((performance.now()-s)/1400);apply(1-easeIO(p));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)};wait();return}
  whileVisible(card,()=>{const vh=innerHeight;const from=Math.max(0,top()-vh);const flatAt=Math.max(from+vh*.25,(top()+card.offsetHeight/2-vh/2)/(1-.15));apply(Math.round((1-smooth((Math.max(0,scrollY)-from)/(flatAt-from)))*1e4)/1e4)});
})();

/* ---- Line flows: silk ribbons of hair-thin strands ---- */
const FLOWS={
  flow1:{spine:[[.74,-.04],[.62,.28],[.8,.5],[1.15,.68]],spread:[.07,.22],twist:.83,strands:26,reveal:false},
  flow2:{spine:[[.004,.01],[.02,.17],[-.004,.34],[.028,.52],[-.004,.7],[-.012,.99]],spread:[.008,.028],twist:3.2,strands:22,reveal:"down",rel:true},
  flow3:{spine:[[.99,.3],[.97,.5],[1.0,.7],[.97,.99]],spread:[.012,.04],twist:1.6,strands:22,reveal:"up",fan:.9}
};
const flow=(cv,cfg)=>{
  const ctx=cv.getContext("2d");let w=0,h=0,dpr=1,now=0;const P=cfg.spine;const n=P.length;let prog=cfg.reveal?0:1;
  const sz=()=>{w=cv.clientWidth;h=cv.clientHeight;dpr=Math.min(2,devicePixelRatio||1);cv.width=w*dpr;cv.height=h*dpr};
  const at=(t,i)=>{const f=clamp(t)*(n-1),s=Math.min(n-2,Math.floor(f)),u=f-s;const g=k=>P[Math.max(0,Math.min(n-1,k))][i];const p0=g(s-1),p1=g(s),p2=g(s+1),p3=g(s+2);return .5*(2*p1+(p2-p0)*u+(2*p0-5*p1+4*p2-p3)*u*u+(3*p1-p0-3*p2+p3)*u*u*u)};
  const cols=["#bfd6f6","#8dbaf0","#5c9be6"];const S=Array.from({length:cfg.strands},(_,j)=>({u:j/(cfg.strands-1)-.5,c:j%7===3?0:j%3===0?1:2,a:j%7===3?.85:.22+.22*((Math.sin(j*12.9)*43758.5453)%1+1)%1,ph:((Math.sin(j*7.3)*9301.7)%1+1)%1*6.28,lw:j%7===3?1.1:.8}));
  const SM=70;
  const draw=()=>{ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);if(prog<=.005)return;ctx.globalCompositeOperation="lighter";ctx.lineCap="round";
    for(const s of S){const a=cfg.reveal==="up"?1-prog:0,b=cfg.reveal==="up"?1:cfg.reveal?prog:1;if(b-a<.01)continue;
      const pts=[];for(let k=0;k<SM;k++){const t=a+(b-a)*k/(SM-1);const x=at(t,0)*w,y=at(t,1)*h;const e=.001;const tx=(at(Math.min(1,t+e),0)-at(Math.max(0,t-e),0))*w,ty=(at(Math.min(1,t+e),1)-at(Math.max(0,t-e),1))*h;const L=Math.hypot(tx,ty)||1;
        const wd=(cfg.spread[0]+(cfg.spread[1]-cfg.spread[0])*t)*(cfg.rel?w:w);const turn=Math.cos(t*cfg.twist*Math.PI-now*.35+s.u*(cfg.fan||0)*Math.PI);const rip=(6+10*t)*Math.sin(t*7+now*.9+s.ph);const off=wd*s.u*turn+rip;pts.push([x+(-ty/L)*off,y+(tx/L)*off])}
      ctx.strokeStyle=cols[s.c];ctx.globalAlpha=s.a;ctx.lineWidth=s.lw;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let k=1;k<SM;k++){const mx=(pts[k-1][0]+pts[k][0])/2,my=(pts[k-1][1]+pts[k][1])/2;ctx.quadraticCurveTo(pts[k-1][0],pts[k-1][1],mx,my)}ctx.stroke()}
    ctx.globalAlpha=1;ctx.globalCompositeOperation="source-over"};
  sz();new ResizeObserver(()=>{sz();draw()}).observe(cv);
  if(REDUCED){prog=1;draw();return}
  whileVisible(cv,(dt,t)=>{now=t;if(cfg.reveal){const r=cv.getBoundingClientRect();const target=clamp((innerHeight*.8-r.top)/r.height);prog+=(target-prog)*(1-Math.pow(1-.08,dt*60))}draw()});
};
Object.entries(FLOWS).forEach(([id,cfg])=>{const cv=$("#"+id);if(cv)flow(cv,cfg)});
/* dot corners of the dark block */
(()=>{const wrap=$("#stepsWrap");if(!wrap)return;const mkDots=(pos)=>{const c=mk("canvas");c.style.cssText=`position:absolute;${pos};width:26rem;height:24rem;pointer-events:none;opacity:.9`;wrap.prepend(c);const x=c.getContext("2d");const draw=()=>{const w=c.clientWidth,h=c.clientHeight,dpr=Math.min(2,devicePixelRatio||1);c.width=w*dpr;c.height=h*dpr;x.setTransform(dpr,0,0,dpr,0,0);const p=14;const fromRight=pos.includes("right");for(let yy=p/2;yy<h;yy+=p)for(let xx=p/2;xx<w;xx+=p){const dx=fromRight?w-xx:xx,dy=pos.includes("bottom")?h-yy:yy;const d=Math.hypot(dx/w,dy/h);const a=Math.max(0,.55-d*.62);if(a<.03)continue;x.globalAlpha=a;x.fillStyle="#fff";x.beginPath();x.arc(xx,yy,Math.max(.5,2.2-d*2),0,6.2832);x.fill()}};draw();new ResizeObserver(draw).observe(c)};mkDots("left:0;top:0");mkDots("right:0;bottom:0")})();

/* ---- Steps timeline driven by the front ---- */
(()=>{
  const ol=$("#steps");if(!ol)return;const plate=$("#plate"),spine=$("#spine");const lis=$$(":scope > li",ol);const tiles=lis.map(li=>$(".tile",li));
  let front=-1,rows=[],ver="";const offIn=(el)=>{let y=0;for(let n=el;n&&n!==ol;n=n.offsetParent)y+=n.offsetTop;return y};
  const measure=()=>{rows=lis.map((li,i)=>({y:li.offsetTop,h:li.offsetHeight,mark:offIn(tiles[i])+tiles[i].offsetHeight/2,range:li.offsetHeight*.6}));
    const first=rows[0].mark,last=rows[rows.length-1].mark;spine.style.top=first+"px";spine.style.height=(last-first)+"px";ver=innerWidth+"x"+ol.offsetHeight};
  const paint=f=>{
    rows.forEach((r,i)=>{const o=smooth((f-(r.mark-r.range/2))/r.range);const fill=$("i",tiles[i]);fill.style.opacity=o;fill.style.transform=`scale(${.92+.08*o})`});
    const first=rows[0].mark,last=rows[rows.length-1].mark;spine.style.transform=`scaleY(${clamp((f-first)/(last-first||1))})`;
    let k=0;while(k<rows.length-1&&f>=rows[k+1].mark)k++;const a=rows[k],b=rows[Math.min(k+1,rows.length-1)];const t=b===a||f<=a.mark?0:smooth((f-a.mark)/(b.mark-a.mark));
    plate.style.transform=`translateY(${a.y+(b.y-a.y)*t}px)`;plate.style.height=`${a.h+(b.h-a.h)*t}px`;plate.style.opacity=1};
  measure();
  if(REDUCED){const lastRow=rows[rows.length-1];paint(lastRow.mark+500);plate.style.opacity=0;return}
  whileVisible(ol,dt=>{if(ver!==innerWidth+"x"+ol.offsetHeight)measure();const target=clamp(innerHeight/2-ol.getBoundingClientRect().top,0,ol.offsetHeight);front=front<0||dt===0?target:front+(target-front)*(1-Math.exp(-12*dt));if(Math.abs(front-target)<.05)front=target;paint(front)});
})();

/* ---- Header bar, menu, rails, form ---- */
(()=>{
  const bar=$("#bar"),hero=$("#top");let shown=false,pend=false;
  const upd=()=>{pend=false;const hb=hero.getBoundingClientRect().bottom+scrollY;const nx=scrollY>hb-80;if(nx===shown)return;shown=nx;bar.classList.toggle("show",shown);bar.setAttribute("aria-hidden",String(!shown))};
  addEventListener("scroll",()=>{if(!pend){pend=true;requestAnimationFrame(upd)}},{passive:true});upd();
  const sheet=$("#sheet"),dim=$("#dim");let open=false;
  const set=v=>{if(open===v)return;open=v;sheet.classList.toggle("open",v);dim.classList.toggle("open",v);$$("[data-menu]").forEach(b=>b.setAttribute("aria-expanded",String(v)));v?lock():unlock();if(v)$("#xb").focus({preventScroll:true})};
  $$("[data-menu]").forEach(b=>b.addEventListener("click",()=>set(true)));$("#xb").addEventListener("click",()=>set(false));dim.addEventListener("click",()=>set(false));
  sheet.addEventListener("click",e=>{const a=e.target.closest("a");if(!a)return;const h=a.getAttribute("href");set(false);if(h&&h.startsWith("#")&&h.length>1){e.preventDefault();setTimeout(()=>{const t=$(h);t&&scrollToEl(t)},120)}});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")set(false)});
  matchMedia("(min-width:769px)").addEventListener("change",m=>{if(m.matches)set(false)});
  $$("[data-rail]").forEach(r=>{const bar=r.nextElementSibling&&$("i",r.nextElementSibling);if(!bar)return;const u=()=>{const max=r.scrollWidth-r.clientWidth;const ratio=r.scrollWidth?Math.min(1,r.clientWidth/r.scrollWidth):.7;bar.style.width=ratio*100+"%";bar.style.marginLeft=(max>0?r.scrollLeft/max:0)*(1-ratio)*100+"%"};u();r.addEventListener("scroll",u,{passive:true});new ResizeObserver(u).observe(r)});
  $("#toTop")&&$("#toTop").addEventListener("click",e=>{e.preventDefault();lenis?lenis.scrollTo(0):scrollTo({top:0,behavior:"smooth"})});
  $("#form")&&$("#form").addEventListener("submit",e=>{e.preventDefault();const b=$("button",e.target);b.textContent="Thank you";setTimeout(()=>b.textContent="Send",2500)});
})();

/* ---- Contact envelope: faces the cursor ---- */
(()=>{const env=$("#env"),panel=$("#envPanel"),sec=$("#contact");if(!env)return;const REST={p:14,y:-20,r:-3};
  if(!FINE||REDUCED)return;const set=(p,y,r)=>env.style.transform=`rotateX(${p}deg) rotateY(${y}deg) rotate(${r}deg)`;let vis=false;
  new IntersectionObserver(([e])=>{vis=e.isIntersecting;if(!vis)set(REST.p,REST.y,REST.r)}).observe(panel);
  sec.addEventListener("pointermove",e=>{if(!vis)return;const r=env.getBoundingClientRect();const nx=clamp((e.clientX-(r.left+r.width/2))/520,-1,1),ny=clamp((e.clientY-(r.top+r.height/2))/520,-1,1);set(-ny*20,nx*28,-nx*4)});
  sec.addEventListener("pointerleave",()=>set(REST.p,REST.y,REST.r));
  /* dot field behind the envelope */
  const cv=$("#dotsN"),x=cv.getContext("2d");const d=()=>{const w=cv.clientWidth,h=cv.clientHeight,dp=Math.min(2,devicePixelRatio||1);cv.width=w*dp;cv.height=h*dp;x.setTransform(dp,0,0,dp,0,0);const p=16;for(let yy=p/2;yy<h;yy+=p)for(let xx=p/2;xx<w;xx+=p){const dd=Math.hypot(xx/w-.5,yy/h-.5);const a=Math.max(0,.5-dd*.7);if(a<.04)continue;x.globalAlpha=a;x.fillStyle="#fff";x.beginPath();x.arc(xx,yy,1.6,0,6.2832);x.fill()}};d();new ResizeObserver(d).observe(cv);
})();
(()=>{const cv=$("#dotsN");if(!cv||FINE&&!REDUCED)return;const x=cv.getContext("2d");const d=()=>{const w=cv.clientWidth,h=cv.clientHeight,dp=Math.min(2,devicePixelRatio||1);cv.width=w*dp;cv.height=h*dp;x.setTransform(dp,0,0,dp,0,0);const p=16;for(let yy=p/2;yy<h;yy+=p)for(let xx=p/2;xx<w;xx+=p){const dd=Math.hypot(xx/w-.5,yy/h-.5);const a=Math.max(0,.5-dd*.7);if(a<.04)continue;x.globalAlpha=a;x.fillStyle="#fff";x.beginPath();x.arc(xx,yy,1.6,0,6.2832);x.fill()}};d();new ResizeObserver(d).observe(cv)})();

/* ---- Footer revealed from under the page; wordmark letters rise ---- */
(()=>{
  const under=$("#under"),cover=$("#cover"),end=$("#mainEnd");if(!under)return;const letters=$$("#mega span");
  const START=.02,SPAN=.45;const turn=letters.length>1?(1-START-SPAN)/(letters.length-1):0;let fits=false,tuck=0,shown=0;
  const scrub=()=>letters.forEach((s,i)=>{s.style.transform=`translateY(${(1-smooth((shown-START-i*turn)/SPAN))*105}%)`});
  const check=()=>{tuck=parseFloat(getComputedStyle(under).paddingTop)||0;const nx=under.offsetHeight-tuck<=innerHeight;fits=nx;under.classList.toggle("stick",fits);
    if(!fits){letters.forEach((s,i)=>{s.style.transform="";if(!REDUCED){s.style.opacity=0;s.style.transition=`transform .9s var(--ease) ${i*70}ms,opacity .9s var(--ease) ${i*70}ms`;s.style.transform="translateY(40%)"}});
      if(!REDUCED)inView($("#mega"),()=>letters.forEach(s=>{s.style.opacity=1;s.style.transform="none"}));else letters.forEach(s=>s.style.opacity=1)}
    else{letters.forEach(s=>{s.style.opacity=1;s.style.transition="none"});scrub()}};
  check();new ResizeObserver(check).observe(under);
  if(REDUCED){shown=1;scrub();return}
  whileVisible(end,()=>{if(!fits)return;const h=under.offsetHeight-tuck;if(h<=0)return;const v=clamp((innerHeight-cover.getBoundingClientRect().bottom)/h);const r=Math.round(v*1e4)/1e4;if(r===shown)return;shown=r;scrub()});
  /* whileVisible's margin is symmetrical; also update on scroll for the last stretch */
  addEventListener("scroll",()=>{if(!fits)return;const h=under.offsetHeight-tuck;const v=Math.round(clamp((innerHeight-cover.getBoundingClientRect().bottom)/h)*1e4)/1e4;if(v!==shown){shown=v;scrub()}},{passive:true});
})();

/* ---- Cursor dot trail on the pale page ---- */
(()=>{
  if(!FINE||REDUCED)return;const cv=$("#trail");if(!cv)return;const main=cv.closest("main"),ctx=cv.getContext("2d");
  const PITCH=1.25,DOT=.22,WIDTH=3.5,ALPHA=.4,LIFE=.8,STEP=.5,MAXP=140;let rem=16,dpr=1;
  const meas=()=>{rem=parseFloat(getComputedStyle(html).fontSize)||16;dpr=Math.min(2,devicePixelRatio||1);cv.width=cv.clientWidth*dpr;cv.height=cv.clientHeight*dpr};meas();addEventListener("resize",meas);
  const ptr={x:0,y:0,in:false},head={x:0,y:0},anchor={x:0,y:0},trail=[];let now=0,off=null,last=0;
  const draw=dt=>{const k=1-Math.pow(1-.35,dt*60);head.x+=(ptr.x-head.x)*k;head.y+=(ptr.y-head.y)*k;const step=STEP*rem;
    if(ptr.in){const g=Math.hypot(head.x-anchor.x,head.y-anchor.y);const n=Math.floor(g/step);if(n>0){const sx=anchor.x,sy=anchor.y;for(let i=1;i<=n;i++){const f=i*step/g;trail.push({x:sx+(head.x-sx)*f,y:sy+(head.y-sy)*f,t:now})}const tip=trail[trail.length-1];anchor.x=tip.x;anchor.y=tip.y;while(trail.length>MAXP)trail.shift()}}
    while(trail.length&&now-trail[0].t>LIFE)trail.shift();ctx.clearRect(0,0,cv.width,cv.height);
    if(!trail.length){if(!ptr.in||Math.hypot(ptr.x-head.x,ptr.y-head.y)<.5){off&&off();off=null}return}
    const W=WIDTH*rem,pitch=PITCH*rem,box=main.getBoundingClientRect();let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of trail){x0=Math.min(x0,p.x-2*W);x1=Math.max(x1,p.x+2*W);y0=Math.min(y0,p.y-2*W);y1=Math.max(y1,p.y+2*W)}
    x0=Math.max(x0,box.left,0);x1=Math.min(x1,box.right,innerWidth);y0=Math.max(y0,box.top,0);y1=Math.min(y1,box.bottom,innerHeight);if(x1<=x0||y1<=y0)return;
    ctx.save();ctx.scale(dpr,dpr);const at=cv.getBoundingClientRect();ctx.translate(-at.left,-at.top);ctx.fillStyle="#2f74d0";const ox=box.left,oy=box.top;
    for(let gy=Math.ceil((y0-oy)/pitch)*pitch+oy;gy<=y1;gy+=pitch)for(let gx=Math.ceil((x0-ox)/pitch)*pitch+ox;gx<=x1;gx+=pitch){let v=0;for(const p of trail){const life=1-(now-p.t)/LIFE,r=W*(.3+.7*life),d=Math.hypot(gx-p.x,gy-p.y);if(d>2*r)continue;v=Math.max(v,Math.pow(life,1.3)*Math.exp(-((d/r)**2)))}
      if(v<.05)continue;ctx.globalAlpha=ALPHA*v;ctx.beginPath();ctx.arc(gx,gy,DOT*rem*(.4+.6*v),0,6.2832);ctx.fill()}ctx.restore()};
  const run=()=>{if(off)return;last=performance.now();off=tick(t=>{const dt=Math.min(.1,(t-last)/1000);last=t;now+=dt;draw(dt)})};
  addEventListener("pointermove",e=>{if(e.pointerType!=="mouse")return;if(!ptr.in){head.x=anchor.x=e.clientX;head.y=anchor.y=e.clientY}ptr.x=e.clientX;ptr.y=e.clientY;ptr.in=true;run()},{passive:true});
  html.addEventListener("pointerleave",()=>{ptr.in=false});
})();

/* ---- Visible asset failures ---- */
const fail=(u,e)=>{if($(".errbar"))return;const b=mk("div","errbar");b.setAttribute("role","alert");b.textContent="Asset failed to load: "+u+(e?" ("+e+")":"");document.body.append(b)};
$$("img").forEach(i=>i.addEventListener("error",()=>fail(i.src),{once:true}));
if(document.fonts)document.fonts.ready.then(()=>{if(![...document.fonts].some(f=>f.status==="loaded"))console.warn("[aitropolis] web font not loaded, using fallback")});
})();

/* ===== Solutions mega menu (desktop) and accordion (mobile sheet) ===== */
(()=>{
  const {mk,REDUCED}=window.AIT;const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const ic=(n,c="ic")=>`<svg class="${c}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  /* District data: in the Next.js build this is src/lib/districts.ts. Service rows: [slug, title, subtitle, icon]. */
  const D=[
   {slug:"systems",title:"Systems",sub:"ERP, CRM and business intelligence",desc:"End-to-end enterprise systems that are the backbone of business operations.",icon:"blocks",art:"blocks",g:"a",s:[["erp","ERP Implementation","Oracle EBS, Oracle Cloud, SAP, D365, Odoo","boxes"],["crm","CRM Solutions","Salesforce, Dynamics, Siebel, Oracle CX","users"],["bi","Business Intelligence","Analytics, dashboards, data warehousing","chart-column"],["application-modernization","Application Modernization","Legacy refactoring, cloud migration, microservices","refresh-cw"],["assessments","Assessments & Upgrades","Functional and technical assessments, upgrades","clipboard-check"],["database","Database Management","Administration, tuning, performance","database"]]},
   {slug:"foundations",title:"Foundations",sub:"Cloud and infrastructure",desc:"The cloud-native foundation that every modern enterprise is built on.",icon:"layers",art:"slabs",g:"b",s:[["cloud","Cloud Transformation","AWS, Azure, GCP, BytePlus","cloud"],["cloud-virtualization","Cloud & Virtualization","Private, hybrid, public cloud, migration","server"],["private-cloud","Private Cloud","VMware, Red Hat OpenShift","lock"],["devops","DevOps & Automation","CI/CD, infrastructure as code","git-branch"],["finops","FinOps","Cloud cost governance and optimisation","trending-down"],["managed-services","Managed Services","24/7 operations and support","headset"]]},
   {slug:"intelligence",title:"Intelligence",sub:"AI, machine learning and custom software",desc:"Artificial intelligence, machine learning and custom platforms that unlock competitive advantage.",icon:"brain",art:"burst",g:"c",s:[["generative-ai","Generative AI","LLMs, RAG systems, AI agents","sparkles"],["mlops","ML & MLOps","Model training, OpenShift AI, pipelines","cpu"],["data-engineering","Data Engineering","Pipelines, warehousing, insights","workflow"],["custom-software","Custom Software","Core banking, wallets, payment gateways","code"],["telecom-platforms","Telecom Platforms","OSS/BSS, VAS platforms","radio-tower"]]},
   {slug:"exchange",title:"Exchange",sub:"Blockchain and fintech",desc:"Distributed systems and blockchain that enable trust in digital economies.",icon:"hexagon",art:"hex",g:"b",s:[["smart-contracts","Smart Contracts","Contract development, audits, Web3","file-code"],["defi","DeFi Protocols","Lending, staking, liquidity systems","landmark"],["tokenization","Tokenization & NFT","Asset tokenisation, NFT marketplaces","coins"],["wallets-exchanges","Wallets & Exchanges","Custody, trading platforms","wallet"],["blockchain-consulting","Integration & Consulting","Blockchain strategy and enterprise integration","link"]]},
   {slug:"signal",title:"Signal",sub:"AI-powered go-to-market and growth",desc:"AI-driven go-to-market and growth marketing that turns market signals into measurable revenue.",icon:"radar",art:"waves",g:"c",s:[["seo","SEO & Content","Search, organic growth, content marketing","search"],["paid-media","Paid Media","Google, Meta, LinkedIn advertising","megaphone"],["marketing-automation","Marketing Automation","Journeys, nurture, CRM-connected campaigns","zap"],["social-media-marketing","Social Media Marketing","Multi-platform strategy and community","share-2"],["social-influencer","Social & Influencer","Social media management, influencer marketing","users-round"],["brand-analytics","Brand & Analytics","Brand strategy, performance tracking","chart-pie"]]},
   {slug:"immersion",title:"Immersion",sub:"AR/VR, AV and experiences",desc:"Immersive technologies and audio-visual environments that redefine customer and employee experiences.",icon:"glasses",art:"gem",g:"a",s:[["ar-vr","AR/VR Experiences","XR, metaverse, interactive installations","box"],["smart-meetings","Smart Meeting Rooms","Control systems, room automation","presentation"],["av-integration","Museum & Public-Space AV","Interactive installations, kiosks, exhibits","tv"],["scenography","Scenography & Lighting","Technical lighting, scenography, automation","lamp-ceiling"]]}
  ];
  const EXTRA=[{t:"AI Center",s:"GPU-accelerated AI and ML",h:"/ai",i:"cpu"},{t:"Growth Partner offer",s:"Build, grow and automate, bundled",h:"/digital-growth-partner",i:"handshake"},{t:"Offshore IT teams",s:"Engineers inside your delivery process",h:"/solutions/offshore-it-teams",i:"users"}];
  Object.assign(window.AIT,{D,ic});

  /* ---- Desktop panel ---- */
  const panel=mk("div","msol");panel.id="mega-sol";panel.setAttribute("role","dialog");panel.setAttribute("aria-label","Solutions");panel.inert=true;
  panel.innerHTML=`<div class="msol-in"><div class="msol-l"><p class="cap">Solutions</p><ul class="mdist">${D.map((d,i)=>`<li><a class="mitem" href="/solutions/${d.slug}" data-i="${i}"><span class="mico">${ic(d.icon)}</span><span><b>${d.title}</b><small>${d.sub}</small></span></a></li>`).join("")}</ul></div>
  <div class="msol-r"><div class="msol-h"><p class="cap" id="msolCap"></p><a class="mopen lnk" id="msolOpen" href="#"></a></div><ul class="msvc" id="msolSvc"></ul></div>
  <div class="msol-b">${EXTRA.map(e=>`<a class="mxtra" href="${e.h}"><span class="mico">${ic(e.i)}</span><span><b>${e.t}</b><small>${e.s}</small></span></a>`).join("")}<a class="btn btn-d btn-sm" href="solutions.html">See all solutions${ic("arrow-right")}</a></div></div>`;
  document.body.append(panel);
  const dim=mk("div","mdim");document.body.append(dim);
  const items=$$(".mitem",panel),svc=$("#msolSvc"),cap=$("#msolCap"),opn=$("#msolOpen");
  const setActive=i=>{items.forEach((a,k)=>a.classList.toggle("on",k===i));const d=D[i];cap.textContent=`${d.title} services`;opn.href=`/solutions/${d.slug}`;opn.innerHTML=`Open the ${d.title} district`;
    svc.innerHTML=d.s.map((s,k)=>`<li style="--k:${k}"><a href="/solutions/${d.slug}/${s[0]}"><span class="mico sm">${ic(s[3])}</span><span><b>${s[1]}</b><small>${s[2]}</small></span></a></li>`).join("")};
  items.forEach((a,i)=>{a.addEventListener("mouseenter",()=>setActive(i));a.addEventListener("focus",()=>setActive(i))});
  setActive(0);
  const triggers=$$(".nav-sol");let isOpen=false,cur=null,tmr=0,pinned=false;
  const fine=matchMedia("(hover:hover) and (pointer:fine) and (min-width:769px)");
  const place=t=>{const h=t.closest(".hdr,.bar");const r=h.getBoundingClientRect();panel.style.top=Math.max(0,r.bottom+8)+"px"};
  const show=t=>{clearTimeout(tmr);cur=t;place(t);if(isOpen)return;isOpen=true;panel.classList.add("open");panel.inert=false;dim.classList.add("open");triggers.forEach(x=>x.setAttribute("aria-expanded","true"))};
  const hide=(back)=>{clearTimeout(tmr);pinned=false;if(!isOpen)return;isOpen=false;panel.classList.remove("open");panel.inert=true;dim.classList.remove("open");triggers.forEach(x=>x.setAttribute("aria-expanded","false"));if(back&&cur)cur.focus()};
  const later=()=>{if(pinned)return;clearTimeout(tmr);tmr=setTimeout(()=>hide(false),220)};
  triggers.forEach(t=>{
    /* A click on a hover-opened menu pins it open; a second click closes it. Touch and keyboard: click toggles. */
    t.addEventListener("click",e=>{e.preventDefault();if(isOpen&&cur===t){if(pinned||!fine.matches){hide(false)}else{pinned=true}}else{show(t);pinned=true;if(e.detail===0)items[0].focus({preventScroll:true})}});
    t.addEventListener("mouseenter",()=>{if(fine.matches)show(t)});
    t.addEventListener("mouseleave",()=>{if(fine.matches)later()});
    t.addEventListener("keydown",e=>{if(e.key==="ArrowDown"){e.preventDefault();show(t);pinned=true;items[0].focus({preventScroll:true})}});
  });
  panel.addEventListener("mouseenter",()=>{clearTimeout(tmr)});
  panel.addEventListener("mouseleave",()=>{if(fine.matches)later()});
  /* The dim layer is visual only (pointer-events none). Clicks outside the menu close it. */
  document.addEventListener("click",e=>{if(isOpen&&!panel.contains(e.target)&&!e.target.closest(".nav-sol"))hide(false)});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&isOpen){e.preventDefault();hide(true)}if(e.key==="Tab"&&isOpen&&panel.contains(document.activeElement)){const f=$$("a",panel);if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();cur&&cur.focus()}else if(!e.shiftKey&&document.activeElement===f[f.length-1]){e.preventDefault();hide(true)}}});
  let lastY=scrollY;addEventListener("scroll",()=>{if(isOpen&&Math.abs(scrollY-lastY)>60)hide(false);lastY=scrollY},{passive:true});
  addEventListener("resize",()=>{if(isOpen)hide(false)});
  panel.addEventListener("click",e=>{if(e.target.closest("a"))hide(false)});

  /* ---- Mobile sheet accordion ---- */
  const sl=$("#sheet [data-sol-link]");
  if(sl){const wrap=mk("div","sh-sol");
    wrap.innerHTML=`<button class="sh-btn dash-b" type="button" aria-expanded="false" aria-controls="shSolBody"><span>Solutions</span>${ic("chevron-down","ic chev")}</button><div class="sh-body" id="shSolBody"><div class="sh-inner">${D.map(d=>`<details><summary><span class="mico sm">${ic(d.icon)}</span><span>${d.title}</span>${ic("chevron-down","ic chev")}</summary><ul>${d.s.map(s=>`<li><a href="/solutions/${d.slug}/${s[0]}">${s[1]}</a></li>`).join("")}<li><a class="all" href="/solutions/${d.slug}">Open ${d.title}${ic("arrow-right")}</a></li></ul></details>`).join("")}<a class="sh-all" href="solutions.html">See all solutions${ic("arrow-right")}</a></div></div>`;
    sl.replaceWith(wrap);const b=$(".sh-btn",wrap);b.addEventListener("click",()=>{const o=wrap.classList.toggle("open");b.setAttribute("aria-expanded",String(o))});
    $$("details",wrap).forEach(d=>d.addEventListener("toggle",()=>{if(d.open)$$("details",wrap).forEach(o=>{if(o!==d)o.open=false})}))}
})();
