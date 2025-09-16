/* ===== FitMate – app.js (1/3) =====
   - Segédek, router, háttérkezelés
   - Alsó tabbar navigáció
   - Splash → Célválasztó → Főmenü
   - Főmenü csempék kattintás
   - Testsúlyos és súlyzós listák (render)
   (Modál/időzítő + Kalória+Víz + Statisztika + Chat + Speciális videók a 2/3–3/3 részekben)
*/

/* ======= Segédek + globális állapot ======= */
const qs = s => document.querySelector(s);
const qsa = s => [...document.querySelectorAll(s)];
const S = {
  goal: null,
  gender: localStorage.getItem('gender') || 'no',
  done: +(localStorage.getItem('done') || 0),
  streak: +(localStorage.getItem('streak') || 0)
};
let viewStack = [];

/* ======= Router ======= */
function show(id, push = true) {
  const cur = document.querySelector('.view.show');
  if (push && cur) viewStack.push(cur.id.replace('v-', ''));
  qsa('.view').forEach(v => v.classList.remove('show'));
  const next = qs('#v-' + id);
  if (next) next.classList.add('show');
  setBG(id);
  setActiveTab(id);
}
function goBack() {
  const prev = viewStack.pop();
  show(prev || 'home', false);
}
qsa('[data-back]').forEach(b => b.onclick = goBack);

/* ======= Háttérkép-váltás (a beépített képekkel) ======= */
function setBG(view) {
  const foods = ['food1.png', 'food2.png', 'food3.png'];
  const pick = () => foods[Math.floor(Math.random() * foods.length)] || 'fogyas.png';
  const m = {
    splash: 'kezdo.png',
    goal: 'fogyas.png',
    home: (S.goal || 'fogyas') + '.png',
    workout: (S.goal || 'fogyas') + '.png',
    weights: (S.goal || 'fogyas') + '.png',
    weightslist: (S.goal || 'fogyas') + '.png',
    cal: pick(),
    perf: pick(),
    chat: (S.goal || 'fogyas') + '.png',
    special: (S.goal || 'fogyas') + '.png'
  };
  qs('#bg').style.backgroundImage =
    `linear-gradient(0deg, rgba(255,255,255,.35), rgba(255,255,255,.55)), url('${m[view] || 'kezdo.png'}')`;
}

/* ======= Alsó tabbar ======= */
function setActiveTab(view) {
  const map = { home: 'home', workout: 'workout', special: 'special', perf: 'perf', chat: 'chat', cal: null };
  const key = map[view];
  const bar = qs('#tabbar');
  if (!bar) return;
  bar.querySelectorAll('button').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === key));
}
(function initTabbar() {
  const bar = qs('#tabbar');
  if (!bar) return;
  bar.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const to = btn.dataset.tab;
      // előkészítések
      if (to === 'workout') renderExList();
      if (to === 'perf') drawPerfChart && drawPerfChart();
      if (to === 'chat') ensureChatWelcome && ensureChatWelcome();
      if (to === 'special') openSpecialDefault && openSpecialDefault();
      show(to);
    });
  });
})();

/* ======= Splash → Célválasztó ======= */
qs('#start') && (qs('#start').onclick = () => show('goal'));

/* ======= Célválasztó kezelés ======= */
let tmpGoal = localStorage.getItem('goal') || 'fogyas';
let tmpGender = S.gender;

qsa('.goal-list .item').forEach(it => {
  if (it.dataset.goal === tmpGoal) it.classList.add('active');
  it.onclick = () => {
    qsa('.goal-list .item').forEach(x => x.classList.remove('active'));
    it.classList.add('active');
    tmpGoal = it.dataset.goal;
    qs('#bg').style.backgroundImage = `url('${tmpGoal}.png')`;
  };
});
qs('#gender') && (qs('#gender').value = (tmpGender === 'ferfi' ? 'ferfi' : 'no'));
qs('#gender') && (qs('#gender').onchange = e => tmpGender = e.target.value);

qs('#toHome') && (qs('#toHome').onclick = () => {
  S.goal = tmpGoal; S.gender = tmpGender;
  localStorage.setItem('goal', S.goal);
  localStorage.setItem('gender', S.gender);
  const lab = S.goal === 'fogyas' ? 'Fogyás' : (S.goal === 'szalkasitas' ? 'Szálkásítás' : 'Hízás');
  qs('#goalLabel') && (qs('#goalLabel').textContent = `Cél: ${lab}`);
  show('home');
});

/* ======= Főmenü csempék ======= */
qs('#tileBodyweight') && (qs('#tileBodyweight').onclick = () => { renderExList(); show('workout'); });
qs('#tileWeights') && (qs('#tileWeights').onclick = () => show('weights'));
qsa('#v-home [data-open]').forEach(t => t.onclick = () => {
  const to = t.dataset.open;
  if (to === 'chat') ensureChatWelcome && ensureChatWelcome();
  if (to === 'perf') drawPerfChart && drawPerfChart();
  if (to === 'special') openSpecialDefault && openSpecialDefault();
  show(to);
});
qs('#changeGoal') && (qs('#changeGoal').onclick = () => show('goal'));

