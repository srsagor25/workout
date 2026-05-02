// =================================================================
// Workout Helper — multi-program edition
// Vanilla JS, MD3 styling, localStorage persistence
// =================================================================

// --- Time budget helpers ---
const SEC_PER_REP = 3;
const SETUP_SEC = 5;
const WARMUP_MIN = 5;
const TIME_BUDGET_MIN = 60;

const WARMUP_VIDEO = 'https://youtu.be/tFpwBr_7KPg?si=mC4_uHgulB38cPTK';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// =================================================================
// Built-in programs
// =================================================================
const BUILTIN_PROGRAMS = {
  full_body_4day: {
    id: 'full_body_4day',
    name: 'Full Body 4-Day',
    subtitle: '4-day Full Body split with weak-point work',
    builtin: true,
    days: [
      {
        id: 'day1', name: 'Mix', accent: '#ff8a72', icon: 'looks_one',
        exercises: [
          { id: 'd1e1', name: 'Back Squat',        sets: 4, reps: 8,  restSec: 150, url: 'https://youtu.be/-bJIpOq-LWk?si=c41lylC_OqturUN6' },
          { id: 'd1e2', name: 'Bench Press',       sets: 4, reps: 8,  restSec: 150, url: 'https://youtu.be/SCVCLChPQFY?si=MbIdKTjcoMBKGHcs' },
          { id: 'd1e3', name: 'Barbell Row',       sets: 4, reps: 8,  restSec: 90,  url: 'https://youtu.be/6FZHJGzMFEc?si=EPrKQ-nMZI8O95o8' },
          { id: 'd1e4', name: 'Dumbbell Curl',     sets: 3, reps: 11, restSec: 60,  url: 'https://youtu.be/HnHuhf4hEWY?si=cLp6Onrbvwd1MdzV' },
          { id: 'd1e5', name: 'Hanging Leg Raise', sets: 3, reps: 15, restSec: 60,  url: 'https://www.youtube.com/watch?v=Pr1ieGZ5atk' },
        ],
      },
      {
        id: 'day2', name: 'Pull', accent: '#94b8ff', icon: 'looks_two',
        exercises: [
          { id: 'd2e1', name: 'Deadlift',       sets: 5, reps: 6,  restSec: 150, url: 'https://youtu.be/AweC3UaM14o?si=EpmzLOqYdL5edfmi' },
          { id: 'd2e2', name: 'Overhead Press', sets: 4, reps: 8,  restSec: 120, url: 'https://youtu.be/cGnhixvC8uA?si=A3JcKPo0jkHe9X5c' },
          { id: 'd2e3', name: 'Pull-Up',        sets: 4, reps: 9,  restSec: 120, url: 'https://www.youtube.com/watch?v=sIvJTfGxdFo' },
          { id: 'd2e4', name: 'Face Pull',      sets: 3, reps: 15, restSec: 60,  url: 'https://youtu.be/0Po47vvj9g4?si=gZtsKeLP6hKinp5E' },
          { id: 'd2e5', name: 'Rope Pushdown',  sets: 3, reps: 13, restSec: 60,  url: 'https://youtu.be/-xa-6cQaZKY?si=84EsGv9_4u7zyCKa' },
        ],
      },
      {
        id: 'day3', name: 'Power', accent: '#92dca6', icon: 'looks_3',
        exercises: [
          { id: 'd3e1', name: 'Front Squat',            sets: 4, reps: 8,  restSec: 150, url: 'https://youtu.be/HHxNbhP16UE?si=7ix7aLdmn9ztX0H6' },
          { id: 'd3e2', name: 'Incline Dumbbell Press', sets: 4, reps: 9,  restSec: 120, url: 'https://youtu.be/5CECBjd7HLQ?si=L6I2RvdiWKGXMe8I' },
          { id: 'd3e3', name: 'Seated Row',             sets: 4, reps: 10, restSec: 60,  url: 'https://youtu.be/lJoozxC0Rns?si=KRIZgwtBUkvMv9gt' },
          { id: 'd3e4', name: 'Calf Raise',             sets: 3, reps: 17, restSec: 60,  url: 'https://youtu.be/_iYwv4QVFjM?si=ao4HVUbmomEmvp8u' },
          { id: 'd3e5', name: 'Plank (60s hold)',       sets: 3, reps: 20, restSec: 60,  url: 'https://www.youtube.com/watch?v=mwlp75MS6Rg' },
        ],
      },
      {
        id: 'day4', name: 'Arms', accent: '#d8a4ff', icon: 'looks_4',
        exercises: [
          { id: 'd4w1', name: 'Weak Point Exercise #1', sets: 3, reps: 10, restSec: 60, url: '' },
          { id: 'd4w2', name: 'Weak Point Exercise #2', sets: 2, reps: 10, restSec: 60, url: '' },
          { id: 'd4e1', name: 'DB Scott Curl',           sets: 3, reps: 11, restSec: 60, url: 'https://youtu.be/u00CqDeAHTE?si=Bvy35Dc_hcTjT9pK' },
          { id: 'd4e2', name: 'Close-Grip Assisted Dip', sets: 3, reps: 8,  restSec: 60, url: 'https://youtu.be/mpcPTUAhfto?si=VHNG-WmxfbY9hmjn' },
          { id: 'd4e3', name: 'Spider Curl',             sets: 2, reps: 13, restSec: 60, url: 'https://youtu.be/jw9tvoGLJmo?si=fWwgK9iG6AFc6eLz' },
          { id: 'd4e4', name: 'DB Triceps Kickback',     sets: 2, reps: 13, restSec: 60, url: 'https://youtu.be/YdUUYFgpA7g?si=9YPHWgXxnSNmNZIt' },
          { id: 'd4e5', name: 'Donkey Calf Raise',       sets: 3, reps: 13, restSec: 60, url: 'https://youtu.be/0eQQwveeQzw?si=aArHDuEO337Si_XU' },
        ],
      },
    ],
    defaultWeek: ['rest', 'day1', 'day2', 'rest', 'day3', 'day4', 'rest'],
  },
  ppl: {
    id: 'ppl',
    name: 'Push / Pull / Legs',
    subtitle: 'Classic 6-day machine-based split',
    builtin: true,
    days: [
      {
        id: 'push', name: 'Push', accent: '#ff8a72', icon: 'arrow_upward',
        exercises: [
          { id: 'p1', name: 'Chest Press Machine',     sets: 4, reps: 10, restSec: 90, url: 'https://youtu.be/65npK4Ijz1c?si=6u8CbHJBZ_XFTL-i' },
          { id: 'p2', name: 'Incline Dumbbell Press',  sets: 3, reps: 10, restSec: 90, url: 'https://youtu.be/5CECBjd7HLQ?si=L6I2RvdiWKGXMe8I' },
          { id: 'p3', name: 'Machine Shoulder Press',  sets: 3, reps: 10, restSec: 90, url: 'https://youtu.be/MjVDrYPD7Rs?si=439qKoj2fgS92tt0' },
          { id: 'p4', name: 'Machine Lateral Raise',   sets: 3, reps: 12, restSec: 60, url: 'https://youtu.be/tavibkNpZLI?si=H_gMuhLzn9VHizn9' },
          { id: 'p5', name: 'Low Incline DB Flye',     sets: 3, reps: 12, restSec: 60, url: 'https://youtu.be/frlR1vLdimA?si=w9IDHGmuM1kEJPoV' },
          { id: 'p6', name: 'Rope Pushdown',           sets: 4, reps: 12, restSec: 60, url: 'https://youtu.be/-xa-6cQaZKY?si=84EsGv9_4u7zyCKa' },
        ],
      },
      {
        id: 'pull', name: 'Pull', accent: '#94b8ff', icon: 'arrow_downward',
        exercises: [
          { id: 'pl1', name: 'Half-Kneeling 1-Arm Lat Pulldown', sets: 4, reps: 10, restSec: 90, url: 'https://youtu.be/KXMROsEH6c8?si=q7W5VzwFz8II88Pt' },
          { id: 'pl2', name: 'Seated Row',                       sets: 4, reps: 10, restSec: 90, url: 'https://youtu.be/lJoozxC0Rns?si=KRIZgwtBUkvMv9gt' },
          { id: 'pl3', name: 'Barbell Row',                      sets: 3, reps: 10, restSec: 90, url: 'https://youtu.be/6FZHJGzMFEc?si=EPrKQ-nMZI8O95o8' },
          { id: 'pl4', name: 'Face Pull',                        sets: 3, reps: 15, restSec: 60, url: 'https://youtu.be/0Po47vvj9g4?si=gZtsKeLP6hKinp5E' },
          { id: 'pl5', name: 'DB Scott Curl',                    sets: 3, reps: 10, restSec: 60, url: 'https://youtu.be/u00CqDeAHTE?si=Bvy35Dc_hcTjT9pK' },
          { id: 'pl6', name: 'Spider Curl',                      sets: 3, reps: 12, restSec: 45, url: 'https://youtu.be/jw9tvoGLJmo?si=fWwgK9iG6AFc6eLz' },
        ],
      },
      {
        id: 'legs', name: 'Legs', accent: '#92dca6', icon: 'directions_run',
        exercises: [
          { id: 'lg1', name: 'Back Squat',          sets: 4, reps: 10, restSec: 120, url: 'https://youtu.be/-bJIpOq-LWk?si=c41lylC_OqturUN6' },
          { id: 'lg2', name: 'Front Squat',         sets: 3, reps: 8,  restSec: 120, url: 'https://youtu.be/HHxNbhP16UE?si=7ix7aLdmn9ztX0H6' },
          { id: 'lg3', name: 'Single-Leg Leg Press',sets: 3, reps: 10, restSec: 90,  url: 'https://youtu.be/gspQiEILqOw?si=iCGxHfmBmxLUgnsV' },
          { id: 'lg4', name: 'Barbell Hip Thrust',  sets: 3, reps: 10, restSec: 90,  url: 'https://youtu.be/5S8SApGU_Lk?si=x9eExGiEtPGbpSpz' },
          { id: 'lg5', name: 'Calf Raise',          sets: 4, reps: 15, restSec: 60,  url: 'https://youtu.be/_iYwv4QVFjM?si=ao4HVUbmomEmvp8u' },
          { id: 'lg6', name: 'Donkey Calf Raise',   sets: 3, reps: 12, restSec: 45,  url: 'https://youtu.be/0eQQwveeQzw?si=aArHDuEO337Si_XU' },
        ],
      },
    ],
    defaultWeek: ['rest', 'push', 'pull', 'legs', 'push', 'pull', 'legs'],
  },
};
const BUILTIN_IDS = Object.keys(BUILTIN_PROGRAMS);

