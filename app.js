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

/* ============== ÁLLAPOT + SEGÉDEK ============== */
const S={
  goal:null,
  gender:(localStorage.getItem('gender')||'no')==='ferfi'?'ferfi':'no',
  done:+(localStorage.getItem('done')||0),
  streak:+(localStorage.getItem('streak')||0)
};
const qs=s=>document.querySelector(s), qsa=s=>[...document.querySelectorAll(s)];
function show(id){ qsa('.view').forEach(v=>v.classList.remove('show')); qs('#v-'+id).classList.add('show'); setBG(id); }

// hátterek
function setBG(view){
  const foods = ['food1.png','food2.png','food3.png']; // opcionális képek a gyökérben
  const pickFood = ()=> foods[Math.floor(Math.random()*foods.length)] || 'fogyas.png';
  const m={
    splash:'kezdo.png',
    goal:'fogyas.png',
    home:(S.goal||'fogyas')+'.png',
    workout:(S.goal||'fogyas')+'.png',
    cal: pickFood(),
    perf: pickFood(),
    chat:'hizas.png'
  };
  qs('#bg').style.backgroundImage=`linear-gradient(0deg, rgba(11,15,20,.68), rgba(11,15,20,.68)), url('${m[view]||'kezdo.png'}')`;
}

/* ============== SPLASH → GOAL ============== */
qs('#start').onclick=()=>show('goal');

/* ============== GOAL PICK ============== */
let tmpGoal='fogyas'; let tmpGender=S.gender;
qsa('.goal-list .item').forEach(it=>{
  if(it.dataset.goal===tmpGoal) it.classList.add('active');
  it.onclick=()=>{
    qsa('.goal-list .item').forEach(x=>x.classList.remove('active'));
    it.classList.add('active');
    tmpGoal=it.dataset.goal;
    qs('#bg').style.backgroundImage=`url('${tmpGoal}.png')`;
  };
});
const genderSel=qs('#gender');
genderSel.value = tmpGender; // 'no' | 'ferfi'
genderSel.onchange=e=>tmpGender=e.target.value;

qs('#toHome').onclick=()=>{
  S.goal=tmpGoal; S.gender=tmpGender;
  localStorage.setItem('goal',S.goal);
  localStorage.setItem('gender',S.gender);
  qs('#goalLabel').textContent=`Cél: ${S.goal==='fogyas'?'Fogyás':S.goal==='szalkasitas'?'Szálkásítás':'Hízás'}`;
  renderExList();
  show('home');
};

/* ============== NAV ============== */
qsa('[data-go]').forEach(b=>b.onclick=()=>show(b.dataset.go));
qsa('#v-home [data-open]').forEach(t=>t.onclick=()=>{
  const to=t.dataset.open;
  if(to==='workout') renderExList();
  show(to);
});

/* ============== GYAKORLATLISTA (FILES → HU_META) ============== */
function getExercises(){
  const goal = (['fogyas','szalkasitas','hizas'].includes(S.goal)?S.goal:'fogyas');
  const gender = (S.gender==='ferfi')?'ferfi':'no';
  const names = ((FILES[goal]||{})[gender]||[]);
  return names.map(fn=>{
    const meta = HU_META[fn] || {};
    return {file:fn, title:meta.title||fn, desc:meta.desc||''};
  });
}

function renderExList(){
  const wrap=qs('#exList'); wrap.innerHTML='';
  const arr=getExercises();
  if(!arr.length){
    wrap.innerHTML='<div class="card pad"><b>Még nincs feltöltve ehhez a célhoz.</b></div>';
    return;
  }
  arr.forEach((it,i)=>{
    const row=document.createElement('div');
    row.className='list-item';
    row.innerHTML=`
      <img class="thumb" src="${S.goal}.png" alt="">
      <div style="flex:1"><div style="font-weight:800">#${i+1}. gyakorlat</div><div class="muted">${it.title}</div></div>
      <button class="btn">Megnyit</button>`;
    row.querySelector('.btn').onclick=()=>openEx(it);
    row.onclick=()=>openEx(it);
    wrap.appendChild(row);
  });
}

/* ============== MODÁL + IDŐZÍTŐ ============== */
const modal=qs('#modal'), mClose=qs('#mClose'), v=qs('#exVideo'), title=qs('#exTitle'), desc=qs('#exDesc');
const iSets=qs('#iSets'), iReps=qs('#iReps'), iSec=qs('#iSec');
const bStart=qs('#bStart'), bPause=qs('#bPause'), bNext=qs('#bNext');
const clock=qs('#clock'), status=qs('#status');

