(() => {
'use strict';

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

/* =====================================================
   TEXT GENERATOR
   Templates + topic-specific vocabulary, so every
   combination stays meaningful. A template starting
   with '#' contains numbers (used only if numbers ON).
   ===================================================== */
const TOPICS = {
  daily: {
    slots: {
      time: ['in the morning', 'after lunch', 'before dinner', 'on weekends', 'every evening', 'early in the day'],
      hab: ['go for a walk', 'read a few pages of a book', 'call a friend', 'make a cup of tea', 'check the news', 'stretch for ten minutes', 'water the plants'],
      feel: ['calm', 'tired', 'happy', 'a little nervous', 'surprisingly relaxed', 'ready for a change'],
      place: ['the kitchen', 'the park', 'the library', 'a small café', 'the garden', 'my room'],
      thing: ['a good book', 'a warm blanket', 'some fresh bread', 'an old photograph', 'a cup of coffee', 'a quiet corner']
    },
    t: [
      'I usually {hab} {time}.',
      'Most days I {hab}, and it makes me feel {feel}.',
      'After a long day, I like to sit in {place} with {thing}.',
      'She said she would {hab} {time}, but she forgot.',
      "It's hard to stay focused when you feel {feel}, so I try to {hab}.",
      'There is nothing better than {thing} when the day is over.',
      'We spent the afternoon in {place}, and nobody wanted to leave.',
      'Although I was {feel}, I decided to {hab} anyway.',
      'Sometimes a simple habit, like trying to {hab}, can change your whole day.',
      "#I wake up at {h} o'clock and {hab}.",
      '#It takes about {m} minutes to walk to {place}.'
    ]
  },
  work: {
    slots: {
      task: ['finish the report', 'answer every email', 'plan the next meeting', 'review the new design', 'fix the last bug', 'prepare a short presentation'],
      when: ['before noon', 'by the end of the week', 'as soon as possible', 'tomorrow morning', 'after the break', 'this afternoon'],
      qual: ['clear', 'patient', 'organized', 'curious', 'reliable', 'creative'],
      sub: ['the team', 'our manager', 'my colleague', 'the new intern', 'the client', 'everyone in the office'],
      tool: ['a simple checklist', 'a shared calendar', 'a fresh notebook', 'a clear plan', 'a short break', 'a cup of coffee']
    },
    t: [
      'I need to {task} {when}.',
      '{sub} asked us to {task} {when}.',
      'Good work depends on being {qual} and using {tool}.',
      'To {task}, I always start with {tool}.',
      '{sub} is {qual}, which makes every project easier.',
      'If you want to {task} {when}, try working with {tool}.',
      'It takes someone {qual} to {task} without losing focus.',
      'We managed to {task} even though the deadline was tight.',
      '#The meeting starts at {t} and should last about {m} minutes.',
      '#I have {n} tasks left, and I want to finish them {when}.'
    ]
  },
  travel: {
    slots: {
      dest: ['a small coastal town', 'the old city', 'a quiet mountain village', 'a big city we had never visited', 'an island in the south', 'the capital'],
      trans: ['train', 'bus', 'plane', 'bicycle', 'ferry', 'car'],
      see: ['old streets', 'beautiful beaches', 'local markets', 'ancient buildings', 'green hills', 'busy squares'],
      adj: ['unforgettable', 'exhausting', 'peaceful', 'exciting', 'surprisingly cheap', 'not as hard as it sounds'],
      pack: ['a light jacket', 'a good map', 'a spare charger', 'comfortable shoes', 'a small camera', 'a bottle of water']
    },
    t: [
      'Last summer we traveled to {dest} by {trans}.',
      'The trip was {adj}, and we saw {see} everywhere we went.',
      "Don't forget {pack}, because you will walk a lot.",
      'I would love to visit {dest} and explore its {see}.',
      'Traveling by {trans} is {adj} if you plan ahead.',
      'We got lost for an hour, but we found {see} we will never forget.',
      'Everyone says {dest} is worth a visit, especially for its {see}.',
      '#The journey took {n} hours, but it was worth every minute.',
      '#Our hotel was only {m} minutes from the station.'
    ]
  },
  food: {
    slots: {
      dish: ['tomato soup', 'fresh pasta', 'grilled fish', 'vegetable curry', 'homemade pizza', 'mushroom risotto'],
      drink: ['black coffee', 'green tea', 'mint tea', 'hot chocolate', 'fresh juice', 'warm milk'],
      taste: ['delicious', 'a bit too salty', 'surprisingly sweet', 'rich and creamy', 'simple but perfect', 'full of flavor'],
      meal: ['breakfast', 'lunch', 'dinner']
    },
    t: [
      'For {meal}, we had {dish} and some {drink}.',
      'The {dish} was {taste}.',
      'I like to have {dish} for {meal}.',
      'Nothing beats {drink} with a slice of cake.',
      "I'm not a great cook, but my {dish} is always {taste}.",
      'She made {dish} for {meal}, and everyone asked for more.',
      'If you add a little lemon, {dish} becomes much better.',
      'We usually have {drink} after {meal}.',
      '#The recipe needs {n} eggs and about {m} minutes in the oven.'
    ]
  },
  nature: {
    slots: {
      weather: ['rainy', 'windy', 'sunny', 'foggy', 'cold', 'warm'],
      season: ['spring', 'summer', 'autumn', 'winter'],
      sight: ['the clouds', 'the river', 'the mountains', 'the old trees', 'the sea', 'the city lights'],
      act: ['walk by the river', 'sit outside', 'go for a run', 'open the windows', 'watch the sky', 'take a few photos']
    },
    t: [
      'It was a {weather} morning, so we decided to {act}.',
      '{season} is my favorite time of the year.',
      'From the hill, you can see {sight} in every direction.',
      'When it is {weather}, I like to {act}.',
      'The weather has been {weather} all week, and I never get tired of watching {sight}.',
      'I love to {act} on a {weather} day.',
      'In {season}, we often {act}.',
      '#The temperature dropped to {n} degrees last night.'
    ]
  },
  learn: {
    slots: {
      skill: ['speak English', 'write clean code', 'play the guitar', 'type faster', 'draw people', 'cook new dishes'],
      aid: ['short daily practice', 'good feedback', 'a patient teacher', 'a useful book', 'a clear goal', 'regular practice'],
      bear: ['mistakes', 'hard days', 'new words', 'long sentences', 'slow progress']
    },
    t: [
      'Learning to {skill} takes time, but {aid} helps a lot.',
      "You can't {skill} overnight, so don't be afraid of {bear}.",
      'It is normal to meet {bear} when you try to {skill}.',
      'To {skill}, you need {aid} and a lot of patience.',
      "I've been trying to {skill} for months, and I finally see progress.",
      'Many people believe that {aid} matters more than talent.',
      "Don't worry about {bear}; just keep trying to {skill}.",
      '#I practice for {m} minutes every day to {skill}.'
    ]
  }
};
const TOPIC_NAMES = Object.keys(TOPICS);

// Standalone sentences: short, advanced vocabulary, questions
const GENERAL = [
  "Let's try again.", 'It was worth the wait.', 'Nobody noticed.', "Time flies when you're busy.",
  'That makes sense.', 'Take your time.', "I'll see you tomorrow.", 'Practice makes progress.',
  'Curiosity is the engine of achievement.',
  'Small, consistent efforts often lead to remarkable results.',
  'She had an extraordinary ability to remain calm under pressure.',
  "It's essential to distinguish between what is urgent and what is important.",
  'The negotiation required patience, tact, and a willingness to compromise.',
  'Despite the setback, he remained optimistic about the outcome.',
  'Reliable information is increasingly difficult to find online.',
  'A thoughtful question is often more valuable than a quick answer.',
  'They gradually adapted to the unfamiliar environment.',
  'Good habits are built through repetition rather than motivation.',
  'The committee will evaluate every proposal carefully before making a decision.',
  'Technology has transformed the way we communicate, work, and learn.',
  'Whether you succeed or fail, the experience will teach you something valuable.',
  'Her explanation was so clear that even a beginner could follow it.',
  "He couldn't help smiling when he heard the unexpected news.",
  'What would you do if you had an extra hour every day?',
  'Have you ever tried to learn something completely new?',
  "I didn't expect the movie to be that good, but it surprised everyone."
];

const WORDS = ('the of and to in is you that it he was for on are with as I his they be at one have this from or had by ' +
 'word but what some we can out other were all there when up use your how said an each she which do their time if will ' +
 "way about many then them write would like so these her long make thing see him two has look more day could go come did " +
 "number sound no most people my over know water than call first who may down side been now find any new work part take get " +
 "place made live where after back little only round man year came show every good me give our under name very through just " +
 "form much great think say help low line before turn cause same mean move right old too does tell sentence set three want " +
 "air well also play small end put home read hand large add even land here must big high such follow act why ask change went " +
 "light kind need house picture try again animal point mother world near build father coffee window garden simple quiet happy " +
 "morning bright music practice answer journey friend story learn city weather careful important together remember don't it's " +
 "I'm can't").split(' ');

const recent = [];
function fresh(list) {                       // avoid recently used templates/sentences
  let c;
  for (let i = 0; i < 12; i++) {
    c = pick(list);
    if (!recent.includes(c)) break;
  }
  recent.push(c);
  if (recent.length > 40) recent.shift();
  return c;
}

function fill(tpl, slots) {
  return tpl.replace(/^#/, '').replace(/\{(\w+)\}/g, (_, k) => {
    if (k === 'n') return String(2 + rnd(11));
    if (k === 'h') return String(5 + rnd(5));
    if (k === 'm') return String(5 * (2 + rnd(10)));
    if (k === 't') return (8 + rnd(4)) + ':' + pick(['00', '15', '30', '45']);
    return pick(slots[k]);
  });
}

function sentence(topic) {
  const T = TOPICS[topic || pick(TOPIC_NAMES)];
  const pool = T.t.filter(t => S.nums || t[0] !== '#');
  return cap(fill(fresh(pool), T.slots));
}
const anySentence = () => Math.random() < 0.3 ? fresh(GENERAL) : sentence();

function paragraph() {
  const topic = pick(TOPIC_NAMES), n = 3 + rnd(3), out = [];
  for (let i = 0; i < n; i++) out.push(sentence(topic));
  return out.join(' ');
}

function wordsText(min) {
  const out = []; let len = 0, up = true;
  while (len < min) {
    let w = pick(WORDS);
    if (S.nums && Math.random() < 0.08) w = String(1 + rnd(999));
    if (S.punct) {
      if (up) { w = cap(w); up = false; }
      const r = Math.random();
      if (r < 0.08) w += ',';
      else if (r < 0.16) { w += '.'; up = true; }
    }
    out.push(w); len += w.length + 1;
  }
  return out.join(' ');
}

// punctuation OFF: remove .,!?; and lowercase (keep "I" and apostrophes)
const strip = s => s.replace(/[.,!?;]/g, '').toLowerCase().replace(/\bi\b/g, 'I').replace(/\s+/g, ' ');

function generate(min) {
  let out;
  if (S.mode === 'words') out = wordsText(min);
  else {
    const parts = []; let len = 0;
    while (len < min) {
      const p = S.mode === 'paragraphs' ? paragraph() : anySentence();
      parts.push(p); len += p.length + 1;
    }
    out = parts.join(' ');
    if (!S.punct) out = strip(out);
  }
  return out.trim() + ' ';
}

/* =====================================================
   SETTINGS & STORAGE
   ===================================================== */
const KEY_S = 'mgren.settings', KEY_R = 'mgren.results';
const S = { duration: 30, mode: 'sentences', punct: true, nums: false, font: 24, sound: false, accent: '#E2B714' };

try { Object.assign(S, JSON.parse(localStorage.getItem(KEY_S) || '{}')); } catch (e) {}
if (![15, 30, 60].includes(S.duration)) S.duration = 30;
if (!['words', 'sentences', 'paragraphs'].includes(S.mode)) S.mode = 'sentences';

const saveSettings = () => { try { localStorage.setItem(KEY_S, JSON.stringify(S)); } catch (e) {} };
const loadResults = () => { try { return JSON.parse(localStorage.getItem(KEY_R) || '[]'); } catch (e) { return []; } };

/* =====================================================
   TYPING ENGINE
   ===================================================== */
const input = $('#input'), wordsEl = $('#words'), typingEl = $('#typing');
const resultsEl = $('#results'), settingsEl = $('#settings');

let text = '', spans = [], typed = '', state = 'idle'; // idle | run | done
let startT = 0, timer = null, keys = 0, errs = 0, curIdx = -1;

function appendSpans(str) {
  const frag = document.createDocumentFragment();
  let w = null;
  for (const ch of str) {
    if (!w) { w = document.createElement('span'); w.className = 'word'; frag.appendChild(w); }
    const s = document.createElement('span');
    s.className = 'ch' + (ch === ' ' ? ' sp' : '');
    s.textContent = ch;
    w.appendChild(s); spans.push(s);
    if (ch === ' ') w = null;               // the space belongs to the word before it
  }
  wordsEl.appendChild(frag);
}

function paintRange(a, b) {
  for (let i = a; i < b && i < spans.length; i++) {
    const s = spans[i];
    s.classList.remove('ok', 'bad');
    if (i < typed.length) s.classList.add(typed[i] === text[i] ? 'ok' : 'bad');
  }
}

function scrollTo(s) {                       // keep the current line as the 2nd visible line
  const lh = parseFloat(getComputedStyle(wordsEl).lineHeight) || 40;
  const y = Math.max(0, s.parentNode.offsetTop - lh);
  wordsEl.style.transform = 'translateY(' + (-y) + 'px)';
}

function setCaret() {
  if (curIdx >= 0 && spans[curIdx]) spans[curIdx].classList.remove('cur');
  curIdx = typed.length;
  const s = spans[curIdx];
  if (s) { s.classList.add('cur'); scrollTo(s); }
}
const relayout = () => { const s = spans[typed.length]; if (s) scrollTo(s); };

function calc(elapsed) {
  const min = Math.max(elapsed, 1) / 60;
  let correct = 0;
  for (let i = 0; i < typed.length; i++) if (typed[i] === text[i]) correct++;
  return {
    wpm: Math.round(correct / 5 / min),
    raw: Math.round(typed.length / 5 / min),
    acc: keys ? Math.round((keys - errs) / keys * 100) : 100
  };
}

function updateStats(el) {
  if (el === undefined) el = state === 'run' ? (performance.now() - startT) / 1000 : 0;
  const r = calc(el);
  $('#sTime').textContent = Math.max(0, Math.ceil(S.duration - el));
  $('#sWpm').textContent = r.wpm;
  $('#sAcc').textContent = r.acc + '%';
  $('#sChars').textContent = typed.length;
  $('#sRaw').textContent = r.raw;
}

function start() {
  state = 'run';
  startT = performance.now();
  timer = setInterval(() => {
    const el = (performance.now() - startT) / 1000;
    if (el >= S.duration) finish(); else updateStats(el);
  }, 100);
}

function finish() {
  clearInterval(timer); timer = null;
  state = 'done';
  const r = calc(S.duration);
  updateStats(S.duration);
  const res = { wpm: r.wpm, raw: r.raw, acc: r.acc, errors: errs, chars: typed.length,
                dur: S.duration, mode: S.mode, ts: Date.now() };
  const all = loadResults(); all.push(res);
  try { localStorage.setItem(KEY_R, JSON.stringify(all.slice(-100))); } catch (e) {}

  $('#rWpm').textContent = r.wpm;
  $('#rAcc').textContent = r.acc + '%';
  $('#rRaw').textContent = r.raw;
  $('#rErr').textContent = errs;
  $('#rChars').textContent = typed.length;
  $('#rTime').textContent = S.duration + 's';
  typingEl.hidden = true; resultsEl.hidden = false;
  input.readOnly = true; input.blur();
  renderProgress();
}

function restart(newText) {
  clearInterval(timer); timer = null;     // always clean the old timer
  state = 'idle'; typed = ''; keys = 0; errs = 0; curIdx = -1;
  if (newText || !text) text = generate(S.duration * 18 + 200);
  wordsEl.textContent = ''; spans = [];
  appendSpans(text);
  wordsEl.style.transform = 'translateY(0)';
  input.value = ''; input.readOnly = false;
  typingEl.hidden = false; resultsEl.hidden = true;
  setCaret(); updateStats(0);
  input.focus({ preventScroll: true });
}

function extend() {                          // never run out of text during a test
  const more = generate(300);
  text += more; appendSpans(more);
}

let ac = null;
function click() {
  if (!S.sound) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.value = 500 + rnd(80); g.gain.value = 0.04;
    o.connect(g); g.connect(ac.destination);
    o.start(); o.stop(ac.currentTime + 0.03);
  } catch (e) {}
}

