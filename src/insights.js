(()=>{
const {mk,inView,REDUCED,ic,ART,ORDER,smooth,easeIO,clamp,NS}=window.AIT;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
/* Published copy from the live Insights list (src/lib/insights.ts). */
const A=[
 ["ai-in-oracle-ebs","What Role Does AI Play in Oracle EBS?","Where AI fits around E-Business Suite without touching the core: read from a copy, run models outside, write back through supported routes. Use cases by module.","ERP Strategy",7,"2026-09-18","blocks","a"],
 ["erp-migration-timeline","How Long Does an ERP Migration Really Take?","From assessment through go-live: realistic timelines for Oracle, D365 and SAP migrations, plus the five factors that make the difference.","ERP Strategy",8,"2026-08-15","blocks","b"],
 ["b200-vs-h100-inference","B200 vs H100: Which GPU for Enterprise AI Inference?","Performance benchmarks, cost per token and deployment patterns for choosing the right NVIDIA GPU for production inference workloads.","AI Infrastructure",10,"2026-08-14","burst","c"],
 ["cloud-cost-governance","FinOps Essentials: 5 Patterns to Cut Cloud Waste by 40%","How enterprise teams use cost tagging, reserved instances and automation to reclaim budgets without sacrificing agility.","Cloud Operations",7,"2026-08-13","slabs","a"],
 ["ai-adoption-roadmap","From Pilot to Production: The Enterprise AI Adoption Roadmap","A practical framework for moving AI from proof of concept to business-critical systems: data foundation, governance, model deployment and organisational readiness.","AI Strategy",12,"2026-08-12","burst","b"],
 ["blockchain-enterprise-use-cases","Beyond Crypto: 4 Enterprise Blockchain Use Cases That Deliver ROI","Supply chain provenance, asset tokenisation and smart contract automation: where blockchain solves real business problems.","Blockchain",9,"2026-08-11","hex","c"],
 ["social-media-roi","Why Your Social Media Budget Isn't Working (And How to Fix It)","Attribution models, audience segmentation and platform strategy to turn social spend into pipeline and brand loyalty.","Digital Marketing",6,"2026-08-10","waves","a"]
].map(([slug,title,ex,cat,min,date,art,g])=>({slug,title,ex,cat,min,date,art,g}));
const fmt=d=>new Date(d+"T00:00:00Z").toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric",timeZone:"UTC"});
const cats=[...new Set(A.map(a=>a.cat))];
$("#atotal").textContent=A.length;$("#amins").textContent=A.reduce((n,a)=>n+a.min,0);$("#alatest").textContent=fmt(A[0].date);$("#atopics").textContent=cats.length;
/* hero bars: reading time per article */
(()=>{const host=$("#bars");const max=Math.max(...A.map(a=>a.min));
  A.forEach((a,r)=>{const row=mk("div","brow"+(a.min===max?" hot":""));const short=a.title.length>26?a.title.slice(0,24).replace(/[\s:,]+$/,"")+"…":a.title;row.innerHTML=`<b title="${a.title.replace(/"/g,"&quot;")}">${short}</b><div class="track"><span class="fill" style="--d:${900+r*70}ms;--g:0;width:${a.min/max*100}%"></span></div><em>${a.min}</em>`;host.append(row)});
  const run=()=>$$(".fill",host).forEach(f=>f.style.setProperty("--g",1));
  if(REDUCED)run();else inView($("#dash"),run,"0px")})();
/* pixel tile */
const tile=(host,kind)=>{const svg=document.createElementNS(NS,"svg");svg.setAttribute("viewBox","0 0 448 308");svg.setAttribute("aria-hidden","true");svg.setAttribute("fill","#fff");svg.setAttribute("preserveAspectRatio","xMidYMid slice");svg.style.cssText="position:absolute;inset:0;left:0;top:0;width:100%;height:100%;transform:none";
  const px=[];for(let r=0;r<22;r++)for(let c=0;c<32;c++){const e=document.createElementNS(NS,"circle");e.setAttribute("cx",c*14+7);e.setAttribute("cy",r*14+7);e.setAttribute("r",1);e.setAttribute("fill-opacity",.4);svg.append(e);if(ART[kind](c,r))px.push({e,k:ORDER[kind](c,r)})}
  const ks=px.map(p=>p.k),lo=Math.min(...ks),rg=Math.max(1e-6,Math.max(...ks)-lo);px.forEach(p=>p.s=((p.k-lo)/rg)*.6);host.append(svg);
  const draw=p=>px.forEach(o=>{const g=smooth((p-o.s)/.4);o.e.setAttribute("r",1+4*g);o.e.setAttribute("fill-opacity",.4+.6*g)});
  if(REDUCED){draw(1);return}draw(0);
  inView(svg,()=>{const t0=performance.now()+200;const f=()=>{const p=clamp((performance.now()-t0)/1300);draw(easeIO(p));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)},"0px 0px -5% 0px")};
/* cards: the newest is featured and spans two columns */
const grid=$("#agrid");const arrow=ic("arrow-right");
A.forEach((a,i)=>{const c=mk("article","card acard"+(i===0?" feat":""));c.dataset.c=a.cat;c.dataset.t=(a.title+" "+a.ex+" "+a.cat).toLowerCase();
  const t=mk("div",`dtile ${a.g}`);tile(t,a.art);if(i===0){const b=mk("span","newb");b.textContent="Newest";t.append(b)}
  const b=mk("div","dbody");b.innerHTML=`<p class="meta"><span class="cat">${a.cat}</span><span>${fmt(a.date)}</span><span>${ic("clock")}${a.min} min read</span></p><h3 class="${i===0?"t-tl":"t-tm"}">${a.title}</h3><p class="t-bm muted">${a.ex}</p><a class="open-d lnk" href="/insights/${a.slug}">Read the article</a>`;
  c.append(t,b);grid.append(c);
  if(!REDUCED){c.dataset.r="";c.style.setProperty("--d",`${(i%3)*90}ms`);new IntersectionObserver(([e],io)=>{if(e.isIntersecting){c.classList.add("in");io.disconnect()}},{rootMargin:"0px 0px -4% 0px"}).observe(c)}});
/* filters */
const bar=$("#chipbar");let cat="all";
const chip=(k,l)=>{const b=mk("button","chip");b.type="button";b.dataset.k=k;b.setAttribute("aria-pressed",String(k==="all"));b.textContent=l;b.addEventListener("click",()=>{cat=k;$$(".chip",bar).forEach(x=>x.setAttribute("aria-pressed",String(x===b)));apply()});bar.append(b)};
chip("all","All topics");cats.forEach(c=>chip(c,c));
const q=$("#q");q.addEventListener("input",apply);
function apply(){const term=q.value.trim().toLowerCase();let n=0;
  $$(".acard",grid).forEach(a=>{const show=(cat==="all"||a.dataset.c===cat)&&(!term||a.dataset.t.includes(term));
    if(show){n++;if(a.hidden){a.hidden=false;requestAnimationFrame(()=>a.classList.remove("out"))}else a.classList.remove("out")}
    else if(!a.hidden){a.classList.add("out");setTimeout(()=>{if(a.classList.contains("out"))a.hidden=true},260)}});
  $("#cnt").textContent=`Showing ${n} of ${A.length} articles`;$("#cempty").hidden=n>0}
apply();
/* topic map */
const T=[["ERP strategy","blocks",["ERP Strategy"],[["ERP implementation","/solutions/systems/erp"],["Assessments & upgrades","/solutions/systems/assessments"],["Database management","/solutions/systems/database"]]],
 ["AI and GPU infrastructure","brain",["AI Strategy","AI Infrastructure"],[["Generative AI","/solutions/intelligence/generative-ai"],["ML & MLOps","/solutions/intelligence/mlops"],["GPU servers","/ai/gpu"]]],
 ["Cloud operations","layers",["Cloud Operations"],[["FinOps","/solutions/foundations/finops"],["Cloud transformation","/solutions/foundations/cloud"],["Managed services","/solutions/foundations/managed-services"]]],
 ["Blockchain","hexagon",["Blockchain"],[["Smart contracts","/solutions/exchange/smart-contracts"],["Tokenisation","/solutions/exchange/tokenization"],["Integration & consulting","/solutions/exchange/blockchain-consulting"]]],
 ["Digital marketing","radar",["Digital Marketing"],[["Social media marketing","/solutions/signal/social-media-marketing"],["Paid media","/solutions/signal/paid-media"],["Brand & analytics","/solutions/signal/brand-analytics"]]]];
const dm=$("#dmap");
T.forEach(([t,icn,cs,sv],i)=>{const n=A.filter(a=>cs.includes(a.cat)).length;const r=mk("div","dmrow");r.dataset.r="";r.style.setProperty("--d",`${i*70}ms`);
  r.innerHTML=`<span class="mico lg">${ic(icn)}</span><span class="dmt"><b>${t}</b><small>${n} ${n===1?"article":"articles"}</small></span><ul class="dmv">${sv.map(([l,h])=>`<li><a href="${h}">${l}</a></li>`).join("")}</ul>`;dm.append(r);
  if(!REDUCED)new IntersectionObserver(([e],io)=>{if(e.isIntersecting){r.classList.add("in");io.disconnect()}},{rootMargin:"0px 0px -4% 0px"}).observe(r)});
})();