let tInt=null, paused=false, curSet=1, curRep=0, totalSets=3, reps=12, secPer=2;

function mmss(s){const m=String(Math.floor(s/60)).padStart(2,'0'); const ss=String(s%60).padStart(2,'0'); return `${m}:${ss}`;}
function beep(){try{const ctx=new (window.AudioContext||window.webkitAudioContext)();const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.type='sine';o.frequency.value=900;g.gain.value=.06;o.start();setTimeout(()=>{o.stop();ctx.close()},160);}catch(e){}}

function openEx(it){
  title.textContent=it.title;
  desc.textContent=it.desc||'';
  v.src = it.file + '?v=' + Date.now(); // cache-törés
  v.loop = true; v.muted = true; v.playsInline = true; v.play().catch(()=>{});
  iSets.value=3; iReps.value=12; iSec.value=2; clock.textContent='00:00'; status.textContent='';
  stopTimer(); modal.classList.add('show');
}
mClose.onclick=()=>{stopTimer(); modal.classList.remove('show'); v.pause();};

function stopTimer(){ if(tInt){clearInterval(tInt); tInt=null;} }

bStart.onclick=()=>{
  totalSets=Math.max(1,+iSets.value||1);
  reps=Math.max(1,+iReps.value||1);
  secPer=Math.max(1,+iSec.value||1);
  curSet=1; curRep=0; paused=false; runRep();
};
bPause.onclick=()=>{ paused=!paused; bPause.textContent=paused?'Folytatás':'Szünet'; };
bNext.onclick=()=>{ // manuális ugrás
  stopTimer(); curSet++; if(curSet<=totalSets){ restPhase(()=>runRep()); } else { finishExercise(); }
};

function runRep(){
  let left=secPer; clock.textContent=mmss(left); status.textContent=`Kör ${curSet}/${totalSets} • Ismétlés ${curRep+1}/${reps}`;
  stopTimer();
  tInt=setInterval(()=>{
    if(paused) return;
    left--; clock.textContent=mmss(left);
    if(left<=0){
      beep(); curRep++;
      if(curRep<reps){ left=secPer; status.textContent=`Kör ${curSet}/${totalSets} • Ismétlés ${curRep+1}/${reps}`; }
      else { // kör vége
        stopTimer(); curSet++; if(curSet<=totalSets){ restPhase(()=>{curRep=0; runRep();}); } else { finishExercise(); }
      }
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

/* ============== KALÓRIA ============== */
const meals=JSON.parse(localStorage.getItem('meals')||'[]');
function saveMeals(){ localStorage.setItem('meals',JSON.stringify(meals)); }
function renderMeals(){ const wrap=qs('#mealList'); wrap.innerHTML=''; let sum=0; meals.forEach((m,i)=>{ sum+=m.k; const r=document.createElement('div'); r.className='item-row'; r.innerHTML=`<span>${m.n}</span><span>${m.k} kcal</span>`; r.onclick=()=>{meals.splice(i,1);saveMeals();renderMeals();}; wrap.appendChild(r); }); qs('#sumKcal').innerHTML='<b>'+sum+'</b>'; }
qs('#addMeal').onclick=()=>{ const n=qs('#mealName').value.trim(); const k=+qs('#mealKcal').value||0; if(!n||!k) return; meals.push({n,k}); saveMeals(); renderMeals(); qs('#mealName').value=''; qs('#mealKcal').value=''; };
renderMeals();

/* ============== CHAT ============== */
function pushBubble(t,me=false){ const b=document.createElement('div'); b.className='bubble'+(me?' me':' bot'); b.textContent=t; qs('#chatBox').appendChild(b); qs('#chatBox').scrollTop=1e9; }
qs('#sendChat').onclick=async()=>{
  const q=qs('#chatInput').value.trim(); if(!q) return;
  qs('#chatInput').value=''; pushBubble(q,true);
  let reply='';
  try{
    const r=await fetch('/.netlify/functions/ai-chat',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({prompt:q,goal:S.goal||'fogyas',gender:S.gender})
    });
    if(r.ok){ const j=await r.json(); reply=j.reply||''; }
  }catch(e){}
  if(!reply){ reply = 'Megvagyok! Írj, miben segítsek az edzés/étrend kapcsán. 😉'; }
  pushBubble(reply,false);
};

/* ============== INDÍTÁS ============== */
(function boot(){
  // mindig Splash -> Goal-lal nyitunk
  qs('#done').textContent=S.done; qs('#streak').textContent=S.streak;
  show('splash');
})();