/* ======= Testsúlyos (bodyweight) videóadatok ======= */
const DATA = {
  fogyas: {
    ferfi: [
      { t: 'Terpeszugrás kézemeléssel', f: 'fogyas1.mp4', d: 'Alap kardió, bemelegítésnek is jó.' },
      { t: 'Magastérdemelés kézmagasságig', f: 'fogyas2.mp4', d: 'Cardio, core.' },
      { t: 'Burpee (fekvőtámaszból felugrás)', f: 'fogyas3.mp4', d: 'Teljes test, pulzusemelő.' },
      { t: 'Mountain climber előre–hátra', f: 'fogyas4.mp4', d: 'Core és kardió.' },
      { t: 'Guggolásból felugrás', f: 'fogyas5.mp4', d: 'Alsótest, kardió.' },
    ],
    no: [
      { t: 'Guggolás terpeszben', f: 'fogyas_w1.mp4', d: 'Comb és farizom.' },
      { t: 'Csípőemelés fekve', f: 'fogyas_w2.mp4', d: 'Farizom, hamstring.' },
      { t: 'Oldalsó ugrás keresztezve', f: 'fogyas_w3.mp4', d: 'Kardió, koordináció.' },
      { t: 'Guggolásból felugrás', f: 'fogyas_w4.mp4', d: 'Alsótest, kardió.' },
      { t: 'Ugrókötél', f: 'fogyas_w5.mp4', d: 'Állóképesség fejlesztése.' },
    ]
  },
  szalkasitas: {
    ferfi: [
      { t: 'Fekvőtámasz', f: 'szalkasitas1.mp4', d: 'Mell, tricepsz.' },
      { t: 'Plank', f: 'szalkasitas2.mp4', d: 'Core tartás.' },
      { t: 'Egylábas kitörés', f: 'szalkasitas3.mp4', d: 'Comb és far.' },
      { t: 'Oldaltartás (könyökön plank)', f: 'szalkasitas4.mp4', d: 'Ferde hasizom.' },
      { t: 'Guggolás felrúgással', f: 'szalkasitas5.mp4', d: 'Teljes test, pulzus.' },
    ],
    no: [
      { t: 'Csípőemelés fekve', f: 'szalkasitas_w1.mp4', d: 'Farizom és combhajlító.' },
      { t: 'Fekvőtámaszban váltott láb előre', f: 'szalkasitas_w2.mp4', d: 'Core és kardió egyszerre.' },
      { t: 'Terpeszugrás kéznyújtással', f: 'szalkasitas_w3.mp4', d: 'Kardió, vállöv.' },
      { t: 'Fekvőtámasz tartás', f: 'szalkasitas_w4.mp4', d: 'Statikus core és váll.' },
      { t: 'Terpesz guggolás súllyal (súlyzó nélkül is mehet)', f: 'szalkasitas_w5.mp4', d: 'Comb és far.' },
    ]
  },
  hizas: {
    ferfi: [
      { t: 'Fekvőtámasz', f: 'hizas1.mp4', d: 'Mell és tricepsz erősítése.' },
      { t: 'V alakú előrehajlás', f: 'hizas2.mp4', d: 'Core és mobilitás fejlesztése.' },
      { t: 'Guggolásból felugrás', f: 'hizas3.mp4', d: 'Robbanékonyság, alsótest.' },
      { t: 'Plank kézváltással', f: 'hizas4.mp4', d: 'Váll-stabilitás, core.' },
      { t: 'Fekvőtámaszból felugrás (burpee)', f: 'hizas5.mp4', d: 'Teljes test, pulzusemelő.' },
    ],
    no: [
      { t: 'Csípőemelés fekve', f: 'hizas_w1.mp4', d: 'Farizom és combhajlító.' },
      { t: 'Guggolás terpeszben (folyamatos)', f: 'hizas_w2.mp4', d: 'Comb és farizom.' },
      { t: 'Térdelő (könnyített) fekvőtámasz', f: 'hizas_w3.mp4', d: 'Könnyített mell- és karerősítés.' },
      { t: 'Oldalfekvés lábemeléssel', f: 'hizas_w4.mp4', d: 'Külső comb, farizom.' },
      { t: 'Váltott láb plank helyzetben', f: 'hizas_w5.mp4', d: 'Core és csípőmobilitás.' },
    ]
  }
};

