(()=>{
const {mk,inView,REDUCED,ic}=window.AIT;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
$("#oyrs").textContent=new Date().getFullYear()-2010;
/* Partner copy is the published Partners page. Certification lists are left out until the team confirms which are held. */
const KIND={cloud:"Cloud",erp:"ERP & data",infra:"Infrastructure",ai:"AI & collaboration"};
const SV={cloud:["Cloud transformation","/solutions/foundations/cloud"],pcloud:["Private cloud","/solutions/foundations/private-cloud"],erp:["ERP implementation","/solutions/systems/erp"],db:["Database management","/solutions/systems/database"],bi:["Business intelligence","/solutions/systems/bi"],genai:["Generative AI","/solutions/intelligence/generative-ai"],mlops:["ML & MLOps","/solutions/intelligence/mlops"],meet:["Smart meeting rooms","/solutions/immersion/smart-meetings"],dev:["DevOps & automation","/solutions/foundations/devops"],finops:["FinOps","/solutions/foundations/finops"]};
const P=[
 {n:"Amazon Web Services (AWS)",s:"AWS",k:"cloud",tier:"Cloud Partner",d:"Cloud migration, infrastructure as code, serverless architectures, managed services and cost optimisation across the AWS ecosystem. Our architects design and operate mission-critical workloads on AWS for clients in the Middle East, the UK and Asia-Pacific.",c:["EC2 & ECS/EKS","RDS & DynamoDB","Lambda & Serverless","CloudFormation / CDK","Security & Compliance","Cost Optimization"],sv:["cloud","dev","finops"],g:"a"},
 {n:"Microsoft Azure",s:"Azure",k:"cloud",tier:"Cloud Partner",d:"Identity and access management, data and AI services, Azure DevOps and enterprise integrations with Microsoft 365 and Dynamics 365. We migrate on-premises workloads, build cloud-native applications and manage Azure environments at scale.",c:["Azure VMs & AKS","Azure SQL & Cosmos DB","Azure AD & Entra ID","Azure DevOps","Power Platform","Azure OpenAI"],sv:["cloud","dev","genai"],g:"b"},
 {n:"Google Cloud Platform",s:"GCP",k:"cloud",tier:"Cloud Partner",d:"Data analytics, BigQuery, Vertex AI and cloud-native application development. We help enterprises use Google's ML and AI services and build scalable, data-first architectures.",c:["Compute Engine & GKE","BigQuery & Looker","Vertex AI / AutoML","Cloud Run","Firebase","Cloud SQL"],sv:["cloud","mlops","bi"],g:"c"},
 {n:"BytePlus",s:"BytePlus",k:"cloud",tier:"Official Partner · Cloud & AI Infrastructure",d:"Aitropolis is an official BytePlus partner, with client business already delivered on the platform. We use its cloud computing and AI infrastructure for high-performance compute, content delivery and AI/ML inference across Asia-Pacific and emerging markets.",c:["Elastic Compute","AI/ML Inference","Content Delivery Network","Real-Time Communication","Media Processing","Global Edge Network"],sv:["cloud"],g:"a"},
 {n:"Oracle",s:"Oracle",k:"erp",tier:"ERP & Database Partner",d:`${new Date().getFullYear()-2010} years of Oracle expertise: Oracle E-Business Suite, Oracle Cloud (Fusion), Oracle Database and Oracle Analytics for large enterprises and government bodies.`,c:["Oracle EBS","Oracle Cloud (Fusion)","Oracle Database","Oracle Analytics Cloud","Oracle Integration Cloud","APEX Development"],sv:["erp","db","bi"],g:"b"},
 {n:"SAP",s:"SAP",k:"erp",tier:"ERP Partner",d:"ERP implementations, S/4HANA migrations and SAP integration projects. We work with SAP-run organisations to modernise core processes, move to the cloud and extend SAP with custom development.",c:["SAP S/4HANA","SAP FICO / SD / MM","SAP BTP","SAP Analytics Cloud","SAP Integration Suite","ABAP Development"],sv:["erp","bi"],g:"c"},
 {n:"Odoo",s:"Odoo",k:"erp",tier:"ERP Partner",d:"Full-lifecycle Odoo deployments, from needs analysis and configuration to custom modules, integration, training and support, for SMEs and growing enterprises across the MENA region.",c:["Odoo ERP","Odoo CRM","Custom Module Development","Odoo.sh Hosting","API Integration","Training & Support"],sv:["erp"],g:"a"},
 {n:"Red Hat OpenShift",s:"Red Hat",k:"infra",tier:"Infrastructure Partner",d:"OpenShift container platforms for enterprises that need on-premises or hybrid Kubernetes. Our engineers support Linux infrastructure, Ansible automation and OpenShift application delivery pipelines.",c:["OpenShift Platform","RHEL Administration","Ansible Automation","OpenShift Virtualization","Operators","CI/CD on OpenShift"],sv:["pcloud","dev","mlops"],g:"b"},
 {n:"VMware",s:"VMware",k:"infra",tier:"Infrastructure Partner",d:"vSphere, NSX, vSAN and Workspace ONE, supporting data centre virtualisation, network security and end-user computing for enterprise clients across the UAE, the UK and Pakistan.",c:["vSphere & ESXi","NSX-T Networking","vSAN Storage","Workspace ONE","VMware Cloud","VDI Solutions"],sv:["pcloud","cloud"],g:"c"},
 {n:"IBM",s:"IBM",k:"ai",tier:"Enterprise AI Partner",d:"Enterprise AI with Watson, IT infrastructure modernisation, IBM MQ middleware and Maximo asset management, with consultants experienced in large-scale enterprise environments.",c:["IBM Watson AI","IBM MQ & Integration","Maximo Asset Management","IBM Cloud","IBM Power Systems","OpenPages GRC"],sv:["genai","mlops"],g:"a"},
 {n:"Zoom",s:"Zoom",k:"ai",tier:"Collaboration Partner",d:"Zoom-powered collaboration: enterprise Zoom Phone rollouts, Zoom Rooms for smart meeting environments, and Zoom Webinars for large virtual events and hybrid workplaces.",c:["Zoom Phone","Zoom Rooms","Zoom Webinars","Zoom Contact Centre","Zoom API Integrations","Training & Adoption"],sv:["meet"],g:"b"}
];
$("#ptotal").textContent=P.length;
/* hero bars */
(()=>{const host=$("#bars");const counts=Object.keys(KIND).map(k=>[k,P.filter(p=>p.k===k).length]).sort((a,b)=>b[1]-a[1]);const max=counts[0][1];
  counts.forEach(([k,n],r)=>{const row=mk("div","brow"+(n===max?" hot":""));row.innerHTML=`<b>${KIND[k]}</b><div class="track"><span class="fill" style="--d:${900+r*80}ms;--g:0;width:${n/max*100}%"></span></div><em>${n}</em>`;host.append(row)});
  const run=()=>$$(".fill",host).forEach(f=>f.style.setProperty("--g",1));
  if(REDUCED)run();else inView($("#dash"),run,"0px")})();
/* directory */
const grid=$("#prgrid"),arrow=ic("arrow-right");
/* Vendor marks: Simple Icons (CC0). BytePlus has no mark in that set, so it keeps an initials tile. */
const LOGO={AWS:"aws",Azure:"azure",GCP:"gcp",Oracle:"oracle",SAP:"sap",Odoo:"odoo","Red Hat":"redhat",VMware:"vmware",IBM:"ibm",Zoom:"zoom"};
const slug=p=>"p-"+p.s.toLowerCase().replace(/[^a-z0-9]/g,"");
const logoTile=(p,ini)=>LOGO[p.s]?`<span class="logo-tile" role="img" aria-label="${p.s} logo"><span class="brand" style="--m:url(brands/${LOGO[p.s]}.svg)"></span></span>`:`<span class="logo-tile txt" aria-hidden="true">${ini}</span>`;
/* logo wall */
(()=>{const w=$("#lwall");P.forEach((p,i)=>{const a=mk("a","lcell");a.href="#"+slug(p);a.setAttribute("aria-label",p.n);a.setAttribute("role","listitem");a.dataset.r="";a.style.setProperty("--d",`${i*40}ms`);
  a.innerHTML=LOGO[p.s]?`<span class="brand" style="--m:url(brands/${LOGO[p.s]}.svg)"></span><small>${p.s}</small>`:`<span class="wtxt">${p.s}</span>`;w.append(a);
  a.addEventListener("click",e=>{const t=document.getElementById(slug(p));if(!t)return;e.preventDefault();if(t.hidden)$(".chip",$("#chipbar")).click();t.scrollIntoView({behavior:"smooth",block:"center"});t.classList.add("flash");setTimeout(()=>t.classList.remove("flash"),1600)});
  if(!REDUCED)new IntersectionObserver(([e],io)=>{if(e.isIntersecting){a.classList.add("in");io.disconnect()}},{rootMargin:"0px 0px -4% 0px"}).observe(a)});
  /* a twelfth cell keeps the grid even and answers "what if my vendor is not here?" */
  const m=mk("a","lcell more");m.href="contact.html";m.setAttribute("role","listitem");m.innerHTML=`<span class="mico">${ic("plus")}</span><small>Using something else? Ask us</small>`;w.append(m)})();
P.forEach((p,i)=>{const a=mk("article","card prt");a.id=slug(p);a.dataset.k=p.k;a.dataset.r="";a.style.setProperty("--d",`${(i%2)*90}ms`);
  const ini=p.s.replace(/[^A-Za-z0-9]/g,"").slice(0,2).toUpperCase();
  a.innerHTML=`<div class="prt-h">${logoTile(p,ini)}<div><h3 class="t-tl">${p.n}</h3><p class="tier">${p.tier}</p></div></div><p class="t-bm muted">${p.d}</p><p class="eb">Where we work on it</p><ul class="tags">${p.c.map(x=>`<li>${x}</li>`).join("")}</ul><p class="eb">Services it supports</p><ul class="prt-sv">${p.sv.map(k=>`<li><a href="${SV[k][1]}"><span>${SV[k][0]}</span>${arrow}</a></li>`).join("")}</ul>`;
  grid.append(a);if(!REDUCED)new IntersectionObserver(([e],io)=>{if(e.isIntersecting){a.classList.add("in");io.disconnect()}},{rootMargin:"0px 0px -4% 0px"}).observe(a)});
const bar=$("#chipbar");let kind="all";
const chip=(k,l)=>{const b=mk("button","chip");b.type="button";b.dataset.k=k;b.setAttribute("aria-pressed",String(k==="all"));b.textContent=l;b.addEventListener("click",()=>{kind=k;$$(".chip",bar).forEach(x=>x.setAttribute("aria-pressed",String(x===b)));apply()});bar.append(b)};
chip("all","All partners");Object.entries(KIND).forEach(([k,l])=>chip(k,l));
function apply(){let n=0;$$(".prt",grid).forEach(a=>{const show=kind==="all"||a.dataset.k===kind;if(show){n++;if(a.hidden){a.hidden=false;requestAnimationFrame(()=>a.classList.remove("out"))}else a.classList.remove("out")}else if(!a.hidden){a.classList.add("out");setTimeout(()=>{if(a.classList.contains("out"))a.hidden=true},260)}});$("#cnt").textContent=`Showing ${n} of ${P.length} partners`}
apply();
/* district map */
const MK={Oracle:"oracle",SAP:"sap",Odoo:"odoo",AWS:"aws",Azure:"azure",GCP:"gcp","Red Hat":"redhat",VMware:"vmware",IBM:"ibm",Zoom:"zoom"};
const DM=[["systems","Systems","blocks",["Oracle","SAP","Odoo"]],["foundations","Foundations","layers",["AWS","Azure","GCP","BytePlus","Red Hat","VMware"]],["intelligence","Intelligence","brain",["IBM","GCP","Azure","Red Hat"]],["immersion","Immersion","glasses",["Zoom"]]];
const dm=$("#dmap");
DM.forEach(([slug,t,icn,v],i)=>{const r=mk("a","dmrow");r.href=`/solutions/${slug}`;r.dataset.r="";r.style.setProperty("--d",`${i*70}ms`);
  r.innerHTML=`<span class="mico lg">${ic(icn)}</span><span class="dmt"><b>${t}</b><small>District</small></span><ul class="dmv">${v.map(x=>`<li class="v">${MK[x]?`<i class="vm" aria-hidden="true" style="--m:url(brands/${MK[x]}.svg)"></i>`:""}${x}</li>`).join("")}</ul>${arrow}`;dm.append(r);if(!REDUCED)new IntersectionObserver(([e],io)=>{if(e.isIntersecting){r.classList.add("in");io.disconnect()}},{rootMargin:"0px 0px -4% 0px"}).observe(r)});
})();