function onInput() {
  if (state === 'done') return;
  let v = input.value;
  if (v.length > text.length) v = v.slice(0, text.length);
  if (v !== input.value) input.value = v;
  const prev = typed;
  if (v === prev) return;
  if (state === 'idle') start();

  const grew = v.length > prev.length && v.startsWith(prev);
  if (grew) {                                // count each new keystroke
    for (let i = prev.length; i < v.length; i++) { keys++; if (v[i] !== text[i]) errs++; }
    click();
  }
  typed = v;
  const simple = grew || prev.startsWith(v);
  paintRange(simple ? Math.min(prev.length, v.length) : 0, Math.max(prev.length, v.length));
  setCaret();
  if (text.length - typed.length < 150) extend();
  updateStats();
}

/* =====================================================
   PROGRESS
   ===================================================== */
function renderProgress() {
  const r = loadResults(), n = r.length;
  $('#pBest').textContent = n ? Math.max(...r.map(x => x.wpm)) : '–';
  $('#pAvg').textContent = n ? Math.round(r.reduce((a, x) => a + x.wpm, 0) / n) : '–';
  $('#pAcc').textContent = n ? Math.max(...r.map(x => x.acc)) + '%' : '–';
  $('#pCount').textContent = n;
  const ul = $('#recent'); ul.textContent = '';
  r.slice(-8).reverse().forEach(x => {
    const li = document.createElement('li');
    const d = new Date(x.ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const b = document.createElement('span'); b.textContent = x.wpm + ' wpm';
    li.append(b, ` · ${x.acc}% · ${x.dur}s · ${x.mode} · ${d}`);
    ul.appendChild(li);
  });
}

/* =====================================================
   UI SYNC & EVENTS (attached once)
   ===================================================== */
function syncUI() {
  const root = document.documentElement.style;
  root.setProperty('--accent', S.accent);
  root.setProperty('--fs', S.font + 'px');
  $$('[data-duration]').forEach(b => b.classList.toggle('on', +b.dataset.duration === S.duration));
  $$('[data-mode]').forEach(b => b.classList.toggle('on', b.dataset.mode === S.mode));
  $$('[data-toggle]').forEach(b => b.classList.toggle('on', !!S[b.dataset.toggle]));
  $$('.sw').forEach(b => b.classList.toggle('on', b.dataset.accent === S.accent));
  $('#setFont').value = S.font;
  $('#setDuration').value = S.duration;
  $('#setSound').checked = S.sound;
  $('#setPunct').checked = S.punct;
  $('#setNums').checked = S.nums;
}
function change(newText) { saveSettings(); syncUI(); if (newText) restart(true); }

$('.controls').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.duration) { S.duration = +b.dataset.duration; change(true); }
  else if (b.dataset.mode) { S.mode = b.dataset.mode; change(true); }
  else if (b.dataset.toggle) { S[b.dataset.toggle] = !S[b.dataset.toggle]; change(true); }
  else if (b.id === 'btnRestart') restart(false);
  else if (b.id === 'btnNew') restart(true);
  input.focus({ preventScroll: true });
});
$('#btnNext').addEventListener('click', () => restart(true));
$('#btnRepeat').addEventListener('click', () => restart(false));

