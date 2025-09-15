const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

/* ---- háttér + router ---- */
function applyBg(section){
  if(!section) return;
  const p = section.getAttribute("data-bg");
  if (p) section.style.backgroundImage =
    `linear-gradient(180deg, rgba(0,0,0,.38), rgba(0,0,0,.58)), url('${p}')`;
}
function show(selector){
  $$(".screen").forEach(el=>el.classList.remove("active"));
  const el = typeof selector==="string" ? $(selector) : selector;
  el.classList.add("active"); applyBg(el);
}
["#splash","#goals","#home","#workout","#woDetail","#calories","#progress","#chat"].forEach(sel=>applyBg($(sel)));
show("#splash");

/* ---- profil (cél) ---- */
const GSTR="fit_profile";
const goalName = g=>({fogyas:"Fogyás",szalkasitas:"Szálkásítás",hizas:"Hízás"})[g]||"—";
const loadProf = ()=>{ try{return JSON.parse(localStorage.getItem(GSTR)||"null");}catch{return null;} };
const saveProf = p => localStorage.setItem(GSTR, JSON.stringify(p||{}));

$("#goStart").addEventListener("click",()=>show("#goals"));
let selectedGoal=null;
$$(".goal").forEach(btn=>{
  btn.addEventListener("click",()=>{
    selectedGoal=btn.dataset.goal;
    $$(".goal").forEach(b=>b.classList.remove("picked"));
    btn.classList.add("picked");
    $("#goals").setAttribute("data-bg", btn.dataset.bg); applyBg($("#goals"));
    $("#toHome").disabled=false;
  });
});
$("#skipGoal").addEventListener("click",()=>{ const p=loadProf()||{}; p.goal="fogyas"; saveProf(p); $("#goalLabel").textContent=goalName(p.goal); show("#home"); });
$("#toHome").addEventListener("click",()=>{ if(!selectedGoal) return; const p=loadProf()||{}; p.goal=selectedGoal; saveProf(p); $("#goalLabel").textContent=goalName(p.goal); show("#home");});
$("#changeGoal").addEventListener("click",()=>{ const g=(loadProf()?.goal)||"fogyas"; selectedGoal=g; $("#toHome").disabled=false; show("#goals"); });

$$("[data-nav='home']").forEach(b=>b.addEventListener("click",()=>show("#home")));
$$("[data-nav='splash']").forEach(b=>b.addEventListener("click",()=>show("#splash")));
$$("[data-nav='workout']").forEach(b=>b.addEventListener("click",()=>show("#workout")));

const prof=loadProf(); if(prof?.goal) $("#goalLabel").textContent=goalName(prof.goal);

/* ---- menü ---- */
$$("[data-open]").forEach(a=>{
  a.addEventListener("click",(e)=>{
    e.preventDefault();
    const id="#"+a.dataset.open;
    if(id==="#workout") buildPlan();
    if(id==="#calories") renderK();
    if(id==="#progress") renderProgress();
    if(id==="#chat") initChat();
    show(id);
  });
});

/* ---- edzés: lista + részlet ---- */
const PLAN = [
  {key:"jumping_jacks",  name:"Jumping jacks",  img:"assets/exercises/jumping_jacks.png", desc:"Ugrálás terpesz–zár, karok lendítése."},
  {key:"guggolas",       name:"Guggolás",       img:"assets/exercises/guggolas.png",       desc:"Csípő hátra, térd a lábfej irányába."},
  {key:"fekvotamasz",    name:"Fekvőtámasz",    img:"assets/exercises/fekvotamasz.png",    desc:"Core feszes, könyök 45°."},
  {key:"plank",          name:"Plank",          img:"assets/exercises/plank.png",          desc:"Egyenes törzs, farizom feszes."},
  {key:"kitores",        name:"Kitörés váltva", img:"assets/exercises/kitores.png",        desc:"Hosszú lépés, hát egyenes."},
];

function buildPlan(){
  $("#woList").innerHTML = PLAN.map((x,i)=>`
    <article class="wocard" data-i="${i}">
      ${x.img ? `<img src="${x.img}" alt="${x.name}" loading="eager">` : `<div style="height:180px;background:#16233b"></div>`}
      <div class="wobody">
        <h4>${i+1}. ${x.name}</h4>
        <p>${x.desc}</p>
        <p class="muted">Koppints a részletekhez →</p>
      </div>
    </article>
  `).join("");
  $$("#woList .wocard").forEach(card=>{
    card.addEventListener("click",()=>{
      const i = Number(card.dataset.i);
      openDetail(i);
    });
  });
}

