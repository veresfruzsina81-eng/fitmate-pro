<!doctype html>
<html lang="hu">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>FitMate HU</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <!-- Globális háttér -->
  <div id="bg"></div>

  <!-- Splash -->
  <section id="view-splash" class="view show">
    <div class="panel center glass">
      <h1>FitMate <span class="accent">HU</span></h1>
      <p>Magyar fitnesz – egyszerűen, szépen, okosan.</p>
      <button class="btn primary" id="btnStart">Kezdjük</button>
    </div>
  </section>

  <!-- Célválasztó -->
  <section id="view-goal" class="view">
    <button class="back" data-back="splash">Vissza</button>
    <header class="page-title">
      <h2>Válaszd ki a célod</h2>
      <p>Ezt később bármikor módosíthatod.</p>
    </header>

    <div class="goal-list">
      <div class="goal-card" data-goal="fogyas">
        <img src="fogyas.png" alt="Fogyás" />
        <div>
          <h3>Fogyás</h3>
          <p>Zsírégetés, kíméletes tempó</p>
        </div>
      </div>
      <div class="goal-card" data-goal="szalkasitas">
        <img src="szalkasitas.png" alt="Szálkásítás" />
        <div>
          <h3>Szálkásítás</h3>
          <p>Deficit + tónusos izom</p>
        </div>
      </div>
      <div class="goal-card" data-goal="hizas">
        <img src="hizas.png" alt="Hízás" />
        <div>
          <h3>Hízás</h3>
          <p>Izomtömeg növelés, szuficit</p>
        </div>
      </div>
    </div>

    <div class="row">
      <label class="select-label">Nem:</label>
      <select id="genderPick" class="select">
        <option value="no">Nő</option>
        <option value="ferfi">Férfi</option>
      </select>
      <button class="btn primary" id="btnToHome">Tovább a főmenübe</button>
    </div>
  </section>

  <!-- Főmenü -->
  <section id="view-home" class="view">
    <button class="back" data-back="goal">Vissza</button>
    <div class="home-head">
      <div class="pill">Cél: <span id="currentGoalLbl">–</span></div>
      <button class="btn subtle" id="btnChangeGoal">Cél módosítása</button>
      <button class="btn subtle" id="btnToSplash">Kezdő</button>
    </div>

    <div class="menu">
      <button class="card" data-open="workout">
        <h4>Edzés</h4>
        <p>Válassz gyakorlatot, időzítővel.</p>
      </button>
      <button class="card" data-open="cal">
        <h4>Kalóriaszámláló</h4>
        <p>Egyszerű napi bevitel.</p>
      </button>
      <button class="card" data-open="perf">
        <h4>Napi teljesítmény</h4>
        <p>Streak és kész napok.</p>
      </button>
      <button class="card" data-open="chat">
        <h4>AI chat</h4>
        <p>Magyar tanácsok.</p>
      </button>
    </div>
  </section>

  <!-- Edzés – lista -->
  <section id="view-workout" class="view">
    <button class="back" data-back="home">Vissza</button>
    <header class="page-title">
      <h2>Napi edzés</h2>
      <p>Válassz gyakorlatot a célod alapján (5 db / kategória)</p>
    </header>
    <div id="exerciseList" class="exercise-list"></div>
  </section>

  <!-- Edzés – részletek (MODÁL) -->
  <div id="exerciseModal" class="modal">
    <div class="modal-body">
      <button class="close" id="exClose">×</button>
      <h3 id="exTitle"></h3>
      <p id="exDesc" class="muted"></p>

      <div class="video-wrap">
        <video id="exVideo" playsinline muted autoplay loop></video>
      </div>

      <div class="grid-3">
        <div>
          <label>Körök:</label>
          <input id="setsInp" type="number" min="1" value="3" />
        </div>
        <div>
          <label>Ismétlés/kör:</label>
          <input id="repsInp" type="number" min="1" value="12" />
        </div>
        <div>
          <label>Idő/ism. (mp):</label>
          <input id="secPerRepInp" type="number" min="1" value="2" />
        </div>
      </div>

      <div class="timer">
        <h4>Készen állsz?</h4>
        <div id="timerDisplay">00:00</div>
        <div class="row btns">
          <button class="btn primary" id="btnStartTimer">Start</button>
          <button class="btn" id="btnPauseTimer">Szünet</button>
          <button class="btn" id="btnNextSet">Következő</button>
        </div>
        <div id="timerInfo" class="muted"></div>
      </div>
    </div>
  </div>

  <!-- Kalóriaszámláló -->
  <section id="view-cal" class="view">
    <button class="back" data-back="home">Vissza</button>
    <header class="page-title">
      <h2>Kalóriaszámláló (egyszerű v1)</h2>
    </header>
    <div class="cal">
      <input id="mealInp" class="input" placeholder="Étkezés (pl. csirkemell, rizs)" />
      <input id="kcalInp" class="input small" placeholder="kcal" type="number" />
      <button class="btn primary" id="btnAddMeal">Hozzáad</button>
      <div id="calList" class="list"></div>
      <div class="total">Napi összesen: <strong id="calTotal">0</strong> kcal</div>
    </div>
  </section>

  <!-- Teljesítmény -->
  <section id="view-perf" class="view">
    <button class="back" data-back="home">Vissza</button>
    <header class="page-title">
      <h2>Napi teljesítmény</h2>
    </header>
    <div class="perf">
      <div class="stat"><span id="streakDays">0</span> nap folyamatosan</div>
      <div class="stat"><span id="doneWorkouts">0</span> befejezett edzés</div>
      <p class="muted">Az értékek az eszközödön tárolódnak (LocalStorage).</p>
    </div>
  </section>

  <!-- AI Chat -->
  <section id="view-chat" class="view">
    <button class="back" data-back="home">Vissza</button>
    <header class="page-title">
      <h2>AI chat (magyar)</h2>
    </header>
    <div class="chat">
      <div id="chatBox" class="chat-box">
        <div class="bubble bot">Szia! Miben segíthetek?</div>
      </div>
      <div class="chat-input">
        <input id="chatInp" class="input" placeholder="Írd ide a kérdésed..." />
        <button id="chatSend" class="btn primary">Küldés</button>
      </div>
    </div>
  </section>

  <audio id="beep">
    <source src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABYAAAABAAgAZGF0YQAAAAA=" type="audio/wav">
  </audio>

  <script src="app.js"></script>
</body>
</html>
