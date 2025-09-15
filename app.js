// ====== Segédek
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

function show(id){
  $$(".screen").forEach(s => s.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
}

function setVideo(src){
  const v = $("#exerciseVideo"); const s = $("#exerciseSrc");
  if (!v || !s) return;
  const url = `${src}?v=${Date.now()}`; // cache-buster
  s.src = url; v.load();
  v.play().catch(()=>{ /* user action needed */ });
}

// ====== Navigáció gombok
window.addEventListener("DOMContentLoaded", () => {
  // top nav
  $$(".navbtn").forEach(b => b.addEventListener("click", () => show(b.dataset.target)));
  // CTA-k
  $$("[data-target]").forEach(b => b.addEventListener("click", () => show(b.dataset.target)));

  // Célválasztó
  $$(".goal").forEach(g => g.addEventListener("click", () => {
    const goal = g.dataset.goal;
    localStorage.setItem("goal", goal);
    $("#currentGoal").textContent = `Cél: ${goal[0].toUpperCase()+goal.slice(1)}`;
    show("screen-menu");
  }));

  // Induláskor: főmenü + cél jelzés
  const saved = localStorage.getItem("goal");
  if (saved) {
    $("#currentGoal").textContent = `Cél: ${saved[0].toUpperCase()+saved.slice(1)}`;
    show("screen-menu");
  } else {
    show("screen-home");
  }

  // Backend státusz
  $("#btnStatus")?.addEventListener("click", async () => {
    const out = $("#statusOut");
    out.textContent = "Ellenőrzés…";
    try {
      const r = await fetch("/.netlify/functions/status");
      const j = await r.json();
      out.textContent = j.ok ? `OK | OPENAI kulcs: ${j.env?.OPENAI_API_KEY ? "igen" : "nem"}` : "HIBA";
    } catch(e){
      out.textContent = "Hálózati hiba";
    }
  });

  // Alap videó beállítás (ha van)
  const goal = localStorage.getItem("goal") || "fogyas";
  const gender = localStorage.getItem("gender") || "male";
  // példának: fogyas1.mp4 vagy fogyas_w1.mp4, ha nő
  const suffix = gender === "female" ? "_w" : "";
  const base = goal; // fogyas / szalkasitas / hizas
  setVideo(`${base}${suffix}1.mp4`);

  // Timer
  initTimer();

  // Kalóriaszámláló
  initCalories();

  // Chat
  initChat(goal);
});

// ====== Timer
let tHandle=null, tSec=0, running=false;
function format(sec){ const m=String(Math.floor(sec/60)).padStart(2,"0"); const s=String(sec%60).padStart(2,"0"); return `${m}:${s}`; }
function tick(){
  tSec++; $("#timerClock").textContent = format(tSec);
}
function initTimer(){
  $("#btnStart").addEventListener("click", ()=>{
    if(!running){ running=true; $("#timerState").textContent="Fut…"; tHandle=setInterval(tick,1000); }
  });
  $("#btnPause").addEventListener("click", ()=>{
    running=false; $("#timerState").textContent="Szünet"; clearInterval(tHandle);
  });
  $("#btnNext").addEventListener("click", ()=>{
    running=false; clearInterval(tHandle); tSec=0; $("#timerClock").textContent="00:00";
    $("#timerState").textContent="Következő gyakorlat!";
    // itt léptethetsz a következő videóra ha akarsz
  });
}

// ====== Kalóriák
function initCalories(){
  const list = $("#calList"); const sum = $("#calSum");
  const storeKey = "cal-entries";
  function load(){ return JSON.parse(localStorage.getItem(storeKey) || "[]"); }
  function save(arr){ localStorage.setItem(storeKey, JSON.stringify(arr)); }
  function render(){
    const arr = load();
    list.innerHTML=""; let total=0;
    arr.forEach((it,idx)=>{
      total += Number(it.kcal)||0;
      const li = document.createElement("li");
      li.innerHTML = `<span>${it.food} (${it.kcal} kcal)</span><button data-i="${idx}" class="secondary">Törlés</button>`;
      list.appendChild(li);
    });
    sum.textContent = total;
    list.querySelectorAll("button").forEach(b=>b.addEventListener("click", ()=>{
      const arr = load(); arr.splice(Number(b.dataset.i),1); save(arr); render();
    }));
  }
  $("#btnAddCal").addEventListener("click", ()=>{
    const food=$("#food").value.trim(); const kcal=Number($("#kcal").value);
    if(!food || !kcal){ alert("Adj meg ételt és kcal-t!"); return; }
    const arr=load(); arr.push({food,kcal}); save(arr); $("#food").value=""; $("#kcal").value=""; render();
  });
  render();
}

// ====== Chat
function initChat(goal){
  $("#btnSend").addEventListener("click", async ()=>{
    const input = $("#chatInput"); const out=$("#chatOut");
    const text = input.value.trim(); if(!text) return;
    out.insertAdjacentHTML("beforeend", `<div class="msg me">${text}</div>`);
    input.value = ""; input.focus();
    try{
      const r = await fetch("/.netlify/functions/ai-chat", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ prompt: text, goal })
      });
      const j = await r.json();
      if(j.reply){
        out.insertAdjacentHTML("beforeend", `<div class="msg bot">${j.reply.replace(/\n/g,"<br>")}</div>`);
      }else{
        out.insertAdjacentHTML("beforeend", `<div class="msg bot">Hiba a válaszban.</div>`);
      }
    }catch(e){
      out.insertAdjacentHTML("beforeend", `<div class="msg bot">Hálózati hiba.</div>`);
    }
    out.scrollTop = out.scrollHeight;
  });
}
