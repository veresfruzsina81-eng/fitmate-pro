// ===== util =====
const $ = (sel, p = document) => p.querySelector(sel);
const $$ = (sel, p = document) => [...p.querySelectorAll(sel)];
const show = id => $$(".screen").forEach(s => s.id === id ? s.classList.add("show") : s.classList.remove("show"));
const beep = () => $("#beepAudio")?.play();

const LS = {
  set(k,v){ localStorage.setItem(k, JSON.stringify(v)); },
  get(k,d=null){ try{ return JSON.parse(localStorage.getItem(k)) ?? d }catch{ return d }},
  del(k){ localStorage.removeItem(k) }
};

// ===== app state =====
let state = {
  goal: LS.get("goal","fogyas"),        // fogyas | szalkasitas | hizas
  gender: LS.get("gender","no"),        // no | ferfi
  streak: LS.get("streak",0),
  doneWorkouts: LS.get("doneWorkouts",0),
};

// ===== splash → goal =====
$("#btnStart").addEventListener("click", () => {
  // állítsuk a cél képét a háttérnek
  $("#screen-goal").style.setProperty("--bg", "url('fogyas.png')");
  show("screen-goal");
});

$("#btnGoalNext").addEventListener("click", () => {
  const active = $(".choice.active")?.dataset.goal || state.goal;
  state.goal = active;
  state.gender = $("#selGender").value;
  LS.set("goal", state.goal);
  LS.set("gender", state.gender);
  paintHomeBG();
  $("#chipGoal").textContent = "Cél: " + labelForGoal(state.goal);
  show("screen-home");
});

$$(".choice").forEach(c => {
  c.addEventListener("click", () => {
    $$(".choice").forEach(x => x.classList.remove("active"));
    c.classList.add("active");
  });
});

$("#btnEditGoal").addEventListener("click", () => {
  $("#screen-goal").style.setProperty("--bg", `url('${state.goal}.png')`);
  show("screen-goal");
});

// back buttons (data-back)
$$("[data-back]").forEach(b => b.addEventListener("click", e => show(e.currentTarget.dataset.back)));
$$("[data-target]").forEach(b => b.addEventListener("click", e => show(e.currentTarget.dataset.target)));

function labelForGoal(g){
  return g === "fogyas" ? "Fogyás" : g === "szalkasitas" ? "Szálkásítás" : "Hízás";
}
function paintHomeBG(){
  $("#screen-home").style.setProperty("--bg", `url('${state.goal}.png')`);
}

// ===== training list based on goal+gender =====
const exercises = {
  fogyas: {
    ferfi: [
      {file:"fogyas1.mp4", nev:"Burpee (férfi)", leiras:"Teljes test, erős kardió."},
      {file:"fogyas2.mp4", nev:"Switch jump mountain climber", leiras:"Magas intenzitású törzs+láberősítés."},
      {file:"fogyas3.mp4", nev:"Cardio jumping jacks", leiras:"Keringés fokozása, bemelegítés is."},
      {file:"fogyas4.mp4", nev:"Plank (váltott érintés)", leiras:"Törzs stabilizáció, vállkontroll."},
      {file:"fogyas5.mp4", nev:"Fekvőtámasz", leiras:"Mell, váll, tricepsz; zsírégető köredzésben remek."},
    ],
    no: [
      {file:"fogyas_w1.mp4", nev:"Guggolás (női)", leiras:"Comb-far erősítés."},
      {file:"fogyas_w2.mp4", nev:"Kitörés", leiras:"Láb, far; egyensúly."},
      {file:"fogyas_w3.mp4", nev:"Jumping jacks", leiras:"Kardió, bemelegítés."},
      {file:"fogyas_w4.mp4", nev:"Plank", leiras:"Has, törzs stabilitás."},
      {file:"fogyas_w5.mp4", nev:"Glute bridge", leiras:"Farizom, alsótest aktiválás."},
    ]
  },
  szalkasitas: {
    ferfi: [
      {file:"szalkasitas1.mp4", nev:"Fekvőtámasz", leiras:"Mell-tricepsz, kontrollált tempó."},
      {file:"szalkasitas2.mp4", nev:"Térdelő oldalemelés", leiras:"Vállöv stabilitás."},
      {file:"szalkasitas3.mp4", nev:"Kitörés hátra", leiras:"Quadriceps, farizom."},
      {file:"szalkasitas4.mp4", nev:"Plank vállérintéssel", leiras:"Anti-rotációs törzserő."},
      {file:"szalkasitas5.mp4", nev:"Hegymászó", leiras:"Core+cardio, zsírszázalék csökkentés."},
    ],
    no: [
      {file:"szalkasitas_w1.mp4", nev:"Sumo guggolás", leiras:"Belső comb, far."},
      {file:"szalkasitas_w2.mp4", nev:"Oldalsó kitörés", leiras:"Oldalsík erősítés."},
      {file:"szalkasitas_w3.mp4", nev:"Plank", leiras:"Törzs, derék tehermentes."},
      {file:"szalkasitas_w4.mp4", nev:"Híd tartás", leiras:"Far/hamstring aktiválás."},
      {file:"szalkasitas_w5.mp4", nev:"Hegymászó", leiras:"Core+cardio."},
    ]
  },
  hizas: {
    ferfi: [
      {file:"hizas1.mp4", nev:"Csípőemelés", leiras:"Far és hát alsó szakasz."},
      {file:"hizas2.mp4", nev:"Fekvőtámasz szűken", leiras:"Tricepsz fókusz."},
      {file:"hizas3.mp4", nev:"Guggolás", leiras:"Alap alsótest erő."},
      {file:"hizas4.mp4", nev:"Dumbbell plank pull-through", leiras:"Törzs+stabilitás (végezhető súlyzó nélkül is)."},
      {file:"hizas5.mp4", nev:"Híd váltott lábbal", leiras:"Far és hamstring."},
    ],
    no: [
      {file:"hizas_w1.mp4", nev:"Glute bridge (női)", leiras:"Farizom fókusz."},
      {file:"hizas_w2.mp4", nev:"Oldalsó támasz", leiras:"Oldalsó törzs stabilitás."},
      {file:"hizas_w3.mp4", nev:"Sumo guggolás", leiras:"Belső comb, far."},
      {file:"hizas_w4.mp4", nev:"Plank (head tap)", leiras:"Váll-stabilitás, core."},
      {file:"hizas_w5.mp4", nev:"Híd tartás", leiras:"Statikus far/hamstring."},
    ]
  }
};

