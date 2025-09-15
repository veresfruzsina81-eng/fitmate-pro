/* ======= segédek + router ======= */
const qs=s=>document.querySelector(s), qsa=s=>[...document.querySelectorAll(s)];
const S={goal:null, gender:'no', done:+(localStorage.getItem('done')||0), streak:+(localStorage.getItem('streak')||0)};

function show(id){
  qsa('.view').forEach(v=>v.classList.remove('show'));
  qs('#v-'+id).classList.add('show');
  setBG(id);
}

function setBG(view){
  const foods=['food1.png','food2.png','food3.png'];
  const pick=()=>foods[Math.floor(Math.random()*foods.length)]||'fogyas.png';
  const m={
    splash:'kezdo.png',
    goal:'fogyas.png',
    home:(S.goal||'fogyas')+'.png',
    workout:(S.goal||'fogyas')+'.png',
    weights:(S.goal||'fogyas')+'.png',
    cal:pick(),
    perf:pick(),
    chat:'hizas.png'
  };
  qs('#bg').style.backgroundImage=
    `linear-gradient(0deg, rgba(11,15,20,.68), rgba(11,15,20,.68)), url('${m[view]||'kezdo.png'}')`;
}

/* ======= Splash → Goal ======= */
qs('#start').onclick=()=>show('goal');

/* ======= Goal pick ======= */
let tmpGoal='fogyas', tmpGender='no';
qsa('.goal-list .item').forEach(it=>{
  it.onclick=()=>{
    qsa('.goal-list .item').forEach(x=>x.classList.remove('active'));
    it.classList.add('active');
    tmpGoal=it.dataset.goal;
    qs('#bg').style.backgroundImage=`url('${tmpGoal}.png')`;
  };
});
qs('#gender').onchange=e=>tmpGender=e.target.value;
qs('#toHome').onclick=()=>{
  S.goal=tmpGoal; S.gender=tmpGender;
  localStorage.setItem('goal',S.goal); localStorage.setItem('gender',S.gender);
  qs('#goalLabel').textContent=`Cél: ${S.goal==='fogyas'?'Fogyás':S.goal==='szalkasitas'?'Szálkásítás':'Hízás'}`;
  show('home');
};

/* ======= Főmenü csempék ======= */
document.getElementById('tileBodyweight').onclick=()=>{ renderExList(); show('workout'); };
document.getElementById('tileWeights').onclick=()=>show('weights');
qsa('#v-home [data-open]').forEach(t=>t.onclick=()=>{
  const to=t.dataset.open;
  if(to==='chat') ensureChatWelcome();
  show(to);
});

/* ======= Bodyweight videóadatok – a te listáiddal ======= */
const DATA = {
  // FOGYÁS
  fogyas: {
    ferfi: [
      {t:'Terpeszugrás kézemeléssel',         f:'fogyas1.mp4',   d:'Alap kardió, bemelegítésnek is jó.'},
      {t:'Magastérdemelés kézmagasságig',     f:'fogyas2.mp4',   d:'Cardio, core.'},
      {t:'Burpee (fekvőtámaszból felugrás)',  f:'fogyas3.mp4',   d:'Teljes test, pulzusemelő.'},
      {t:'Mountain climber előre–hátra',      f:'fogyas4.mp4',   d:'Core és kardió.'},
      {t:'Guggolásból felugrás',              f:'fogyas5.mp4',   d:'Alsótest, kardió.'},
    ],
    no: [
      {t:'Guggolás terpeszben',               f:'fogyas_w1.mp4', d:'Comb és farizom.'},
      {t:'Csípőemelés fekve',                 f:'fogyas_w2.mp4', d:'Farizom, hamstring.'},
      {t:'Oldalsó ugrás keresztezve',         f:'fogyas_w3.mp4', d:'Kardió, koordináció.'},
      {t:'Guggolásból felugrás',              f:'fogyas_w4.mp4', d:'Alsótest, kardió.'},
      {t:'Ugrókötél',                          f:'fogyas_w5.mp4', d:'Állóképesség fejlesztése.'},
    ]
  },
  // SZÁLKÁSÍTÁS
  szalkasitas: {
    ferfi: [
      {t:'Fekvőtámasz',                                      f:'szalkasitas1.mp4',   d:'Mell, tricepsz.'},
      {t:'Plank',                                            f:'szalkasitas2.mp4',   d:'Core tartás.'},
      {t:'Egylábas kitörés',                                 f:'szalkasitas3.mp4',   d:'Comb és far.'},
      {t:'Oldaltartás (könyökön plank)',                     f:'szalkasitas4.mp4',   d:'Ferde hasizom.'},
      {t:'Guggolás felrúgással',                             f:'szalkasitas5.mp4',   d:'Teljes test, pulzus.'},
    ],
    no: [
      {t:'Csípőemelés fekve',                                f:'szalkasitas_w1.mp4', d:'Farizom és combhajlító.'},
      {t:'Fekvőtámaszban váltott láb előre',                 f:'szalkasitas_w2.mp4', d:'Core és kardió egyszerre.'},
      {t:'Terpeszugrás kéznyújtással',                       f:'szalkasitas_w3.mp4', d:'Kardió, vállöv.'},
      {t:'Fekvőtámasz tartás',                               f:'szalkasitas_w4.mp4', d:'Statikus core és váll.'},
      {t:'Terpesz guggolás súllyal (súlyzó nélkül is mehet)',f:'szalkasitas_w5.mp4', d:'Comb és far.'},
    ]
  },
  // HÍZÁS
  hizas: {
    ferfi: [
      {t:'Fekvőtámasz',                          f:'hizas1.mp4',   d:'Mell és tricepsz erősítése.'},
      {t:'V alakú előrehajlás',                  f:'hizas2.mp4',   d:'Core és mobilitás fejlesztése.'},
      {t:'Guggolásból felugrás',                 f:'hizas3.mp4',   d:'Robbanékonyság, alsótest.'},
      {t:'Plank kézváltással',                   f:'hizas4.mp4',   d:'Váll-stabilitás, core.'},
      {t:'Fekvőtámaszból felugrás (burpee)',     f:'hizas5.mp4',   d:'Teljes test, pulzusemelő.'},
    ],
    no: [
      {t:'Csípőemelés fekve',                    f:'hizas_w1.mp4', d:'Farizom és combhajlító.'},
      {t:'Guggolás terpeszben (folyamatos)',     f:'hizas_w2.mp4', d:'Comb és farizom.'},
      {t:'Térdelő (könnyített) fekvőtámasz',     f:'hizas_w3.mp4', d:'Könnyített mell- és karerősítés.'},
      {t:'Oldalfekvés lábemeléssel',             f:'hizas_w4.mp4', d:'Külső comb, farizom.'},
      {t:'Váltott láb plank helyzetben',         f:'hizas_w5.mp4', d:'Core és csípőmobilitás.'},
    ]
  }
};