// =================================================================
// Storage
// =================================================================
const K_PROGRAMS = 'wo-custom-programs-v1';
const K_ACTIVE   = 'wo-active-program-v1';
const K_WEEKS    = 'wo-weeks-v1';
const K_HISTORY  = 'ppl-history-v2';
const K_CURRENT  = 'ppl-current-v2';
const K_WEEK_LEGACY = 'ppl-week-v1';

function loadCustomPrograms() {
  try {
    const raw = localStorage.getItem(K_PROGRAMS);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}
function saveCustomPrograms() {
  localStorage.setItem(K_PROGRAMS, JSON.stringify(customPrograms));
}

function loadActiveProgramId() {
  const id = localStorage.getItem(K_ACTIVE) || 'full_body_4day';
  return id === 'starbase' ? 'full_body_4day' : id;
}
function saveActiveProgramId() {
  localStorage.setItem(K_ACTIVE, activeProgramId);
}

function loadWeeks() {
  try {
    const raw = localStorage.getItem(K_WEEKS);
    if (raw) return JSON.parse(raw) || {};
  } catch {}
  return {};
}
function saveWeeks() { localStorage.setItem(K_WEEKS, JSON.stringify(weeks)); }

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(K_HISTORY) || '[]'); }
  catch { return []; }
}
function saveHistory() { localStorage.setItem(K_HISTORY, JSON.stringify(history)); }