$('#settingsBtn').addEventListener('click', toggleSettings);
function toggleSettings() {
  settingsEl.hidden = !settingsEl.hidden;
  $('#settingsBtn').setAttribute('aria-expanded', String(!settingsEl.hidden));
  if (settingsEl.hidden && state !== 'done') input.focus({ preventScroll: true });
}
$('#setFont').addEventListener('change', e => { S.font = +e.target.value; saveSettings(); syncUI(); relayout(); });
$('#setDuration').addEventListener('change', e => { S.duration = +e.target.value; change(true); });
$('#setSound').addEventListener('change', e => { S.sound = e.target.checked; saveSettings(); });
$('#setPunct').addEventListener('change', e => { S.punct = e.target.checked; change(true); });
$('#setNums').addEventListener('change', e => { S.nums = e.target.checked; change(true); });
$('#swatches').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  S.accent = b.dataset.accent; change(false);
});
$('#btnReset').addEventListener('click', () => {
  if (confirm('Reset all saved statistics?')) {
    try { localStorage.removeItem(KEY_R); } catch (e) {}
    renderProgress();
  }
});

input.addEventListener('input', onInput);
input.addEventListener('keydown', e => { if (e.key === 'Enter') e.preventDefault(); });
input.addEventListener('paste', e => e.preventDefault());
input.addEventListener('drop', e => e.preventDefault());
input.addEventListener('focus', () => typingEl.classList.remove('blur'));
input.addEventListener('blur', () => typingEl.classList.add('blur'));

document.addEventListener('keydown', e => {
  const inSettings = !settingsEl.hidden && settingsEl.contains(e.target);
  if (e.key === 'Escape') {
    e.preventDefault();
    if (!settingsEl.hidden) toggleSettings(); else restart(true);
    return;
  }
  if (inSettings) return;
  if (e.key === 'Tab') { e.preventDefault(); restart(false); return; }
  if (e.key === 'Enter' && state === 'done' && !e.target.closest('button,select')) {
    e.preventDefault(); restart(true); return;
  }
  // any printable key focuses the input so typing starts immediately
  if (state !== 'done' && !e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1 &&
      document.activeElement !== input && !e.target.closest('select,input')) {
    input.focus({ preventScroll: true });
  }
});

/* ---------- init ---------- */
syncUI();
renderProgress();
restart(true);
})();