/* ======= Lista render ======= */
function renderExList(){
  const wrap=qs('#exList'); wrap.innerHTML='';
  const arr=(DATA[S.goal]||{})[S.gender]||[];
  if(!arr.length){
    wrap.innerHTML='<div class="card pad"><b>Még nincs feltöltve ehhez a célhoz.</b></div>'; return;
  }
  arr.forEach((it,i)=>{
    const row=document.createElement('div');
    row.className='list-item';
    row.innerHTML=`
      <img class="thumb" src="${S.goal}.png" alt="">
      <div style="flex:1"><div style="font-weight:800">#${i+1}. gyakorlat</div><div class="muted">${it.t}</div></div>
      <button class="btn">Megnyit</button>`;
    row.querySelector('.btn').onclick=()=>openEx(it);
    row.onclick=()=>openEx(it);
    wrap.appendChild(row);
  });
}

/* ======= Modál + Időzítő (loop + 15 mp pihenő) ======= */
const modal=qs('#modal'), mClose=qs('#mClose'), v=qs('#exVideo'), title=qs('#exTitle'), desc=qs('#exDesc');
const iSets=qs('#iSets'), iReps=qs('#iReps'), iSec=qs('#iSec');
const bStart=qs('#bStart'), bPause=qs('#bPause'), bNext=qs('#bNext');
const clock=qs('#clock'), status=qs('#status');

let tInt=null, paused=false, curSet=1, curRep=0, totalSets=3, reps=12, secPer=2;

function mmss(s){const m=String(Math.floor(s/60)).padStart(2,'0'); const ss=String(s%60).padStart(2,'0'); return `${m}:${ss}`;}
function beep(){try{const ctx=new (window.AudioContext||window.webkitAudioContext)();const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.type='sine';o.frequency.value=900;g.gain.value=.06;o.start();setTimeout(()=>{o.stop();ctx.close()},160);}catch(e){}}
function stopTimer(){ if(tInt){clearInterval(tInt); tInt=null;} }

function openEx(it){
  title.textContent=it.t; desc.textContent=it.d||''; v.src=it.f+'?v='+Date.now();
  v.loop=true; v.muted=true; v.playsInline=true; v.play().catch(()=>{});
  iSets.value=3; iReps.value=12; iSec.value=2; clock.textContent='00:00'; status.textContent='';
  paused=false; stopTimer(); modal.classList.add('show');
}
mClose.onclick=()=>{stopTimer(); modal.classList.remove('show'); v.pause();};

bStart.onclick=()=>{
  totalSets=Math.max(1,+iSets.value||1);
  reps=Math.max(1,+iReps.value||1);
  secPer=Math.max(1,+iSec.value||1);
  curSet=1; curRep=0; paused=false; runRep();
};
bPause.onclick=()=>{ paused=!paused; bPause.textContent=paused?'Folytatás':'Szünet'; };
bNext.onclick=()=>{ stopTimer(); curSet++; if(curSet<=totalSets){ restPhase(()=>runRep()); } else { finishExercise(); } };

