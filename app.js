// ------- helpers -------
const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function show(id){
  $$(".screen").forEach(el=>el.classList.remove("active"));
  const el = typeof id==="string" ? $(id) : id;
  el.classList.add("active");
}
function applyBg(section){
  const p = section.getAttribute("data-bg");
  if(p) section.style.backgroundImage = `linear-gradient(180deg, rgba(0,0,0,.45), rgba(0,0,0,.65)), url('${p}')`;
}

// init covers
["#splash","#goals","#home"].forEach(sel=>applyBg($(sel)));
show("#splash");

// ------- profile (goal) -------
const GSTR = "fit_profile";
const goalName = g => ({fogyas:"Fogyás",szalkasitas:"Szálkásítás",hizas:"Hízás"})[g] || "—";
const loadProf = ()=>{ try{ return JSON.parse(localStorage.getItem(GSTR)||"null"); }catch{ return null; } };
const saveProf = p => localStorage.setItem(GSTR, JSON.stringify(p||{}));

// splash
$("#goStart").addEventListener("click", ()=> show("#goals"));

// goal select
let selectedGoal = null;
$$(".goal").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    selectedGoal = btn.dataset.goal;
    $$(".goal").forEach(b=>b.classList.remove("picked"));
    btn.classList.add("picked");
    $("#goals").setAttribute("data-bg", btn.dataset.bg); applyBg($("#goals"));
    $("#toHome").disabled = false;
  });
});
$("#skipGoal").addEventListener("click", ()=>{
  const p = loadProf() || {}; p.goal = "fogyas"; saveProf(p);
  $("#goalLabel").textContent = goalName(p.goal);
  show("#home");
});
$("#toHome").addEventListener("click", ()=>{
  if(!selectedGoal) return;
  const p = loadProf() || {}; p.goal = selectedGoal; saveProf(p);
  $("#goalLabel").textContent = goalName(p.goal);
  show("#home");
});
$("#changeGoal").addEventListener("click", ()=>{
  const p = loadProf(); const g = p?.goal || "fogyas";
  const map = {fogyas:"assets/fogyas.png", szalkasitas:"assets/szalkasitas.png", hizas:"assets/hizas.png"};
  $("#goals").setAttribute("data-bg", map[g]); applyBg($("#goals"));
  selectedGoal = g; $("#toHome").disabled = false;
  $$(".goal").forEach(b=>b.classList.remove("picked"));
  const active = document.querySelector(`.goal[data-goal="${g}"]`); if(active) active.classList.add("picked");
  show("#goals");
});

// back buttons
$$("[data-nav='splash']").forEach(b=>b.addEventListener("click", ()=>show("#splash")));
$$("[data-nav='home']").forEach(b=>b.addEventListener("click", ()=>show("#home")));

// restore goal label
const prof = loadProf(); if(prof?.goal) $("#goalLabel").textContent = goalName(prof.goal);

// menu open
$$("[data-open]").forEach(link=>{
  link.addEventListener("click", e=>{
    e.preventDefault();
    const target = "#" + link.dataset.open;
    if(target==="#workout"){ buildPlan(); }
    if(target==="#calories"){ renderK(); }
    if(target==="#progress"){ renderP(); }
    if(target==="#chat"){ initChat(); }
    show(target);
  });
});

// ------- workout -------
const PLAN = [
  {name:"Jumping jacks", time:30, img:"assets/exercises/jumping_jacks.png", desc:"Ugrálás terpesz-zár, karok lendítése."},
  {name:"Guggolás", time:30, img:"assets/exercises/guggolas.png", desc:"Csípő hátra, térd a lábfej irányába."},
  {name:"Fekvőtámasz térdelve", time:30, img:"assets/exercises/knee_pushup.png", desc:"Core feszes, könyök 45°."},
  {name:"Plank", time:30, img:"assets/exercises/plank.png", desc:"Egyenes törzs, farizom feszes."},
  {name:"Kitörés váltva", time:30, img:"assets/exercises/lunges.png", desc:"Hosszú lépés, hát egyenes."},
];

function buildPlan(){
  $("#woList").innerHTML = PLAN.map((x,i)=>`
    <article class="wocard">
      ${x.img ? `<img src="${x.img}" alt="${x.name}">` : ""}
      <div class="wobody">
        <h4>${i+1}. ${x.name}</h4>
        <p>${x.desc || ""}</p>
        <p class="muted">Időtartam: ${x.time} mp</p>
      </div>
    </article>
  `).join("");

  // reset timer UI
  $("#woNow").textContent = "Készen állsz?";
  $("#woDesc").textContent = "Nyomd meg a Start gombot.";
  $("#woClock").textContent = "00:30";
  $("#woStart").disabled=false; $("#woPause").disabled=true; $("#woNext").disabled=true;

  idx=-1; mode="work"; remain=0; clearInterval(tint);
}

let idx=-1, mode="work", remain=0, tint=null;
const MOTIV = ["Szép munka! 💪","Csak így tovább!","Már majdnem kész! 🔥","Ügyes! 👏","Minden ismétlés számít!"];

function beep(freq=1000,ms=150){
  try{ const ctx = new (window.AudioContext||window.webkitAudioContext)();
    const o = ctx.createOscillator(), g=ctx.createGain(); o.connect(g); g.connect(ctx.destination);
    o.type="sine"; o.frequency.value=freq; g.gain.value=0.06; o.start(); setTimeout(()=>{o.stop(); ctx.close();}, ms);
  }catch{}
}
function renderClock(){ const s = remain.toString().padStart(2,"0"); $("#woClock").textContent = `00:${s}`; }

