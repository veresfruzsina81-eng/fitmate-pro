// ---------- állapot ----------
const state = {
  goal: localStorage.getItem('goal') || 'fogyas',
  gender: localStorage.getItem('gender') || 'no',
  streak: +(localStorage.getItem('streak') || 0),
  done: +(localStorage.getItem('done') || 0),
};

// ---------- háttér képek váltása ----------
const bgEl = document.getElementById('bg');
function setBackgroundFor(section) {
  // section: splash | goal | home | workout | cal | perf | chat
  const map = {
    splash: 'kezdo.png',
    goal: 'fogyas.png',
    home: state.goal + '.png',
    workout: state.goal + '.png',
    cal: 'fogyas.png',
    perf: 'szalkasitas.png',
    chat: 'hizas.png',
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
document.getElementById('btnStart').onclick = ()=>show('goal');
document.getElementById('btnToHome').onclick = ()=>{
  localStorage.setItem('goal', state.goal);
  localStorage.setItem('gender', state.gender);
  hydrateHome();
  show('home');
};
document.getElementById('btnChangeGoal').onclick = ()=>show('goal');
document.getElementById('btnToSplash').onclick = ()=>show('splash');
document.querySelectorAll('.back').forEach(b=>{
  b.onclick = ()=> show(b.dataset.back);
});

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

// ---------- Főmenü feltöltés ----------
function hydrateHome(){
  document.getElementById('currentGoalLbl').textContent =
    (state.goal==='fogyas'?'Fogyás':state.goal==='szalkasitas'?'Szálkásítás':'Hízás');
}
hydrateHome();
document.querySelectorAll('#view-home .card').forEach(btn=>{
  btn.onclick = ()=>show(btn.dataset.open);
});

// ---------- Gyakorlatok listája (név + videó fájl) ----------
/** Helper: fájlnév prefix nem szerint */
const sx = g => g==='no' ? '_w' : '';
const exercises = {
  // A sorrend és címek a kérésed szerint
  hizas: [
    {title:'Csípőemelés', file: g => `hizas${sx(g)}1.mp4`,
     desc:'Far és hamstring erősítés.'},
    {title:'Négyütemű fekvőtámasz', file: g => `hizas${sx(g)}2.mp4`,
     desc:'Teljes test állóképesség (burpee).'},
    {title:'Guggolás', file: g => `hizas${sx(g)}3.mp4`,
     desc:'Alap alsótest gyakorlat, törzs feszítéssel.'},
    {title:'Plank', file: g => `hizas${sx(g)}4.mp4`,
     desc:'Törzs statikus erősítés.'},
    {title:'Glute bridge', file: g => `hizas${sx(g)}5.mp4`,
     desc:'Csípőnyújtás, farizom aktiválás.'},
  ],
  fogyas: [
    {title:'Jumping jacks', file:g=>`fogyas${sx(g)}1.mp4`, desc:'Kardió, teljes test bemelegítés.'},
    {title:'Switch jump mountain climber', file:g=>`fogyas${sx(g)}2.mp4`, desc:'Intenzív kardió core-dominánsan.'},
    {title:'Cardio jumping jacks', file:g=>`fogyas${sx(g)}3.mp4`, desc:'Pulzus fokozása.'},
    {title:'Plank', file:g=>`fogyas${sx(g)}4.mp4`, desc:'Core stabilitás.'},
    {title:'Glute bridge', file:g=>`fogyas${sx(g)}5.mp4`, desc:'Farizom aktiválás.'},
  ],
  szalkasitas: [
    {title:'Fekvőtámasz', file:g=>`szalkasitas${sx(g)}1.mp4`, desc:'Mell, tricepsz, core.'},
    {title:'Váll oldalemelés', file:g=>`szalkasitas${sx(g)}2.mp4`, desc:'Vállközép aktiválás.'},
    {title:'Kitörés', file:g=>`szalkasitas${sx(g)}3.mp4`, desc:'Láb, egyensúly.'},
    {title:'Plank', file:g=>`szalkasitas${sx(g)}4.mp4`, desc:'Törzs statikus.'},
    {title:'Híd', file:g=>`szalkasitas${sx(g)}5.mp4`, desc:'Alsótest tónus.'},
  ]
};

// ---------- Lista render ----------
const exList = document.getElementById('exerciseList');
function renderExerciseList(){
  exList.innerHTML = '';
  const arr = exercises[state.goal];
  arr.forEach((ex, i)=>{
    const el = document.createElement('div');
    el.className = 'exercise-item';
    el.innerHTML = `
      <div class="title">#${i+1}. gyakorlat</div>
      <div class="muted">${ex.title}</div>
    `;
    el.onclick = ()=> openExerciseModal(ex);
    exList.appendChild(el);
  });
}
renderExerciseList();

// újrarender, ha cél vált
document.getElementById('btnToHome').addEventListener('click', renderExerciseList);
document.getElementById('btnChangeGoal').addEventListener('click', ()=>{});

// ---------- Modál + időzítő ----------
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
  // beolvas beállítások
  totalSets = Math.max(1, +setsInp.value||1);
  reps = Math.max(1, +repsInp.value||1);
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
      if(curRep < reps){ // következő ismétlés
        curRep++;
        runRep();
      }else{
        // kör vége -> pihenő 15 mp
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
        // teljesen kész
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
  exTitle.textContent = ex.title;
  exDesc.textContent = ex.desc;
  exVideo.src = ex.file(state.gender);
  exVideo.setAttribute('loop','');
  exVideo.play().catch(()=>{});
  modal.classList.add('show');
  // reset timer UI
  pauseTimer();
  paintTimer('00:00');
  timerInfo.textContent = '';
}
document.getElementById('exClose').onclick = ()=> modal.classList.remove('show');
document.getElementById('btnStartTimer').onclick = startTimer;
document.getElementById('btnPauseTimer').onclick = pauseTimer;
document.getElementById('btnNextSet').onclick = nextSetManual;

// ---------- Kalória ----------
const mealInp = document.getElementById('mealInp');
const kcalInp = document.getElementById('kcalInp');
const calList = document.getElementById('calList');
const calTotal = document.getElementById('calTotal');
const calData = JSON.parse(localStorage.getItem('calData')||'[]');
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

// ---------- Teljesítmény ----------
function incrementDone(){
  state.done++;
  localStorage.setItem('done', String(state.done));
  document.getElementById('doneWorkouts').textContent = state.done;
  // nagyon egyszerű „streak” – ha ma már pipált, most nem foglalkozunk dátumokkal
  state.streak = Math.max(state.streak,1);
  localStorage.setItem('streak', String(state.streak));
  document.getElementById('streakDays').textContent = state.streak;
}
document.getElementById('streakDays').textContent = state.streak;
document.getElementById('doneWorkouts').textContent = state.done;

// ---------- Chat (frontend-buborék; backendhez már be van kötve nálad) ----------
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
    // Hívd a saját Netlify function-öd endpointját, ha használod:
    // const r = await fetch('/.netlify/functions/ai-chat',{method:'POST',body:JSON.stringify({q,state})});
    // const {text} = await r.json();
    // pushBubble(text || 'Oké!');
    // Amíg a backend javítást végzed, legyen helyettesítő válasz:
    pushBubble('Oké! Dolgozom rajta… (A backend válasz itt jelenik meg.)');
  }catch(e){
    pushBubble('Hopp, a chat backend most nem elérhető.');
  }
};

// első megjelenítés
show('splash');
