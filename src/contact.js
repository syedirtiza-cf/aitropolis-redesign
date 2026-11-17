(()=>{
const {mk,ic,D}=window.AIT;const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
/* service options */
const sel=$("#f-service");
[...D.map(d=>d.title+": "+d.sub),"Offshore IT teams","ISO and business process management","Digital Growth Partner","Not sure yet"].forEach(t=>{const o=mk("option");o.value=t;o.textContent=t;sel.append(o)});
/* offices */
const O=[["Dubai","Global HQ · UAE","Asia/Dubai","Innovation HUB, Sheikh Zayed Road, DIFC","Strategic hub for the Middle East and Africa markets."],["London","Europe · United Kingdom","Europe/London","London, United Kingdom","Serving European markets with local expertise."],["Islamabad","South Asia · Pakistan","Asia/Karachi","Islamabad, Pakistan","Our primary software development and engineering hub."],["Singapore","APAC · Singapore","Asia/Singapore","Republic of Singapore","Gateway to Asia-Pacific opportunities."]];
const og=$("#ogrid"),clocks=[];
O.forEach(([c,r,tz,ad,ds],i)=>{const a=mk("article","card ocard");a.dataset.r="";a.style.setProperty("--d",`${i*80}ms`);
  a.innerHTML=`<div class="otop"><div><h3 class="t-tl">${c}</h3><p class="t-bs muted">${r}</p></div><time class="oclock"></time></div><p class="t-bm muted">${ds}</p><p class="oaddr">${ic("map-pin")}<span>${ad}</span></p>`;og.append(a);clocks.push([tz,$("time",a)]);
  new IntersectionObserver(([e],io)=>{if(e.isIntersecting){a.classList.add("in");io.disconnect()}},{rootMargin:"0px 0px -4% 0px"}).observe(a)});
const upd=()=>clocks.forEach(([tz,el])=>{el.textContent=new Intl.DateTimeFormat("en-GB",{timeZone:tz,hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date())});upd();setInterval(upd,15000);
/* FAQ */
const F=[["How quickly does Aitropolis respond to enquiries?","We reply within 24 hours. A booked 15-minute assessment is the fastest route to an engineer."],["Can I schedule a free consultation with Aitropolis?","Yes. We offer a complimentary technology assessment call to understand your business challenges and explore how our solutions can address them. Use the form, or call us, to schedule it."],["What information should I prepare before contacting Aitropolis?","A brief overview of your current technology environment, the business challenge or opportunity, your approximate timeline and a budget range all help. None of it is required, and we can help you frame the rest."],["Does Aitropolis have offices I can visit?","Yes. We have offices in Dubai (DIFC, Innovation HUB, Sheikh Zayed Road), London, Islamabad and Singapore. Contact us in advance to schedule an in-person meeting at your nearest location."]];
$("#faqList").innerHTML=F.map(([q,a])=>`<details><summary><span>${q}</span><i aria-hidden="true"></i></summary><p class="t-bm">${a}</p></details>`).join("");
$$("#faqList details").forEach(d=>d.addEventListener("toggle",()=>{if(d.open)$$("#faqList details").forEach(o=>{if(o!==d)o.open=false})}));
/* form: validation and states. No backend in this prototype. */
const form=$("#cform"),ok=$("#fok"),send=$("#send");const t0=Date.now();
const err=(id,msg,field)=>{const e=$("#"+id);e.textContent=msg;e.hidden=!msg;if(field)field.setAttribute("aria-invalid",String(!!msg))};
const validate=()=>{let first=null;const n=form.name,m=form.email,g=form.message;
  const bad=(f,id,msg)=>{err(id,msg,f);if(!first)first=f};
  err("e-name","",n);err("e-email","",m);err("e-msg","",g);err("e-form","");
  if(!n.value.trim())bad(n,"e-name","Please tell us your name.");
  if(!m.value.trim())bad(m,"e-email","Please enter your work email.");else if(!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(m.value.trim()))bad(m,"e-email","That email address does not look right.");
  if(g.value.trim().length<10)bad(g,"e-msg","Please add a few words about what you need (at least ten characters).");
  if(first){err("e-form","Please fix the highlighted fields.");first.focus()}return !first};
form.addEventListener("submit",e=>{e.preventDefault();if(send.disabled)return;if(form.website.value){return}if(!validate())return;
  send.disabled=true;send.classList.add("loading");send.firstElementChild.textContent="Sending";send.querySelector("use").setAttribute("href","#i-loader-circle");
  setTimeout(()=>{form.hidden=true;ok.hidden=false;ok.focus();send.disabled=false;send.classList.remove("loading");send.firstElementChild.textContent="Send message";send.querySelector("use").setAttribute("href","#i-arrow-right")},900)});
$$("input,textarea",form).forEach(f=>f.addEventListener("input",()=>{if(f.getAttribute("aria-invalid")==="true"){f.setAttribute("aria-invalid","false");const id={name:"e-name",email:"e-email",message:"e-msg"}[f.name];if(id)err(id,"")}}));
$("#again").addEventListener("click",()=>{form.reset();ok.hidden=true;form.hidden=false;form.name.focus()});
})();