function runRep(){
  let left=secPer; clock.textContent=mmss(left); status.textContent=`Kör ${curSet}/${totalSets} • Ismétlés ${curRep+1}/${reps}`;
  stopTimer();
  tInt=setInterval(()=>{
    if(paused) return;
    left--; clock.textContent=mmss(left);
    if(left<=0){
      beep(); curRep++;
      if(curRep<reps){ left=secPer; status.textContent=`Kör ${curSet}/${totalSets} • Ismétlés ${curRep+1}/${reps}`; }
      else { stopTimer(); curSet++; if(curSet<=totalSets){ restPhase(()=>{curRep=0; runRep();}); } else { finishExercise(); } }
    }
  },1000);
}
function restPhase(cb){
  let r=15; status.textContent=`Pihenő ${r} mp`; clock.textContent=mmss(r);
  const ri=setInterval(()=>{
    if(paused) return;
    r--; clock.textContent=mmss(r); if(r<=0){ clearInterval(ri); beep(); cb(); }
  },1000);
}
function finishExercise(){
  status.innerHTML='🎉 <b>Ügyes vagy! Büszke vagyok rád!</b> Lépj vissza a listához és válaszd a következőt.';
  clock.textContent='00:00'; stopTimer();
  S.done++; localStorage.setItem('done',S.done); qs('#done').textContent=S.done;
  const today=new Date().toDateString(), last=localStorage.getItem('lastDone')||'';
  if(last!==today){ S.streak++; localStorage.setItem('streak',S.streak); localStorage.setItem('lastDone',today); qs('#streak').textContent=S.streak; }
}

/* ======= Kalória ======= */
const meals=JSON.parse(localStorage.getItem('meals')||'[]');
function saveMeals(){ localStorage.setItem('meals',JSON.stringify(meals)); }
function renderMeals(){ const wrap=qs('#mealList'); if(!wrap) return; wrap.innerHTML=''; let sum=0; meals.forEach((m,i)=>{ sum+=m.k; const r=document.createElement('div'); r.className='item-row'; r.innerHTML=`<span>${m.n}</span><span>${m.k} kcal</span>`; r.onclick=()=>{meals.splice(i,1);saveMeals();renderMeals();}; wrap.appendChild(r); }); const t=qs('#sumKcal'); if(t) t.innerHTML='<b>'+sum+'</b>'; }
const addBtn=qs('#addMeal'); if(addBtn){ addBtn.onclick=()=>{ const n=qs('#mealName').value.trim(); const k=+qs('#mealKcal').value||0; if(!n||!k) return; meals.push({n,k}); saveMeals(); renderMeals(); qs('#mealName').value=''; qs('#mealKcal').value=''; }; renderMeals(); }

/* ======= Teljesítmény kezdeti kiírás ======= */
const sEl=qs('#streak'), dEl=qs('#done'); if(sEl) sEl.textContent=S.streak; if(dEl) dEl.textContent=S.done;

/* ======= Chat – egyszeri üdvözlés célenként ======= */
const chatBox = qs('#chatBox');
function pushBubble(t,me=false){ const b=document.createElement('div'); b.className='bubble'+(me?' me':' bot'); b.textContent=t; chatBox.appendChild(b); chatBox.scrollTop=1e9; }
function goalWelcome(goal){ if(goal==='szalkasitas') return 'Szia! Miben segíthetek a szálkásításban? Írj: „étrend”, „edzés”, vagy „mindkettő”.'; if(goal==='hizas') return 'Szia! Miben segíthetek a hízásban? Írj: „étrend”, „edzés”, vagy „mindkettő”.'; return 'Szia! Miben segíthetek a fogyásban? Írj: „étrend”, „edzés”, vagy „mindkettő”.'; }
let welcomedKey = localStorage.getItem('welcomedGoal') || '';
function ensureChatWelcome(){ const key = S.goal || 'fogyas'; if (welcomedKey !== key) { chatBox.innerHTML = ''; pushBubble(goalWelcome(key)); welcomedKey = key; localStorage.setItem('welcomedGoal', key); } }
const sendBtn=qs('#sendChat'); if(sendBtn){ sendBtn.onclick=async()=>{ const inp=qs('#chatInput'); const q=inp.value.trim(); if(!q) return; inp.value=''; pushBubble(q,true); let reply=''; try{ const r=await fetch('/.netlify/functions/ai-chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:q,goal:S.goal,gender:S.gender})}); if(r.ok){ const j=await r.json(); reply=j.reply||''; } }catch(e){} if(!reply){ reply = 'Megvagyok! Írj, miben segítsek az edzés/étrend kapcsán. 😉'; } pushBubble(reply,false); }; }

/* ======= Indítás ======= */
(function boot(){
  S.goal=null; // mindig Splash -> Goal
  show('splash');
})();
