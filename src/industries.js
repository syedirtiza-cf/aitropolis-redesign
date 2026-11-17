(()=>{
const {mk,inView,REDUCED,ic}=window.AIT;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
$("#yrs").textContent=new Date().getFullYear()-2010;
/* Sector data: in the Next.js build this is src/lib/industries.ts. */
const S={erp:["ERP implementation","/solutions/systems/erp"],crm:["CRM","/solutions/systems/crm"],bi:["Business intelligence","/solutions/systems/bi"],cloud:["Cloud transformation","/solutions/foundations/cloud"],managed:["Managed services","/solutions/foundations/managed-services"],genai:["Generative AI","/solutions/intelligence/generative-ai"],mlops:["Machine learning operations","/solutions/intelligence/mlops"],software:["Custom software","/solutions/intelligence/custom-software"],telecom:["Telecom platforms","/solutions/intelligence/telecom-platforms"],exchange:["Blockchain & tokenisation","/solutions/exchange"],signal:["Digital marketing","/solutions/signal"],iso:["ISO & business process management","/solutions/iso-bpm"]};
const I=[
 {slug:"banking",icon:"landmark",name:"Banking & Financial Services",desc:"Enterprise banking systems must handle mission-critical transactions, regulatory compliance and 24/7 availability.",
  hurts:["Legacy core banking systems blocking innovation","Regulatory compliance (AML, KYC, Basel III, MiFID II)","Open banking and API-first architecture requirements","Real-time fraud detection and risk management","Customer experience modernisation"],
  does:["Core banking system modernisation","Real-time payment processing","Regulatory reporting automation","Customer analytics at scale"],
  tech:["Oracle Banking Suite","AWS","ML for fraud detection","Blockchain for settlements"],svc:["erp","cloud","bi","genai","exchange","software"],
  cases:[["arib-fintech-cloud-acceleration","ARIB","Fintech cloud acceleration, KSA"],["quikcard-oracle-cloud-migration","Quikcard","Payments workload moved to Oracle Cloud, Canada"],["riskcalm-finops-oracle-cloud","RiskCalm","FinOps for a fintech on Oracle Cloud, US"],["trustedpof-fintech","TrustedPoF","Fraud detection for a fintech launch"]]},
 {slug:"telecommunications",icon:"radio-tower",name:"Telecommunications",desc:"Telecom operators need agile billing, customer management and infrastructure to compete.",
  hurts:["Complex rating and billing systems","5G infrastructure and OSS/BSS modernisation","Customer churn management","Network automation and orchestration","Digital transformation of customer experience"],
  does:["OSS/BSS implementation and modernisation","Network automation","Customer experience management","Revenue assurance"],
  tech:["OSS/BSS platforms","Kubernetes","5G orchestration","Customer analytics"],svc:["telecom","erp","cloud","bi","signal"],
  cases:[["pakistan-telecom-oracle-coe","Pakistan Telecom","Oracle Database Centre of Excellence"],["australia-telecom-post-acquisition","Australia Telecom","Managed database and analytics after an acquisition"],["gms-telecom-us","GMS Global Message System","Enterprise A2P messaging platform, US"]]},
 {slug:"government",icon:"building-2",name:"Government & Public Sector",desc:"Government agencies require secure, compliant systems that serve citizens while keeping availability high.",
  hurts:["Legacy systems integration across agencies","Security and compliance (FedRAMP, NIST, ISO)","E-government services modernisation","Data silos and information sharing","Budget constraints and cost optimisation"],
  does:["Government ERP systems","Secure cloud deployment","Data warehouse and analytics","Citizen experience modernisation"],
  tech:["Secure cloud (GovCloud, FedRAMP)","Data integration","Analytics for citizen services"],svc:["erp","cloud","bi","managed","iso"],
  cases:[["uae-public-sector-cloud-compliance","UAE Public Sector Entity","IAR compliance through Oracle Cloud and managed services"],["dubai-municipality-ai-frames","Dubai Municipality","AI frames across civic infrastructure"],["rta-iot-museum","RTA","IoT and audio-visual for a transport museum"]]},
 {slug:"manufacturing",icon:"factory",name:"Manufacturing & Supply Chain",desc:"Manufacturers face supply chain complexity, need real-time visibility and must optimise operations globally.",
  hurts:["Supply chain visibility and resilience","Demand planning and inventory optimisation","Operational technology (OT) and IT convergence","Predictive maintenance and asset optimisation","Sustainability and ESG reporting"],
  does:["ERP for manufacturing","Supply chain optimisation","Predictive maintenance","Quality management systems"],
  tech:["SAP, Oracle Manufacturing","Predictive analytics","IoT sensors","Supply chain networks"],svc:["erp","cloud","mlops","bi"],
  cases:[["riyadh-pharma-erp-modernization","Riyadh Pharma","ERP and infrastructure modernisation for a pharmaceutical manufacturer, KSA"]]},
 {slug:"retail",icon:"shopping-bag",name:"Retail",desc:"Retailers must deliver seamless omnichannel experiences while managing inventory, pricing and customer loyalty.",
  hurts:["Omnichannel customer experience","Real-time inventory and fulfilment","Pricing optimisation and promotions","Customer loyalty and personalisation","Analytics-driven merchandising"],
  does:["E-commerce platform implementation","Omnichannel inventory management","Customer analytics and personalisation","Marketing automation"],
  tech:["Salesforce Commerce","Analytics","Real-time inventory","Personalisation engines"],svc:["crm","cloud","bi","signal","mlops"],
  cases:[["dell-technologies-uae","Dell Technologies UAE","Customer transformation across sectors, retail among them"]]},
 {slug:"healthcare",icon:"heart-pulse",name:"Healthcare",desc:"Healthcare providers must protect data, stay compliant and keep systems interoperable while delivering patient-centred care.",
  hurts:["Electronic health record (EHR) interoperability","HIPAA compliance and data security","Patient experience and engagement","Clinical decision support","Population health management"],
  does:["EHR implementation","Health data integration","Clinical analytics","Patient engagement platforms"],
  tech:["HL7, FHIR standards","Secure cloud","Clinical analytics","Interoperability platforms"],svc:["erp","cloud","bi","mlops","managed"],
  cases:[["healthcare-ai-twin","Healthcare AI Digital Twin","AI digital twin across AWS, Azure and Vertex AI"],["aicenna","AICenna","Brand launch for a healthcare AI platform"]]}
];
$("#projTotal").textContent=I.reduce((n,i)=>n+i.cases.length,0);
/* hero bars */
(()=>{const host=$("#bars");const max=Math.max(...I.map(i=>i.cases.length));
  I.forEach((d,k)=>{const row=mk("div","brow"+(d.cases.length===max?" hot":""));row.innerHTML=`<b>${d.name.split(" &")[0]}</b><div class="track"><span class="fill" style="--d:${900+k*80}ms;--g:0;width:${d.cases.length/max*100}%"></span></div><em>${d.cases.length}</em>`;host.append(row)});
  const run=()=>$$(".fill",host).forEach(f=>f.style.setProperty("--g",1));
  if(REDUCED)run();else inView($("#dash"),run,"0px")})();
/* explorer */
const list=$("#expList"),panel=$("#expPanel");let cur=-1;
const arrow=ic("arrow-right");
I.forEach((d,i)=>{const b=mk("button","exp-item");b.type="button";b.id="tab-"+d.slug;b.setAttribute("role","tab");b.setAttribute("aria-controls","expPanel");b.dataset.i=i;
  b.innerHTML=`<span class="mico">${ic(d.icon)}</span><span><b>${d.name}</b><small>${d.cases.length} published ${d.cases.length===1?"project":"projects"}</small></span>`;
  b.addEventListener("click",()=>select(i,true));b.addEventListener("mouseenter",()=>{if(matchMedia("(hover:hover) and (min-width:1025px)").matches)select(i,false)});
  b.addEventListener("keydown",e=>{if(e.key==="ArrowDown"||e.key==="ArrowRight"){e.preventDefault();$$(".exp-item",list)[(i+1)%I.length].focus()}if(e.key==="ArrowUp"||e.key==="ArrowLeft"){e.preventDefault();$$(".exp-item",list)[(i+I.length-1)%I.length].focus()}});
  list.append(b)});
function select(i,hash){if(i===cur)return;cur=i;const d=I[i];
  $$(".exp-item",list).forEach((b,k)=>{b.classList.toggle("on",k===i);b.setAttribute("aria-selected",String(k===i));b.tabIndex=k===i?0:-1});
  panel.setAttribute("aria-labelledby","tab-"+d.slug);
  panel.innerHTML=`<div class="ep-head"><span class="mico lg">${ic(d.icon)}</span><div><h3 class="t-tl">${d.name}</h3><p class="t-bm muted">${d.desc}</p></div></div>
  <div class="ep-cols"><div><p class="eb">Where it hurts</p><ul class="ep-list">${d.hurts.map(x=>`<li>${ic("minus")}<span>${x}</span></li>`).join("")}</ul></div><div><p class="eb">What we deliver</p><ul class="ep-list ok">${d.does.map(x=>`<li>${ic("check")}<span>${x}</span></li>`).join("")}</ul></div></div>
  <p class="eb">Technology focus</p><ul class="tags">${d.tech.map(x=>`<li>${x}</li>`).join("")}</ul>
  <p class="eb">Services</p><ul class="ep-svc">${d.svc.map(k=>`<li><a href="${S[k][1]}"><span>${S[k][0]}</span>${arrow}</a></li>`).join("")}</ul>
  <p class="eb">Published work</p><ul class="ep-cases">${d.cases.map(c=>`<li><a href="/case-studies/${c[0]}"><b>${c[1]}</b><small>${c[2]}</small>${arrow}</a></li>`).join("")}</ul>`;
  panel.classList.remove("swap");void panel.offsetWidth;panel.classList.add("swap");
  if(hash)history.replaceState(null,"","#"+d.slug)}
const start=I.findIndex(d=>"#"+d.slug===location.hash);select(start>=0?start:0,false);
/* dot field for the cultural card */
(()=>{const cv=$("#dotsN");if(!cv)return;const x=cv.getContext("2d");const d=()=>{const w=cv.clientWidth,h=cv.clientHeight,dp=Math.min(2,devicePixelRatio||1);cv.width=w*dp;cv.height=h*dp;x.setTransform(dp,0,0,dp,0,0);const p=16;for(let yy=p/2;yy<h;yy+=p)for(let xx=p/2;xx<w;xx+=p){const dd=Math.hypot(xx/w-.5,yy/h-.5);const a=Math.max(0,.55-dd*.7);if(a<.04)continue;x.globalAlpha=a;x.fillStyle="#fff";x.beginPath();x.arc(xx,yy,1.6,0,6.2832);x.fill()}};d();new ResizeObserver(d).observe(cv)})();
})();
