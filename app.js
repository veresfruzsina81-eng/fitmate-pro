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

/* ========= Állapot ========= */
const S = {
  goal:   localStorage.getItem('goal')   || null, // splash után választ
  gender: localStorage.getItem('gender') || 'no', // 'ferfi' | 'no'
  streak: +(localStorage.getItem('streak') || 0),
  bestStreak: +(localStorage.getItem('bestStreak') || 0),
  done:   +(localStorage.getItem('done')   || 0),
};

/* ========= Segédek ========= */
const qs=s=>document.querySelector(s), qsa=s=>[...document.querySelectorAll(s)];
const bgEl = document.getElementById('bg');

function setBG(view){
  const foods = ['food1.png','food2.png','food3.png'];
  const pickFood = () => foods[Math.floor(Math.random()*foods.length)] || 'fogyas.png';
  const map = {
    splash:'kezdo.png', goal:'fogyas.png',
    home:(S.goal||'fogyas')+'.png', workout:(S.goal||'fogyas')+'.png',
    weights:(S.goal||'fogyas')+'.png',
    cal:pickFood(), perf:pickFood(), chat:(S.goal||'fogyas')+'.png'
  };
  bgEl.style.backgroundImage = `linear-gradient(0deg, rgba(11,15,20,.68), rgba(11,15,20,.68)), url('${map[view]||'kezdo.png'}')`;
}

function show(id){
  qsa('.view').forEach(v=>v.classList.remove('show'));
  qs('#v-'+id).classList.add('show');
  setBG(id);
  if(id==='chat') ensureChatWelcome();
}

function goalHu(g){
  return g==='fogyas'?'Fogyás':g==='szalkasitas'?'Szálkásítás':'Hízás';
}
function goalLabelIn(g){
  return g==='fogyas' ? 'fogyásban' : g==='szalkasitas' ? 'szálkásításban' : 'hízásban';
}

/* ========= Splash → Goal ========= */
qs('#start').onclick=()=>show('goal');

/* ========= Célválasztás ========= */
let tmpGoal='fogyas'; let tmpGender=S.gender;
qsa('.goal-list .item').forEach(it=>{
  if(it.dataset.goal===tmpGoal) it.classList.add('active');
  it.onclick=()=>{
    qsa('.goal-list .item').forEach(x=>x.classList.remove('active'));
    it.classList.add('active');
    tmpGoal=it.dataset.goal;
    setBG('goal');
  };
});
qs('#gender').value = S.gender;
qs('#gender').onchange = e => tmpGender = e.target.value;

qs('#toHome').onclick=()=>{
  S.goal=tmpGoal; S.gender=tmpGender;
  localStorage.setItem('goal',S.goal); localStorage.setItem('gender',S.gender);
  qs('#goalLabel').textContent=`Cél: ${goalHu(S.goal)}`;
  show('home');
};

/* ========= Navigáció ========= */
qsa('[data-go]').forEach(b=>b.onclick=()=>show(b.dataset.go));
qsa('#v-home [data-open]').forEach(t=>{
  t.onclick=()=>{
    const to=t.dataset.open;
    if(to==='workout') renderExerciseList();
    if(to==='chat') ensureChatWelcome();
    if(to==='perf')  renderPerf();
    if(to==='cal')   renderMeals(); // hogy biztos friss legyen
    show(to);
  };
});

/* ========= Saját testsúly – lista ========= */
function getExercisesSafe(){
  const names = ((FILES[S.goal]||{})[S.gender]||[]);
  return names.map(fn => ({file:fn, title:(HU_META[fn]?.title||fn), desc:(HU_META[fn]?.desc||'')}));
}
const exList = document.getElementById('exList');
function renderExerciseList(){
  exList.innerHTML='';
  const arr = getExercisesSafe();
  arr.forEach((ex,i)=>{
    const el = document.createElement('div');
    el.className = 'list-item';
    el.innerHTML = `
      <img class="thumb" src="${S.goal}.png" alt="">
      <div style="flex:1">
        <div style="font-weight:800">#${i+1}. gyakorlat</div>
        <div class="muted">${ex.title}</div>
      </div>
      <button class="btn">Megnyit</button>
    `;
    el.querySelector('.btn').onclick=()=>openEx(ex);
    exList.appendChild(el);
  });
}

