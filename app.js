/* ====== ÁLLAPOT ====== */
const state = {
  goal: localStorage.getItem('goal') || null,      // 'fogyas' | 'szalkasitas' | 'hizas'
  gender: localStorage.getItem('gender') || 'no',  // 'no' | 'ferfi'
  streak: +(localStorage.getItem('streak')||0),
  done: +(localStorage.getItem('done')||0),
};

/* ====== ELEMEK ====== */
const views = {
  splash: qs('#view-splash'),
  goal: qs('#view-goal'),
  home: qs('#view-home'),
  workout: qs('#view-workout'),
  calories: qs('#view-calories'),
  progress: qs('#view-progress'),
  chat: qs('#view-chat')
};
const header = qs('#appHeader');
const backBtn = qs('#backBtn');
const viewTitle = qs('#viewTitle');

/* ====== SEGÉD ====== */
function qs(sel, root=document){ return root.querySelector(sel); }
function show(id){
  // címsor + háttér váltás
  for(const k in views) views[k].classList.remove('active');
  views[id].classList.add('active');

  header.classList.toggle('hidden', id==='splash');
  document.body.classList.remove('bg--kezdo','bg--fogyas','bg--szalkasitas','bg--hizas');
  if(id==='splash') document.body.classList.add('bg--kezdo');
  if(id==='goal') document.body.classList.add(state.goal ? `bg--${state.goal}` : 'bg--fogyas');
  if(id==='home') document.body.classList.add(state.goal ? `bg--${state.goal}` : 'bg--fogyas');
  if(id==='workout') document.body.classList.add(state.goal ? `bg--${state.goal}` : 'bg--fogyas');

  // cím
  viewTitle.textContent = ({
    splash:'FitMate HU',
    goal:'Célválasztó',
    home:'Főmenü',
    workout:'Edzés',
    calories:'Kalóriaszámláló',
    progress:'Teljesítmény',
    chat:'AI chat'
  })[id];

  // vissza útvonal
  backBtn.onclick = () => {
    if(id==='goal' || id==='home') return show('splash');
    if(id==='workout' || id==='calories' || id==='progress' || id==='chat') return show('home');
    show('splash');
  };
}

/* ====== SPLASH ====== */
qs('#startBtn').onclick = () => { show('goal'); };

/* ====== CÉLVÁLASZTÓ ====== */
const goalCards = qs('#goalCards');
let pickedGoal = state.goal || 'fogyas';
goalCards.addEventListener('click', (e)=>{
  const btn = e.target.closest('.card'); if(!btn) return;
  pickedGoal = btn.dataset.goal;
  document.body.classList.remove('bg--fogyas','bg--szalkasitas','bg--hizas');
  document.body.classList.add(`bg--${pickedGoal}`);
});
qs('#genderSel').value = state.gender;

qs('#proceedBtn').onclick = () => {
  state.goal = pickedGoal;
  state.gender = qs('#genderSel').value;
  localStorage.setItem('goal', state.goal);
  localStorage.setItem('gender', state.gender);
  qs('#stateGoalLabel').textContent = labelForGoal(state.goal);
  show('home');
};

qs('#changeGoalBtn').onclick = () => show('goal');

/* ====== FŐMENÜ NAV ====== */
qs('#view-home').addEventListener('click', (e)=>{
  const card = e.target.closest('.menu-card'); if(!card) return;
  const open = card.dataset.open;
  if(open==='workout') initWorkout();
  show({workout:'workout',calories:'calories',progress:'progress',chat:'chat'}[open]);
});
qs('#stateGoalLabel').textContent = labelForGoal(state.goal||'fogyas');