/* ======= Testsúlyos lista render ======= */
function renderExList() {
  const wrap = qs('#exList'); if (!wrap) return;
  wrap.innerHTML = '';
  const arr = (DATA[S.goal] || {})[S.gender] || [];
  if (!arr.length) {
    wrap.innerHTML = '<div class="card pad"><b>Még nincs feltöltve ehhez a célhoz.</b></div>';
    return;
  }
  arr.forEach((it, i) => {
    const row = document.createElement('div');
    row.className = 'list-item';
    row.innerHTML = `
      <img class="thumb" src="${S.goal}.png" alt="">
      <div style="flex:1">
        <div style="font-weight:800">#${i + 1}. gyakorlat</div>
        <div class="muted">${it.t}</div>
      </div>
      <button class="btn">Megnyit</button>`;
    row.querySelector('.btn').onclick = () => openEx && openEx(it);
    row.onclick = () => openEx && openEx(it);
    wrap.appendChild(row);
  });
}

/* ======= Súlyzós videóadatok (4–4) + render ======= */
const WEIGHTS = {
  m_home: [
    { t:'Goblet guggolás', f:'sulyzos_ferfi1.mp4', d:'Alsótest; törzs feszes, sarok lent.' },
    { t:'Fekvenyomás kézisúllyal (földön)', f:'sulyzos_ferfi2.mp4', d:'Mell–tricepsz; kontrollált leengedés.' },
    { t:'Evezés kézisúllyal', f:'sulyzos_ferfi3.mp4', d:'Hát; lapockazárás, semleges gerinc.' },
    { t:'Vállból nyomás állva', f:'sulyzos_ferfi4.mp4', d:'Vállöv; stabil core, kis homorítás.' },
  ],
  w_home: [
    { t:'Kitörés súllyal', f:'sulyzos_no1.mp4', d:'Comb–far; nagy lépés, törzs egyenes.' },
    { t:'Csípőemelés (hip thrust) kézisúllyal', f:'sulyzos_no2.mp4', d:'Farizom; felül tudatos megállítás.' },
    { t:'Oldalemelés vállra', f:'sulyzos_no3.mp4', d:'Vállközép; kicsi lendület, tiszta mozgás.' },
    { t:'Karhajlítás (bicepsz) kézisúllyal', f:'sulyzos_no4.mp4', d:'Könyök fix, teljes mozgástartomány.' },
  ],
  m_gym: [
    { t:'Fekvenyomás rúddal', f:'sulyzos_ferfi5.mp4', d:'Mell–tricepsz; lapocka zár, stabil pad.' },
    { t:'Felhúzás rúddal', f:'sulyzos_ferfi6.mp4', d:'Hátsó lánc; gerinc neutrális, csípőből.' },
    { t:'Mellhez húzás (lehúzás gépen)', f:'sulyzos_ferfi7.mp4', d:'Széles hát; mellkas kiemel, könyök le.' },
    { t:'Lábtoló gépen', f:'sulyzos_ferfi8.mp4', d:'Quadriceps–far; térd a lábfej irányába.' },
  ],
  w_gym: [
    { t:'Guggolás rúddal', f:'sulyzos_no5.mp4', d:'Teljes mélység, törzs feszes, sarok lent.' },
    { t:'Merevlábas felhúzás rúddal', f:'sulyzos_no6.mp4', d:'Hamstring–far; csípőhátra, neutrális gerinc.' },
    { t:'Tárogatás gépen', f:'sulyzos_no7.mp4', d:'Mell; könyök enyhén hajlítva, kontrollált.' },
    { t:'Combfeszítő gépen', f:'sulyzos_no8.mp4', d:'Quadriceps; ne rúgd ki hirtelen.' },
  ]
};

const mapWeightsBtns = {
  w_m_home: { key: 'm_home', title: 'Férfi – otthoni kézisúlyzó' },
  w_w_home: { key: 'w_home', title: 'Női – otthoni kézisúlyzó' },
  w_m_gym:  { key: 'm_gym',  title: 'Férfi – konditermi' },
  w_w_gym:  { key: 'w_gym',  title: 'Női – konditermi' },
};
Object.keys(mapWeightsBtns).forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.onclick = () => {
    const cfg = mapWeightsBtns[id];
    renderWeightsList(cfg.key, cfg.title);
    show('weightslist');
  };
});

function renderWeightsList(groupKey, titleText) {
  const titleEl = qs('#wTitle');
  const wrap = qs('#wList');
  if (titleEl) titleEl.textContent = 'Súlyzós edzés – ' + titleText;
  if (!wrap) return;
  wrap.innerHTML = '';

  const arr = WEIGHTS[groupKey] || [];
  if (!arr.length) {
    wrap.innerHTML = '<div class="card pad"><b>Nincs feltöltve ehhez a csoporthoz.</b></div>';
    return;
  }
  arr.forEach((it, i) => {
    const row = document.createElement('div');
    row.className = 'list-item';
    row.innerHTML = `
      <img class="thumb" src="${(S.goal || 'fogyas')}.png" alt="">
      <div style="flex:1">
        <div style="font-weight:800">#${i + 1}. gyakorlat</div>
        <div class="muted">${it.t}</div>
      </div>
      <button class="btn">Megnyit</button>`;
    row.querySelector('.btn').onclick = () => openEx && openEx(it);
    row.onclick = () => openEx && openEx(it);
    wrap.appendChild(row);
  });
}

