// —— állapot
const S = {
  goal: localStorage.getItem('goal') || null,        // 'fogyas' | 'szalkasitas' | 'hizas'
  gender: localStorage.getItem('gender') || null,    // 'male' | 'female'
  streak: +(localStorage.getItem('streak') || 0),
  done: +(localStorage.getItem('done') || 0),
  foods: JSON.parse(localStorage.getItem('foods') || '[]'),
  currentExercise: null,
};

// —— segéd: képernyő váltás + háttér beállítás
function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const el = document.getElementById(id);
  if(!el) return;
  el.classList.add('active');

  if(el.classList.contains('cover')){
    const bg = el.getAttribute('data-bg');
    if(bg) { el.style.backgroundImage = `url('${bg}')`; }
  }

  if(id==='screen-home'){
    document.getElementById('activeGoal').textContent =
      `Aktuális cél: ${labelGoal(S.goal)} (${S.gender==='male'?'Férfi':'Nő'})`;
  }
  if(id==='screen-workout'){ renderWorkoutList(); }
  if(id==='screen-calories'){ renderFoods(); }
  if(id==='screen-progress'){ renderProgress(); }
}
function labelGoal(g){
  return g==='fogyas' ? 'Fogyás' : g==='szalkasitas' ? 'Szálkásítás' : 'Hízás';
}

// —— cél választás
document.querySelectorAll('.pick-goal').forEach(b=>{
  b.addEventListener('click', ()=> {
    document.querySelectorAll('.pick-goal').forEach(x=>x.classList.remove('selected'));
    b.classList.add('selected');
    S.goal = b.dataset.goal;
  });
});
document.getElementById('toGender').addEventListener('click', ()=>{
  if(!S.goal) { alert('Válassz célt!'); return; }
  const gbg = S.goal==='fogyas' ? 'fogyas.png' : S.goal==='szalkasitas' ? 'szalkasitas.png' : 'hizas.png';
  document.getElementById('screen-gender').setAttribute('data-bg', gbg);
  show('screen-gender');
});
document.getElementById('skipGoal').addEventListener('click', ()=>{
  if(!S.goal) S.goal = 'szalkasitas';
  show('screen-gender');
});

// —— nem választás
document.querySelectorAll('.pick-gender').forEach(b=>{
  b.addEventListener('click', ()=>{
    document.querySelectorAll('.pick-gender').forEach(x=>x.classList.remove('selected'));
    b.classList.add('selected');
    S.gender = b.dataset.gender;
  });
});
document.getElementById('btnChangeGoal').addEventListener('click', ()=> show('screen-goal'));

document.querySelectorAll('[data-open]').forEach(b=>{
  b.addEventListener('click', ()=>{
    const id = b.getAttribute('data-open');
    show(id);
  });
});

// —— mentés (főmenübe lépésnél)
document.querySelectorAll('#screen-gender .btn.btn-primary, #screen-gender [data-open="screen-home"]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    if(!S.gender) { alert('Válaszd ki a nemet!'); return; }
    localStorage.setItem('goal', S.goal);
    localStorage.setItem('gender', S.gender);
  });
});