function buildTrainingList(){
  const arr = exercises[state.goal][state.gender];
  const list = $("#trainingList");
  list.querySelectorAll(".card.link.item").forEach(e=>e.remove());

  arr.forEach((ex,i)=>{
    const a = document.createElement("a");
    a.className = "card link item";
    a.innerHTML = `<b>#${i+1}. gyakorlat</b><div class="muted">${ex.nev}</div>`;
    a.href = "javascript:void(0)";
    a.addEventListener("click", ()=> openExercise(i+1));
    list.appendChild(a);
  });
}

let currentExerciseIndex = 0;
let currentSet = 1, totalSets = 3, repsPerSet = 12, secPerRep = 2;
let running = false, tInt = null, restInt = null, timeLeft = 0;

function openExercise(idx){
  const arr = exercises[state.goal][state.gender];
  currentExerciseIndex = idx-1;
  const ex = arr[currentExerciseIndex];

  $("#exerciseTitle").textContent = ex.nev;
  $("#exerciseDesc").textContent = ex.leiras;
  $("#exerciseVideo").src = ex.file; // repo gyökérből
  $("#exerciseVideo").currentTime = 0;

  // alap beállítások
  $("#inpKor").value = 3;
  $("#inpRep").value = 12;
  $("#inpDur").value = 2;
  $("#exerciseTimer").textContent = "Készen állsz?";
  $("#timerNote").textContent = "";
  $("#exerciseDetail").classList.remove("hide");
  $("#btnStartTimer").disabled = false;
}

$("#btnCloseDetail").addEventListener("click", ()=>{
  stopAllTimers();
  $("#exerciseDetail").classList.add("hide");
});

$("#btnStartTimer").addEventListener("click", ()=>{
  // beolvas
  totalSets = Math.max(1, parseInt($("#inpKor").value||"1",10));
  repsPerSet = Math.max(1, parseInt($("#inpRep").value||"1",10));
  secPerRep = Math.max(1, parseInt($("#inpDur").value||"1",10));
  currentSet = 1;
  startSet();
});

$("#btnPauseTimer").addEventListener("click", ()=>{
  if(!running) return;
  running = false;
  clearInterval(tInt);
  $("#timerNote").textContent = "Szünet…";
});

$("#btnNextSet").addEventListener("click", ()=>{
  if(running) return;
  // manuális továbblépés
  startRest(1);
});

function startSet(){
  stopAllTimers();
  const totalSec = repsPerSet * secPerRep;
  timeLeft = totalSec;
  running = true;
  $("#timerNote").textContent = `Kör ${currentSet}/${totalSets} • ${repsPerSet} ismétlés`;
  tick();
  tInt = setInterval(tick, 1000);

  function tick(){
    $("#exerciseTimer").textContent = `Hátralévő idő: ${timeLeft} mp`;
    if(timeLeft <= 0){
      clearInterval(tInt);
      running = false;
      beep();
      startRest(15);
    }
    timeLeft--;
  }
}