/* ======= A modál/időzítő és a további részek a 2/3-ban folytatódnak ======= */
/* ======= Modál + Időzítő (loop + 15 mp pihenő) ======= */
const modal = qs('#modal'), mClose = qs('#mClose'), v = qs('#exVideo');
const title = qs('#exTitle'), desc = qs('#exDesc');
const iSets = qs('#iSets'), iReps = qs('#iReps'), iSec = qs('#iSec');
const bStart = qs('#bStart'), bPause = qs('#bPause'), bNext = qs('#bNext');
const clock = qs('#clock'), status = qs('#status');

let tInt = null, paused = false, curSet = 1, curRep = 0, totalSets = 3, reps = 12, secPer = 2;

function mmss(s){ const m=String(Math.floor(s/60)).padStart(2,'0'); const ss=String(s%60).padStart(2,'0'); return `${m}:${ss}`; }
function beep(){ try{ const ctx=new (window.AudioContext||window.webkitAudioContext)(); const o=ctx.createOscillator(), g=ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type='sine'; o.frequency.value=900; g.gain.value=.06; o.start(); setTimeout(()=>{o.stop();ctx.close()},160);}catch(e){} }
function stopTimer(){ if(tInt){ clearInterval(tInt); tInt=null; } }

function openEx(it){
  title.textContent = it.t; desc.textContent = it.d || '';
  v.src = it.f + '?v=' + Date.now();
  v.loop = true; v.muted = true; v.playsInline = true; v.play().catch(()=>{});
  iSets.value = 3; iReps.value = 12; iSec.value = 2; clock.textContent = '00:00'; status.textContent = '';
  paused=false; stopTimer(); modal.classList.add('show');
}
mClose && (mClose.onclick=()=>{ stopTimer(); modal.classList.remove('show'); v.pause(); });

bStart && (bStart.onclick=()=>{
  totalSets=Math.max(1,+iSets.value||1);
  reps=Math.max(1,+iReps.value||1);
  secPer=Math.max(1,+iSec.value||1);
  curSet=1; curRep=0; paused=false; runRep();
});
bPause && (bPause.onclick=()=>{ paused=!paused; bPause.textContent=paused?'Folytatás':'Szünet'; });
bNext && (bNext.onclick=()=>{ stopTimer(); curSet++; if(curSet<=totalSets){ restPhase(()=>runRep()); } else { finishExercise(); } });

function runRep(){
  let left=secPer; clock.textContent=mmss(left);
  status.textContent=`Kör ${curSet}/${totalSets} • Ismétlés ${curRep+1}/${reps}`;
  stopTimer();
  tInt=setInterval(()=>{
    if(paused) return;
    left--; clock.textContent=mmss(left);
    if(left<=0){
      beep(); curRep++;
      if(curRep<reps){
        left=secPer; status.textContent=`Kör ${curSet}/${totalSets} • Ismétlés ${curRep+1}/${reps}`;
      }else{
        stopTimer(); curSet++;
        if(curSet<=totalSets){ restPhase(()=>{ curRep=0; runRep(); }); }
        else{ finishExercise(); }
      }
    }
  },1000);
}
function restPhase(cb){
  let r=15; status.textContent=`Pihenő ${r} mp`; clock.textContent=mmss(r);
  const ri=setInterval(()=>{
    if(paused) return;
    r--; clock.textContent=mmss(r);
    if(r<=0){ clearInterval(ri); beep(); cb(); }
  },1000);
}
function finishExercise(){
  status.innerHTML='🎉 <b>Ügyes vagy! Büszke vagyok rád!</b>';
  clock.textContent='00:00'; stopTimer();
  // naplózás
  S.done++; localStorage.setItem('done',S.done); qs('#done') && (qs('#done').textContent=S.done);
  const todayStr=new Date().toISOString().slice(0,10);
  const hist = JSON.parse(localStorage.getItem('workHist')||'{}'); hist[todayStr]=(hist[todayStr]||0)+1;
  localStorage.setItem('workHist', JSON.stringify(hist));
  const last=localStorage.getItem('lastDone')||'';
  if(last!==todayStr){ S.streak++; localStorage.setItem('streak',S.streak); localStorage.setItem('lastDone',todayStr); qs('#streak') && (qs('#streak').textContent=S.streak); }
}

