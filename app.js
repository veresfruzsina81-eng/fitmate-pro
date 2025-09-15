/* ========= HOTFIX blokk: magyar címek + fájlhoz kötött meta ========= */

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

// ---------- állapot ----------
const state = {
  goal:   localStorage.getItem('goal')   || 'fogyas', // 'fogyas' | 'szalkasitas' | 'hizas'
  gender: localStorage.getItem('gender') || 'no',     // 'ferfi' | 'no'
  streak: +(localStorage.getItem('streak') || 0),
  done:   +(localStorage.getItem('done')   || 0),
};

// ---------- háttér képek váltása (random kaja háttér a cal/perf nézetben) ----------
const bgEl = document.getElementById('bg');
function setBackgroundFor(section) {
  const foods = ['food1.png','food2.png','food3.png']; // tölts fel ilyen nevű képeket a gyökérbe
  const pickFood = () => foods[Math.floor(Math.random()*foods.length)] || 'fogyas.png';

  const map = {
    splash:  'kezdo.png',
    goal:    'fogyas.png',
    home:    state.goal + '.png',
    workout: state.goal + '.png',
    cal:     pickFood(),
    perf:    pickFood(),
    chat:    'hizas.png',
  };
  const img = map[section] || 'kezdo.png';
  bgEl.style.backgroundImage =
    `linear-gradient(0deg, rgba(11,15,20,.68), rgba(11,15,20,.68)), url('${img}')`;
}

// ---------- nézet váltó ----------
function show(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('show'));
  document.getElementById('view-'+id).classList.add('show');
  setBackgroundFor(id);
}
document.getElementById('btnStart').onclick    = ()=>show('goal');
document.getElementById('btnToSplash').onclick  = ()=>show('splash');
document.querySelectorAll('.back').forEach(b=>{ b.onclick = ()=> show(b.dataset.back); });

// ---------- célválasztás ----------
const goalCards = document.querySelectorAll('.goal-card');
goalCards.forEach(c=>{
  if(c.dataset.goal===state.goal) c.classList.add('active');
  c.onclick = ()=>{
    goalCards.forEach(x=>x.classList.remove('active'));
    c.classList.add('active');
    state.goal = c.dataset.goal;
  };
});
const genderPick = document.getElementById('genderPick');
genderPick.value = state.gender;
genderPick.onchange = e => state.gender = e.target.value;

document.getElementById('btnToHome').onclick = ()=>{
  localStorage.setItem('goal', state.goal);
  localStorage.setItem('gender', state.gender);
  hydrateHome();
  renderExerciseList();
  show('home');
};

// ---------- Főmenü feltöltés ----------
function hydrateHome(){
  document.getElementById('currentGoalLbl').textContent =
    (state.goal==='fogyas'?'Fogyás':state.goal==='szalkasitas'?'Szálkásítás':'Hízás');
}
hydrateHome();
document.querySelectorAll('#view-home .card').forEach(btn=>{
  btn.onclick = ()=>show(btn.dataset.open);
});

// ---------- Gyakorlatok (sorrend a megbeszéltek szerint) ----------
const sx = g => g==='no' ? '_w' : ''; // női: _w
const exercises = {
  hizas: [
    { title: 'Csípőemelés',                   file: g => `hizas${sx(g)}1.mp4`, desc:'Far és hamstring erősítés.' },
    { title: 'Négyütemű fekvőtámasz',         file: g => `hizas${sx(g)}2.mp4`, desc:'Teljes test állóképesség.' },
    { title: 'Guggolás',                      file: g => `hizas${sx(g)}3.mp4`, desc:'Alsótest, törzs feszítése.' },
    { title: 'Plank',                         file: g => `hizas${sx(g)}4.mp4`, desc:'Törzs statikus erősítés.' },
    { title: 'Glute bridge',                  file: g => `hizas${sx(g)}5.mp4`, desc:'Csípőnyújtás, far aktiválás.' },
  ],
  fogyas: [
    { title: 'Terpeszugrás kézemeléssel',     file: g => `fogyas${sx(g)}1.mp4`, desc:'Kardió, bemelegítés.' },
    { title: 'Magastérdemelés kézmagasságig', file: g => `fogyas${sx(g)}2.mp4`, desc:'Cardio + core.' },
    { title: 'Burpee',                        file: g => `fogyas${sx(g)}3.mp4`, desc:'Pulzusemelő, teljes test.' },
    { title: 'Mountain climber előre-hátra',  file: g => `fogyas${sx(g)}4.mp4`, desc:'Core és kardió.' },
    { title: 'Guggolásból felugrás',          file: g => `fogyas${sx(g)}5.mp4`, desc:'Alsótest, kardió.' },
  ],
  szalkasitas: [
    { title: 'Fekvőtámasz',                           file: g => `szalkasitas${sx(g)}1.mp4`, desc:'Mell, tricepsz, core.' },
    { title: 'Plank',                                  file: g => `szalkasitas${sx(g)}2.mp4`, desc:'Törzs statikus tartás.' },
    { title: 'Egylábas kitörés',                       file: g => `szalkasitas${sx(g)}3.mp4`, desc:'Láb és egyensúly.' },
    { title: 'Oldaltartás (könyökön plank)',           file: g => `szalkasitas${sx(g)}4.mp4`, desc:'Ferde hasizom.' },
    { title: 'Guggolás felrúgással',                   file: g => `szalkasitas${sx(g)}5.mp4`, desc:'Teljes test, pulzus.' },
  ],
};