function loadCurrent() {
  try { return JSON.parse(localStorage.getItem(K_CURRENT) || 'null'); }
  catch { return null; }
}
function saveCurrent() {
  if (current) localStorage.setItem(K_CURRENT, JSON.stringify(current));
  else localStorage.removeItem(K_CURRENT);
}

// One-shot migrations:
//  - rename legacy 'starbase' program key to 'full_body_4day'
//  - import the very old per-app K_WEEK_LEGACY blob as the default program's week
function runMigrations() {
  let dirty = false;
  if (weeks.starbase && !weeks.full_body_4day) {
    weeks.full_body_4day = weeks.starbase;
    delete weeks.starbase;
    dirty = true;
  }
  if (!weeks.full_body_4day) {
    const raw = localStorage.getItem(K_WEEK_LEGACY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === 7) {
          weeks.full_body_4day = parsed;
          dirty = true;
        }
      } catch {}
    }
  }
  if (dirty) saveWeeks();
  if (localStorage.getItem(K_ACTIVE) === 'starbase') {
    localStorage.setItem(K_ACTIVE, 'full_body_4day');
  }
}

// =================================================================
// State
// =================================================================
let customPrograms = loadCustomPrograms();
let activeProgramId = loadActiveProgramId();
let weeks = loadWeeks();
runMigrations();

let history = loadHistory();
let current = loadCurrent();
let activeTab = '';        // active dayId in current program
let currentPage = 'today'; // 'today' | 'history' | 'programs' | 'editor'
let editorState = null;    // { mode: 'create'|'edit'|'clone', program: {...} }

// =================================================================
// Program helpers
// =================================================================
function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}
function getProgram(id) {
  return BUILTIN_PROGRAMS[id] || customPrograms.find((p) => p.id === id) || null;
}
function getActiveProgram() {
  return getProgram(activeProgramId) || BUILTIN_PROGRAMS.full_body_4day;
}
function isBuiltin(id) {
  return BUILTIN_IDS.includes(id);
}
function getAllPrograms() {
  return [...BUILTIN_IDS.map((id) => BUILTIN_PROGRAMS[id]), ...customPrograms];
}
function getActiveWeek() {
  const id = activeProgramId;
  if (!Array.isArray(weeks[id]) || weeks[id].length !== 7) {
    const program = getActiveProgram();
    weeks[id] = [...(program.defaultWeek || ['rest','rest','rest','rest','rest','rest','rest'])];
    saveWeeks();
  }
  return weeks[id];
}
function setActiveWeekDay(i, dayId) {
  const w = getActiveWeek();
  w[i] = dayId;
  saveWeeks();
}
function getDayCycle(program) {
  return [...program.days.map((d) => d.id), 'rest'];
}
function getDay(program, dayId) {
  if (!dayId || dayId === 'rest') return null;
  return program.days.find((d) => d.id === dayId) || null;
}
function todayIndex() { return new Date().getDay(); }
function todayDayId() {
  const id = getActiveWeek()[todayIndex()] || 'rest';
  // If the stored day no longer exists in this program, fall back to rest
  if (id === 'rest') return 'rest';
  return getDay(getActiveProgram(), id) ? id : 'rest';
}
function pickDefaultActiveTab() {
  const today = todayDayId();
  if (today !== 'rest') return today;
  const program = getActiveProgram();
  return program.days[0]?.id || 'rest';
}