/* ======= Kalória + Víz (felturbózva) ======= */
function dayKey(d=new Date()){ return d.toISOString().slice(0,10); }
function weekDays(){
  const days=[]; const d=new Date();
  for(let i=6;i>=0;i--){ const dd=new Date(d); dd.setDate(d.getDate()-i); days.push(dayKey(dd)); }
  return days;
}

/* --- Étkezések tárolása/render --- */
function loadMealsFor(dateKey){ return JSON.parse(localStorage.getItem('meals:'+dateKey) || '[]'); }
function saveMealsFor(dateKey, arr){ localStorage.setItem('meals:'+dateKey, JSON.stringify(arr)); }
function renderMeals(){
  const today=dayKey(), wrap=qs('#mealList'); if(!wrap) return;
  let items=loadMealsFor(today);
  wrap.innerHTML='';
  let kcal=0,P=0,C=0,F=0;
  items.forEach((m,i)=>{
    kcal+=+m.k||0; P+=+m.p||0; C+=+m.c||0; F+=+m.f||0;
    const r=document.createElement('div');
    r.className='item-row';
    r.innerHTML=`<span>${m.n}</span><span>${m.k||0} kcal • P:${m.p||0}g • CH:${m.c||0}g • Zs:${m.f||0}g</span>`;
    r.onclick=()=>{ items.splice(i,1); saveMealsFor(today,items); renderMeals(); drawMacroChart(); drawWeekKcalChart(); fillWeekTable(); };
    wrap.appendChild(r);
  });
  qs('#sumKcal') && (qs('#sumKcal').textContent=kcal);
  qs('#sumP') && (qs('#sumP').textContent=P);
  qs('#sumC') && (qs('#sumC').textContent=C);
  qs('#sumF') && (qs('#sumF').textContent=F);

  // heti összes kcal
  const days=weekDays();
  let w=0; days.forEach(k=>{ const arr=loadMealsFor(k); w+=arr.reduce((s,m)=>s+(+m.k||0),0); });
  qs('#weekKcal') && (qs('#weekKcal').textContent=w);
}

qs('#addMeal') && (qs('#addMeal').onclick=()=>{
  const n=qs('#mealName').value.trim();
  const k=+qs('#mealKcal').value||0;
  const p=+qs('#mealP').value||0;
  const c=+qs('#mealC').value||0;
  const f=+qs('#mealF').value||0;
  if(!n || !k) return;
  const today=dayKey(); const arr=loadMealsFor(today);
  arr.push({n,k,p,c,f}); saveMealsFor(today,arr);
  qs('#mealName').value=''; qs('#mealKcal').value=''; qs('#mealP').value=''; qs('#mealC').value=''; qs('#mealF').value='';
  renderMeals(); drawMacroChart(); drawWeekKcalChart(); fillWeekTable();
});
qs('#clearDay') && (qs('#clearDay').onclick=()=>{ saveMealsFor(dayKey(), []); renderMeals(); drawMacroChart(); drawWeekKcalChart(); fillWeekTable(); });

/* --- Víz emlékeztető --- */
function waterKey(date=dayKey()){ return 'water:'+date; }
function waterTargetKey(){ return 'water:target'; }
function getWaterTarget(){ return +(localStorage.getItem(waterTargetKey())||2000); }
function setWaterTarget(vml){ localStorage.setItem(waterTargetKey(), Math.max(0, +vml||0)); }
function getWaterToday(){ return +(localStorage.getItem(waterKey())||0); }
function setWaterToday(vml){ localStorage.setItem(waterKey(), Math.max(0, +vml||0)); }

function updateWaterUI(){
  const target = getWaterTarget();
  const cur = getWaterToday();
  const pct = target>0 ? Math.min(100, Math.round(cur/target*100)) : 0;
  qs('#waterGoal') && (qs('#waterGoal').textContent = target);
  qs('#waterNow') && (qs('#waterNow').textContent = cur);
  qs('#waterProg') && (qs('#waterProg').style.width = pct+'%');
}
function initWaterControls(){
  const t=qs('#waterTarget'), setBtn=qs('#waterSetTarget'), a250=qs('#waterAdd250'), a500=qs('#waterAdd500'), reset=qs('#waterReset');
  if(!t||!setBtn||!a250||!a500||!reset) return;
  t.value = getWaterTarget();
  setBtn.onclick=()=>{ setWaterTarget(+t.value||2000); updateWaterUI(); drawWeekKcalChart(); fillWeekTable(); };
  a250.onclick=()=>{ setWaterToday(getWaterToday()+250); updateWaterUI(); drawWeekKcalChart(); fillWeekTable(); };
  a500.onclick=()=>{ setWaterToday(getWaterToday()+500); updateWaterUI(); drawWeekKcalChart(); fillWeekTable(); };
  reset.onclick=()=>{ setWaterToday(0); updateWaterUI(); drawWeekKcalChart(); fillWeekTable(); };
  updateWaterUI();
}