/* ========= Modál + időzítő ========= */
const modal=qs('#modal'), mClose=qs('#mClose'), v=qs('#exVideo'), title=qs('#exTitle'), desc=qs('#exDesc');
const iSets=qs('#iSets'), iReps=qs('#iReps'), iSec=qs('#iSec');
const bStart=qs('#bStart'), bPause=qs('#bPause'), bNext=qs('#bNext');
const clock=qs('#clock'), status=qs('#status');

let tInt=null, paused=false, curSet=1, curRep=0, totalSets=3, reps=12, secPer=2;

function mmss(s){const m=String(Math.floor(s/60)).padStart(2,'0'); const ss=String(s%60).padStart(2,'0'); return `${m}:${ss}`;}
function beep(){try{const ctx=new (window.AudioContext||window.webkitAudioContext)();const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.type='sine';o.frequency.value=900;g.gain.value=.06;o.start();setTimeout(()=>{o.stop();ctx.close()},160);}catch(e){}}

function openEx(it){
  title.textContent=it.title; desc.textContent=it.desc||''; v.src=it.file+'?v='+Date.now(); v.play().catch(()=>{});
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
  // stat
  S.done++; localStorage.setItem('done',S.done);
  qs('#done').textContent=S.done;
  // streak számítás dátummal
  const today = new Date(); const key='workLog';
  const log = JSON.parse(localStorage.getItem(key)||'[]');
  const dayStr = today.toISOString().slice(0,10);
  if(!log.find(x=>x.date===dayStr)){
    log.push({date:dayStr, goal:S.goal, gender:S.gender});
    localStorage.setItem(key, JSON.stringify(log));
    // streak
    const last = localStorage.getItem('lastDone') || '';
    const yday = new Date(today); yday.setDate(today.getDate()-1);
    const yStr = yday.toISOString().slice(0,10);
    if(last===yStr || last===dayStr){ S.streak = (last===yStr ? S.streak+1 : S.streak); }
    else S.streak = 1;
    localStorage.setItem('lastDone', dayStr);
    localStorage.setItem('streak', S.streak);
    if(S.streak > S.bestStreak){ S.bestStreak = S.streak; localStorage.setItem('bestStreak', S.bestStreak); }
    qs('#streak').textContent=S.streak;
    qs('#bestStreak').textContent=S.bestStreak;
    qs('#weekCount').textContent = countThisWeek(log);
    renderHistory(log);
  }
}

/* ========= Kalória ========= */
const meals=JSON.parse(localStorage.getItem('meals')||'[]');
const mealName=qs('#mealName'), mealKcal=qs('#mealKcal'), mealList=qs('#mealList'), sumKcal=qs('#sumKcal');
function saveMeals(){ localStorage.setItem('meals',JSON.stringify(meals)); }
function renderMeals(){
  mealList.innerHTML=''; let sum=0;
  meals.forEach((m,i)=>{ sum+= +m.k || 0;
    const r=document.createElement('div'); r.className='item-row';
    r.innerHTML=`<span>${m.n}</span><span>${m.k} kcal</span>`;
    r.onclick=()=>{ meals.splice(i,1); saveMeals(); renderMeals(); };
    mealList.appendChild(r);
  });
  sumKcal.innerHTML='<b>'+sum+'</b>';
}
qs('#addMeal').onclick=()=>{ const n=mealName.value.trim(); const k=+mealKcal.value||0; if(!n||!k) return; meals.push({n,k}); saveMeals(); renderMeals(); mealName.value=''; mealKcal.value=''; };
// kalória fülek
qsa('#calTabs [data-cal]').forEach(btn=>{
  btn.onclick=()=>{
    const tab=btn.dataset.cal;
    qs('#calIntake').style.display = (tab==='intake')?'block':'none';
    qs('#calSummary').style.display = (tab==='summary')?'block':'none';
    qsa('#calTabs .btn').forEach(b=>b.classList.add('ghost'));
    btn.classList.remove('ghost');
    if(tab==='summary') updateCalSummary();
  };
});
function updateCalSummary(){
  const list = JSON.parse(localStorage.getItem('meals')||'[]');
  const total = list.reduce((s,x)=>s+(+x.k||0),0);
  qs('#mealCount').textContent=list.length;
  qs('#sumKcal2').textContent=total;
}