/* ---------- Biztos listaépítés: a fenti listát HU_META-val normalizáljuk ---------- */
function getExercisesSafe() {
  const goal   = state.goal;     // 'fogyas' | 'szalkasitas' | 'hizas'
  const gender = state.gender;   // 'ferfi' | 'no'
  const base = (exercises[goal] || []);

  return base.map(ex => {
    const fname = typeof ex.file === 'function' ? ex.file(gender) : ex.file;
    const meta  = HU_META[fname] || {};
    return {
      title: meta.title || ex.title || fname,
      desc:  meta.desc  || ex.desc  || '',
      file:  fname
    };
  });
}

/* ---------- Lista render – EZ AZ EGY fut (nincs duplikáció) ---------- */
const exList = document.getElementById('exerciseList');
function renderExerciseList(){
  exList.innerHTML = '';
  const arr = getExercisesSafe();
  arr.forEach((ex, i)=>{
    const el = document.createElement('div');
    el.className = 'exercise-item';
    el.innerHTML = `
      <div class="title">#${i+1}. gyakorlat</div>
      <div class="muted">${ex.title}</div>
      <button class="open-btn">Megnyit</button>
    `;
    el.querySelector('.open-btn').onclick = (e)=>{ e.stopPropagation(); openExerciseModal(ex); };
    el.onclick = ()=> openExerciseModal(ex);
    exList.appendChild(el);
  });
}
renderExerciseList();

/* ---------- Modál + időzítő (videó loop, 15 mp pihenő) ---------- */
const modal = document.getElementById('exerciseModal');
const exTitle = document.getElementById('exTitle');
const exDesc  = document.getElementById('exDesc');
const exVideo = document.getElementById('exVideo');
const setsInp = document.getElementById('setsInp');
const repsInp = document.getElementById('repsInp');
const secPerRepInp = document.getElementById('secPerRepInp');
const timerDisplay = document.getElementById('timerDisplay');
const timerInfo = document.getElementById('timerInfo');
const beep = document.getElementById('beep');

let tInt=null, running=false, curSet=1, curRep=1, totalSets=3, reps=12, secPerRep=2;

function mmss(sec){
  const m = String(Math.floor(sec/60)).padStart(2,'0');
  const s = String(sec%60).padStart(2,'0');
  return `${m}:${s}`;
}
function paintTimer(text){ timerDisplay.textContent = text; }

function startTimer(){
  totalSets = Math.max(1, +setsInp.value||1);
  reps      = Math.max(1, +repsInp.value||1);
  secPerRep = Math.max(1, +secPerRepInp.value||1);
  curSet = 1; curRep = 1;
  runRep();
}
function runRep(){
  running = true;
  let left = secPerRep;
  paintTimer(mmss(left));
  timerInfo.textContent = `Kör ${curSet}/${totalSets} – Ismétlés ${curRep}/${reps}`;
  clearInterval(tInt);
  tInt = setInterval(()=>{
    left--;
    paintTimer(mmss(left));
    if(left<=0){
      clearInterval(tInt);
      beep.play().catch(()=>{});
      if(curRep < reps){
        curRep++;
        runRep();
      }else{
        restPhase();
      }
    }
  },1000);
}
function restPhase(){
  running=false;
  let rest = 15;
  timerInfo.textContent = `Pihenő (15 mp) – kész kör: ${curSet}/${totalSets}`;
  paintTimer(mmss(rest));
  clearInterval(tInt);
  tInt = setInterval(()=>{
    rest--;
    paintTimer(mmss(rest));
    if(rest<=0){
      clearInterval(tInt);
      if(curSet < totalSets){
        curSet++; curRep=1;
        runRep();
      }else{
        timerInfo.textContent = 'Gratulálok! Készen vagyunk. Lépj vissza a listához és válaszd a következő gyakorlatot.';
        paintTimer('00:00');
        incrementDone();
      }
    }
  },1000);
}
function pauseTimer(){
  if(!running && tInt){ // folytatás
    runRep();
    return;
  }
  running=false;
  clearInterval(tInt);
}
function nextSetManual(){
  clearInterval(tInt);
  if(curSet < totalSets){
    curSet++; curRep=1;
    runRep();
  }
}