let D = {i:0, sets:3, reps:12, sec:2, curSet:1, curRep:0, running:false, t:null};
function openDetail(idx){
  const ex = PLAN[idx]; D = {i:idx, sets:3, reps:12, sec:2, curSet:1, curRep:0, running:false, t:null};
  $("#wdTitle").textContent = ex.name;
  $("#wdDesc").textContent  = ex.desc;
  $("#wdImg").src = ex.img || ""; $("#wdImg").alt = ex.name || "gyakorlat";
  $("#wdSets").value=3; $("#wdReps").value=12; $("#wdSec").value=2;
  $("#wdState").textContent="Készen állsz?"; $("#wdClock").textContent="00:00";
  $("#wdPause").disabled=true; $("#wdNextRep").disabled=true; $("#wdNextSet").disabled=true;
  show("#woDetail");
}

function beep(f=1100,ms=150){ try{ const ctx=new (window.AudioContext||window.webkitAudioContext)(); const o=ctx.createOscillator(), g=ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.frequency.value=f; g.gain.value=0.06; o.start(); setTimeout(()=>{o.stop(); ctx.close();}, ms);}catch{}}
function clock(s){ $("#wdClock").textContent = `00:${String(s).padStart(2,"0")}`; }

$("#wdStart").addEventListener("click", ()=>{
  D.sets = Math.max(1, Math.min(10, Number($("#wdSets").value)||3));
  D.reps = Math.max(1, Math.min(50, Number($("#wdReps").value)||12));
  D.sec  = Math.max(1, Math.min(90, Number($("#wdSec").value)||2));
  D.curSet=1; D.curRep=0; $("#wdState").textContent=`${D.curSet}. kör – ${D.reps} ism.`;
  $("#wdPause").disabled=false; $("#wdNextRep").disabled=false; $("#wdNextSet").disabled=false;
  nextRep();
});

function nextRep(){
  D.running=true; let s=D.sec; clock(s);
  clearInterval(D.t);
  D.t=setInterval(()=>{
    s--; clock(s); if(s<=0){
      clearInterval(D.t); beep(); D.curRep++;
      if(D.curRep>=D.reps){ // kör kész
        D.curRep=0; D.curSet++;
        if(D.curSet>D.sets){ finishExercise(); return; }
        $("#wdState").textContent=`Pihenj (10 mp)…`; rest(10, ()=>{ $("#wdState").textContent=`${D.curSet}. kör – ${D.reps} ism.`; nextRep(); });
      }else{
        $("#wdState").textContent=`${D.curSet}. kör – ${D.curRep+1}/${D.reps} ism.`; nextRep();
      }
    }
  },1000);
}
function rest(sec, cb){
  let s=sec; clock(s); clearInterval(D.t);
  D.t=setInterval(()=>{ s--; clock(s); if(s<=0){ clearInterval(D.t); cb(); } },1000);
}
$("#wdPause").addEventListener("click", ()=>{
  if(!D.running){ nextRep(); $("#wdPause").textContent="Szünet"; D.running=true; return; }
  clearInterval(D.t); D.running=false; $("#wdPause").textContent="Folytatás"; $("#wdState").textContent="Szünetel…";
});
$("#wdNextRep").addEventListener("click", ()=>{ clearInterval(D.t); D.running=false; $("#wdState").textContent="Következő ismétlés…"; nextRep(); });
$("#wdNextSet").addEventListener("click", ()=>{ clearInterval(D.t); D.running=false; D.curRep=D.reps; nextRep(); });

function finishExercise(){
  clearInterval(D.t); D.running=false; clock(0);
  $("#wdState").textContent="Kész! 🎉";

  // naplózás
  const LOG="fit_log"; const today = new Date().toISOString().slice(0,10);
  const all = JSON.parse(localStorage.getItem(LOG)||"{}");
  all[today]=all[today]||{exercises:[], minutes:0, goal:(loadProf()?.goal||"fogyas")};
  const ex = PLAN[D.i];
  const seconds = (D.sets*D.reps*D.sec) + (D.sets-1)*10; // becsült összidő
  all[today].exercises.push({name:ex.name, sets:D.sets, reps:D.reps, seconds, doneAt:Date.now()});
  all[today].minutes += Math.round(seconds/60);
  localStorage.setItem(LOG, JSON.stringify(all));

  // stats (streak & done)
  const S="fit_stats"; const st=JSON.parse(localStorage.getItem(S)||"{}");
  st.done=(st.done||0)+1;
  const t0=new Date(new Date().toDateString()), y=new Date(t0); y.setDate(t0.getDate()-1);
  const prev = st.last? new Date(st.last):null;
  if(!prev) st.streak=1;
  else if(prev.toDateString()===y.toDateString()) st.streak=(st.streak||0)+1;
  else if(prev.toDateString()===t0.toDateString()) st.streak=(st.streak||0);
  else st.streak=1;
  st.last=t0.toISOString();
  localStorage.setItem(S, JSON.stringify(st));

  $("#modalTxt").textContent="Szép munka! Kész vagy ezzel a gyakorlattal. Lépj vissza és válaszd a következőt.";
  $("#modal").classList.remove("hidden");
}
$("#modalOk").addEventListener("click", ()=>{ $("#modal").classList.add("hidden"); show("#workout"); });

