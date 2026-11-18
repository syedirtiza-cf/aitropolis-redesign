const {inView,REDUCED}=window.AIT;
(()=>{const host=document.getElementById("bars");if(!host)return;
  const B=JSON.parse(host.dataset.bars||"[]"),mx=+host.dataset.max||1;
  B.forEach(([l,n],k)=>{const r=document.createElement("div");r.className="brow"+(n===mx?" hot":"");r.innerHTML=`<b>${l}</b><div class="track"><span class="fill" style="--d:${900+k*80}ms;--g:0;width:${n/mx*100}%"></span></div><em>${n}</em>`;host.append(r)});
  const run=()=>host.querySelectorAll(".fill").forEach(f=>f.style.setProperty("--g",1));
  if(REDUCED)run();else inView(document.getElementById("dash"),run,"0px")})();
document.querySelectorAll(".faqlist details").forEach(d=>d.addEventListener("toggle",()=>{if(d.open)document.querySelectorAll(".faqlist details").forEach(o=>{if(o!==d)o.open=false})}));
