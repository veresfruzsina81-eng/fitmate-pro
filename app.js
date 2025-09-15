// ===== Helpers =====
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const show = id => { $$(".screen").forEach(x=>x.classList.add("hidden")); $(id).classList.remove("hidden"); };
function applyBg(el){
  if(!el) return;
  const img = el.getAttribute("data-bg");
  el.style.backgroundImage = img
    ? `linear-gradient(180deg, rgba(0,0,0,.45), rgba(0,0,0,.65)), url('${img}')`
    : "";
}

// init splash + goal bg
applyBg($("#screen-splash"));
applyBg($("#screen-goal"));

// always start on splash
show("#screen-splash");

// ===== Goal persistence =====
const goalMap = { fogyas:"Fogyás", szalkasitas:"Szálkásítás", hizas:"Hízás" };
function saveProfile(p){ localStorage.setItem("fit_profile", JSON.stringify(p)); }
function loadProfile(){ try{ return JSON.parse(localStorage.getItem("fit_profile")||"null"); }catch{ return null; } }
function setGoalLabel(goal){ $("#goalLabel").textContent = goalMap[goal] || "—"; }

// ===== Splash → Goal =====
$("#btnStart").addEventListener("click", ()=> show("#screen-goal"));
$("[data-nav='back-splash']").addEventListener("click", ()=> show("#screen-splash"));
$("[data-nav='skip-goal']").addEventListener("click", ()=>{
  const p = loadProfile() || {}; p.goal = "fogyas"; saveProfile(p);
  setGoalLabel(p.goal); show("#screen-home");
});

let selectedGoal = null;
$$(".goal-card").forEach(card=>{
  card.addEventListener("click", ()=>{
    selectedGoal = card.dataset.goal;
    $("#screen-goal").setAttribute("data-bg", card.dataset.bg || "");
    applyBg($("#screen-goal"));
    $$(".goal-card").forEach(c=>c.style.outline="none");
    card.style.outline = "2px solid var(--accent2)";
    $("#btnToHome").disabled = false;
  });
});
$("#btnToHome").addEventListener("click", ()=>{
  if(!selectedGoal) return;
  const p = loadProfile() || {}; p.goal = selectedGoal; saveProfile(p);
  setGoalLabel(p.goal); show("#screen-home");
});
$("#btnChangeGoal").addEventListener("click", ()=>{
  const p = loadProfile() || {goal:"fogyas"};
  const map = {fogyas:"assets/fogyas.png", szalkasitas:"assets/szalkasitas.png", hizas:"assets/hizas.png"};
  $("#screen-goal").setAttribute("data-bg", map[p.goal]); applyBg($("#screen-goal"));
  selectedGoal = p.goal; $("#btnToHome").disabled = false;
  $$(".goal-card").forEach(c=>c.style.outline="none");
  const chosen = document.querySelector(`.goal-card[data-goal="${p.goal}"]`);
  if(chosen) chosen.style.outline = "2px solid var(--accent2)";
  show("#screen-goal");
});

// restore label if we had goal
const prev = loadProfile(); if(prev?.goal) setGoalLabel(prev.goal);

// ===== Menu navigation =====
$$("[data-open]").forEach(a=>{
  a.addEventListener("click", (e)=>{
    e.preventDefault();
    const t = a.getAttribute("data-open");
    if(t==="workouts") { buildWorkoutPlan(); show("#screen-workouts"); }
    if(t==="calories") { renderKcal(); show("#screen-calories"); }
    if(t==="progress") { renderProgress(); show("#screen-progress"); }
    if(t==="chat")     { initChat(); show("#screen-chat"); }
  });
});
$$("[data-back]").forEach(b=>{
  b.addEventListener("click", ()=> show("#screen-home"));
});

// ===== Workouts (timer + rest + motiváció) =====
const MOTIV = [
  "Szép munka! 💪", "Csak így tovább!", "Már majdnem kész! 🔥", "Erős vagy! 👏", "Minden ismétlés számít!"
];
let plan = [];
let idx = -1;
let mode = "work"; // work | rest
let remain = 0;
let tInt = null;

function buildWorkoutPlan(){
  // egyszerű 1. nap (később célhoz igazíthatjuk)
  plan = [
    { name:"Jumping jacks", time:30 },
    { name:"Guggolás", time:30 },
    { name:"Fekvőtámasz térdelve", time:30 },
    { name:"Plank", time:30 },
    { name:"Kitörés váltott lábbal", time:30 },
  ];
  const box = $("#wo-plan");
  box.innerHTML = plan.map((x,i)=>`
    <div class="wo-item">
      <h4> ${i+1}. ${x.name} </h4>
      <div class="wo-meta">Időtartam: ${x.time} mp</div>
    </div>
  `).join("");
  $("#timerLabel").textContent = "Készen állsz?";
  $("#timerDisplay").textContent = "00:30";
  $("#timerNote").textContent = "Nyomd meg a Start gombot.";
  $("#btnWoStart").disabled = false; $("#btnWoPause").disabled = true; $("#btnWoNext").disabled = true;
  idx = -1; mode = "work"; remain = 0; clearInterval(tInt);
}

function beep(freq=880, ms=180){
  try{
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type="sine"; o.frequency.value=freq; g.gain.value=0.05;
    o.start(); setTimeout(()=>{ o.stop(); ctx.close(); }, ms);
  }catch{}
}

