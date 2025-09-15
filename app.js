const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function show(selector){
  $$(".screen").forEach(el => el.classList.remove("active"));
  const el = $(selector);
  if (el) el.classList.add("active");
}

// ---- Indítás: mindig Splash képernyő ----
document.addEventListener("DOMContentLoaded", () => {
  show("#screen-splash");
});

/* Navigáció gombok */
$("#btn-start").addEventListener("click", () => {
  show("#screen-goal");
});
$("#btn-goal-next").addEventListener("click", () => {
  show("#screen-mainmenu");
});

$$(".btn-back-menu").forEach(btn => {
  btn.addEventListener("click", () => {
    show("#screen-mainmenu");
  });
});

/* Menü gombok */
$("#btn-edzes").addEventListener("click", () => {
  show("#screen-edzes");
});
$("#btn-kaloria").addEventListener("click", () => {
  show("#screen-kaloria");
});
$("#btn-teljesitmeny").addEventListener("click", () => {
  show("#screen-teljesitmeny");
});
$("#btn-chat").addEventListener("click", () => {
  show("#screen-chat");
});

/* ---- Egyszerű Kalóriaszámláló ---- */
const kaloriaList = $("#kaloria-list");
const kaloriaSum = $("#kaloria-sum");

$("#btn-kaloria-add").addEventListener("click", () => {
  const nev = $("#kaloria-nev").value.trim();
  const kcal = parseInt($("#kaloria-kcal").value.trim());
  if (!nev || isNaN(kcal)) return;

  const li = document.createElement("li");
  li.textContent = `${nev} – ${kcal} kcal`;
  kaloriaList.appendChild(li);

  let sum = parseInt(kaloriaSum.textContent);
  kaloriaSum.textContent = sum + kcal;

  $("#kaloria-nev").value = "";
  $("#kaloria-kcal").value = "";
});

/* ---- Edzés Időzítő ---- */
let timer = null;
let timeLeft = 30; // másodperc / alap

const edzTimer = $("#edzes-timer");
const edzStatus = $("#edzes-status");

function updateTimer() {
  edzTimer.textContent = `00:${timeLeft < 10 ? "0" : ""}${timeLeft}`;
}

$("#btn-edzes-start").addEventListener("click", () => {
  clearInterval(timer);
  timeLeft = 30;
  updateTimer();
  edzStatus.textContent = "Edzés folyamatban...";
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timer);
      edzStatus.textContent = "Kész! 🎉 Pihenj egy kicsit!";
    }
  }, 1000);
});

$("#btn-edzes-pause").addEventListener("click", () => {
  clearInterval(timer);
  edzStatus.textContent = "Szünet...";
});

$("#btn-edzes-next").addEventListener("click", () => {
  clearInterval(timer);
  edzStatus.textContent = "Gratulálok! Léphetünk a következő gyakorlathoz.";
  edzTimer.textContent = "00:00";
});
