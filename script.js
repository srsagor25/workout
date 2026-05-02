// =================================================================
// PPL Tracker — vanilla JS, MD3 styling, localStorage persistence
// =================================================================

// --- Time budget helpers ---
// Each set ≈ reps × 3s of work + 5s setup, plus restSec between sets.
const SEC_PER_REP = 3;
const SETUP_SEC = 5;
const WARMUP_MIN = 5;
const TIME_BUDGET_MIN = 60;

// --- Routines: STARBASE 2.0 — 4-day Full Body split (PDF-sourced) ---
// Each exercise carries a direct YouTube URL from the program PDF.
const WARMUP_VIDEO = 'https://youtu.be/tFpwBr_7KPg?si=mC4_uHgulB38cPTK';

const ROUTINES = {
  day1: {
    title: 'Day 1 — Push, Pull & Leg Mix',
    accent: '#ff8a72',
    exercises: [
      { id: 'd1e1', name: 'Back Squat',        sets: 4, reps: 8,  restSec: 150, url: 'https://youtu.be/-bJIpOq-LWk?si=c41lylC_OqturUN6' },
      { id: 'd1e2', name: 'Bench Press',       sets: 4, reps: 8,  restSec: 150, url: 'https://youtu.be/SCVCLChPQFY?si=MbIdKTjcoMBKGHcs' },
      { id: 'd1e3', name: 'Barbell Row',       sets: 4, reps: 8,  restSec: 90,  url: 'https://youtu.be/6FZHJGzMFEc?si=EPrKQ-nMZI8O95o8' },
      { id: 'd1e4', name: 'Dumbbell Curl',     sets: 3, reps: 11, restSec: 60,  url: 'https://youtu.be/HnHuhf4hEWY?si=cLp6Onrbvwd1MdzV' },
      { id: 'd1e5', name: 'Hanging Leg Raise', sets: 3, reps: 15, restSec: 60,  url: '' },
    ],
  },
  day2: {
    title: 'Day 2 — Pull Dominant',
    accent: '#94b8ff',
    exercises: [
      { id: 'd2e1', name: 'Deadlift',       sets: 5, reps: 6,  restSec: 150, url: 'https://youtu.be/AweC3UaM14o?si=EpmzLOqYdL5edfmi' },
      { id: 'd2e2', name: 'Overhead Press', sets: 4, reps: 8,  restSec: 120, url: 'https://youtu.be/cGnhixvC8uA?si=A3JcKPo0jkHe9X5c' },
      { id: 'd2e3', name: 'Pull-Up',        sets: 4, reps: 9,  restSec: 120, url: '' },
      { id: 'd2e4', name: 'Face Pull',      sets: 3, reps: 15, restSec: 60,  url: 'https://youtu.be/0Po47vvj9g4?si=gZtsKeLP6hKinp5E' },
      { id: 'd2e5', name: 'Rope Pushdown',  sets: 3, reps: 13, restSec: 60,  url: 'https://youtu.be/-xa-6cQaZKY?si=84EsGv9_4u7zyCKa' },
    ],
  },
  day3: {
    title: 'Day 3 — Lower & Upper Power',
    accent: '#92dca6',
    exercises: [
      { id: 'd3e1', name: 'Front Squat',            sets: 4, reps: 8,  restSec: 150, url: 'https://youtu.be/HHxNbhP16UE?si=7ix7aLdmn9ztX0H6' },
      { id: 'd3e2', name: 'Incline Dumbbell Press', sets: 4, reps: 9,  restSec: 120, url: 'https://youtu.be/5CECBjd7HLQ?si=L6I2RvdiWKGXMe8I' },
      { id: 'd3e3', name: 'Seated Row',             sets: 4, reps: 10, restSec: 60,  url: 'https://youtu.be/lJoozxC0Rns?si=KRIZgwtBUkvMv9gt' },
      { id: 'd3e4', name: 'Calf Raise',             sets: 3, reps: 17, restSec: 60,  url: 'https://youtu.be/_iYwv4QVFjM?si=ao4HVUbmomEmvp8u' },
      { id: 'd3e5', name: 'Plank (60s hold)',       sets: 3, reps: 20, restSec: 60,  url: '' },
    ],
  },
  day4: {
    title: 'Day 4 — Arms & Weak Points',
    accent: '#d8a4ff',
    exercises: [
      { id: 'd4w1', name: 'Weak Point Exercise #1 (pick from PDF)', sets: 3, reps: 10, restSec: 60, url: '' },
      { id: 'd4w2', name: 'Weak Point Exercise #2 (pick from PDF)', sets: 2, reps: 10, restSec: 60, url: '' },
      { id: 'd4e1', name: 'DB Scott Curl',           sets: 3, reps: 11, restSec: 60, url: 'https://youtu.be/u00CqDeAHTE?si=Bvy35Dc_hcTjT9pK' },
      { id: 'd4e2', name: 'Close-Grip Assisted Dip', sets: 3, reps: 8,  restSec: 60, url: 'https://youtu.be/mpcPTUAhfto?si=VHNG-WmxfbY9hmjn' },
      { id: 'd4e3', name: 'Spider Curl',             sets: 2, reps: 13, restSec: 60, url: 'https://youtu.be/jw9tvoGLJmo?si=fWwgK9iG6AFc6eLz' },
      { id: 'd4e4', name: 'DB Triceps Kickback',     sets: 2, reps: 13, restSec: 60, url: 'https://youtu.be/YdUUYFgpA7g?si=9YPHWgXxnSNmNZIt' },
      { id: 'd4e5', name: 'Donkey Calf Raise',       sets: 3, reps: 13, restSec: 60, url: 'https://youtu.be/0eQQwveeQzw?si=aArHDuEO337Si_XU' },
    ],
  },
  rest: {
    title: 'Mandatory Rest Day',
    accent: '#b6b6b6',
    exercises: [],
  },
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const ROUTINE_CYCLE = ['day1', 'day2', 'day3', 'day4', 'rest'];
const DEFAULT_WEEK = ['rest', 'day1', 'day2', 'rest', 'day3', 'day4', 'rest'];

// Storage keys
const K_WEEK    = 'ppl-week-v1';
const K_HISTORY = 'ppl-history-v2';
const K_CURRENT = 'ppl-current-v2';

// =================================================================
// State
// =================================================================
let week = loadWeek();
let history = loadHistory();
let current = loadCurrent();   // active workout session, or null
let activeTab = currentRoutineKey() === 'rest' ? 'day1' : currentRoutineKey();
let currentPage = 'today';     // 'today' | 'history'

// =================================================================
// Storage
// =================================================================
function loadWeek() {
  try {
    const raw = localStorage.getItem(K_WEEK);
    if (!raw) return [...DEFAULT_WEEK];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== 7) return [...DEFAULT_WEEK];
    return parsed.map((r) => (ROUTINE_CYCLE.includes(r) ? r : 'rest'));
  } catch { return [...DEFAULT_WEEK]; }
}
function saveWeek() { localStorage.setItem(K_WEEK, JSON.stringify(week)); }

