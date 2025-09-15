// helper
const $ = s => document.querySelector(s);
const show = id => {
  document.querySelectorAll(".screen").forEach(x=>x.classList.add("hidden"));
  $(id).classList.remove("hidden");
};

// read saved goal
let saved = null;
try{ saved = JSON.parse(localStorage.getItem("fit_profile")||"null"); }catch{}

const goalMap = {
  fogyas: "Fogyás",
  szalkasitas: "Szálkásítás",
  hizas: "Hízás"
};

// Splash → if we already have goal, jump home; else goal screen
$("#btnStart").addEventListener("click", ()=>{
  if(saved?.goal){ initHome(); show("#screen-home"); }
  else { show("#screen-goal"); }
});

// Topbar actions
document.querySelector("[data-nav='back-splash']").addEventListener("click", ()=> show("#screen-splash"));
document.querySelector("[data-nav='skip-goal']").addEventListener("click", ()=>{
  if(!saved) saved = {};
  saved.goal = "fogyas";
  localStorage.setItem("fit_profile", JSON.stringify(saved));
  initHome(); show("#screen-home");
});

// Select goal
let selectedGoal = null;
document.querySelectorAll(".goal-card").forEach(card=>{
  card.addEventListener("click", ()=>{
    selectedGoal = card.dataset.goal;
    // dinamikus háttércsere a screen-goal-on
    const bg = card.dataset.bg;
    const scr = $("#screen-goal");
    if(bg) scr.setAttribute("data-bg", bg);
    // vizuális kiválasztás
    document.querySelectorAll(".goal-card").forEach(c=>c.style.outline="none");
    card.style.outline = "2px solid var(--accent2)";
    $("#btnToHome").disabled = false;
  });
});

$("#btnToHome").addEventListener("click", ()=>{
  if(!selectedGoal) return;
  const prof = saved || {};
  prof.goal = selectedGoal;
  localStorage.setItem("fit_profile", JSON.stringify(prof));
  saved = prof;
  initHome();
  show("#screen-home");
});

$("#btnChangeGoal").addEventListener("click", ()=>{
  selectedGoal = saved?.goal || null;
  // állítsuk vissza a goal képernyő hátterét a kiválasztott cél szerint
  const mapBg = {
    fogyas: "assets/bg/goal_fogyas.jpg",
    szalkasitas: "assets/bg/goal_szalkasitas.jpg",
    hizas: "assets/bg/goal_hizas.jpg"
  };
  $("#screen-goal").setAttribute("data-bg", mapBg[selectedGoal] || "");
  $("#btnToHome").disabled = !selectedGoal;
  document.querySelectorAll(".goal-card").forEach(c=>c.style.outline="none");
  const chosen = document.querySelector(`.goal-card[data-goal="${selectedGoal}"]`);
  if(chosen) chosen.style.outline = "2px solid var(--accent2)";
  show("#screen-goal");
});

function initHome(){
  $("#goalLabel").textContent = goalMap[saved?.goal] || "—";
}

// first paint
if(saved?.goal){ initHome(); show("#screen-home"); } else { show("#screen-splash"); }