/* ========= Teljesítmény ========= */
function countThisWeek(log){
  const now=new Date(); const monday=new Date(now); const day=(now.getDay()+6)%7; // 0=hétfő
  monday.setDate(now.getDate()-day); const mStr=monday.toISOString().slice(0,10);
  return log.filter(x=>x.date>=mStr).length;
}
function renderHistory(log){
  const box=qs('#histList'); if(!box) return; box.innerHTML='';
  const last = [...log].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,20);
  if(!last.length){ box.innerHTML='<div class="muted">Még nincs előzmény.</div>'; return; }
  last.forEach(x=>{
    const r=document.createElement('div'); r.className='item-row';
    r.innerHTML=`<span>${x.date}</span><span>${goalHu(x.goal)} • ${x.gender==='ferfi'?'Férfi':'Nő'}</span>`;
    box.appendChild(r);
  });
}
function renderPerf(){
  const log = JSON.parse(localStorage.getItem('workLog')||'[]');
  qs('#streak').textContent=S.streak;
  qs('#bestStreak').textContent=S.bestStreak||0;
  qs('#done').textContent=S.done;
  qs('#weekCount').textContent=countThisWeek(log);
  renderHistory(log);
}
// perf fülek
qsa('#perfTabs [data-perf]').forEach(btn=>{
  btn.onclick=()=>{
    const tab=btn.dataset.perf; // 'metrics' | 'history'
    qs('#perfMetrics').style.display = (tab==='metrics')?'block':'none';
    qs('#perfHistory').style.display = (tab==='history')?'block':'none';
    qsa('#perfTabs .btn').forEach(b=>b.classList.add('ghost'));
    btn.classList.remove('ghost');
  };
});

/* ========= Chat ========= */
const chatBox = document.getElementById('chatBox');
function pushBubble(t,me=false){
  const b=document.createElement('div'); b.className='bubble'+(me?' me':' bot'); b.textContent=t; chatBox.appendChild(b); chatBox.scrollTop=1e9;
}
function ensureChatWelcome(){
  if(!chatBox || chatBox.childElementCount>0) return;
  pushBubble(`Szia! Miben segíthetek a ${goalLabelIn(S.goal||'fogyas')}?`, false);
}
qs('#sendChat').onclick=async()=>{
  const inp=qs('#chatInput'); const q=inp.value.trim(); if(!q) return; inp.value=''; pushBubble(q,true);
  let reply='';
  try{
    const r=await fetch('/.netlify/functions/ai-chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:q,goal:S.goal,gender:S.gender})});
    if(r.ok){ const j=await r.json(); reply=j.reply||''; }
  }catch(e){}
  if(!reply) reply='Megvagyok! Írj, miben segítsek az edzés/étrend kapcsán. 😉';
  pushBubble(reply,false);
};

/* ========= Indítás ========= */
(function boot(){
  // mindig Splash -> Goal-lal nyitunk
  qs('#goalLabel').textContent = S.goal ? `Cél: ${goalHu(S.goal)}` : 'Cél: –';
  renderMeals();
  renderPerf();
  show('splash');
})();
