/* ========= HU META: fájlnév -> magyar cím + leírás ========= */
const HU_META = {
  // Hízás – Férfi
  'hizas1.mp4':   { title: 'Fekvőtámasz', desc: 'Mell és tricepsz erősítése.' },
  'hizas2.mp4':   { title: 'V alakú előrehajlás', desc: 'Core és mobilitás fejlesztése.' },
  'hizas3.mp4':   { title: 'Guggolásból felugrás', desc: 'Robbanékonyság, alsótest.' },
  'hizas4.mp4':   { title: 'Plank kézváltással', desc: 'Váll-stabilitás, core.' },
  'hizas5.mp4':   { title: 'Fekvőtámaszból felugrás (burpee)', desc: 'Teljes test, pulzusemelő.' },

  // Hízás – Nő
  'hizas_w1.mp4': { title: 'Csípőemelés fekve', desc: 'Farizom és combhajlító.' },
  'hizas_w2.mp4': { title: 'Guggolás terpeszben', desc: 'Comb és farizom, folyamatos.' },
  'hizas_w3.mp4': { title: 'Térdelő fekvőtámasz', desc: 'Könnyített mell- és karerősítés.' },
  'hizas_w4.mp4': { title: 'Oldalfekvés lábemeléssel', desc: 'Külső comb, farizom.' },
  'hizas_w5.mp4': { title: 'Váltott láb plank helyzetben', desc: 'Core és csípőmobilitás.' },

  // Szálkásítás – Férfi
  'szalkasitas1.mp4': { title: 'Fekvőtámasz', desc: 'Mell és tricepsz.' },
  'szalkasitas2.mp4': { title: 'Plank', desc: 'Core tartás.' },
  'szalkasitas3.mp4': { title: 'Egylábas kitörés', desc: 'Comb és far.' },
  'szalkasitas4.mp4': { title: 'Oldaltartás (könyökön plank)', desc: 'Ferde hasizom.' },
  'szalkasitas5.mp4': { title: 'Guggolás felrúgással', desc: 'Teljes test, pulzus.' },

  // Szálkásítás – Nő
  'szalkasitas_w1.mp4': { title: 'Csípőemelés fekve', desc: 'Farizom és combhajlító.' },
  'szalkasitas_w2.mp4': { title: 'Fekvőtámaszban váltott láb előre', desc: 'Core és kardió egyszerre.' },
  'szalkasitas_w3.mp4': { title: 'Terpeszugrás kéznyújtással', desc: 'Kardió, vállöv.' },
  'szalkasitas_w4.mp4': { title: 'Fekvőtámasz tartás', desc: 'Statikus core és váll.' },
  'szalkasitas_w5.mp4': { title: 'Terpesz guggolás súllyal', desc: 'Comb és far; súlyzó nélkül is végezhető.' },

  // Fogyás – Férfi
  'fogyas1.mp4': { title: 'Terpeszugrás kézemeléssel', desc: 'Alap kardió, bemelegítésnek is jó.' },
  'fogyas2.mp4': { title: 'Magastérdemelés kézmagasságig', desc: 'Cardio, core.' },
  'fogyas3.mp4': { title: 'Burpee', desc: 'Teljes test, pulzusemelő.' },
  'fogyas4.mp4': { title: 'Mountain climber előre-hátra', desc: 'Core és kardió.' },
  'fogyas5.mp4': { title: 'Guggolásból felugrás', desc: 'Alsótest, kardió.' },

  // Fogyás – Nő
  'fogyas_w1.mp4': { title: 'Guggolás terpeszben', desc: 'Comb és farizom.' },
  'fogyas_w2.mp4': { title: 'Csípőemelés fekve', desc: 'Farizom, hamstring.' },
  'fogyas_w3.mp4': { title: 'Oldalsó ugrás keresztezve', desc: 'Kardió, koordináció.' },
  'fogyas_w4.mp4': { title: 'Guggolásból felugrás', desc: 'Alsótest, kardió.' },
  'fogyas_w5.mp4': { title: 'Ugrókötél', desc: 'Állóképesség fejlesztése.' }
};