/* ====== EXERCISE ADATOK ====== */
const EX = {
  fogyas: {
    no: [
      {file:'fogyas_w1.mp4',  name:'Oldalsó lépegetés guggolással', desc:'Alacsony terhelésű kardió + alsótest.'},
      {file:'fogyas_w2.mp4',  name:'Switch jump mountain climber', desc:'Pulzusnövelő teljes test.'},
      {file:'fogyas_w3.mp4',  name:'Jumping jacks', desc:'Klasszikus kardió, bemelegítésre is jó.'},
      {file:'fogyas_w4.mp4',  name:'Plank', desc:'Core stabilitás, vállöv.'},
      {file:'fogyas_w5.mp4',  name:'Csípőemelés', desc:'Farizom és hamstring.'},
    ],
    ferfi: [
      {file:'fogyas1.mp4', name:'Oldalsó lépegetés guggolással', desc:'Alacsony terhelésű kardió + alsótest.'},
      {file:'fogyas2.mp4', name:'Switch jump mountain climber', desc:'Pulzusnövelő teljes test.'},
      {file:'fogyas3.mp4', name:'Jumping jacks', desc:'Klasszikus kardió, bemelegítésre is jó.'},
      {file:'fogyas4.mp4', name:'Plank', desc:'Core stabilitás, vállöv.'},
      {file:'fogyas5.mp4', name:'Csípőemelés', desc:'Farizom és hamstring.'},
    ],
  },
  szalkasitas: {
    no: [
      {file:'szalkasitas_w1.mp4', name:'Hegymászó', desc:'Core + kardió.'},
      {file:'szalkasitas_w2.mp4', name:'Holló tartás variáció', desc:'Kar, váll, core.'},
      {file:'szalkasitas_w3.mp4', name:'Kitörés hátra', desc:'Combfeszítő, farizom.'},
      {file:'szalkasitas_w4.mp4', name:'Plank vállérintéssel', desc:'Core + váll stabilitás.'},
      {file:'szalkasitas_w5.mp4', name:'Guggolás rugózással', desc:'Alsótest tónus.'},
    ],
    ferfi: [
      {file:'szalkasitas1.mp4', name:'Hegymászó', desc:'Core + kardió.'},
      {file:'szalkasitas2.mp4', name:'Fekvőtámasz variáció', desc:'Mell, tricepsz, core.'},
      {file:'szalkasitas3.mp4', name:'Kitörés hátra', desc:'Combfeszítő, farizom.'},
      {file:'szalkasitas4.mp4', name:'Plank vállérintéssel', desc:'Core + váll stabilitás.'},
      {file:'szalkasitas5.mp4', name:'Guggolás rugózással', desc:'Alsótest tónus.'},
    ],
  },
  hizas: {
    no: [
      {file:'hizas_w1.mp4', name:'Csípőemelés', desc:'Far és hamstring.'},
      {file:'hizas_w2.mp4', name:'Négyütemű fekvőtámasz', desc:'Teljes test állóképesség.'},
      {file:'hizas_w3.mp4', name:'Guggolás', desc:'Quadriceps, farizom.'},
      {file:'hizas_w4.mp4', name:'Plank', desc:'Core stabilitás.'},
      {file:'hizas_w5.mp4', name:'Glute bridge', desc:'Farizom izoláció.'},
    ],
    ferfi: [
      {file:'hizas1.mp4', name:'Csípőemelés', desc:'Far és hamstring.'},
      {file:'hizas2.mp4', name:'Négyütemű fekvőtámasz', desc:'Teljes test állóképesség.'},
      {file:'hizas3.mp4', name:'Guggolás', desc:'Quadriceps, farizom.'},
      {file:'hizas4.mp4', name:'Plank', desc:'Core stabilitás.'},
      {file:'hizas5.mp4', name:'Glute bridge', desc:'Farizom izoláció.'},
    ],
  }
};

function labelForGoal(g){
  return {fogyas:'Fogyás', szalkasitas:'Szálkásítás', hizas:'Hízás'}[g] || '–';
}

/* ====== EDZÉS ====== */
const exerciseList = qs('#exerciseList');
const exerciseDetail = qs('#exerciseDetail');
const exTitle = qs('#exTitle');
const exDesc = qs('#exDesc');
const exVideo = qs('#exVideo');
const inpSets = qs('#inpSets');
const inpReps = qs('#inpReps');
const inpPerRep = qs('#inpPerRep');
const timerText = qs('#timerText');
const timerStatus = qs('#timerStatus');
const beep = qs('#beep');
qs('#closeDetail').onclick = ()=> exerciseDetail.classList.add('hidden');

function initWorkout(){
  // háttér a cél szerint
  document.body.classList.remove('bg--fogyas','bg--szalkasitas','bg--hizas');
  document.body.classList.add(`bg--${state.goal}`);

  // lista feltöltése
  exerciseList.innerHTML = '';
  const arr = EX[state.goal][state.gender];
  arr.forEach((ex, i)=>{
    const li = document.createElement('button');
    li.className = 'card';
    li.innerHTML = `
      <img src="${state.goal}.png" alt="">
      <div><div class="title">#${i+1}. gyakorlat</div>
      <div class="sub">${ex.name}</div></div>`;
    li.onclick = () => openExercise(ex);
    exerciseList.appendChild(li);
  });
}

function openExercise(ex){
  exTitle.textContent = ex.name;
  exDesc.textContent = ex.desc;
  exVideo.src = ex.file; // gyökérből
  exVideo.currentTime = 0;
  exVideo.play().catch(()=>{ /* mobilon user action kellhet */ });
  exerciseDetail.classList.remove('hidden');
  resetTimer();
}

/* ====== TIMER ====== */
let tHandle = null;
let setsLeft = 0, repsLeft = 0, perRep = 2, resting = false;