/* --- Gyors ételek gombok --- */
const QUICK_MEALS = [
  {n:'Csirkemell (150g)', k:248, p:33, c:0, f:11},
  {n:'Főtt rizs (200g)', k:260, p:5,  c:57, f:1},
  {n:'Tojás (2 db)',     k:156, p:13, c:1,  f:11},
  {n:'Zabkása (60g)',    k:228, p:8,  c:38, f:4},
  {n:'Alma (1 db)',      k:95,  p:0,  c:25, f:0}
];
function renderQuickMeals(){
  const wrap=qs('#quickMeals'); if(!wrap) return; wrap.innerHTML='';
  QUICK_MEALS.forEach(m=>{
    const b=document.createElement('button'); b.className='btn'; b.textContent=m.n;
    b.onclick=()=>{
      const today=dayKey(); const arr=loadMealsFor(today); arr.push(m);
      saveMealsFor(today,arr); renderMeals(); drawMacroChart(); drawWeekKcalChart(); fillWeekTable();
    };
    wrap.appendChild(b);
  });
}

/* --- Makró „diagram” (egyszerű canvas körtöltés) --- */
function drawMacroChart(){
  const el=qs('#macroChart'); if(!el) return;
  const ctx=el.getContext('2d'); const W=el.width, H=el.height;
  ctx.clearRect(0,0,W,H);
  const today=dayKey(); const items=loadMealsFor(today);
  const P = items.reduce((s,m)=>s+(+m.p||0),0);
  const C = items.reduce((s,m)=>s+(+m.c||0),0);
  const F = items.reduce((s,m)=>s+(+m.f||0),0);
  const sum=P+C+F||1;
  const cx=W/2, cy=H/2, r=Math.min(W,H)*0.35;
  let start=-Math.PI/2;
  const parts=[{v:P},{v:C},{v:F}];
  const fills=['#246bff','#67bfff','#ff99c6']; // nem állítunk globális stílust
  parts.forEach((p,i)=>{
    const ang= (p.v/sum)*Math.PI*2;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,start,start+ang); ctx.closePath(); ctx.fillStyle=fills[i]; ctx.fill();
    start+=ang;
  });
  ctx.fillStyle='#222'; ctx.font='14px system-ui'; ctx.textAlign='center';
  ctx.fillText(`P: ${P}g • CH: ${C}g • Zs: ${F}g`, cx, cy+r+20);
}

/* --- Heti kcal oszlopdiagram + víz táblázat --- */
function drawWeekKcalChart(){
  const el=qs('#weekKcalChart'); if(!el) return;
  const ctx=el.getContext('2d'), W=el.width, H=el.height;
  ctx.clearRect(0,0,W,H);
  const days=weekDays();
  const vals=days.map(d=>loadMealsFor(d).reduce((s,m)=>s+(+m.k||0),0));
  const max=Math.max(1,...vals);
  // tengely
  ctx.strokeStyle='rgba(0,0,0,0.15)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(40,10); ctx.lineTo(40,H-30); ctx.lineTo(W-10,H-30); ctx.stroke();
  // oszlopok
  const n=vals.length, gap=10, bw=(W-70-(n-1)*gap)/n;
  for(let i=0;i<n;i++){
    const x=40+i*(bw+gap), h=Math.round((H-50)*vals[i]/max);
    ctx.fillStyle='rgba(36,107,255,0.8)'; ctx.fillRect(x,H-30-h,bw,h);
    ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.font='12px system-ui'; ctx.textAlign='center';
    ctx.fillText(vals[i], x+bw/2, H-36-h);
    ctx.fillText(days[i].slice(5), x+bw/2, H-12);
  }
}

function fillWeekTable(){
  const tbody = qs('#weekTable tbody'); if(!tbody) return;
  const days=weekDays(); let html='';
  days.forEach(d=>{
    const kcal = loadMealsFor(d).reduce((s,m)=>s+(+m.k||0),0);
    const water = +(localStorage.getItem('water:'+d)||0);
    html += `<tr>
      <td style="padding:6px;border-bottom:1px solid var(--border)">${d}</td>
      <td style="padding:6px;border-bottom:1px solid var(--border);text-align:right">${kcal}</td>
      <td style="padding:6px;border-bottom:1px solid var(--border);text-align:right">${water}</td>
    </tr>`;
  });
  tbody.innerHTML = html;
}

/* --- Ha a Főmenüben a Kalória csempére kattintunk, előkészítünk mindent --- */
(function hookCalTile(){
  const calTile = document.querySelector('#v-home [data-open="cal"]');
  if(!calTile) return;
  calTile.addEventListener('click', ()=>{
    renderMeals(); renderQuickMeals(); initWaterControls();
    drawMacroChart(); drawWeekKcalChart(); fillWeekTable();
  });
})();