function startNext(){
  idx++;
  if(idx>=plan.length){ workoutDone(); return; }
  mode = "work";
  remain = plan[idx].time;
  $("#timerLabel").textContent = `Dolgozz: ${plan[idx].name}`;
  $("#timerNote").textContent = "Tartsd a tempót! Ha vége, jön a pihenő.";
  $("#btnWoPause").disabled = false; $("#btnWoNext").disabled = false;
  tickStart();
}
function tickStart(){
  clearInterval(tInt);
  renderTime();
  tInt = setInterval(()=>{
    remain--;
    if(remain<=0){
      clearInterval(tInt);
      beep(1200,220);
      if(mode==="work"){ // pihenőre vált
        mode="rest"; remain=15;
        $("#timerLabel").textContent = "Pihenj";
        $("#timerNote").textContent = "Igyál egy korty vizet. Mindjárt jön a következő gyakorlat.";
        renderTime(); tickStart();
      }else{ // következő feladat
        $("#timerNote").textContent = MOTIV[Math.floor(Math.random()*MOTIV.length)];
        setTimeout(()=>{ startNext(); }, 600);
      }
    } else {
      // 3-2-1 magasabb hang
      if(remain<=3) beep(1400,120);
      renderTime();
    }
  }, 1000);
}
function renderTime(){
  const m = Math.floor(remain/60).toString().padStart(2,"0");
  const s = (remain%60).toString().padStart(2,"0");
  $("#timerDisplay").textContent = `${m}:${s}`;
}
function workoutDone(){
  clearInterval(tInt);
  beep(1000,300); beep(1400,300);
  $("#timerLabel").textContent = "Kész! 🎉";
  $("#timerDisplay").textContent = "00:00";
  $("#timerNote").textContent = "Gratulálok! Léphetünk a következő napra.";
  $("#btnWoPause").disabled = true; $("#btnWoNext").disabled = true;
  // stat: növeljük a kész edzések számát és streaket
  const st = JSON.parse(localStorage.getItem("fit_stats")||"{}");
  st.done = (st.done||0)+1;
  // egyszerű napi streak (dátum alapján)
  const today = new Date().toDateString();
  if(st.last !== today){ st.streak = (st.last && new Date(st.last) && (new Date(today)-new Date(st.last)===86400000)) ? (st.streak||0)+1 : (st.streak||0)+1; st.last=today; }
  localStorage.setItem("fit_stats", JSON.stringify(st));
}
$("#btnWoStart").addEventListener("click", ()=>{ $("#btnWoStart").disabled=true; startNext(); });
$("#btnWoPause").addEventListener("click", ()=>{
  if(!tInt) return;
  if($("#btnWoPause").textContent==="Szünet"){
    clearInterval(tInt); tInt=null; $("#btnWoPause").textContent="Folytatás";
    $("#timerNote").textContent = "Szünetel. Folytatáshoz kattints.";
  }else{
    $("#btnWoPause").textContent="Szünet"; tickStart();
  }
});
$("#btnWoNext").addEventListener("click", ()=>{ clearInterval(tInt); beep(900,150); mode="work"; startNext(); });

// ===== Calories =====
function getKcal(){ try{return JSON.parse(localStorage.getItem("kcal")||"[]");}catch{return [];} }
function setKcal(arr){ localStorage.setItem("kcal", JSON.stringify(arr)); }
function renderKcal(){
  const arr = getKcal();
  $("#kcalList").innerHTML = arr.map((x,i)=>`
    <div class="kcal-row"><span>${x.food}</span><strong>${x.kcal} kcal</strong></div>
  `).join("");
  const tot = arr.reduce((a,b)=>a+Number(b.kcal||0),0);
  $("#kcalTotal").textContent = `${tot} kcal`;
}
$("#kcalForm").addEventListener("submit", (e)=>{
  e.preventDefault();
  const food = $("#food").value.trim();
  const kcal = Number($("#kcal").value||0);
  if(!food || kcal<=0) return;
  const arr = getKcal(); arr.push({food,kcal}); setKcal(arr);
  $("#food").value=""; $("#kcal").value="";
  renderKcal();
});

// ===== Progress =====
function renderProgress(){
  const st = JSON.parse(localStorage.getItem("fit_stats")||"{}");
  $("#streakVal").textContent = `${st.streak||0} nap`;
  $("#doneCount").textContent = `${st.done||0}`;
}

// ===== Chat =====
let chatInit = false;
function initChat(){
  if(chatInit) return;
  addMsg("ai","Szia! Miben segíthetek? Írj kérdést az edzésedről vagy étrendedről.");
  chatInit = true;
}
function addMsg(role, text){
  const wrap = document.createElement("div");
  wrap.className = `msg ${role}`;
  const b = document.createElement("div");
  b.className = "bubble";
  b.textContent = text;
  wrap.appendChild(b);
  $("#chatLog").appendChild(wrap);
  $("#chatLog").scrollTop = $("#chatLog").scrollHeight;
}
$("#chatForm").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const txt = $("#chatInput").value.trim(); if(!txt) return;
  $("#chatInput").value=""; addMsg("me", txt);

  const goal = (loadProfile()?.goal) || "fogyas";
  try{
    const r = await fetch("/.netlify/functions/ai-chat", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ goal, prompt: txt })
    });
    const json = await r.json();
    addMsg("ai", json.reply || "❔ Nem érkezett válasz.");
  }catch(err){
    addMsg("ai", "⚠️ Hiba történt a chat hívásakor.");
  }
});