/* ========= Fix fájllisták ========= */
const FILES = {
  fogyas: {
    ferfi: ['fogyas1.mp4','fogyas2.mp4','fogyas3.mp4','fogyas4.mp4','fogyas5.mp4'],
    no:    ['fogyas_w1.mp4','fogyas_w2.mp4','fogyas_w3.mp4','fogyas_w4.mp4','fogyas_w5.mp4']
  },
  szalkasitas: {
    ferfi: ['szalkasitas1.mp4','szalkasitas2.mp4','szalkasitas3.mp4','szalkasitas4.mp4','szalkasitas5.mp4'],
    no:    ['szalkasitas_w1.mp4','szalkasitas_w2.mp4','szalkasitas_w3.mp4','szalkasitas_w4.mp4','szalkasitas_w5.mp4']
  },
  hizas: {
    ferfi: ['hizas1.mp4','hizas2.mp4','hizas3.mp4','hizas4.mp4','hizas5.mp4'],
    no:    ['hizas_w1.mp4','hizas_w2.mp4','hizas_w3.mp4','hizas_w4.mp4','hizas_w5.mp4']
  }
};

/* ========= Állapot + segédek ========= */
const S = {
  goal: null,
  gender: 'no',
  done: +(localStorage.getItem('done')||0),
  streak:+(localStorage.getItem('streak')||0)
};
const qs=s=>document.querySelector(s), qsa=s=>[...document.querySelectorAll(s)];
function show(id){ qsa('.view').forEach(v=>v.classList.remove('show')); qs('#v-'+id).classList.add('show'); setBG(id); }
function setBG(view){
  const m={splash:'kezdo.png', goal:'fogyas.png', home:(S.goal||'fogyas')+'.png', workout:(S.goal||'fogyas')+'.png', cal:'hizas.png', perf:'szalkasitas.png', chat:'fogyas.png'};
  qs('#bg').style.backgroundImage=`url('${m[view]||'kezdo.png'}')`;
}

/* ========= Splash → Goal ========= */
qs('#start').onclick=()=>show('goal');

/* ========= Célválasztás ========= */
let tmpGoal='fogyas', tmpGender='no';
qsa('.goal-list .item').forEach(it=>{
  it.onclick=()=>{ qsa('.goal-list .item').forEach(x=>x.classList.remove('active')); it.classList.add('active'); tmpGoal=it.dataset.goal; qs('#bg').style.backgroundImage=`url('${tmpGoal}.png')`; };
});
qs('#gender').onchange=e=>tmpGender=e.target.value;
qs('#toHome').onclick=()=>{
  S.goal=tmpGoal; S.gender=tmpGender;
  localStorage.setItem('goal',S.goal); localStorage.setItem('gender',S.gender);
  qs('#goalLabel').textContent=`Cél: ${S.goal==='fogyas'?'Fogyás':S.goal==='szalkasitas'?'Szálkásítás':'Hízás'}`;
  renderExList(); ensureChatWelcome(true); show('home');
};

/* ========= Navigáció ========= */
qsa('[data-go]').forEach(b=>b.onclick=()=>show(b.dataset.go));
qsa('#v-home [data-open]').forEach(t=>t.onclick=()=>{
  const to=t.dataset.open;
  if(to==='workout') renderExList();
  show(to);
});

/* ========= Gyakorlat lista ========= */
function getExercises(){
  const names = ((FILES[S.goal]||{})[S.gender]||[]);
  return names.map(fn=>({file:fn, title:(HU_META[fn]||{}).title||fn, desc:(HU_META[fn]||{}).desc||''}));
}
function renderExList(){
  const wrap=qs('#exList'); if(!wrap) return; wrap.innerHTML='';
  const arr=getExercises();
  if(!arr.length){ wrap.innerHTML='<div class="card pad"><b>Még nincs feltöltve ehhez a célhoz.</b></div>'; return; }
  arr.forEach((it,i)=>{
    const row=document.createElement('div');
    row.className='list-item';
    row.innerHTML=`
      <img class="thumb" src="${S.goal}.png" alt="">
      <div style="flex:1"><div style="font-weight:800">#${i+1}. gyakorlat</div><div class="muted">${it.title}</div></div>
      <button class="btn">Megnyit</button>`;
    row.querySelector('.btn').onclick=()=>openEx(it);
    wrap.appendChild(row);
  });
}