/* --- Biztonság kedvéért egyszer inicializálunk is, hogy első megnyitáskor kész legyen --- */
(function calWarmup(){
  renderQuickMeals();
  updateWaterUI();
})();
/* ======= Teljesítmény (heti grafikonok) ======= */
function drawPerfChart(){
  const canvas = qs('#perfChart'); if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0,0,W,H);

  const days = (function(){
    const arr=[]; const d=new Date();
    for(let i=6;i>=0;i--){ const dd=new Date(d); dd.setDate(d.getDate()-i); arr.push(dd.toISOString().slice(0,10)); }
    return arr;
  })();
  const hist = JSON.parse(localStorage.getItem('workHist')||'{}');
  const vals = days.map(d=>hist[d]||0);
  const max = Math.max(1, ...vals);

  // tengely
  ctx.strokeStyle='rgba(0,0,0,0.15)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(40,10); ctx.lineTo(40,H-30); ctx.lineTo(W-10,H-30); ctx.stroke();

  // oszlopok
  const n=vals.length, gap=10, bw=(W-70-(n-1)*gap)/n;
  for(let i=0;i<n;i++){
    const x=40+i*(bw+gap);
    const h=Math.round((H-50)*vals[i]/max);
    ctx.fillStyle='rgba(255,47,134,0.85)'; // pink
    ctx.fillRect(x, H-30-h, bw, h);
    ctx.fillStyle='rgba(0,0,0,0.55)';
    ctx.font='12px system-ui'; ctx.textAlign='center';
    ctx.fillText(vals[i], x+bw/2, H-36-h);
    ctx.fillText(days[i].slice(5), x+bw/2, H-12);
  }

  // KPI-k frissítése
  const streakEl=qs('#streak'), doneEl=qs('#done');
  streakEl && (streakEl.textContent = +localStorage.getItem('streak')||0);
  doneEl   && (doneEl.textContent   = +localStorage.getItem('done')||0);
}

/* Kalória + Víz kombinált (7 nap) – külön vászon */
function drawPerfKcalWater(){
  const el = qs('#perfKcalWaterChart'); if(!el) return;
  const ctx = el.getContext('2d'), W=el.width, H=el.height;
  ctx.clearRect(0,0,W,H);

  const days = (function(){
    const arr=[]; const d=new Date();
    for(let i=6;i>=0;i--){ const dd=new Date(d); dd.setDate(d.getDate()-i); arr.push(dd.toISOString().slice(0,10)); }
    return arr;
  })();

  const kcal = days.map(d=> (JSON.parse(localStorage.getItem('meals:'+d)||'[]'))
      .reduce((s,m)=>s+(+m.k||0),0));
  const water = days.map(d=> +(localStorage.getItem('water:'+d)||0));

  const maxK = Math.max(1, ...kcal);
  const maxW = Math.max(1, ...water);

  // tengely
  ctx.strokeStyle='rgba(0,0,0,0.15)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(40,10); ctx.lineTo(40,H-30); ctx.lineTo(W-10,H-30); ctx.stroke();

  // oszlopok – kcal (kék)
  const n=days.length, gap=10, bw=(W-70-(n-1)*gap)/n;
  for(let i=0;i<n;i++){
    const x=40+i*(bw+gap);
    const hk=Math.round((H-50)*kcal[i]/maxK);
    ctx.fillStyle='rgba(36,107,255,0.8)';
    ctx.fillRect(x, H-30-hk, bw, hk);
  }

  // víz – keskenyebb oszlop a közepére (lila)
  for(let i=0;i<n;i++){
    const x=40+i*(bw+gap) + bw*0.25;
    const hw=Math.round((H-50)*water[i]/maxW);
    ctx.fillStyle='rgba(140, 52, 255, 0.5)';
    ctx.fillRect(x, H-30-hw, bw*0.5, hw);
  }

  // feliratok
  ctx.fillStyle='rgba(0,0,0,0.6)';
  ctx.font='12px system-ui'; ctx.textAlign='center';
  for(let i=0;i<n;i++){
    const x=40+i*(bw+gap);
    ctx.fillText(days[i].slice(5), x+bw/2, H-12);
  }

  // kis megjegyzés
  const note = qs('#perfNote');
  if(note){
    const avgK=(kcal.reduce((a,b)=>a+b,0)/n)|0;
    const avgW=(water.reduce((a,b)=>a+b,0)/n)|0;
    note.textContent = `7 nap átlaga — Kalória: ${avgK} kcal / nap • Víz: ${avgW} ml / nap`;
  }
}

