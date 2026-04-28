// =================== DATA ===================
const ROUTINES = {
  push: {
    title: 'Push Day — Chest · Shoulders · Triceps',
    color: '#ef4444',
    heroTitle: 'Chest Press Machine — Latest Tutorials',
    searchQuery: 'chest press machine tutorial',
    exercises: [
      { name: 'Chest Press Machine', sets: '4 x 8-10', rest: '90s', yt: 'chest press machine tutorial' },
      { name: 'Smith Machine Incline Bench', sets: '3 x 10', rest: '90s', yt: 'smith machine incline bench press' },
      { name: 'Shoulder Press Machine', sets: '4 x 10', rest: '90s', yt: 'shoulder press machine tutorial' },
      { name: 'Cable Lateral Raise', sets: '3 x 12-15', rest: '60s', yt: 'cable lateral raise machine' },
      { name: 'Pec Deck Fly', sets: '3 x 12', rest: '60s', yt: 'pec deck machine fly' },
      { name: 'Tricep Pushdown (Cable)', sets: '4 x 12', rest: '60s', yt: 'tricep pushdown cable machine' },
      { name: 'Assisted Dip Machine', sets: '3 x 10', rest: '90s', yt: 'assisted dip machine tutorial' },
    ],
  },
  pull: {
    title: 'Pull Day — Back · Biceps · Rear Delts',
    color: '#3b82f6',
    heroTitle: 'Lat Pulldown — Latest Tutorials',
    searchQuery: 'lat pulldown machine tutorial',
    exercises: [
      { name: 'Lat Pulldown', sets: '4 x 10', rest: '90s', yt: 'lat pulldown machine tutorial' },
      { name: 'Seated Cable Row', sets: '4 x 10', rest: '90s', yt: 'seated cable row machine' },
      { name: 'Chest-Supported Row Machine', sets: '3 x 10', rest: '90s', yt: 'chest supported row machine' },
      { name: 'Cable Face Pull', sets: '3 x 15', rest: '60s', yt: 'cable face pull tutorial' },
      { name: 'Reverse Pec Deck', sets: '3 x 12-15', rest: '60s', yt: 'reverse pec deck rear delt' },
      { name: 'Preacher Curl Machine', sets: '4 x 10', rest: '60s', yt: 'preacher curl machine tutorial' },
      { name: 'Cable Hammer Curl (Rope)', sets: '3 x 12', rest: '60s', yt: 'cable hammer curl rope' },
    ],
  },
  legs: {
    title: 'Leg Day — Quads · Hamstrings · Glutes · Calves',
    color: '#22c55e',
    heroTitle: 'Leg Press Machine — Latest Tutorials',
    searchQuery: 'leg press machine tutorial',
    exercises: [
      { name: 'Leg Press Machine', sets: '4 x 10', rest: '120s', yt: 'leg press machine tutorial' },
      { name: 'Hack Squat Machine', sets: '4 x 8-10', rest: '120s', yt: 'hack squat machine tutorial' },
      { name: 'Leg Extension', sets: '3 x 12', rest: '60s', yt: 'leg extension machine tutorial' },
      { name: 'Lying Leg Curl', sets: '4 x 10-12', rest: '60s', yt: 'lying leg curl machine' },
      { name: 'Hip Thrust Machine', sets: '3 x 10', rest: '90s', yt: 'hip thrust machine tutorial' },
      { name: 'Standing Calf Raise Machine', sets: '4 x 12-15', rest: '60s', yt: 'standing calf raise machine' },
      { name: 'Seated Calf Raise', sets: '3 x 15', rest: '45s', yt: 'seated calf raise machine' },
    ],
  },
  rest: {
    title: 'Rest Day',
    color: '#6b7280',
    heroTitle: 'Mobility & Recovery — Latest',
    searchQuery: 'mobility recovery routine for lifters',
    exercises: [],
  },
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const ROUTINE_CYCLE = ['push', 'pull', 'legs', 'rest'];
const DEFAULT_WEEK = ['rest', 'push', 'pull', 'legs', 'rest', 'push', 'pull'];
const PRESET_PPL = ['rest', 'push', 'pull', 'legs', 'rest', 'push', 'pull'];

const STORAGE_KEY = 'ppl-week-v1';

// =================== STATE ===================
let week = loadWeek();
let activeTab = currentRoutineKey() === 'rest' ? 'push' : currentRoutineKey();

// =================== HELPERS ===================
function loadWeek() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...DEFAULT_WEEK];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== 7) return [...DEFAULT_WEEK];
    return parsed.map((r) => (ROUTINE_CYCLE.includes(r) ? r : 'rest'));
  } catch {
    return [...DEFAULT_WEEK];
  }
}
function saveWeek() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(week));
}
function todayIndex() { return new Date().getDay(); }
function currentRoutineKey() { return week[todayIndex()] || 'rest'; }

