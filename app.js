const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const cap = (t) => t ? t[0].toUpperCase()+t.slice(1) : t;

function show(id){
  $$(".screen").forEach(sec => sec.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
  if(id === "screen-menu"){ refreshUI(); }
}

const getGoal = () => localStorage.getItem("goal") || "fogyas";
const setGoal = (g) => localStorage.setItem("goal", g);
const getGender = () => localStorage.getItem("gender") || "male";
const setGender = (g) => localStorage.setItem("gender", g);

// hátterek
function refreshBackgrounds(){
  const g = getGoal();
  $("#goalBg")?.style.setProperty("--bg", `url('${g}.png')`);
  $("#workoutBg")?.style.setProperty("--bg", `url('${g}.png')`);
  $("#menuBg")?.style.setProperty("--bg", `url('${g}.png')`);
}

// UI
function refreshUI(){
  $("#currentGoal").textContent = `Cél: ${cap(getGoal())}`;
  $("#gender").value = getGender();
  renderExerciseList();
  refreshBackgrounds();
}

// fájlnév
function videoName(base, gender, index){
  const suf = (gender === "female") ? "_w" : "";
  return `${base}${suf}${index}.mp4`;
}

// edzéslista
function renderExerciseList(){
  const wrap = $("#exerciseList");
  if(!wrap) return;
  wrap.innerHTML = "";
  const goal = getGoal();
  const gender = getGender();

  for(let i=1;i<=5;i++){
    const v = videoName(goal, gender, i);
    const btn = document.createElement("button");
    btn.className = "tile";
    btn.innerHTML = `<div class="tile-title">#${i}. gyakorlat</div>
                     <div class="tile-sub">${v}</div>`;
    btn.addEventListener("click", () => openExercise(i));
    wrap.appendChild(btn);
  }
  $("#exerciseDetail").classList.add("hide");
}

// videó betöltés
function setVideo(src){
  const v = $("#exerciseVideo"), s = $("#exerciseSrc");
  if(!v||!s) return;
  s.src = `${src}?v=${Date.now()}`;
  v.load();
  v.play().catch(()=>{});
}

function openExercise(idx){
  const goal = getGoal(), gender = getGender();
  const name = videoName(goal, gender, idx);
  $("#exTitle").textContent = `#${idx}. gyakorlat`;
  setVideo(name);
  $("#exerciseDetail").classList.remove("hide");
  $("#exerciseDetail").scrollIntoView({behavior:"smooth"});
}

// időzítő
let tHandle=null, t=0, running=false;
const fmt = (s)=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
function tick(){ t++; $("#timerClock").textContent = fmt(t); }
function initTimer(){
  $("#btnStart").addEventListener("click", ()=>{
    if(!running){ running=true; $("#timerState").textContent="Fut…"; tHandle=setInterval(tick,1000); }
  });
  $("#btnPause").addEventListener("click", ()=>{
    running=false; $("#timerState").textContent="Szünet"; clearInterval(tHandle);
  });
  $("#btnFinish").addEventListener("click", ()=>{
    running=false; clearInterval(tHandle); $("#timerState").textContent="Kész! 🎉";
    const done = Number(localStorage.getItem("doneWorkouts")||"0")+1;
    localStorage.setItem("doneWorkouts", String(done));
    updateProgress();
    setTimeout(()=>{ t=0; $("#timerClock").textContent="00:00"; }, 700);
  });
  $("#backToList").addEventListener("click", ()=>{
    $("#exerciseDetail").classList.add("hide");
    $("#exerciseList")?.scrollIntoView({behavior:"smooth"});
  });
}

// kalória
function initCalories(){
  const list = $("#calList"), sum = $("#calSum");
  const key = "cal-entries";
  const load = () => JSON.parse(localStorage.getItem(key)||"[]");
  const save = (a) => localStorage.setItem(key, JSON.stringify(a));
  function render(){
    const a = load(); list.innerHTML=""; let total=0;
    a.forEach((it,i)=>{ total += Number(it.kcal)||0;
      const li=document.createElement("div"); li.className="card row spread";
      li.innerHTML = `<span>${it.food} <span class="muted">(${it.kcal} kcal)</span></span>
                      <button class="ghost" data-i="${i}">Törlés</button>`;
      list.appendChild(li);
    });
    sum.textContent = total;
    list.querySelectorAll("button").forEach(b=>b.addEventListener("click", ()=>{
      const a=load(); a.splice(Number(b.dataset.i),1); save(a); render();
    }));
  }
  $("#btnAddCal").addEventListener("click", ()=>{
    const food=$("#food").value.trim(), kcal=Number($("#kcal").value);
    if(!food || !kcal) return alert("Adj meg ételt és kcal-t!");
    const a=load(); a.push({food,kcal}); save(a); $("#food").value=""; $("#kcal").value=""; render();
  });
  render();
}

// teljesítmény
function updateProgress(){
  $("#doneWorkouts").textContent = localStorage.getItem("doneWorkouts") || "0";
  $("#streak").textContent = localStorage.getItem("streak") || "0";
}

// AI chat (status gombbal)
function initChat(){
  $("#btnSend").addEventListener("click", async ()=>{
    const input=$("#chatInput"), out=$("#chatOut");
    const text = input.value.trim(); if(!text) return;
    out.insertAdjacentHTML("beforeend", `<div class="msg me">${text}</div>`);
    input.value=""; input.focus();
    try{
      const r = await fetch("/.netlify/functions/ai-chat", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ prompt: text, goal: getGoal() })
      });
      const j = await r.json();
      out.insertAdjacentHTML("beforeend", `<div class="msg bot">${(j.reply||"Hiba.").replace(/\n/g,"<br>")}</div>`);
    }catch(e){
      out.insertAdjacentHTML("beforeend", `<div class="msg bot">Hálózati hiba.</div>`);
    }
    out.scrollTop = out.scrollHeight;
  });

  $("#btnStatus").addEventListener("click", async ()=>{
    try{
      const r = await fetch("/.netlify/functions/status");
      const j = await r.json();
      $("#chatOut").insertAdjacentHTML("beforeend",
        `<div class="msg bot">Backend: ${j.ok?"OK":"HIBA"} | OPENAI kulcs: ${j.env?.OPENAI_API_KEY?"igen":"nem"}</div>`);
    }catch(e){
      $("#chatOut").insertAdjacentHTML("beforeend", `<div class="msg bot">Státusz hiba.</div>`);
    }
  });
}

// init
window.addEventListener("DOMContentLoaded", ()=>{
  $$("[data-target]").forEach(b=>b.addEventListener("click", ()=>show(b.dataset.target)));
  $$(".goal").forEach(g=>g.addEventListener("click", ()=>{
    setGoal(g.dataset.goal);
    refreshUI();
  }));
  $("#gender").addEventListener("change", (e)=> { setGender(e.target.value); refreshUI(); });

  refreshUI();
  initTimer();
  initCalories();
  updateProgress();
  initChat();
});