/* ======= Chat – üdvözlés és küldés ======= */
const chatBox = qs('#chatBox');
function pushBubble(t, me=false){
  if(!chatBox) return;
  const b=document.createElement('div');
  b.className='bubble'+(me?' me':' bot');
  b.textContent=t;
  chatBox.appendChild(b);
  chatBox.scrollTop=1e9;
}
function goalWelcome(goal){
  if(goal==='szalkasitas') return 'Szia! Miben segíthetek a szálkásításban? Írj: „étrend”, „edzés”, vagy „mindkettő”.';
  if(goal==='hizas') return 'Szia! Miben segíthetek a hízásban? Írj: „étrend”, „edzés”, vagy „mindkettő”.';
  return 'Szia! Miben segíthetek a fogyásban? Írj: „étrend”, „edzés”, vagy „mindkettő”.';
}
let welcomedKey = localStorage.getItem('welcomedGoal') || '';
function ensureChatWelcome(){
  const key = S.goal || 'fogyas';
  if(welcomedKey !== key){
    chatBox && (chatBox.innerHTML = '');
    pushBubble(goalWelcome(key));
    welcomedKey = key;
    localStorage.setItem('welcomedGoal', key);
  }
}
const sendBtn = qs('#sendChat');
sendBtn && (sendBtn.onclick = async ()=>{
  const inp=qs('#chatInput'); const q=(inp&&inp.value||'').trim();
  if(!q) return;
  inp.value=''; pushBubble(q,true);
  let reply='';
  try{
    const r=await fetch('/.netlify/functions/ai-chat',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({prompt:q,goal:S.goal,gender:S.gender})
    });
    if(r.ok){ const j=await r.json(); reply=j.reply||''; }
  }catch(e){}
  if(!reply){ reply='Megvagyok! Írj, miben segítsek az edzés/étrend kapcsán. 😉'; }
  pushBubble(reply,false);
});

/* ======= Speciális videók (Has/Hát/Bicepsz/Tricepsz/Láb – 10-10) ======= */
(function(){
  const CATS={
    has:{label:'Has', name:i=>`has${i}`},
    hat:{label:'Hát', name:i=>`hat${i}`},
    bicepsz:{label:'Bicepsz', name:i=>`bicepsz${i}`},
    tricepsz:{label:'Tricepsz', name:i=>`tricepsz${i}`},
    lab:{label:'Láb', name:i=>`lab${i}`}
  };
  const COUNT=10;
  const section=qs('#v-special'); if(!section) return;
  const player=qs('#sv-player'), nowEl=qs('#sv-now'), grid=qs('#sv-grid');
  const tabs=[...section.querySelectorAll('.sv-tabs [role="tab"]')];

  function playByKey(cat,i){
    const cfg=CATS[cat]; if(!cfg) return;
    const title=`${cfg.label} ${i}`;
    const src=`${cfg.name(i)}.mp4`; // gyökérből
    nowEl && (nowEl.textContent=title);
    if(player){
      player.src=src;
      const p=player.play();
      if(p && p.catch) p.catch(()=>{ /* autoplay blokkolásnál csendben */ });
    }
  }
  function renderGrid(cat){
    const cfg=CATS[cat]; if(!cfg||!grid) return;
    grid.innerHTML='';
    for(let i=1;i<=COUNT;i++){
      const b=document.createElement('button'); b.type='button'; b.className='sv-item';
      b.innerHTML=`<div class="sv-thumb"><span>${cfg.label} ${i}</span></div><div class="muted">Lejátszás</div>`;
      b.addEventListener('click',()=>playByKey(cat,i));
      grid.appendChild(b);
    }
  }
  function initFor(cat='has'){
    tabs.forEach(x=>x.setAttribute('aria-selected', x.dataset.cat===cat?'true':'false'));
    renderGrid(cat); playByKey(cat,1);
  }
  tabs.forEach(b=>b.addEventListener('click',()=>{
    const k=b.dataset.cat; tabs.forEach(x=>x.setAttribute('aria-selected', x===b?'true':'false'));
    renderGrid(k); playByKey(k,1);
  }));

  // kívülről hívható, amikor megnyitod a szekciót
  window.openSpecialDefault = ()=>{ show('special'); initFor('has'); };
})();

/* ======= Indítás ======= */
(function boot(){
  // Splash-sel indulunk, KPI-k betöltése
  qs('#done') && (qs('#done').textContent=S.done);
  qs('#streak') && (qs('#streak').textContent=S.streak);

  // ha a Teljesítményre lépünk, friss grafikonok
  const perfTile = document.querySelector('#v-home [data-open="perf"]');
  if(perfTile){ perfTile.addEventListener('click', ()=>{ drawPerfChart(); drawPerfKcalWater(); }); }
  // tabbarról is
  const bar=qs('#tabbar');
  if(bar){
    bar.querySelector('[data-tab="perf"]')?.addEventListener('click', ()=>{ drawPerfChart(); drawPerfKcalWater(); });
  }

  // Kalória nézet első előkészítése (ha valaki közvetlen odaugrik)
  if(qs('#v-cal')){ renderMeals && renderMeals(); updateWaterUI && updateWaterUI(); }

  show('splash', false);
})();