function openExerciseModal(ex){
  const src = typeof ex.file === 'function' ? ex.file(state.gender) : ex.file;
  exTitle.textContent = ex.title;
  exDesc.textContent  = ex.desc || '';
  exVideo.src = src;
  exVideo.setAttribute('loop','');
  exVideo.play().catch(()=>{});
  modal.classList.add('show');
  pauseTimer();
  paintTimer('00:00');
  timerInfo.textContent = '';
}
document.getElementById('exClose').onclick = ()=> modal.classList.remove('show');
document.getElementById('btnStartTimer').onclick = startTimer;
document.getElementById('btnPauseTimer').onclick = pauseTimer;
document.getElementById('btnNextSet').onclick  = nextSetManual;

/* ---------- Kalória ---------- */
const mealInp  = document.getElementById('mealInp');
const kcalInp  = document.getElementById('kcalInp');
const calList  = document.getElementById('calList');
const calTotal = document.getElementById('calTotal');
const calData  = JSON.parse(localStorage.getItem('calData')||'[]');

function renderCal(){
  calList.innerHTML='';
  let sum=0;
  calData.forEach((it,idx)=>{
    sum+=it.kcal;
    const row = document.createElement('div');
    row.className='item';
    row.innerHTML = `<span>${it.label}</span><span>${it.kcal} kcal</span>`;
    row.onclick = ()=>{ calData.splice(idx,1); saveCal(); };
    calList.appendChild(row);
  });
  calTotal.textContent = sum;
}
function saveCal(){
  localStorage.setItem('calData', JSON.stringify(calData));
  renderCal();
}
document.getElementById('btnAddMeal').onclick = ()=>{
  const label = mealInp.value.trim(); const kcal = +kcalInp.value||0;
  if(!label || !kcal) return;
  calData.push({label,kcal}); mealInp.value=''; kcalInp.value='';
  saveCal();
};
renderCal();

/* ---------- Teljesítmény ---------- */
function incrementDone(){
  state.done++;
  localStorage.setItem('done', String(state.done));
  document.getElementById('doneWorkouts').textContent = state.done;
  state.streak = Math.max(state.streak,1);
  localStorage.setItem('streak', String(state.streak));
  document.getElementById('streakDays').textContent = state.streak;
}
document.getElementById('streakDays').textContent   = state.streak;
document.getElementById('doneWorkouts').textContent = state.done;

/* ---------- Chat (frontend buborék) ---------- */
const chatBox = document.getElementById('chatBox');
function pushBubble(txt, me=false){
  const b = document.createElement('div');
  b.className = 'bubble ' + (me?'me':'bot');
  b.textContent = txt;
  chatBox.appendChild(b);
  chatBox.scrollTop = chatBox.scrollHeight;
}
document.getElementById('chatSend').onclick = async ()=>{
  const q = document.getElementById('chatInp').value.trim();
  if(!q) return;
  document.getElementById('chatInp').value='';
  pushBubble(q,true);
  try{
    // Ha működik a Netlify function-öd:
    // const r = await fetch('/.netlify/functions/ai-chat',{method:'POST',body:JSON.stringify({q,state})});
    // const {text} = await r.json();
    // pushBubble(text || 'Oké!');
    pushBubble('Oké! Dolgozom rajta… (A backend válasz itt jelenik meg.)');
  }catch(e){
    pushBubble('Hopp, a chat backend most nem elérhető.');
  }
};

/* ---------- Indítás ---------- */
renderExerciseList();
show('splash');
