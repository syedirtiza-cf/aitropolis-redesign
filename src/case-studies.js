(()=>{
const {mk,inView,REDUCED,ic,ART,ORDER,smooth,easeIO,clamp,NS}=window.AIT;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
/* Kinds of work. A project can carry several. */
const K={erp:"ERP & databases",cloud:"Cloud & FinOps",ai:"AI & data",telecom:"Telecom",fintech:"Fintech",growth:"Marketing & growth",av:"AV & IoT",change:"Transformation"};
const ART_FOR={erp:"blocks",cloud:"slabs",ai:"burst",telecom:"waves",fintech:"hex",growth:"waves",av:"gem",change:"blocks"};
const GR=["a","b","c"];
/* Titles and summaries are the published case-study copy (src/lib/seo.ts). Metrics are left out until the team signs them off. */
const C=[
 ["erp-transformation","ERP Transformation","A multi-million-dollar, enterprise-wide ERP implementation for thousands of users, and how it was delivered on schedule.","",["erp","change"]],
 ["dubai-municipality-ai-frames","Dubai Municipality AI Digital Signage","Networked AI frames across the city delivering civic information, and how the platform was deployed at scale.","UAE",["ai","av"]],
 ["rta-iot-museum","RTA Dubai: Museum AV Integration & IoT","An end-to-end IoT and audio-visual integration for an RTA museum in Dubai, with interactive exhibits built for a high visitor count.","UAE",["av"]],
 ["healthcare-ai-twin","Healthcare AI Digital Twin","A multi-cloud AI digital twin on AWS, Azure and Vertex AI, with the accuracy and response-time targets it had to meet.","",["ai","cloud"]],
 ["dell-technologies-uae","Dell Technologies UAE Transformation","Supporting GBM and Dell with customer digital transformation across multiple sectors, from assessment through to adoption.","UAE",["change"]],
 ["gpu-ai-solutions","GPU AI Servers: NVIDIA B200 Deployment","NVIDIA Blackwell B200 servers sourced, delivered and deployed for customers in the UAE, Singapore and the Gulf region.","UAE, Singapore",["ai","cloud"]],
 ["sasmep-uae","SASMEP UAE: SME Digital Transformation","Digital branding, a B2B platform and lead generation that moved a UAE SME network online and gave its members a digital presence.","UAE",["growth","change"]],
 ["nshield-io","NShield.io: Cybersecurity Marketing & Brand","Brand positioning, a digital platform and lead generation for a cybersecurity company, and the B2B SaaS growth strategy behind them.","",["growth"]],
 ["aicenna","AICenna: Healthcare AI Brand Launch","Brand launch, website design and digital go-to-market for a healthcare AI platform, positioning a health-tech SaaS product for patients.","",["growth","ai"]],
 ["trustedpof-fintech","TrustedPoF: Fintech Fraud Detection","A real-time fintech fraud detection platform using machine learning to validate transactions and protect payment processing at scale.","",["fintech","ai"]],
 ["velaarc-realestate","Velaarc: Dubai Real Estate Digital Marketing","Website development and social media management for a premium Dubai real estate company, built for lead generation and positioning.","UAE",["growth"]],
 ["tmt-analytics-uk","TMT Analytics UK: Data Intelligence Platform","An enterprise data intelligence platform with predictive analytics and market intelligence, built on advanced data processing.","UK",["ai"]],
 ["gms-telecom-us","GMS US: A2P SMS Platform for Enterprise","An enterprise A2P SMS platform for high-volume delivery, carrier compliance and global reach, built for a US telecom messaging provider.","US",["telecom"]],
 ["riyadh-pharma-erp-modernization","Riyadh Pharma: ERP Modernisation in KSA","End-of-life infrastructure, operating system, database and ERP upgraded together for a Saudi pharmaceutical manufacturer, at a lower support cost.","KSA",["erp"]],
 ["uae-public-sector-cloud-compliance","UAE Government Cloud Compliance (IAR)","Meeting UAE IAR information security through an Oracle Cloud migration, plus SLA-based managed services for a Dubai entity.","UAE",["cloud"]],
 ["arib-fintech-cloud-acceleration","ARIB: Fintech Cloud Deployment in KSA","Rapid cloud infrastructure and offshore DBA, OS and cloud administration that shortened time to market.","KSA",["cloud","fintech","erp"]],
 ["quikcard-oracle-cloud-migration","Quikcard: Oracle Cloud Migration","Quikcard's full workload moved to Oracle Cloud Infrastructure, meeting security, disaster recovery and flexibility needs.","Canada",["cloud","fintech"]],
 ["riskcalm-finops-oracle-cloud","RiskCalm: FinOps on Oracle Cloud","Audit-aligned cloud finance and cost governance for a US fintech, which cut its annual Oracle Cloud spend.","US",["cloud","fintech"]],
 ["australia-telecom-post-acquisition","Telecom Managed Services After Acquisition","Database support, logging and analytics offload, and managed operations that lowered running costs after an acquisition in Australia.","Australia",["telecom","erp"]],
 ["pakistan-telecom-oracle-coe","Oracle Database Centre of Excellence","Multi-platform database operations for a Pakistan telecom operator unified under one team, with measurable cost savings.","Pakistan",["telecom","erp"]],
 ["saudi-contracting-ebs-optimization","Oracle EBS Optimisation: Project Accounting","Project accounting reworked for a Saudi contracting firm, for a faster financial close and fewer reporting errors.","KSA",["erp"]]
].map(([slug,title,sum,region,kinds],i)=>({slug,title,sum,region,kinds,i}));
$("#caseTotal").textContent=C.length;
/* hero bars */
(()=>{const host=$("#bars");const counts=Object.keys(K).map(k=>[k,C.filter(c=>c.kinds.includes(k)).length]).sort((a,b)=>b[1]-a[1]);const max=counts[0][1];
  counts.forEach(([k,n],r)=>{const row=mk("div","brow"+(n===max?" hot":""));row.innerHTML=`<b>${K[k]}</b><div class="track"><span class="fill" style="--d:${900+r*70}ms;--g:0;width:${n/max*100}%"></span></div><em>${n}</em>`;host.append(row)});
  const run=()=>$$(".fill",host).forEach(f=>f.style.setProperty("--g",1));
  if(REDUCED)run();else inView($("#dash"),run,"0px")})();
/* pixel tile */
const tile=(host,kind)=>{const svg=document.createElementNS(NS,"svg");svg.setAttribute("viewBox","0 0 448 308");svg.setAttribute("aria-hidden","true");svg.setAttribute("fill","#fff");svg.setAttribute("preserveAspectRatio","xMidYMid slice");svg.style.cssText="position:absolute;inset:0;left:0;top:0;width:100%;height:100%;transform:none";
  const px=[];for(let r=0;r<22;r++)for(let c=0;c<32;c++){const e=document.createElementNS(NS,"circle");e.setAttribute("cx",c*14+7);e.setAttribute("cy",r*14+7);e.setAttribute("r",1);e.setAttribute("fill-opacity",.4);svg.append(e);if(ART[kind](c,r))px.push({e,k:ORDER[kind](c,r)})}
  const ks=px.map(p=>p.k),lo=Math.min(...ks),rg=Math.max(1e-6,Math.max(...ks)-lo);px.forEach(p=>p.s=((p.k-lo)/rg)*.6);host.append(svg);
  const draw=p=>px.forEach(o=>{const g=smooth((p-o.s)/.4);o.e.setAttribute("r",1+4*g);o.e.setAttribute("fill-opacity",.4+.6*g)});
  if(REDUCED){draw(1);return}draw(0);
  inView(svg,()=>{const t0=performance.now()+200;const f=()=>{const p=clamp((performance.now()-t0)/1300);draw(easeIO(p));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)},"0px 0px -5% 0px")};
/* cards */
const grid=$("#cgrid");const arrow=ic("arrow-right");
C.forEach(c=>{const a=mk("article","card ccard");a.dataset.k=c.kinds.join(" ");a.dataset.t=(c.title+" "+c.sum+" "+c.region+" "+c.kinds.map(k=>K[k]).join(" ")).toLowerCase();
  const t=mk("div",`dtile ${GR[c.i%3]}`);tile(t,ART_FOR[c.kinds[0]]);
  if(c.region){const r=mk("span","reg");r.innerHTML=ic("map-pin")+c.region;t.append(r)}
  const b=mk("div","dbody");b.innerHTML=`<ul class="kinds">${c.kinds.map(k=>`<li>${K[k]}</li>`).join("")}</ul><h3 class="t-tm">${c.title}</h3><p class="t-bm muted">${c.sum}</p><a class="open-d lnk" href="/case-studies/${c.slug}">Read the 3-minute case</a>`;
  a.append(t,b);grid.append(a)});
/* filters */
const bar=$("#chipbar");let kind="all";
const chip=(k,label)=>{const b=mk("button","chip");b.type="button";b.dataset.k=k;b.setAttribute("aria-pressed",String(k==="all"));b.textContent=label;b.addEventListener("click",()=>{kind=k;$$(".chip",bar).forEach(x=>x.setAttribute("aria-pressed",String(x===b)));apply()});bar.append(b)};
chip("all","All projects");Object.entries(K).forEach(([k,l])=>chip(k,l));
const q=$("#q");q.addEventListener("input",apply);
function apply(){const term=q.value.trim().toLowerCase();let n=0;
  $$(".ccard",grid).forEach(a=>{const show=(kind==="all"||a.dataset.k.split(" ").includes(kind))&&(!term||a.dataset.t.includes(term));
    if(show){n++;if(a.hidden){a.hidden=false;requestAnimationFrame(()=>a.classList.remove("out"))}else a.classList.remove("out")}
    else if(!a.hidden){a.classList.add("out");setTimeout(()=>{if(a.classList.contains("out"))a.hidden=true},260)}});
  $("#cnt").textContent=`Showing ${n} of ${C.length} projects`;$("#cempty").hidden=n>0}
apply();
if(!REDUCED)$$("[data-r]").forEach(el=>{});
$$("#cgrid .ccard").forEach((a,i)=>{if(REDUCED)return;a.dataset.r="";a.style.setProperty("--d",`${(i%3)*90}ms`);new IntersectionObserver(([e],io)=>{if(e.isIntersecting){a.classList.add("in");io.disconnect()}},{rootMargin:"0px 0px -4% 0px"}).observe(a)});
})();