// —— edzés tervek (videók a repo gyökeréből)
const PLAN_BY_GOAL = {
  fogyas: {
    male: [
      {name:'Jumping Jacks', file:'fogyas1.mp4'},
      {name:'High Knees', file:'fogyas2.mp4'},
      {name:'Burpees', file:'fogyas3.mp4'},
      {name:'Mountain Climbers', file:'fogyas4.mp4'},
      {name:'Squat Jumps', file:'fogyas5.mp4'},
    ],
    female: [
      {name:'Cross Jacks', file:'fogyas_w1.mp4'},
      {name:'Butt Kicks', file:'fogyas_w2.mp4'},
      {name:'Skater Jumps', file:'fogyas_w3.mp4'},
      {name:'Jumping Squats', file:'fogyas_w4.mp4'},
      {name:'Jump Rope (no rope)', file:'fogyas_w5.mp4'},
    ],
  },
  szalkasitas: {
    male: [
      {name:'Push-Ups', file:'szalkasitas1.mp4'},
      {name:'Plank', file:'szalkasitas2.mp4'},
      {name:'Lunges', file:'szalkasitas3.mp4'},
      {name:'Side Plank', file:'szalkasitas4.mp4'},
      {name:'Squats', file:'szalkasitas5.mp4'},
    ],
    female: [
      {name:'Glute Bridge', file:'szalkasitas_w1.mp4'},
      {name:'Switch Jump Mountain Climber', file:'szalkasitas_w2.mp4'},
      {name:'Cardio Jumping Jacks', file:'szalkasitas_w3.mp4'},
      {name:'Plank Head', file:'szalkasitas_w4.mp4'},
      {name:'Squats with Dumbbells', file:'szalkasitas_w5.mp4', note:'Súlyzó nélkül is végezhető.'},
    ],
  },
  hizas: {
    male: [
      {name:'Push-Up', file:'hizas1.mp4'},
      {name:'Pike Push-Up', file:'hizas2.mp4'},
      {name:'Squat Jump', file:'hizas3.mp4'},
      {name:'Dumbbell Plank Pullthrough', file:'hizas4.mp4', note:'Súlyzó nélkül is végezhető (imitált húzás).'},
      {name:'Burpee', file:'hizas5.mp4'},
    ],
    female: [
      {name:'Glute Bridge', file:'hizas_w1.mp4'},
      {name:'Squat Pulse', file:'hizas_w2.mp4'},
      {name:'Knee Push-Up', file:'hizas_w3.mp4'},
      {name:'Side Leg Raise', file:'hizas_w4.mp4'},
      {name:'Mountain Climber (slow)', file:'hizas_w5.mp4'},
    ],
  },
};

function getPlan(){
  const g = S.goal || 'szalkasitas';
  const sex = S.gender || 'female';
  return PLAN_BY_GOAL[g][sex] || [];
}

// —— edzés lista
function renderWorkoutList(){
  const list = document.getElementById('workoutList');
  list.innerHTML = '';
  const plan = getPlan();
  if(!plan.length){
    list.innerHTML = `<div class="row"><div class="grow">Nincs edzés ehhez a beállításhoz.</div></div>`;
    return;
  }
  plan.forEach((ex, idx)=>{
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `
      <div class="grow">
        <div><strong>${idx+1}. ${ex.name}</strong></div>
        ${ex.note?`<div class="small">${ex.note}</div>`:''}
      </div>
      <button class="btn" data-open="screen-exercise" data-idx="${idx}">Megnyitás</button>
    `;
    row.querySelector('button').addEventListener('click', (e)=>{
      const i = +e.currentTarget.dataset.idx;
      openExercise(i);
    });
    list.appendChild(row);
  });
}

function openExercise(i){
  const plan = getPlan();
  const ex = plan[i];
  if(!ex) return;
  S.currentExercise = ex;

  document.getElementById('exTitle').textContent = ex.name;
  const v = document.getElementById('exVideo');
  v.src = ex.file; // repo gyökér!
  v.load(); // biztos indítás
  document.getElementById('exNote').textContent = ex.note || '';

  document.getElementById('inpSets').value = 3;
  document.getElementById('inpReps').value = 12;
  document.getElementById('inpSecPerRep').value = 2;
  document.getElementById('timer').textContent = '00:00';
  document.getElementById('timerStatus').textContent = 'Indulhatunk!';
  document.getElementById('timerLabel').textContent = 'Készen állsz?';

  show('screen-exercise');
}

// —— egyszerű edzés időzítő
let timerInt = null, t=0, phase='idle', curSet=1, totalSets=1, reps=12, secPerRep=2, rest=20;
function fmt(s){const m=Math.floor(s/60),ss=String(s%60).padStart(2,'0');return `${String(m).padStart(2,'0')}:${ss}`}