function startRest(seconds){
  let rest = seconds;
  $("#timerNote").textContent = "Pihenő";
  $("#exerciseTimer").textContent = `Pihenő: ${rest} mp`;
  restInt = setInterval(()=>{
    rest--;
    $("#exerciseTimer").textContent = `Pihenő: ${rest} mp`;
    if(rest <= 0){
      clearInterval(restInt);
      nextSetOrExercise();
    }
  },1000);
}

function nextSetOrExercise(){
  currentSet++;
  if(currentSet <= totalSets){
    startSet();
  }else{
    // gyakorlat kész
    beep();
    $("#exerciseTimer").textContent = "Ügyes vagy! Büszke vagyok rád! ✅";
    $("#timerNote").textContent = "Léphetünk a következő gyakorlatra.";
    setTimeout(()=>{
      const arr = exercises[state.goal][state.gender];
      if(currentExerciseIndex < arr.length-1){
        openExercise(currentExerciseIndex+2);
      }else{
        state.doneWorkouts++;
        LS.set("doneWorkouts", state.doneWorkouts);
        $("#doneWorkouts").textContent = state.doneWorkouts;
        $("#exerciseDetail").classList.add("hide");
        alert("Gratulálok! 🎉 Végeztél a mai edzéssel!");
      }
    }, 1500);
  }
}

function stopAllTimers(){
  running = false;
  clearInterval(tInt); clearInterval(restInt);
}

// ===== calories =====
function refreshCalories(){
  const items = LS.get("calItems",[]);
  const wrap = $("#calList"); wrap.innerHTML="";
  let sum = 0;
  items.forEach((it,i)=>{
    sum += it.kcal;
    const row = document.createElement("div");
    row.className="item";
    row.innerHTML=`<span>${it.name}</span><span>${it.kcal} kcal</span>`;
    row.addEventListener("click", ()=>{
      items.splice(i,1); LS.set("calItems",items); refreshCalories();
    });
    wrap.appendChild(row);
  });
  $("#calTotal").textContent = sum;
}
$("#btnAddCal").addEventListener("click", ()=>{
  const n = ($("#calName").value||"").trim();
  const v = parseInt($("#calVal").value||"0",10);
  if(!n || v<=0) return;
  const arr = LS.get("calItems",[]);
  arr.push({name:n, kcal:v});
  LS.set("calItems",arr);
  $("#calName").value=""; $("#calVal").value="";
  refreshCalories();
});

// ===== stats =====
function paintStats(){
  $("#streakDays").textContent = `${LS.get("streak",0)} nap`;
  $("#doneWorkouts").textContent = LS.get("doneWorkouts",0);
}

// ===== AI chat =====
async function callStatus(){
  try{
    const r = await fetch("/.netlify/functions/ai-chat", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ ping:true })
    });
    if(!r.ok){ throw new Error("HTTP "+r.status) }
    $("#chatStatus").textContent = "✅ Backend elérhető.";
  }catch(e){
    $("#chatStatus").textContent = "❌ Backend hiba: " + e.message;
  }
}
$("#btnStatus").addEventListener("click", callStatus);

$("#btnSend").addEventListener("click", async ()=>{
  const t = ($("#chatInput").value||"").trim();
  if(!t) return;
  addMsg(t, "user");
  $("#chatInput").value="";
  addMsg("Gondolkodom…", "bot", true);
  try{
    const r = await fetch("/.netlify/functions/ai-chat", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ prompt: t, goal: state.goal, gender: state.gender })
    });
    const j = await r.json();
    replaceLastBot(j.reply ?? "Hopp, nem jött válasz.");
  }catch(e){
    replaceLastBot("Szerver hiba. Ellenőrizd az OPENAI_API_KEY változót a Netlify-ban.");
  }
});
function addMsg(text, who="bot", pending=false){
  const div = document.createElement("div");
  div.className = "msg " + (who==="user"?"user":"bot");
  div.textContent = text;
  $("#chatWindow").appendChild(div);
  $("#chatWindow").scrollTop = 1e9;
  if(pending) div.dataset.pending="1";
}
function replaceLastBot(text){
  const last = [...$$("#chatWindow .msg.bot")].reverse().find(x=>x.dataset.pending==="1");
  if(last){ last.textContent = text; last.dataset.pending="0"; }
}

// ===== init routing =====
function init(){
  // cél chip
  paintHomeBG();
  $("#chipGoal").textContent = "Cél: " + labelForGoal(state.goal);
  // listák, stitek
  buildTrainingList();
  refreshCalories();
  paintStats();
  // alap képernyő
  show("screen-splash");
}
init();