/* ---- kalória ---- */
function dayKey(d=new Date()){ return d.toISOString().slice(0,10); }
const KC="fit_kcal";
function getDayArr(key=dayKey()){ try{ const all=JSON.parse(localStorage.getItem(KC)||"{}"); return all[key]||[]; }catch{return [];} }
function setDayArr(arr,key=dayKey()){ const all=JSON.parse(localStorage.getItem(KC)||"{}"); all[key]=arr; localStorage.setItem(KC, JSON.stringify(all)); }
function renderK(){
  const arr = getDayArr();
  $("#kList").innerHTML = arr.map((x,i)=>`
    <div class="krow"><span>${x.food}</span><strong>${x.kcal} kcal</strong><button class="x" data-i="${i}">Törlés</button></div>
  `).join("");
  const tot = arr.reduce((a,b)=>a+Number(b.kcal||0),0);
  $("#kTotal").textContent = `${tot} kcal`;
  $$("#kList .x").forEach(btn=>{
    btn.addEventListener("click",()=>{ const i=Number(btn.dataset.i); const a=getDayArr(); a.splice(i,1); setDayArr(a); renderK(); });
  });
}
$("#kForm").addEventListener("submit", e=>{
  e.preventDefault();
  const food=$("#kFood").value.trim(), kcal=Number($("#kKcal").value||0);
  if(!food || !kcal) return;
  const arr=getDayArr(); arr.push({food,kcal}); setDayArr(arr);
  $("#kFood").value=""; $("#kKcal").value=""; renderK();
});

/* ---- teljesítmény ---- */
function renderProgress(){
  const S="fit_stats"; const st=JSON.parse(localStorage.getItem(S)||"{}");
  $("#streak").textContent = `${st.streak||0} nap`;
  $("#done").textContent   = `${st.done||0}`;
  const LOG="fit_log"; const all=JSON.parse(localStorage.getItem(LOG)||"{}");
  let sum=0; for(let i=0;i<7;i++){ const d=new Date(); d.setDate(d.getDate()-i); const k=dayKey(d); sum += (all[k]?.minutes)||0; }
  $("#w7").textContent = `${sum|0} perc`;
  const k=dayKey(); const today=all[k]?.exercises||[];
  $("#dailyLog").innerHTML = today.length
    ? `<div class="klist">` + today.map(e=>`<div class="krow"><span>${e.name}</span><span>${e.sets}×${e.reps} ism.</span><strong>${Math.round(e.seconds/60)} perc</strong></div>`).join("") + `</div>`
    : `<p class="muted">Még nincs felvéve gyakorlat ma.</p>`;
}

/* ---- chat (Netlify Function) ---- */
let chatInit=false;
function addMsg(role, text){
  const row=document.createElement("div"); row.className=`msg ${role}`;
  const b=document.createElement("div"); b.className="bubble"; b.textContent=text;
  row.appendChild(b); $("#cLog").appendChild(row); $("#cLog").scrollTop=$("#cLog").scrollHeight;
}
function initChat(){ if(chatInit) return; addMsg("ai","Szia! Hogyan segíthetek a célodban?"); chatInit=true; }

$("#cForm").addEventListener("submit", async e=>{
  e.preventDefault();
  const txt=$("#cInput").value.trim(); if(!txt) return;
  $("#cInput").value=""; addMsg("me", txt);

  const goal=(loadProf()?.goal)||"fogyas";
  const LOG="fit_log"; const all=JSON.parse(localStorage.getItem(LOG)||"{}"); const k=dayKey();
  const today=all[k]?.exercises?.map(e=>`${e.name} ${e.sets}x${e.reps}`)?.join(", ") || "ma még nem edzettem";

  try{
    const r = await fetch("/.netlify/functions/ai-chat", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ goal, prompt: `Cél: ${goal}. Mai napló: ${today}. Kérdés: ${txt}` })
    });
    const js = await r.json();
    addMsg("ai", js.reply || "❔ Nem érkezett érvényes válasz.");
  }catch(err){
    addMsg("ai","⚠️ Hiba történt a chat hívásakor.");
  }
});