// =================================================================
// Misc helpers
// =================================================================
function fmt(secs) {
  const m = Math.floor(Math.max(0, secs) / 60).toString().padStart(2, '0');
  const s = Math.floor(Math.max(0, secs) % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
function fmtDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}
function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;',
  }[c]));
}
function estimateMinutes(day) {
  if (!day || !day.exercises.length) return 0;
  let secs = WARMUP_MIN * 60;
  day.exercises.forEach((ex) => {
    secs += ex.sets * (ex.reps * SEC_PER_REP + SETUP_SEC + ex.restSec);
  });
  return Math.round(secs / 60);
}
function lastBest(exerciseId) {
  for (let i = history.length - 1; i >= 0; i--) {
    const ex = history[i].exercises.find((e) => e.id === exerciseId);
    if (ex && ex.sets.length) {
      return ex.sets.reduce((a, b) => (Number(b.weight) > Number(a.weight) ? b : a));
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
// Page navigation
// =================================================================
const pageToday    = document.getElementById('page-today');
const pageHistory  = document.getElementById('page-history');
const pagePrograms = document.getElementById('page-programs');
const pageEditor   = document.getElementById('page-editor');

function showPage(id) {
  currentPage = id;
  pageToday.style.display    = id === 'today'    ? '' : 'none';
  pageHistory.style.display  = id === 'history'  ? '' : 'none';
  pagePrograms.style.display = id === 'programs' ? '' : 'none';
  pageEditor.style.display   = id === 'editor'   ? '' : 'none';
  document.querySelectorAll('.app-bar-actions [data-nav]').forEach((b) => {
    b.classList.toggle('active', b.dataset.nav === id);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('todayBtn').addEventListener('click', () => showPage('today'));
document.getElementById('historyBtn').addEventListener('click', () => {
  showPage('history');
  renderHistory();
});
document.getElementById('programsBtn').addEventListener('click', () => {
  showPage('programs');
  renderPrograms();
});

// =================================================================
// Brand area / today subtitle
// =================================================================
const brandTitleEl = document.getElementById('brandTitle');
const todaySubEl   = document.getElementById('todaySub');

function updateBrand() {
  const p = getActiveProgram();
  brandTitleEl.textContent = p.name;
  const today = getActiveWeek()[todayIndex()] || 'rest';
  const day = getDay(p, today);
  todaySubEl.textContent = `${DAYS[todayIndex()]} · ${day ? day.name.toUpperCase() : 'REST'}`;
}

// =================================================================
// Week grid
// =================================================================
const weekGrid = document.getElementById('weekGrid');

function renderWeek() {
  const program = getActiveProgram();
  const cycle = getDayCycle(program);
  const todayI = todayIndex();
  const w = getActiveWeek();
  weekGrid.innerHTML = '';
  w.forEach((dayId, i) => {
    const day = getDay(program, dayId);
    const cell = document.createElement('div');
    cell.className = 'week-day';
    if (i === todayI) cell.classList.add('today');
    if (day) cell.style.setProperty('--accent', day.accent);
    cell.innerHTML = `
      <div class="day-name">${DAYS[i]}</div>
      <div class="day-tag${day ? ' is-day' : ' is-rest'}">${day ? escapeHtml(day.name).toUpperCase() : 'REST'}</div>
    `;
    cell.addEventListener('click', () => {
      const idx = cycle.indexOf(w[i]);
      const next = cycle[(idx + 1) % cycle.length];
      setActiveWeekDay(i, next);
      renderWeek();
      updateBrand();
      if (i === todayI) {
        if (next !== 'rest') activeTab = next;
        renderWorkout();
      }
    });
    weekGrid.appendChild(cell);
  });
}

document.getElementById('resetWeekBtn').addEventListener('click', () => {
  weeks[activeProgramId] = [...getActiveProgram().defaultWeek];
  saveWeeks();
  renderWeek(); updateBrand(); renderWorkout();
  showSnack('Week reset to program default');
});

// =================================================================
// Workout view
// =================================================================
const dayTabsEl       = document.getElementById('dayTabs');
const exerciseList    = document.getElementById('exerciseList');
const workoutTitle    = document.getElementById('workoutTitle');
const workoutSubtitle = document.getElementById('workoutSubtitle');
const routineChip     = document.getElementById('routineChip');
const durationChip    = document.getElementById('durationChip');
const ytHero          = document.getElementById('ytHero');
const ytHeroTitle     = document.getElementById('ytHeroTitle');
const ytHeroKicker    = document.getElementById('ytHeroKicker');
const videoCaption    = document.getElementById('videoCaption');
const finishBtn       = document.getElementById('finishBtn');
const cancelWorkoutBtn = document.getElementById('cancelWorkoutBtn');

function renderDayTabs() {
  const program = getActiveProgram();
  dayTabsEl.innerHTML = '';
  program.days.forEach((day) => {
    const btn = document.createElement('button');
    btn.className = 'md-tab' + (day.id === activeTab ? ' active' : '');
    btn.dataset.day = day.id;
    btn.innerHTML = `<span class="material-symbols-rounded">${day.icon || 'fitness_center'}</span>${escapeHtml(day.name)}`;
    btn.addEventListener('click', () => {
      if (current && current.routine !== day.id) {
        showSnack('Finish or cancel the active workout first');
        return;
      }
      activeTab = day.id;
      renderDayTabs();
      renderWorkout();
    });
    dayTabsEl.appendChild(btn);
  });
}

function isTracking() { return current && current.routine === activeTab; }

function renderWorkout() {
  const program = getActiveProgram();
  const day = getDay(program, activeTab);

  if (!day) {
    // Either rest day or program has no days
    workoutTitle.textContent = program.days.length ? 'Rest Day' : 'No Days In This Program';
    workoutSubtitle.textContent = program.days.length
      ? 'Recovery, mobility, and hydration. No tracking today.'
      : 'Open Programs to add days, or pick a different program.';
    routineChip.textContent = program.days.length ? 'REST' : 'EMPTY';
    durationChip.textContent = '—';
    durationChip.style.color = '';
    exerciseList.innerHTML = `
      <div class="exercise empty-state">
        <span class="material-symbols-rounded big">${program.days.length ? 'self_improvement' : 'add_circle'}</span>
        <p class="body-medium on-surface-variant">${program.days.length
          ? 'Walk · stretch · hydrate · sleep. See you tomorrow.'
          : 'This program has no training days yet.'}</p>
      </div>`;
    finishBtn.style.display = 'none';
    cancelWorkoutBtn.style.display = 'none';
    ytHero.href = WARMUP_VIDEO;
    ytHero.dataset.routine = 'rest';
    ytHeroTitle.textContent = 'Warm-Up Routine';
    ytHeroKicker.textContent = `${program.name.toUpperCase()} · WARM-UP`;
    videoCaption.textContent = 'Arm swings, leg swings, cable rotations — start every session here.';
    return;
  }

  const mins = estimateMinutes(day);
  const overBudget = mins > TIME_BUDGET_MIN;

  workoutTitle.textContent = day.name;
  workoutSubtitle.textContent = `${day.exercises.length} exercise${day.exercises.length === 1 ? '' : 's'} · ${program.name}`;
  routineChip.textContent = day.name.toUpperCase();
  routineChip.style.background = day.accent ? hexToBg(day.accent) : '';
  routineChip.style.color = day.accent || '';
  durationChip.textContent = mins ? `~ ${mins} min${overBudget ? ' ⚠' : ''}` : '—';
  durationChip.style.color = overBudget ? 'var(--md-error)' : '';

  exerciseList.innerHTML = '';
  if (!day.exercises.length) {
    exerciseList.innerHTML = `
      <div class="exercise empty-state">
        <span class="material-symbols-rounded big">add_circle</span>
        <p class="body-medium on-surface-variant">No exercises yet. Open Programs to add some.</p>
      </div>`;
  } else {
    day.exercises.forEach((ex) => renderExercise(ex));
  }

  const tracking = isTracking();
  finishBtn.style.display = tracking ? '' : 'none';
  cancelWorkoutBtn.style.display = tracking ? '' : 'none';

  ytHero.href = WARMUP_VIDEO;
  ytHero.dataset.routine = activeTab;
  ytHeroTitle.textContent = 'Warm-Up Routine';
  ytHeroKicker.textContent = `${program.name.toUpperCase()} · ${day.name.toUpperCase()}`;
  videoCaption.textContent = 'Arm swings, leg swings, cable rotations — start every session here.';
}

function hexToBg(hex) {
  // produce a tint at ~18% opacity for chip background
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return '';
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r}, ${g}, ${b}, 0.18)`;
}

function renderExercise(ex) {
  const last = lastBest(ex.id);
  const tracked = isTracking();
  const log = tracked ? (current.log[ex.id] || []) : [];

  const el = document.createElement('div');
  el.className = 'exercise' + (tracked ? ' tracking' : '');
  el.innerHTML = `
    <div class="ex-header">
      <div>
        <h3 class="ex-name">${escapeHtml(ex.name)}</h3>
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
        ${ex.url ? `<a class="icon-btn small" target="_blank" rel="noopener" href="${escapeHtml(ex.url)}" aria-label="Watch demo video">
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
  el.querySelector('[data-rest]').addEventListener('click', () => {
    setRestPreset(ex.restSec);
    startRest();
    showSnack(`Resting ${ex.restSec}s`);
  });
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
      setRestPreset(ex.restSec);
      startRest();
      showSnack(`Set ${idx + 1}: ${weight}kg × ${reps}`);
    });
  });
  exerciseList.appendChild(el);
}

// =================================================================
// Session timer
// =================================================================
let sessionInterval = null;
const sessionTime     = document.getElementById('sessionTime');
const sessionToggle   = document.getElementById('sessionToggle');
const sessionResetBtn = document.getElementById('sessionReset');
const sessionIcon     = document.getElementById('sessionIcon');
const sessionLabel    = document.getElementById('sessionLabel');
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
    sessionIcon.textContent = current.paused ? 'play_arrow' : 'pause';
    sessionLabel.textContent = current.paused ? 'Resume' : 'Pause';
  } else {
    sessionIcon.textContent = 'play_arrow';
    sessionLabel.textContent = 'Start Workout';
  }
  tickSession();
}

sessionToggle.addEventListener('click', () => {
  if (!current) {
    const day = getDay(getActiveProgram(), activeTab);
    if (!day || day.exercises.length === 0) {
      showSnack('Pick a training day first');
      return;
    }
    current = {
      id: `s_${Date.now()}`,
      routine: activeTab,
      programId: activeProgramId,
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
    showSnack(`Started ${day.name} workout`);
    return;
  }
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
// Finish workout
// =================================================================
const summaryScrim = document.getElementById('summaryScrim');
const summaryBody  = document.getElementById('summaryBody');
document.getElementById('summaryDismiss').addEventListener('click', () => {
  summaryScrim.style.display = 'none';
});

finishBtn.addEventListener('click', () => {
  if (!current) return;
  const program = getProgram(current.programId) || getActiveProgram();
  const day = getDay(program, current.routine);
  if (!day) {
    showSnack('Original day no longer exists — discarding session');
    current = null; saveCurrent(); stopSessionTimer(); renderWorkout(); syncSessionUI();
    return;
  }
  const durationSec = sessionElapsedSec();
  const exercises = day.exercises.map((ex) => ({
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
    routineName: day.name,
    programId: program.id,
    programName: program.name,
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

  summaryBody.innerHTML = `
    <div class="summary-stat"><span>Program</span><b>${escapeHtml(program.name)}</b></div>
    <div class="summary-stat"><span>Day</span><b>${escapeHtml(day.name)}</b></div>
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
const restDock    = document.getElementById('restDock');

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
const historyList    = document.getElementById('historyList');
const historySummary = document.getElementById('historySummary');

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
  [...history].reverse().forEach((s) => {
    const exsHTML = s.exercises.map((ex) => {
      const top = ex.sets.reduce((a, b) => (Number(b.weight) > Number(a.weight) ? b : a), ex.sets[0]);
      const totalReps = ex.sets.reduce((a, b) => a + Number(b.reps), 0);
      return `<div class="ex-row">
        <span class="name">${escapeHtml(ex.name)}</span>
        <span>${ex.sets.length} sets · ${totalReps} reps · top ${top.weight}kg</span>
      </div>`;
    }).join('');
    const label = s.routineName || (s.routine || '').toString().toUpperCase();
    const programLabel = s.programName ? ` · ${escapeHtml(s.programName)}` : '';
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
      <div class="history-head">
        <div>
          <div class="history-date">${fmtDate(s.date)}</div>
          <div class="history-meta">
            <span>${escapeHtml(label)}${programLabel}</span>
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
// Programs page
// =================================================================
const programsList = document.getElementById('programsList');

document.getElementById('newProgramBtn').addEventListener('click', () => openEditor('create'));

function renderPrograms() {
  programsList.innerHTML = '';
  getAllPrograms().forEach((p) => {
    const isActive = p.id === activeProgramId;
    const card = document.createElement('div');
    card.className = 'program-card' + (isActive ? ' active' : '');
    const dayCount = p.days.length;
    const exCount = p.days.reduce((a, d) => a + d.exercises.length, 0);
    card.innerHTML = `
      <div class="program-card-head">
        <div>
          <div class="program-name">
            ${escapeHtml(p.name)}
            ${isActive ? '<span class="badge active-badge">Active</span>' : ''}
            ${p.builtin ? '<span class="badge builtin-badge">Built-in</span>' : '<span class="badge custom-badge">Custom</span>'}
          </div>
          <div class="program-sub on-surface-variant body-small">${escapeHtml(p.subtitle || '')}</div>
          <div class="program-meta on-surface-variant body-small mt-8">
            ${dayCount} day${dayCount === 1 ? '' : 's'} · ${exCount} exercise${exCount === 1 ? '' : 's'}
          </div>
        </div>
      </div>
      <div class="program-day-pills">
        ${p.days.map((d) => `<span class="day-pill" style="--accent:${d.accent}">${escapeHtml(d.name)}</span>`).join('')}
      </div>
      <div class="program-card-actions">
        ${isActive
          ? '<span class="status-tag"><span class="material-symbols-rounded" style="font-size:16px">check_circle</span>Currently active</span>'
          : '<button class="btn filled small" data-action="use">Use this</button>'}
        <button class="btn outlined small" data-action="clone">Clone</button>
        ${p.builtin ? '' : '<button class="btn text small" data-action="edit">Edit</button>'}
        ${p.builtin ? '' : '<button class="btn text small danger" data-action="delete">Delete</button>'}
      </div>
    `;
    card.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => handleProgramAction(p.id, btn.dataset.action));
    });
    programsList.appendChild(card);
  });
}

function handleProgramAction(id, action) {
  const p = getProgram(id);
  if (!p) return;
  if (action === 'use') {
    if (current) {
      showSnack('Finish or cancel the active workout first');
      return;
    }
    activeProgramId = id;
    saveActiveProgramId();
    activeTab = pickDefaultActiveTab();
    renderAll();
    showSnack(`Switched to ${p.name}`);
    showPage('today');
  } else if (action === 'clone') {
    openEditor('clone', p);
  } else if (action === 'edit') {
    openEditor('edit', p);
  } else if (action === 'delete') {
    if (!confirm(`Delete program "${p.name}"? This cannot be undone.`)) return;
    customPrograms = customPrograms.filter((x) => x.id !== id);
    saveCustomPrograms();
    delete weeks[id];
    saveWeeks();
    if (activeProgramId === id) {
      activeProgramId = 'full_body_4day';
      saveActiveProgramId();
      activeTab = pickDefaultActiveTab();
      renderAll();
    }
    renderPrograms();
    showSnack('Program deleted');
  }
}

// =================================================================
// Program Editor
// =================================================================
const editorForm           = document.getElementById('editorForm');
const editorBackBtn        = document.getElementById('editorBackBtn');
const editorTitle          = document.getElementById('editorTitle');
const editorNameInput      = document.getElementById('editorNameInput');
const editorSubtitleInput  = document.getElementById('editorSubtitleInput');
const editorDays           = document.getElementById('editorDays');
const addDayBtn            = document.getElementById('addDayBtn');
const editorWeekRow        = document.getElementById('editorWeekRow');
const editorSaveBtn        = document.getElementById('editorSaveBtn');
const editorCancelBtn      = document.getElementById('editorCancelBtn');

const DAY_ACCENTS = ['#ff8a72', '#94b8ff', '#92dca6', '#d8a4ff', '#ffd166', '#73d2de', '#f4978e'];
const DAY_ICONS   = ['fitness_center', 'arrow_upward', 'arrow_downward', 'directions_run', 'sports_martial_arts', 'pool', 'self_improvement'];

function openEditor(mode, source) {
  if (mode === 'create') {
    const days = Array.from({ length: 7 }, (_, i) => makeBlankDay(i));
    editorState = {
      mode,
      program: {
        id: uid('prog'),
        name: '',
        subtitle: '',
        builtin: false,
        days,
        // Sun → Day 1, Mon → Day 2, … Sat → Day 7. Swap any slot to Rest later.
        defaultWeek: days.map((d) => d.id),
      },
    };
    editorTitle.textContent = 'Create Program';
  } else if (mode === 'clone') {
    const copy = deepClone(source);
    copy.id = uid('prog');
    copy.builtin = false;
    copy.name = `${source.name} (copy)`;
    // Re-id days/exercises to avoid collisions with source
    copy.days = copy.days.map((d, i) => {
      const newId = `d${i + 1}_${Math.random().toString(36).slice(2, 5)}`;
      const oldId = d.id;
      const remapped = { ...d, id: newId, exercises: d.exercises.map((e, j) => ({ ...e, id: `${newId}e${j + 1}` })) };
      copy.defaultWeek = copy.defaultWeek.map((slot) => slot === oldId ? newId : slot);
      return remapped;
    });
    editorState = { mode, program: copy, originalId: source.id };
    editorTitle.textContent = 'Clone Program';
  } else {
    editorState = { mode, program: deepClone(source), originalId: source.id };
    editorTitle.textContent = 'Edit Program';
  }
  showPage('editor');
  renderEditor();
}

function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

function makeBlankDay(idx) {
  const id = `d${idx + 1}_${Math.random().toString(36).slice(2, 5)}`;
  return {
    id,
    name: `Day ${idx + 1}`,
    accent: DAY_ACCENTS[idx % DAY_ACCENTS.length],
    icon: DAY_ICONS[idx % DAY_ICONS.length],
    exercises: [],
  };
}
function makeBlankExercise() {
  return { id: `ex_${Math.random().toString(36).slice(2, 8)}`, name: '', sets: 3, reps: 10, restSec: 60, url: '' };
}

function renderEditor() {
  const p = editorState.program;
  editorNameInput.value = p.name;
  editorSubtitleInput.value = p.subtitle || '';
  editorDays.innerHTML = '';
  p.days.forEach((day, dayIdx) => {
    const wrap = document.createElement('div');
    wrap.className = 'editor-day';
    wrap.style.setProperty('--accent', day.accent);
    wrap.innerHTML = `
      <div class="editor-day-head">
        <div class="editor-day-head-left">
          <span class="material-symbols-rounded day-icon">${day.icon}</span>
          <input class="input-field day-name-input" type="text" value="${escapeHtml(day.name)}" placeholder="Day name (e.g. Push)" />
        </div>
        <button class="icon-btn small danger" data-action="del-day" aria-label="Remove day">
          <span class="material-symbols-rounded">delete</span>
        </button>
      </div>
      <div class="editor-exercises"></div>
      <button class="btn text small add-ex-btn" data-action="add-ex">
        <span class="material-symbols-rounded">add</span>Add exercise
      </button>
    `;

    wrap.querySelector('.day-name-input').addEventListener('input', (e) => {
      day.name = e.target.value;
    });
    wrap.querySelector('[data-action="del-day"]').addEventListener('click', () => {
      if (p.days.length === 1) {
        showSnack('A program needs at least one day');
        return;
      }
      if (!confirm(`Remove "${day.name || 'this day'}" and its exercises?`)) return;
      p.defaultWeek = p.defaultWeek.map((slot) => slot === day.id ? 'rest' : slot);
      p.days.splice(dayIdx, 1);
      renderEditor();
    });
    wrap.querySelector('[data-action="add-ex"]').addEventListener('click', () => {
      day.exercises.push(makeBlankExercise());
      renderEditor();
    });

    const exContainer = wrap.querySelector('.editor-exercises');
    if (!day.exercises.length) {
      exContainer.innerHTML = `<div class="editor-empty body-small on-surface-variant">No exercises yet — add the first one below.</div>`;
    } else {
      day.exercises.forEach((ex, exIdx) => {
        const row = document.createElement('div');
        row.className = 'editor-ex';
        row.innerHTML = `
          <div class="editor-ex-grid">
            <input class="input-field ex-name" type="text" value="${escapeHtml(ex.name)}" placeholder="Exercise name" />
            <label class="num-label">Sets <input class="input-field" type="number" min="1" max="20" value="${ex.sets}" data-field="sets" /></label>
            <label class="num-label">Reps <input class="input-field" type="number" min="1" max="100" value="${ex.reps}" data-field="reps" /></label>
            <label class="num-label">Rest s <input class="input-field" type="number" min="0" max="600" value="${ex.restSec}" data-field="restSec" /></label>
            <button class="icon-btn small danger" data-action="del-ex" aria-label="Remove exercise">
              <span class="material-symbols-rounded">delete</span>
            </button>
          </div>
          <input class="input-field url-input" type="url" value="${escapeHtml(ex.url || '')}" placeholder="YouTube URL (optional)" />
        `;
        row.querySelector('.ex-name').addEventListener('input', (e) => { ex.name = e.target.value; });
        row.querySelector('.url-input').addEventListener('input', (e) => { ex.url = e.target.value; });
        row.querySelectorAll('[data-field]').forEach((input) => {
          input.addEventListener('input', (e) => {
            const v = Number(e.target.value);
            if (Number.isFinite(v) && v >= 0) ex[e.target.dataset.field] = v;
          });
        });
        row.querySelector('[data-action="del-ex"]').addEventListener('click', () => {
          day.exercises.splice(exIdx, 1);
          renderEditor();
        });
        exContainer.appendChild(row);
      });
    }
    editorDays.appendChild(wrap);
  });
  renderEditorWeek();
}

function renderEditorWeek() {
  const p = editorState.program;
  editorWeekRow.innerHTML = '';
  // Reconcile defaultWeek length
  if (!Array.isArray(p.defaultWeek) || p.defaultWeek.length !== 7) {
    p.defaultWeek = ['rest','rest','rest','rest','rest','rest','rest'];
  }
  for (let i = 0; i < 7; i++) {
    const cell = document.createElement('label');
    cell.className = 'editor-week-cell';
    const slot = p.defaultWeek[i];
    const valid = slot === 'rest' || p.days.some((d) => d.id === slot);
    if (!valid) p.defaultWeek[i] = 'rest';
    cell.innerHTML = `
      <span class="day-name">${DAYS[i]}</span>
      <select class="input-field" data-day-index="${i}">
        <option value="rest"${p.defaultWeek[i] === 'rest' ? ' selected' : ''}>Rest</option>
        ${p.days.map((d) => `<option value="${d.id}"${p.defaultWeek[i] === d.id ? ' selected' : ''}>${escapeHtml(d.name || 'Day')}</option>`).join('')}
      </select>
    `;
    cell.querySelector('select').addEventListener('change', (e) => {
      p.defaultWeek[i] = e.target.value;
    });
    editorWeekRow.appendChild(cell);
  }
}

editorNameInput.addEventListener('input', (e) => { editorState.program.name = e.target.value; });
editorSubtitleInput.addEventListener('input', (e) => { editorState.program.subtitle = e.target.value; });

addDayBtn.addEventListener('click', () => {
  editorState.program.days.push(makeBlankDay(editorState.program.days.length));
  renderEditor();
});

editorBackBtn.addEventListener('click', () => {
  if (!confirm('Discard changes and return to programs?')) return;
  editorState = null;
  showPage('programs');
  renderPrograms();
});
editorCancelBtn.addEventListener('click', () => editorBackBtn.click());

editorSaveBtn.addEventListener('click', () => {
  const p = editorState.program;
  if (!p.name.trim()) { showSnack('Give the program a name'); editorNameInput.focus(); return; }
  if (!p.days.length) { showSnack('Add at least one day'); return; }
  for (const day of p.days) {
    if (!day.name.trim()) { showSnack('Every day needs a name'); return; }
    for (const ex of day.exercises) {
      if (!ex.name.trim()) { showSnack(`Exercise in "${day.name}" needs a name`); return; }
      if (ex.sets < 1) ex.sets = 1;
      if (ex.reps < 1) ex.reps = 1;
      if (ex.restSec < 0) ex.restSec = 0;
    }
  }

  if (editorState.mode === 'edit') {
    const idx = customPrograms.findIndex((x) => x.id === editorState.originalId);
    if (idx >= 0) customPrograms[idx] = p;
    else customPrograms.push(p);
  } else {
    customPrograms.push(p);
  }
  saveCustomPrograms();

  // Initialize per-program week with the new default
  weeks[p.id] = [...p.defaultWeek];
  saveWeeks();

  // If we just edited the active program, refresh Train view
  if (activeProgramId === p.id) {
    activeTab = pickDefaultActiveTab();
    renderAll();
  }

  editorState = null;
  showPage('programs');
  renderPrograms();
  showSnack('Program saved');
});

// =================================================================
// Render orchestration
// =================================================================
function renderAll() {
  renderWeek();
  renderDayTabs();
  renderWorkout();
  updateBrand();
}

// =================================================================
// Init
// =================================================================
function init() {
  // If a saved current session belongs to a program/day that no longer exists, drop it
  if (current) {
    const program = getProgram(current.programId) || getActiveProgram();
    const day = getDay(program, current.routine);
    if (!day) { current = null; saveCurrent(); }
  }

  if (current) {
    activeProgramId = current.programId || activeProgramId;
    activeTab = current.routine;
    if (!current.paused) {
      current.resumedAt = Date.now();
      saveCurrent();
      startSessionTimer();
    }
  } else {
    activeTab = pickDefaultActiveTab();
  }

  renderAll();
  syncSessionUI();
  setRestPreset(90);
  showPage('today');
}

init();