function startNext(){
  idx++;
  if(idx>=PLAN.length){ return doneWorkout(); }
  mode="work"; remain=PLAN[idx].time;
  $("#woNow").textContent = `Dolgozz: ${PLAN[idx].name}`;
  $("#woDesc").textContent = PLAN[idx].desc || "Tartsd a tempót!";
  $("#woPause").disabled=false; $("#woNext").disabled=false;
  tick();
}
function tick(){
  clearInterval(tint); renderClock();
  tint=setInterval(()=>{
    remain--; if(remain<=0){
      clearInterval(tint); beep(1200,220);
      if(mode==="work"){ mode="rest"; remain=15; $("#woNow").textContent="Pihenj"; $("#woDesc").textContent="Igyál egy korty vizet."; renderClock(); tick(); }
      else{ $("#woDesc").textContent=MOTIV[Math.floor(Math.random()*MOTIV.length)]; setTimeout(()=>startNext(),600); }
      return;
    }
    if(remain<=3) beep(1400,120);
    renderClock();
  },1000);
}
function doneWorkout(){
  clearInterval(tint); beep(900,200); setTimeout(()=>beep(1400,220),240);
  $("#woNow").textContent="Kész! 🎉"; $("#woDesc").textContent="Gratulálok! Léphetünk a következő napra."; $("#woClock").textContent="00:00";
  $("#woPause").disabled=true; $("#woNext").disabled=true;

  // stats
  const S="fit_stats"; const st = JSON.parse(localStorage.getItem(S)||"{}");
  st.done = (st.done||0)+1;
  const d = new Date(); const key = d.toISOString().slice(0,10);
  st.minutes = st.minutes||{}; st.minutes[key]=(st.minutes[key]||0)+ (PLAN.reduce((a,b)=>a+b.time,0)+15*(PLAN.length-1))/60|0;
  // streak egyszerűsítve
  const prev = st.last || null;
  const today = new Date(new Date().toDateString());
  const yday = new Date(today); yday.setDate(today.getDate()-1);
  if(!prev) st.streak=1;
  else{
    const prevDate = new Date(prev);
    if(prevDate.toDateString()===yday.toDateString()) st.streak=(st.streak||0)+1;
    else if(prevDate.toDateString()===today.toDateString()) st.streak=(st.streak||0); 
    else st.streak=1;
  }
  st.last = today.toISOString();
  localStorage.setItem(S, JSON.stringify(st));
}

$("#woStart").addEventListener("click", ()=>{ $("#woStart").disabled=true; startNext(); });
$("#woPause").addEventListener("click", ()=>{
  if(!tint){ tick(); $("#woPause").textContent="Szünet"; return; }
  clearInterval(tint); tint=null; $("#woPause").textContent="Folytatás"; $("#woDesc").textContent="Szünetel. Folytatáshoz kattints.";
});
$("#woNext").addEventListener("click", ()=>{ clearInterval(tint); tint=null; mode="work"; startNext(); });

// ------- calories -------
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

  // bind deletes
  $$("#kList .x").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const i = Number(btn.dataset.i);
      const a = getDayArr(); a.splice(i,1); setDayArr(a); renderK();
    });
  });
}
$("#kForm").addEventListener("submit", e=>{
  e.preventDefault();
  const food = $("#kFood").value.trim(); const kcal = Number($("#kKcal").value||0);
  if(!food || !kcal) return;
  const arr = getDayArr(); arr.push({food,kcal}); setDayArr(arr); $("#kFood").value=""; $("#kKcal").value=""; renderK();
});

// ------- progress -------
function renderP(){
  const st = JSON.parse(localStorage.getItem("fit_stats")||"{}");
  $("#streak").textContent = `${st.streak||0} nap`;
  $("#done").textContent = `${st.done||0}`;
  const mins = st.minutes||{};
  // elmúlt 7 nap
  let sum=0; for(let i=0;i<7;i++){ const d=new Date(); d.setDate(d.getDate()-i); const k=dayKey(d); sum += mins[k]||0; }
  $("#w7").textContent = `${sum|0} perc`;
}

// ------- chat -------
let chatInit=false;
function addMsg(role, text){
  const row = document.createElement("div"); row.className = `msg ${role}`;
  const b = document.createElement("div"); b.className = "bubble"; b.textContent = text;
  row.appendChild(b); $("#cLog").appendChild(row); $("#cLog").scrollTop = $("#cLog").scrollHeight;
}
function initChat(){ if(chatInit) return; addMsg("ai","Szia! Miben segíthetek? Írj kérdést az edzésedről vagy étrendedről."); chatInit=true; }

$("#cForm").addEventListener("submit", async e=>{
  e.preventDefault();
  const txt = $("#cInput").value.trim(); if(!txt) return;
  $("#cInput").value=""; addMsg("me", txt);
  const goal = (loadProf()?.goal) || "fogyas";
  try{
    const r = await fetch("/.netlify/functions/ai-chat", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ goal, prompt: txt })
    });
    const js = await r.json();
    addMsg("ai", js.reply || "❔ Nem érkezett érvényes válasz.");
  }catch(e){
    addMsg("ai", "⚠️ Hiba történt a chat hívásakor.");
  }
});