function loadHistory() {
  try {
    const raw = localStorage.getItem(K_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveHistory() { localStorage.setItem(K_HISTORY, JSON.stringify(history)); }

function loadCurrent() {
  try {
    const raw = localStorage.getItem(K_CURRENT);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveCurrent() {
  if (current) localStorage.setItem(K_CURRENT, JSON.stringify(current));
  else localStorage.removeItem(K_CURRENT);
}

// =================================================================
// Helpers
// =================================================================
function todayIndex() { return new Date().getDay(); }
function currentRoutineKey() { return week[todayIndex()] || 'rest'; }
function fmt(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

// Time estimate for a routine, in minutes
function estimateMinutes(routineKey) {
  const r = ROUTINES[routineKey];
  if (!r.exercises.length) return 0;
  let secs = WARMUP_MIN * 60;
  r.exercises.forEach((ex) => {
    secs += ex.sets * (ex.reps * SEC_PER_REP + SETUP_SEC + ex.restSec);
  });
  return Math.round(secs / 60);
}

// Find last logged values (weight, reps) for an exercise, walking history newest→oldest
function lastBest(exerciseId) {
  for (let i = history.length - 1; i >= 0; i--) {
    const ex = history[i].exercises.find((e) => e.id === exerciseId);
    if (ex && ex.sets.length) {
      // pick the heaviest set (or last)
      const top = ex.sets.reduce((a, b) => (Number(b.weight) > Number(a.weight) ? b : a));
      return top;
    }
  }
  return null;
}

// =================================================================
// Snackbar
// =================================================================
const snackbar = document.getElementById('snackbar');
let snackTimer = null;
function showSnack(text) {
  snackbar.textContent = text;
  snackbar.classList.add('visible');
  if (snackTimer) clearTimeout(snackTimer);
  snackTimer = setTimeout(() => snackbar.classList.remove('visible'), 2200);
}

// =================================================================
// Week grid
// =================================================================
const weekGrid = document.getElementById('weekGrid');
const todaySub = document.getElementById('todaySub');

function renderWeek() {
  weekGrid.innerHTML = '';
  const today = todayIndex();
  week.forEach((routine, i) => {
    const cell = document.createElement('div');
    cell.className = 'week-day';
    cell.dataset.routine = routine;
    if (i === today) cell.classList.add('today');
    cell.innerHTML = `
      <div class="day-name">${DAYS[i]}</div>
      <div class="day-tag">${routine.toUpperCase()}</div>
    `;
    cell.addEventListener('click', () => {
      const idx = ROUTINE_CYCLE.indexOf(week[i]);
      week[i] = ROUTINE_CYCLE[(idx + 1) % ROUTINE_CYCLE.length];
      saveWeek();
      renderWeek();
      updateTodaySub();
      if (i === today) {
        activeTab = week[i] === 'rest' ? activeTab : week[i];
        renderWorkout();
      }
    });
    weekGrid.appendChild(cell);
  });
}
function updateTodaySub() {
  const r = currentRoutineKey();
  todaySub.textContent = `${DAYS[todayIndex()]} · ${r.toUpperCase()}`;
}

document.getElementById('resetWeekBtn').addEventListener('click', () => {
  week = [...DEFAULT_WEEK];
  saveWeek(); renderWeek(); updateTodaySub(); renderWorkout();
  showSnack('Week reset');
});
document.getElementById('presetBtn').addEventListener('click', () => {
  week = [...DEFAULT_WEEK];
  saveWeek(); renderWeek(); updateTodaySub(); renderWorkout();
  showSnack('Preset applied: Rest/D1/D2/Rest/D3/D4/Rest');
});

// =================================================================
// Workout view
// =================================================================
const tabs = document.querySelectorAll('.md-tab');
const exerciseList = document.getElementById('exerciseList');
const workoutTitle = document.getElementById('workoutTitle');
const workoutSubtitle = document.getElementById('workoutSubtitle');
const routineChip = document.getElementById('routineChip');
const durationChip = document.getElementById('durationChip');
const ytHero = document.getElementById('ytHero');
const ytHeroTitle = document.getElementById('ytHeroTitle');
const ytHeroKicker = document.getElementById('ytHeroKicker');
const videoCaption = document.getElementById('videoCaption');
const finishBtn = document.getElementById('finishBtn');
const cancelWorkoutBtn = document.getElementById('cancelWorkoutBtn');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    if (current && current.routine !== tab.dataset.day) {
      showSnack('Finish or cancel the active workout first');
      return;
    }
    tabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    activeTab = tab.dataset.day;
    renderWorkout();
  });
});

function isTracking() { return current && current.routine === activeTab; }

function renderWorkout() {
  tabs.forEach((t) => t.classList.toggle('active', t.dataset.day === activeTab));

  const r = ROUTINES[activeTab];
  const mins = estimateMinutes(activeTab);
  const overBudget = mins > TIME_BUDGET_MIN;

  workoutTitle.textContent = r.title;
  workoutSubtitle.textContent = `${r.exercises.length} exercises · designed to finish under ${TIME_BUDGET_MIN} minutes.`;
  routineChip.textContent = activeTab.toUpperCase();
  durationChip.textContent = mins ? `~ ${mins} min${overBudget ? ' ⚠' : ''}` : '—';
  durationChip.style.color = overBudget ? 'var(--md-error)' : '';

  exerciseList.innerHTML = '';
  if (!r.exercises.length) {
    exerciseList.innerHTML = `
      <div class="exercise">
        <div class="ex-header">
          <div>
            <h3 class="ex-name">Recovery</h3>
            <div class="ex-meta">
              <span class="pill">walk</span>
              <span class="pill">stretch</span>
              <span class="pill">hydrate</span>
            </div>
          </div>
        </div>
      </div>`;
  } else {
    r.exercises.forEach((ex) => {
      const last = lastBest(ex.id);
      const tracked = isTracking();
      const log = tracked ? (current.log[ex.id] || []) : [];

      const el = document.createElement('div');
      el.className = 'exercise' + (tracked ? ' tracking' : '');
      el.innerHTML = `
        <div class="ex-header">
          <div>
            <h3 class="ex-name">${ex.name}</h3>
            <div class="ex-meta">
              <span class="pill"><b>${ex.sets}</b> × ${ex.reps}</span>
              <span class="pill">rest ${ex.restSec}s</span>
              ${last ? `<span class="pill last">last ${last.weight}kg × ${last.reps}</span>` : ''}
            </div>
          </div>
          <div class="ex-actions">
            <button class="icon-btn small" data-rest="${ex.restSec}" aria-label="Start rest">
              <span class="material-symbols-rounded">timer</span>
            </button>
            ${ex.url ? `<a class="icon-btn small" target="_blank" rel="noopener" href="${ex.url}" aria-label="Watch demo video">
              <span class="material-symbols-rounded">smart_display</span>
            </a>` : ''}
          </div>
        </div>
        <div class="set-rows" data-ex="${ex.id}">
          ${Array.from({ length: ex.sets }, (_, i) => {
            const logged = log[i];
            const placeholderW = last ? last.weight : '';
            const placeholderR = last ? last.reps : ex.reps;
            return `
            <div class="set-row${logged ? ' done' : ''}" data-set="${i}">
              <span class="set-num">${i + 1}</span>
              <input class="input-field" type="number" inputmode="decimal" step="0.5" min="0"
                placeholder="${placeholderW || 'kg'}"
                value="${logged ? logged.weight : ''}"
                ${logged ? 'disabled' : ''}
                data-field="weight" />
              <input class="input-field" type="number" inputmode="numeric" min="0"
                placeholder="${placeholderR}"
                value="${logged ? logged.reps : ''}"
                ${logged ? 'disabled' : ''}
                data-field="reps" />
              <button class="set-log-btn ${logged ? 'done' : ''}" aria-label="Log set">
                <span class="material-symbols-rounded">${logged ? 'check' : 'add'}</span>
              </button>
            </div>`;
          }).join('')}
        </div>
      `;
      // Rest timer button
      el.querySelector('[data-rest]').addEventListener('click', () => {
        setRestPreset(ex.restSec);
        startRest();
        showSnack(`Resting ${ex.restSec}s`);
      });
      // Set log buttons (only relevant when tracking)
      el.querySelectorAll('.set-row').forEach((row) => {
        const idx = Number(row.dataset.set);
        const wEl = row.querySelector('[data-field="weight"]');
        const rEl = row.querySelector('[data-field="reps"]');
        const btn = row.querySelector('.set-log-btn');
        btn.addEventListener('click', () => {
          if (!isTracking()) {
            showSnack('Tap Start Workout first');
            return;
          }
          if (row.classList.contains('done')) return;
          const weight = wEl.value === '' ? (last ? last.weight : 0) : Number(wEl.value);
          const reps = rEl.value === '' ? ex.reps : Number(rEl.value);
          if (!Number.isFinite(weight) || !Number.isFinite(reps)) {
            showSnack('Enter valid numbers');
            return;
          }
          current.log[ex.id] = current.log[ex.id] || [];
          current.log[ex.id][idx] = { weight, reps, ts: Date.now() };
          saveCurrent();
          row.classList.add('done');
          wEl.disabled = true; rEl.disabled = true;
          wEl.value = weight; rEl.value = reps;
          btn.classList.add('done');
          btn.querySelector('.material-symbols-rounded').textContent = 'check';
          // Auto-start rest timer
          setRestPreset(ex.restSec);
          startRest();
          showSnack(`Set ${idx + 1}: ${weight}kg × ${reps}`);
        });
      });
      exerciseList.appendChild(el);
    });
  }

  // Start/Finish button visibility
  const tracking = isTracking();
  finishBtn.style.display = tracking ? '' : 'none';
  cancelWorkoutBtn.style.display = tracking ? '' : 'none';

  // Hero — always points to the warm-up routine video from the PDF
  ytHero.href = WARMUP_VIDEO;
  ytHero.dataset.routine = activeTab;
  ytHeroTitle.textContent = 'Warm-Up Routine';
  ytHeroKicker.textContent = `STARBASE 2.0 · ${activeTab.toUpperCase()}`;
  videoCaption.textContent = 'Arm swings, leg swings, cable rotations — start every session here.';
}

// =================================================================
// Session timer (auto-runs while a workout is active)
// =================================================================
let sessionInterval = null;
const sessionTime = document.getElementById('sessionTime');
const sessionToggle = document.getElementById('sessionToggle');
const sessionResetBtn = document.getElementById('sessionReset');
const sessionIcon = document.getElementById('sessionIcon');
const sessionLabel = document.getElementById('sessionLabel');
const sessionProgress = document.getElementById('sessionProgress');

function sessionElapsedSec() {
  if (!current) return 0;
  if (current.paused) return current.accumSec || 0;
  return (current.accumSec || 0) + Math.floor((Date.now() - current.resumedAt) / 1000);
}
function tickSession() {
  const s = sessionElapsedSec();
  sessionTime.textContent = fmt(s);
  const target = TIME_BUDGET_MIN * 60;
  sessionProgress.style.width = `${Math.min(100, (s / target) * 100)}%`;
}
function startSessionTimer() {
  if (sessionInterval) return;
  sessionInterval = setInterval(tickSession, 1000);
}
function stopSessionTimer() {
  if (sessionInterval) clearInterval(sessionInterval);
  sessionInterval = null;
}

function syncSessionUI() {
  const tracking = !!current;
  if (tracking) {
    if (current.paused) {
      sessionIcon.textContent = 'play_arrow';
      sessionLabel.textContent = 'Resume';
    } else {
      sessionIcon.textContent = 'pause';
      sessionLabel.textContent = 'Pause';
    }
  } else {
    sessionIcon.textContent = 'play_arrow';
    sessionLabel.textContent = 'Start Workout';
  }
  tickSession();
}

sessionToggle.addEventListener('click', () => {
  if (!current) {
    // Start a fresh workout for the active tab
    if (ROUTINES[activeTab].exercises.length === 0) {
      showSnack('Nothing to track on a rest day');
      return;
    }
    current = {
      id: `s_${Date.now()}`,
      routine: activeTab,
      startedAt: Date.now(),
      resumedAt: Date.now(),
      accumSec: 0,
      paused: false,
      log: {},
    };
    saveCurrent();
    startSessionTimer();
    renderWorkout();
    syncSessionUI();
    showSnack(`Started ${activeTab.toUpperCase()} workout`);
    return;
  }
  // Toggle pause/resume
  if (current.paused) {
    current.resumedAt = Date.now();
    current.paused = false;
    startSessionTimer();
  } else {
    current.accumSec = sessionElapsedSec();
    current.paused = true;
    stopSessionTimer();
  }
  saveCurrent();
  syncSessionUI();
});

sessionResetBtn.addEventListener('click', () => {
  if (!current) return;
  if (!confirm('Reset session timer to 00:00?')) return;
  current.accumSec = 0;
  current.resumedAt = Date.now();
  saveCurrent();
  tickSession();
});

cancelWorkoutBtn.addEventListener('click', () => {
  if (!confirm('Cancel workout? Logged sets will be discarded.')) return;
  current = null;
  saveCurrent();
  stopSessionTimer();
  sessionTime.textContent = '00:00';
  sessionProgress.style.width = '0%';
  syncSessionUI();
  renderWorkout();
  showSnack('Workout cancelled');
});

// =================================================================
// Finish workout — save to history, show summary
// =================================================================
const summaryScrim = document.getElementById('summaryScrim');
const summaryBody = document.getElementById('summaryBody');
document.getElementById('summaryDismiss').addEventListener('click', () => {
  summaryScrim.style.display = 'none';
});

finishBtn.addEventListener('click', () => {
  if (!current) return;
  const r = ROUTINES[current.routine];
  const durationSec = sessionElapsedSec();
  const exercises = r.exercises.map((ex) => ({
    id: ex.id,
    name: ex.name,
    sets: (current.log[ex.id] || []).filter(Boolean),
  })).filter((e) => e.sets.length > 0);

  if (exercises.length === 0) {
    if (!confirm('No sets logged. Finish anyway?')) return;
  }

  let totalSets = 0, totalReps = 0, totalVolume = 0;
  exercises.forEach((e) => e.sets.forEach((s) => {
    totalSets++;
    totalReps += Number(s.reps) || 0;
    totalVolume += (Number(s.weight) || 0) * (Number(s.reps) || 0);
  }));

  const session = {
    id: current.id,
    date: Date.now(),
    routine: current.routine,
    durationSec,
    totalSets, totalReps, totalVolume,
    exercises,
  };
  history.push(session);
  saveHistory();

  current = null;
  saveCurrent();
  stopSessionTimer();
  sessionTime.textContent = '00:00';
  sessionProgress.style.width = '0%';
  syncSessionUI();
  renderWorkout();

  // Show summary dialog
  summaryBody.innerHTML = `
    <div class="summary-stat"><span>Routine</span><b>${session.routine.toUpperCase()}</b></div>
    <div class="summary-stat"><span>Duration</span><b>${fmt(durationSec)}</b></div>
    <div class="summary-stat"><span>Sets logged</span><b>${totalSets}</b></div>
    <div class="summary-stat"><span>Total reps</span><b>${totalReps}</b></div>
    <div class="summary-stat"><span>Total volume</span><b>${Math.round(totalVolume)} kg</b></div>
  `;
  summaryScrim.style.display = '';
  showSnack('Workout saved to history');
});

// =================================================================
// Rest timer
// =================================================================
let restTotal = 90;
let restRemaining = 90;
let restInterval = null;
const restDisplay = document.getElementById('restDisplay');
const restDock = document.getElementById('restDock');

function setRestPreset(secs) {
  restTotal = secs;
  restRemaining = secs;
  restDisplay.textContent = fmt(restRemaining);
  document.querySelectorAll('.rest-presets button').forEach((b) => {
    b.classList.toggle('active', Number(b.dataset.secs) === secs);
  });
}
function tickRest() {
  restRemaining--;
  restDisplay.textContent = fmt(Math.max(0, restRemaining));
  if (restRemaining <= 0) {
    clearInterval(restInterval);
    restInterval = null;
    restDock.classList.add('alarm');
    if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
    setTimeout(() => restDock.classList.remove('alarm'), 3000);
  }
}
function startRest() {
  if (restInterval) clearInterval(restInterval);
  if (restRemaining <= 0) restRemaining = restTotal;
  restInterval = setInterval(tickRest, 1000);
  restDock.classList.remove('alarm');
}

document.querySelectorAll('.rest-presets button').forEach((b) => {
  b.addEventListener('click', () => setRestPreset(Number(b.dataset.secs)));
});
document.getElementById('restStart').addEventListener('click', startRest);
document.getElementById('restPause').addEventListener('click', () => {
  if (restInterval) { clearInterval(restInterval); restInterval = null; }
});
document.getElementById('restReset').addEventListener('click', () => {
  if (restInterval) { clearInterval(restInterval); restInterval = null; }
  restRemaining = restTotal;
  restDisplay.textContent = fmt(restRemaining);
  restDock.classList.remove('alarm');
});

// =================================================================
// History page
// =================================================================
const pageToday = document.getElementById('page-today');
const pageHistory = document.getElementById('page-history');
const historyList = document.getElementById('historyList');
const historySummary = document.getElementById('historySummary');

document.getElementById('historyBtn').addEventListener('click', () => {
  currentPage = currentPage === 'history' ? 'today' : 'history';
  pageToday.style.display = currentPage === 'today' ? '' : 'none';
  pageHistory.style.display = currentPage === 'history' ? '' : 'none';
  if (currentPage === 'history') renderHistory();
});
document.getElementById('planBtn').addEventListener('click', () => {
  currentPage = 'today';
  pageToday.style.display = '';
  pageHistory.style.display = 'none';
  document.getElementById('weekGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.getElementById('clearHistoryBtn').addEventListener('click', () => {
  if (!history.length) return;
  if (!confirm(`Clear all ${history.length} sessions from history?`)) return;
  history = [];
  saveHistory();
  renderHistory();
  showSnack('History cleared');
});

function renderHistory() {
  if (!history.length) {
    historySummary.textContent = 'No sessions yet — log one to start tracking.';
    historyList.innerHTML = `<div class="history-empty">
      <span class="material-symbols-rounded" style="font-size:48px;opacity:0.4">timeline</span>
      <p class="body-medium on-surface-variant">Your finished workouts will appear here.</p>
    </div>`;
    return;
  }
  const totalVolume = history.reduce((a, s) => a + (s.totalVolume || 0), 0);
  const totalMin = Math.round(history.reduce((a, s) => a + (s.durationSec || 0), 0) / 60);
  historySummary.textContent = `${history.length} sessions · ${totalMin} total minutes · ${Math.round(totalVolume).toLocaleString()} kg total volume`;

  historyList.innerHTML = '';
  // Newest first
  [...history].reverse().forEach((s) => {
    const exsHTML = s.exercises.map((ex) => {
      const top = ex.sets.reduce((a, b) => (Number(b.weight) > Number(a.weight) ? b : a), ex.sets[0]);
      const totalReps = ex.sets.reduce((a, b) => a + Number(b.reps), 0);
      return `<div class="ex-row">
        <span class="name">${ex.name}</span>
        <span>${ex.sets.length} sets · ${totalReps} reps · top ${top.weight}kg</span>
      </div>`;
    }).join('');
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
      <div class="history-head">
        <div>
          <div class="history-date">${fmtDate(s.date)}</div>
          <div class="history-meta">
            <span>${(s.routine || '').toUpperCase()}</span>
            <span>${fmt(s.durationSec)}</span>
            <span>${s.totalSets} sets</span>
            <span>${Math.round(s.totalVolume).toLocaleString()} kg</span>
          </div>
        </div>
      </div>
      <div class="history-exs">${exsHTML}</div>
    `;
    historyList.appendChild(item);
  });
}

// =================================================================
// Init
// =================================================================
function init() {
  renderWeek();
  updateTodaySub();
  if (current) {
    activeTab = current.routine;
    if (!current.paused) {
      // Resume timing from when it was last persisted
      current.resumedAt = Date.now();
      saveCurrent();
      startSessionTimer();
    }
  }
  renderWorkout();
  syncSessionUI();
  setRestPreset(90);
}

init();