/* ========= Modál + Időzítő (stabil, garantált 15 mp pihenő) ========= */
const modal=qs('#modal'), mClose=qs('#mClose'), v=qs('#exVideo'), title=qs('#exTitle'), desc=qs('#exDesc');
const iSets=qs('#iSets'), iReps=qs('#iReps'), iSec=qs('#iSec');
const bStart=qs('#bStart'), bPause=qs('#bPause'), bNext=qs('#bNext');
const clock=qs('#clock'), statusEl=qs('#status');

let tick=null, phase='idle'; // 'rep' | 'rest' | 'idle' | 'done'
let curSet=1, curRep=0, totalSets=3, reps=12, secPer=2, paused=false;

function mmss(s){ const m=String(Math.floor(s/60)).padStart(2,'0'); const ss=String(s%60).padStart(2,'0'); return `${m}:${ss}`; }
function tone(){ try{ const C=new (window.AudioContext||window.webkitAudioContext)(); const o=C.createOscillator(), g=C.createGain(); o.connect(g); g.connect(C.destination); o.type='sine'; o.frequency.value=900; g.gain.value=.06; o.start(); setTimeout(()=>{o.stop();C.close()},170);}catch(e){} }
function setClock(s){ clock.textContent=mmss(s); }

function stopTick(){ if(tick){ clearInterval(tick); tick=null; } }

// belső futtató – általános visszaszámláló
function runCountdown(seconds, onEnd, label){
  let left=seconds; setClock(left); statusEl.textContent=label; stopTick();
  tick=setInterval(()=>{
    if(!paused){ left--; setClock(left); }
    if(left<=0){ stopTick(); tone(); onEnd&&onEnd(); }
  },1000);
}

function doRep(){
  phase='rep';
  curRep++;
  runCountdown(secPer, ()=>{
    if(curRep<reps){ doRep(); }
    else { // kör vége -> pihenő
      curRep=0;
      if(curSet<=totalSets){ doRest(); }
    }
  }, `Kör ${curSet}/${totalSets} • Ismétlés ${curRep}/${reps}`);
}

function doRest(){
  phase='rest';
  runCountdown(15, ()=>{
    if(curSet<totalSets){ curSet++; doRep(); }
    else { finishExercise(); }
  }, `Pihenő 15 mp • Kész kör: ${curSet}/${totalSets}`);
}

function startTimer(){
  totalSets = Math.max(1,+iSets.value||1);
  reps      = Math.max(1,+iReps.value||1);
  secPer    = Math.max(1,+iSec.value||1);
  curSet=1; curRep=0; paused=false;
  doRep();
}

function finishExercise(){
  phase='done'; stopTick(); setClock(0);
  statusEl.innerHTML='🎉 <b>Ügyes vagy! Büszke vagyok rád!</b> Válaszd a következő gyakorlatot.';
  S.done++; localStorage.setItem('done',S.done); qs('#done').textContent=S.done;
  const today=new Date().toDateString(), last=localStorage.getItem('lastDone')||'';
  if(last!==today){ S.streak++; localStorage.setItem('streak',S.streak); localStorage.setItem('lastDone',today); qs('#streak').textContent=S.streak; }
}

function openEx(it){
  title.textContent=it.title; desc.textContent=it.desc||''; v.src=it.file+'?v='+Date.now(); v.play().catch(()=>{});
  iSets.value=3; iReps.value=12; iSec.value=2; setClock(0); statusEl.textContent='';
  stopTick(); phase='idle'; modal.classList.add('show');
}
mClose.onclick=()=>{ stopTick(); modal.classList.remove('show'); v.pause(); };

bStart.onclick=()=>{ if(phase==='rep'||phase==='rest'){ /* már fut */ } else { startTimer(); } };
bPause.onclick=()=>{ paused=!paused; bPause.textContent=paused?'Folytatás':'Szünet'; };
bNext.onclick=()=>{ // kézi ugrás a következő körre
  stopTick();
  if(phase==='rep' || phase==='rest'){ // befejezzük ezt a kört
    if(curSet<totalSets){ curSet++; curRep=0; doRep(); }
    else { finishExercise(); }
  }
};