function startTimer(){
  totalSets = +document.getElementById('inpSets').value||1;
  reps = +document.getElementById('inpReps').value||10;
  secPerRep = +document.getElementById('inpSecPerRep').value||2;
  rest = 20;

  phase='work'; t = reps*secPerRep;
  curSet=1;
  document.getElementById('timerStatus').textContent = `1. kör – ${reps} ismétlés`;
  document.getElementById('timerLabel').textContent = 'Munka';
  draw();

  clearInterval(timerInt);
  timerInt = setInterval(tick, 1000);
}
function tick(){
  t--; draw();
  if(t<=0){
    if(phase==='work'){
      if(curSet < totalSets){
        phase='rest'; t=rest;
        document.getElementById('timerLabel').textContent='Pihenő';
        document.getElementById('timerStatus').textContent = `Pihenj ${rest} mp-et…`;
      } else {
        finished();
      }
    } else if(phase==='rest'){
      curSet++;
      phase='work'; t=reps*secPerRep;
      document.getElementById('timerLabel').textContent='Munka';
      document.getElementById('timerStatus').textContent = `${curSet}. kör – ${reps} ismétlés`;
    }
  }
}
function draw(){ document.getElementById('timer').textContent = fmt(t); }
function pauseTimer(){ if(timerInt){ clearInterval(timerInt); timerInt=null; document.getElementById('timerStatus').textContent='Szünet'; } }
function nextTimer(){ pauseTimer(); finished(); }
function finished(){
  if(timerInt){ clearInterval(timerInt); timerInt=null; }
  document.getElementById('timerLabel').textContent='Kész! 🎉';
  document.getElementById('timer').textContent='00:00';
  document.getElementById('timerStatus').textContent='Gratulálok! Léphetünk a következő gyakorlathoz vagy vissza a listához.';
  S.done++; localStorage.setItem('done', S.done);
  const today = new Date().toDateString();
  const last = localStorage.getItem('lastDay');
  if(last !== today){
    S.streak++; localStorage.setItem('streak', S.streak); localStorage.setItem('lastDay', today);
  }
}
document.getElementById('btnStart').addEventListener('click', startTimer);
document.getElementById('btnPause').addEventListener('click', pauseTimer);
document.getElementById('btnNext').addEventListener('click', nextTimer);

// —— kalória
function renderFoods(){
  const ul = document.getElementById('foodList');
  ul.innerHTML='';
  let sum=0;
  S.foods.forEach((f,i)=>{
    sum += f.kcal;
    const li = document.createElement('li');
    li.className='row';
    li.innerHTML = `<div class="grow">${f.name}</div><div>${f.kcal} kcal</div><button class="btn" data-i="${i}">×</button>`;
    li.querySelector('button').addEventListener('click', (e)=>{
      const idx = +e.currentTarget.dataset.i;
      S.foods.splice(idx,1);
      localStorage.setItem('foods', JSON.stringify(S.foods));
      renderFoods();
    });
    ul.appendChild(li);
  });
  document.getElementById('totalKcal').textContent = `${sum} kcal`;
}
document.getElementById('btnAddFood').addEventListener('click', ()=>{
  const name = document.getElementById('foodName').value.trim();
  const kcal = +(document.getElementById('foodKcal').value||0);
  if(!name || !kcal) return;
  S.foods.push({name, kcal});
  localStorage.setItem('foods', JSON.stringify(S.foods));
  document.getElementById('foodName').value='';
  document.getElementById('foodKcal').value='';
  renderFoods();
});
document.getElementById('btnClearFood').addEventListener('click', ()=>{
  if(confirm('Biztos törlöd a mai listát?')){
    S.foods=[]; localStorage.setItem('foods','[]'); renderFoods();
  }
});

// —— progress
function renderProgress(){
  document.getElementById('streakDays').textContent = `${S.streak} nap`;
  document.getElementById('doneCount').textContent = S.done;
}

// —— chat
function appendBubble(text, who='bot'){
  const div = document.createElement('div');
  div.className = `bubble ${who}`;
  div.textContent = text;
  document.getElementById('chatLog').appendChild(div);
  document.getElementById('chatLog').scrollTop = 1e9;
}
appendBubble('Szia! Miben segíthetek a céloddal kapcsolatban? Van valami konkrét kérdésed?', 'bot');

document.getElementById('chatSend').addEventListener('click', sendChat);
document.getElementById('chatInput').addEventListener('keydown', (e)=>{ if(e.key==='Enter') sendChat(); });

async function sendChat(){
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if(!msg) return;
  appendBubble(msg, 'me'); input.value='';
  try{
    const res = await fetch('/.netlify/functions/ai-chat', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ prompt: msg, goal: S.goal || 'szalkasitas' })
    });
    const data = await res.json();
    appendBubble(data.reply || 'Hopp, most nem sikerült választ kapni. Nézd meg a Netlify Functions logot.');
  }catch(err){
    appendBubble('Hiba történt a kérdés küldésekor. Ellenőrizd az internetet és az API kulcsot.');
  }
}

// —— indulás
show('screen-splash');
if(S.goal && S.gender){
  show('screen-home');
  document.getElementById('activeGoal').textContent = `Aktuális cél: ${labelGoal(S.goal)} (${S.gender==='male'?'Férfi':'Nő'})`;
}
