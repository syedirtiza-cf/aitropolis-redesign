const {inView,REDUCED}=window.AIT;
(()=>{const host=document.getElementById("bars");if(!host)return;
  const B=JSON.parse(host.dataset.bars||"[]"),mx=+host.dataset.max||1;
  B.forEach(([l,n],k)=>{const r=document.createElement("div");r.className="brow"+(n===mx?" hot":"");r.innerHTML=`<b>${l}</b><div class="track"><span class="fill" style="--d:${900+k*80}ms;--g:0;width:${n/mx*100}%"></span></div><em>${n}</em>`;host.append(r)});
  const run=()=>host.querySelectorAll(".fill").forEach(f=>f.style.setProperty("--g",1));
  if(REDUCED)run();else inView(document.getElementById("dash"),run,"0px")})();
document.querySelectorAll(".faqlist details").forEach(d=>d.addEventListener("toggle",()=>{if(d.open)document.querySelectorAll(".faqlist details").forEach(o=>{if(o!==d)o.open=false})}));
/* pixel tiles */
(()=>{const {ART,ORDER,smooth,easeIO,clamp,NS}=window.AIT;
document.querySelectorAll("[data-pix]").forEach(host=>{const kind=host.dataset.pix;if(!ART[kind])return;
  const svg=document.createElementNS(NS,"svg");svg.setAttribute("viewBox","0 0 448 308");svg.setAttribute("aria-hidden","true");svg.setAttribute("fill","#fff");svg.setAttribute("preserveAspectRatio","xMidYMid slice");svg.style.cssText="position:absolute;inset:0;left:0;top:0;width:100%;height:100%;transform:none";
  const px=[];for(let r=0;r<22;r++)for(let c=0;c<32;c++){const e=document.createElementNS(NS,"circle");e.setAttribute("cx",c*14+7);e.setAttribute("cy",r*14+7);e.setAttribute("r",1);e.setAttribute("fill-opacity",.4);svg.append(e);if(ART[kind](c,r))px.push({e,k:ORDER[kind](c,r)})}
  const ks=px.map(p=>p.k),lo=Math.min(...ks),rg=Math.max(1e-6,Math.max(...ks)-lo);px.forEach(p=>p.s=((p.k-lo)/rg)*.6);host.append(svg);
  const draw=p=>px.forEach(o=>{const g=smooth((p-o.s)/.4);o.e.setAttribute("r",1+4*g);o.e.setAttribute("fill-opacity",.4+.6*g)});
  if(REDUCED){draw(1);return}draw(0);
  inView(svg,()=>{const t0=performance.now()+200;const f=()=>{const p=clamp((performance.now()-t0)/1300);draw(easeIO(p));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)},"0px 0px -5% 0px")})})();
/* in-page nav: highlight the section in view */
(()=>{const links=[...document.querySelectorAll(".subnav a")];if(!links.length)return;
  const secs=links.map(a=>document.getElementById(a.getAttribute("href").slice(1))).filter(Boolean);
  const set=id=>links.forEach(a=>{const on=a.getAttribute("href")==="#"+id;a.classList.toggle("on",on);if(on)a.setAttribute("aria-current","true");else a.removeAttribute("aria-current")});
  const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)set(e.target.id)})},{rootMargin:"-30% 0px -60% 0px"});secs.forEach(s=>io.observe(s));
  links.forEach(a=>a.addEventListener("click",e=>{const t=document.getElementById(a.getAttribute("href").slice(1));if(!t)return;e.preventDefault();t.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth"});history.replaceState(null,"",a.getAttribute("href"))}))})();
/* article: reading progress and contents highlight */
(()=>{const bar=document.querySelector(".aprog i");if(!bar)return;const art=document.querySelector(".abody");
  const upd=()=>{const r=art.getBoundingClientRect(),h=r.height-innerHeight*.5;bar.style.transform="scaleX("+Math.max(0,Math.min(1,(-r.top+innerHeight*.2)/Math.max(1,h)))+")"};
  addEventListener("scroll",upd,{passive:true});addEventListener("resize",upd);upd();
  const links=[...document.querySelectorAll(".ptoc a")];const secs=links.map(a=>document.getElementById(a.getAttribute("href").slice(1))).filter(Boolean);
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+e.target.id))}),{rootMargin:"-25% 0px -65% 0px"});secs.forEach(s=>io.observe(s))})();