/* ========= Kalória ========= */
const meals=JSON.parse(localStorage.getItem('meals')||'[]');
function saveMeals(){ localStorage.setItem('meals',JSON.stringify(meals)); }
function renderMeals(){ const wrap=qs('#mealList'); wrap.innerHTML=''; let sum=0; meals.forEach((m,i)=>{ sum+=m.k; const r=document.createElement('div'); r.className='item-row'; r.innerHTML=`<span>${m.n}</span><span>${m.k} kcal</span>`; r.onclick=()=>{meals.splice(i,1);saveMeals();renderMeals();}; wrap.appendChild(r); }); qs('#sumKcal').innerHTML='<b>'+sum+'</b>'; }
qs('#addMeal').onclick=()=>{ const n=qs('#mealName').value.trim(); const k=+qs('#mealKcal').value||0; if(!n||!k) return; meals.push({n,k}); saveMeals(); renderMeals(); qs('#mealName').value=''; qs('#mealKcal').value=''; };
renderMeals();

/* ========= Chat (célhoz igazított üdvözlés + „mindkettő” felismerés) ========= */
const chatBox = document.getElementById('chatBox');
function pushBubble(t, me=false){ const b=document.createElement('div'); b.className='bubble'+(me?' me':' bot'); b.textContent=t; chatBox.appendChild(b); chatBox.scrollTop=1e9; }
function goalWelcome(g){ if(g==='hizas') return 'Szia! Miben segíthetek a hízásban / tömegnövelésben?'; if(g==='szalkasitas') return 'Szia! Miben segíthetek a szálkásításban?'; return 'Szia! Miben segíthetek a fogyásban?'; }
function ensureChatWelcome(reset=false){ if(reset) chatBox.innerHTML=''; if(chatBox.childElementCount===0) pushBubble(goalWelcome(S.goal||'fogyas')); }

function dietAdvice(goal){
  if(goal==='hizas') return 'Tömegnöveléshez: +250–400 kcal/nap többlet, 1.6–2.2 g/ttkg fehérje, 2–3 főétkezés + 2 snack, teljes értékű szénhidrát és jó zsírok.';
  if(goal==='szalkasitas') return 'Szálkásításhoz: napi 300–500 kcal deficit, ~2 g/ttkg fehérje, sok zöldség, 30–40 ml/ttkg folyadék.';
  return 'Fogyáshoz: 400–600 kcal deficit, 1.6–2.0 g/ttkg fehérje, rostos köretek (rizs, bulgur, zöldség), cukros italok off.';
}
function workoutAdvice(goal){
  if(goal==='hizas') return 'Tömegnöveléshez: heti 3–5 erősítés, 8–12 ism., 3–5 sorozat; alapgyakorlatok; pihenő 60–120 mp.';
  if(goal==='szalkasitas') return 'Szálkásításhoz: heti 3 erősítés + 2–3 HIIT/kardió; köredzés 30–45 perc; pihenők 30–60 mp.';
  return 'Fogyáshoz: heti 3 erősítés + 3× 20–30 perc kardió (séta/futás/bringá); nagy mozdulatok, köredzés.';
}
function bothAdvice(goal){ return dietAdvice(goal)+' '+workoutAdvice(goal); }

document.getElementById('sendChat').onclick=async()=>{
  const inp=qs('#chatInput'); const q=(inp.value||'').trim(); if(!q) return; inp.value=''; pushBubble(q,true);
  const text=q.toLowerCase();
  const wantsDiet=/étrend|kaja|kal(ó|o)ria|étkez|feh(é|e)rje/.test(text);
  const wantsWork=/edz(é|e)s|gyakorlat|edz(ő|o)terem|sorozat|ism(é|e)tl(é|e)s/.test(text);
  const wantsBoth=/mindkett(ő|o)/.test(text)||(wantsDiet&&wantsWork);
  let reply = wantsBoth ? bothAdvice(S.goal||'fogyas') : wantsDiet ? dietAdvice(S.goal||'fogyas') : wantsWork ? workoutAdvice(S.goal||'fogyas') : (goalWelcome(S.goal||'fogyas')+' Írj: „étrend”, „edzés”, vagy „mindkettő”.');
  pushBubble(reply,false);

  // opcionális: backend plusz válasz
  try{
    const r=await fetch('/.netlify/functions/ai-chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:q,goal:S.goal,gender:S.gender})});
    if(r.ok){ const j=await r.json(); if(j && j.reply) pushBubble(j.reply,false); }
  }catch(e){}
};

/* ========= Indítás ========= */
(function boot(){
  S.goal=null; // mindig Splash -> Goal
  qs('#done').textContent=S.done; qs('#streak').textContent=S.streak;
  ensureChatWelcome(true);
  show('splash');
})();