function resetTimer(){
  setsLeft = +inpSets.value;
  repsLeft = +inpReps.value;
  perRep = +inpPerRep.value;
  resting = false;
  updateClock(0);
  timerStatus.textContent = `Hátralévő körök: ${setsLeft}, ismétlés: ${repsLeft}`;
  clearInterval(tHandle); tHandle=null;
}

function updateClock(sec){
  const m = String(Math.floor(sec/60)).padStart(2,'0');
  const s = String(sec%60).padStart(2,'0');
  timerText.textContent = `${m}:${s}`;
}

qs('#btnStart').onclick = ()=>{
  if(tHandle) return;
  let tick = perRep;
  updateClock(tick);
  tHandle = setInterval(()=>{
    tick--;
    updateClock(tick);
    if(tick<=0){
      // ismétlés vége
      beep.currentTime = 0; beep.play().catch(()=>{});
      if(!resting){
        repsLeft--;
        if(repsLeft>0){
          tick = perRep; // következő ismétlés
        } else {
          // kör vége -> 15 mp pihenő
          resting = true;
          timerStatus.textContent = 'Pihenj 15 mp-et…';
          tick = 15;
        }
      } else {
        // pihenő vége -> új kör vagy kész
        setsLeft--;
        if(setsLeft>0){
          resting = false;
          repsLeft = +inpReps.value;
          timerStatus.textContent = `Hátralévő körök: ${setsLeft}, ismétlés: ${repsLeft}`;
          tick = perRep;
        } else {
          clearInterval(tHandle); tHandle=null;
          timerStatus.textContent = 'Kész! 🎉 Ügyes voltál – léphetsz a következő gyakorlatra.';
          // stat frissítés
          state.done++; localStorage.setItem('done', String(state.done));
        }
      }
    }
  },1000);
};

qs('#btnPause').onclick = ()=>{ clearInterval(tHandle); tHandle=null; };
qs('#btnNext').onclick = ()=>{
  clearInterval(tHandle); tHandle=null;
  timerStatus.textContent = 'Ugorjunk a következő gyakorlatra a listában.';
  // csak vizuális – a felhasználó a listából választja ki a következőt
};

/* ====== KALÓRIA ====== */
const foodName = qs('#foodName');
const foodKcal = qs('#foodKcal');
const addFood = qs('#addFood');
const foodList = qs('#foodList');
const totalKcal = qs('#totalKcal');
let foods = JSON.parse(localStorage.getItem('foods')||'[]');
renderFoods();

addFood.onclick = ()=>{
  const name = foodName.value.trim();
  const kcal = +foodKcal.value;
  if(!name || !kcal) return;
  foods.push({name,kcal});
  localStorage.setItem('foods', JSON.stringify(foods));
  foodName.value=''; foodKcal.value='';
  renderFoods();
};
function renderFoods(){
  let sum = 0;
  foodList.innerHTML='';
  foods.forEach((f,i)=>{
    sum+=f.kcal;
    const li = document.createElement('li');
    li.innerHTML = `<span>${f.name}</span><span>${f.kcal} kcal</span>`;
    li.onclick = ()=>{ foods.splice(i,1); localStorage.setItem('foods',JSON.stringify(foods)); renderFoods(); };
    foodList.appendChild(li);
  });
  totalKcal.textContent = sum;
}

/* ====== PROGRESS ====== */
const streakDays = qs('#streakDays');
const doneWorkouts = qs('#doneWorkouts');
function refreshProgress(){
  doneWorkouts.textContent = state.done;
  // egyszerű „ma nyitottad meg?” streak – demó
  const today = new Date().toDateString();
  const last = localStorage.getItem('lastSeen');
  if(last !== today){ state.streak++; localStorage.setItem('streak', String(state.streak)); }
  localStorage.setItem('lastSeen', today);
  streakDays.textContent = state.streak;
}
refreshProgress();

/* ====== CHAT ====== */
const chatBox = qs('#chatBox');
const chatInput = qs('#chatInput');
const chatSend = qs('#chatSend');

function pushBubble(text, who='bot'){
  const div = document.createElement('div');
  div.className = 'bubble ' + (who==='me'?'me':'bot');
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

chatSend.onclick = async ()=>{
  const q = chatInput.value.trim();
  if(!q) return;
  pushBubble(q,'me');
  chatInput.value='';
  try{
    const res = await fetch('/.netlify/functions/ai-chat',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ prompt:q, goal: state.goal, gender: state.gender })
    });
    const data = await res.json();
    pushBubble(data.reply || 'Bocsi, nem sikerült választ adnom.');
  }catch(e){
    pushBubble('A chat szerver nem elérhető.');
  }
};

/* ====== INDULÁS ====== */
(function boot(){
  if(state.goal){ show('home'); }
  else { show('splash'); }
})();