function ytSearchUrl(query) {
  // sp=CAI%253D sorts results by upload date (latest first)
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=CAI%253D`;
}

function fmt(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// =================== WEEK GRID ===================
const weekGrid = document.getElementById('weekGrid');
const todayPill = document.getElementById('todayPill');

function renderWeek() {
  weekGrid.innerHTML = '';
  const today = todayIndex();
  week.forEach((routine, i) => {
    const cell = document.createElement('div');
    cell.className = 'week-day';
    cell.dataset.routine = routine;
    if (i === today) cell.classList.add('today');
    cell.innerHTML = `
      <div class="day-name">${DAYS[i]}${i === today ? ' · today' : ''}</div>
      <div class="day-tag">${routine.toUpperCase()}</div>
    `;
    cell.addEventListener('click', () => {
      const idx = ROUTINE_CYCLE.indexOf(week[i]);
      week[i] = ROUTINE_CYCLE[(idx + 1) % ROUTINE_CYCLE.length];
      saveWeek();
      renderWeek();
      updateTodayPill();
      // if user changed today's routine, update workout view
      if (i === today) {
        activeTab = week[i] === 'rest' ? activeTab : week[i];
        renderWorkout();
      }
    });
    weekGrid.appendChild(cell);
  });
}

function updateTodayPill() {
  const r = currentRoutineKey();
  const dayName = DAYS[todayIndex()];
  todayPill.textContent = `${dayName} · ${r.toUpperCase()}`;
  todayPill.style.borderColor = ROUTINES[r].color;
}

document.getElementById('resetWeekBtn').addEventListener('click', () => {
  week = [...DEFAULT_WEEK];
  saveWeek();
  renderWeek();
  updateTodayPill();
  renderWorkout();
});

document.getElementById('presetBtn').addEventListener('click', () => {
  week = [...PRESET_PPL];
  saveWeek();
  renderWeek();
  updateTodayPill();
  renderWorkout();
});

// =================== WORKOUT VIEW ===================
const tabs = document.querySelectorAll('.tab');
const exerciseList = document.getElementById('exerciseList');
const workoutSubtitle = document.getElementById('workoutSubtitle');
const ytHero = document.getElementById('ytHero');
const ytHeroTitle = document.getElementById('ytHeroTitle');
const ytHeroKicker = document.getElementById('ytHeroKicker');
const videoCaption = document.getElementById('videoCaption');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    activeTab = tab.dataset.day;
    renderWorkout();
  });
});

function renderWorkout() {
  // sync tab active state
  tabs.forEach((t) => t.classList.toggle('active', t.dataset.day === activeTab));

  const r = ROUTINES[activeTab];
  workoutSubtitle.textContent = r.title;

  exerciseList.innerHTML = '';
  if (!r.exercises.length) {
    exerciseList.innerHTML = `<div class="exercise"><div class="ex-info"><h3>Recovery</h3><div class="meta">Walk · stretch · hydrate</div></div></div>`;
  } else {
    r.exercises.forEach((ex) => {
      const restSecs = parseInt(ex.rest, 10) || 90;
      const el = document.createElement('div');
      el.className = 'exercise';
      el.innerHTML = `
        <div class="ex-info">
          <h3>${ex.name}</h3>
          <div class="meta">
            <span><b>${ex.sets}</b> sets</span>
            <span>Rest <b>${ex.rest}</b></span>
          </div>
        </div>
        <div class="ex-actions">
          <button class="btn small primary" data-rest="${restSecs}">Start Rest</button>
          <a class="btn small ghost" target="_blank" rel="noopener" href="${ytSearchUrl(ex.yt)}">Latest YT ↗</a>
        </div>
      `;
      el.querySelector('[data-rest]').addEventListener('click', (e) => {
        const s = parseInt(e.currentTarget.dataset.rest, 10);
        setRestPreset(s);
        startRest();
      });
      exerciseList.appendChild(el);
    });
  }

  // featured hero
  ytHero.href = ytSearchUrl(r.searchQuery);
  ytHero.dataset.routine = activeTab;
  ytHeroTitle.textContent = r.heroTitle;
  ytHeroKicker.textContent = `YOUTUBE · LATEST · ${activeTab.toUpperCase()}`;
  videoCaption.textContent = `Latest YouTube uploads for "${r.searchQuery}".`;
}

// =================== SESSION TIMER ===================
let sessionSecs = 0;
let sessionInterval = null;
const sessionTime = document.getElementById('sessionTime');
const sessionToggle = document.getElementById('sessionToggle');
const sessionResetBtn = document.getElementById('sessionReset');

function tickSession() {
  sessionSecs++;
  sessionTime.textContent = fmt(sessionSecs);
}
sessionToggle.addEventListener('click', () => {
  if (sessionInterval) {
    clearInterval(sessionInterval);
    sessionInterval = null;
    sessionToggle.textContent = 'Resume';
  } else {
    sessionInterval = setInterval(tickSession, 1000);
    sessionToggle.textContent = 'Pause';
  }
});
sessionResetBtn.addEventListener('click', () => {
  clearInterval(sessionInterval);
  sessionInterval = null;
  sessionSecs = 0;
  sessionTime.textContent = '00:00';
  sessionToggle.textContent = 'Start';
});

// =================== REST TIMER ===================
let restTotal = 90;
let restRemaining = 90;
let restInterval = null;
const restDisplay = document.getElementById('restDisplay');
const restDock = document.getElementById('restDock');
const dingAudio = document.getElementById('dingAudio');

function setRestPreset(secs) {
  restTotal = secs;
  restRemaining = secs;
  restDisplay.textContent = fmt(restRemaining);
  document.querySelectorAll('.rest-presets button').forEach((b) => {
    b.classList.toggle('active', parseInt(b.dataset.secs, 10) === secs);
  });
}
function tickRest() {
  restRemaining--;
  restDisplay.textContent = fmt(Math.max(0, restRemaining));
  if (restRemaining <= 0) {
    clearInterval(restInterval);
    restInterval = null;
    restDock.classList.add('alarm');
    try { dingAudio.play(); } catch {}
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
  b.addEventListener('click', () => setRestPreset(parseInt(b.dataset.secs, 10)));
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

// =================== INIT ===================
renderWeek();
updateTodayPill();
renderWorkout();
setRestPreset(90);
