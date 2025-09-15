// mini helper
const $ = s => document.querySelector(s);
const show = id => {
  document.querySelectorAll(".screen").forEach(x=>x.classList.add("hidden"));
  $(id).classList.remove("hidden");
};

// háttér beállítása a section data-bg alapján
function applyBg(el){
  if(!el) return;
  const img = el.getAttribute("data-bg");
  if (img) {
    el.style.backgroundImage =
      `linear-gradient(180deg, rgba(0,0,0,.45), rgba(0,0,0,.65)), url('${img}')`;
  } else {
    el.style.backgroundImage = ""; // marad az alap gradiens
  }
}

// induláskor állítsuk be a splash és a goal háttérképet
applyBg($("#screen-splash"));
applyBg($("#screen-goal"));

const goalMap = { fogyas:"Fogyás", szalkasitas:"Szálkásítás", hizas:"Hízás" };

// MINDIG splash-sel indulunk
show("#screen-splash");

// Start → célválasztás
$("#btnStart").addEventListener("click", ()=> show("#screen-goal"));

// Vissza splash-re
document.querySelector("[data-nav='back-splash']").addEventListener("click", ()=> show("#screen-splash"));

// „Kihagyom” → alap Fogyás + főmenü
document.querySelector("[data-nav='skip-goal']").addEventListener("click", ()=>{
  const prof = { goal: "fogyas" };
  localStorage.setItem("fit_profile", JSON.stringify(prof));
  initHome(prof.goal);
  show("#screen-home");
});

// Cél kiválasztás
let selectedGoal = null;
document.querySelectorAll(".goal-card").forEach(card=>{
  card.addEventListener("click", ()=>{
    selectedGoal = card.dataset.goal;
    // frissítsük a cél képernyő hátterét a kiválasztott kártya képére
    $("#screen-goal").setAttribute("data-bg", card.dataset.bg || "");
    applyBg($("#screen-goal"));
    // vizuális kijelölés
    document.querySelectorAll(".goal-card").forEach(c=>c.style.outline="none");
    card.style.outline = "2px solid var(--accent2)";
    $("#btnToHome").disabled = false;
  });
});

// Tovább a főmenübe
$("#btnToHome").addEventListener("click", ()=>{
  if(!selectedGoal) return;
  const prof = { goal: selectedGoal };
  localStorage.setItem("fit_profile", JSON.stringify(prof));
  initHome(prof.goal);
  show("#screen-home");
});

// Cél módosítása a főmenüből
$("#btnChangeGoal").addEventListener("click", ()=>{
  // vissza a célképernyőre, állítsuk a hátteret a mostani célhoz
  const curr = getSavedGoal() || "fogyas";
  const bgByGoal = {
    fogyas: "assets/goal_fogyas.jpg",
    szalkasitas: "assets/goal_szalkasitas.jpg",
    hizas: "assets/goal_hizas.jpg"
  };
  $("#screen-goal").setAttribute("data-bg", bgByGoal[curr]);
  applyBg($("#screen-goal"));

  document.querySelectorAll(".goal-card").forEach(c=>c.style.outline="none");
  const chosen = document.querySelector(`.goal-card[data-goal="${curr}"]`);
  if (chosen) { chosen.style.outline = "2px solid var(--accent2)"; selectedGoal = curr; $("#btnToHome").disabled = false; }
  show("#screen-goal");
});

// Helper: kiírás a főmenü fejlécbe
function initHome(goal){
  $("#goalLabel").textContent = goalMap[goal] || "—";
}
function getSavedGoal(){
  try{
    const p = JSON.parse(localStorage.getItem("fit_profile")||"null");
    return p?.goal || null;
  }catch{ return null; }
}

// Ha volt korábbi cél, csak a feliratot frissítjük (DE splash marad a nyitó képernyő)
const prev = getSavedGoal();
if (prev) initHome(prev);
