/* ═══════════════════════════════════════════════════════════════
   SCT_WD_3 – Web Dev Quiz  |  SkillCraft Technology
   Vanilla JS – No external libraries
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── Quiz Data ────────────────────────────────────────────── */
const QUESTIONS = [
  {
    id: 1,
    type: 'mcq',
    question: 'What does <strong>HTML</strong> stand for?',
    options: [
      'HyperText Markup Language',
      'High-Level Text Machine Language',
      'Hyperlink and Text Markup Language',
      'Home Tool Markup Language'
    ],
    correct: 0
  },
  {
    id: 2,
    type: 'mcq',
    question: 'Which CSS property controls the <strong>text size</strong>?',
    options: ['font-weight', 'text-size', 'font-size', 'text-style'],
    correct: 2
  },
  {
    id: 3,
    type: 'mcq',
    question: 'Which HTML tag is used for the <strong>largest heading</strong>?',
    options: ['&lt;h6&gt;', '&lt;heading&gt;', '&lt;head&gt;', '&lt;h1&gt;'],
    correct: 3
  },
  {
    id: 4,
    type: 'mcq',
    question: 'In JavaScript, which keyword declares a <strong>constant</strong>?',
    options: ['var', 'let', 'const', 'def'],
    correct: 2
  },
  {
    id: 5,
    type: 'mcq',
    question: 'What does <strong>CSS</strong> stand for?',
    options: [
      'Creative Style Sheets',
      'Cascading Style Sheets',
      'Computer Style Sheets',
      'Colorful Style Sheets'
    ],
    correct: 1
  },
  {
    id: 6,
    type: 'mcq',
    question: 'Which CSS property value creates a <strong>flex container</strong>?',
    options: ['display: grid', 'display: block', 'display: flex', 'display: inline'],
    correct: 2
  },
  {
    id: 7,
    type: 'mcq',
    question: 'What is the correct CSS selector to target an element by <strong>ID</strong>?',
    options: ['.myId', '#myId', '*myId', 'myId'],
    correct: 1
  },
  {
    id: 8,
    type: 'tf',
    question: '<strong>JavaScript</strong> is a compiled programming language.',
    options: ['True', 'False'],
    correct: 1   // False
  },
  {
    id: 9,
    type: 'tf',
    question: 'The <strong>&lt;br&gt;</strong> tag is a self-closing HTML element.',
    options: ['True', 'False'],
    correct: 0   // True
  },
  {
    id: 10,
    type: 'fitb',
    question: 'Complete the CSS property used to change the <strong>background color</strong> of an element:\n<code>___________ : blue;</code>',
    correct: 'background-color',
    hint: 'Two words joined by a hyphen'
  }
];

const TOTAL = QUESTIONS.length;
const TIMER_MAX = 30;
const TIMER_CIRCUMFERENCE = 163.36; // 2π × 26

/* ── State ────────────────────────────────────────────────── */
let currentIndex = 0;
let score        = 0;
let correctCount = 0;
let wrongCount   = 0;
let skippedCount = 0;
let timerInterval = null;
let timeLeft     = TIMER_MAX;
let answered     = false;

/* ── DOM Refs ─────────────────────────────────────────────── */
const screenStart   = document.getElementById('screen-start');
const screenQuiz    = document.getElementById('screen-quiz');
const screenResults = document.getElementById('screen-results');

const btnStart      = document.getElementById('btn-start');
const btnNext       = document.getElementById('btn-next');
const btnPlayAgain  = document.getElementById('btn-play-again');

const qCurrent      = document.getElementById('q-current');
const qTotal        = document.getElementById('q-total');
const qTypeBadge    = document.getElementById('q-type-badge');
const qText         = document.getElementById('q-text');
const optionsGrid   = document.getElementById('options-grid');
const progressBar   = document.getElementById('progress-bar');

const timerFill     = document.getElementById('timer-fill-circle');
const timerLabel    = document.getElementById('timer-label');
const scoreLiveVal  = document.getElementById('score-live-val');

const fitbWrap      = document.getElementById('fitb-wrap');
const fitbInput     = document.getElementById('fitb-input');
const fitbSubmit    = document.getElementById('fitb-submit');

const feedbackBanner = document.getElementById('feedback-banner');
const feedbackIcon   = document.getElementById('feedback-icon');
const feedbackText   = document.getElementById('feedback-text');

const questionCard  = document.getElementById('question-card');

const starEls       = [document.getElementById('star-1'), document.getElementById('star-2'), document.getElementById('star-3')];
const perfLabel     = document.getElementById('perf-label');
const scoreBig      = document.getElementById('score-big');
const pctNum        = document.getElementById('pct-num');
const pctFill       = document.getElementById('pct-fill-circle');
const sumCorrect    = document.getElementById('sum-correct');
const sumWrong      = document.getElementById('sum-wrong');
const sumSkipped    = document.getElementById('sum-skipped');
const confettiCanvas = document.getElementById('confetti-canvas');

/* ── Screen Transitions ───────────────────────────────────── */
function showScreen(el) {
  [screenStart, screenQuiz, screenResults].forEach(s => {
    if (s !== el) {
      s.classList.remove('active');
    }
  });
  el.classList.add('active');
}

/* ── Quiz Init ────────────────────────────────────────────── */
function startQuiz() {
  currentIndex = 0;
  score        = 0;
  correctCount = 0;
  wrongCount   = 0;
  skippedCount = 0;
  answered     = false;

  qTotal.textContent  = TOTAL;
  scoreLiveVal.textContent = '0';

  showScreen(screenQuiz);
  loadQuestion(true);
}

/* ── Load Question ────────────────────────────────────────── */
function loadQuestion(firstLoad) {
  clearTimer();
  answered = false;
  btnNext.hidden = true;

  const q = QUESTIONS[currentIndex];

  // --- Progress ---
  const pct = (currentIndex / TOTAL) * 100;
  progressBar.style.width = pct + '%';
  progressBar.setAttribute('aria-valuenow', Math.round(pct));
  qCurrent.textContent = currentIndex + 1;

  // --- Animate card ---
  if (!firstLoad) {
    questionCard.classList.add('slide-out-left');
    setTimeout(() => {
      questionCard.classList.remove('slide-out-left');
      questionCard.classList.add('slide-in-right');
      populateQuestion(q);
      // Force reflow
      questionCard.offsetHeight;
      questionCard.classList.add('slide-in-active');
      setTimeout(() => questionCard.classList.remove('slide-in-right', 'slide-in-active'), 350);
    }, 330);
  } else {
    populateQuestion(q);
  }
}

function populateQuestion(q) {
  // Reset feedback
  feedbackBanner.className = 'feedback-banner';
  feedbackIcon.textContent = '';
  feedbackText.textContent = '';

  // Type Badge
  const badgeMap = { mcq: 'Multiple Choice', tf: 'True / False', fitb: 'Fill in the Blank' };
  const badgeClass = { mcq: '', tf: 'tf', fitb: 'fitb' };
  qTypeBadge.textContent = badgeMap[q.type];
  qTypeBadge.className = 'q-type-badge ' + badgeClass[q.type];

  // Question Text
  qText.innerHTML = q.question;

  // Options
  optionsGrid.innerHTML = '';
  optionsGrid.style.display = '';

  if (q.type === 'fitb') {
    optionsGrid.style.display = 'none';
    fitbWrap.classList.add('visible');
    fitbWrap.setAttribute('aria-hidden', 'false');
    fitbInput.value = '';
    fitbInput.disabled = false;
    fitbInput.className = 'fitb-input';
    fitbInput.focus();
  } else {
    fitbWrap.classList.remove('visible');
    fitbWrap.setAttribute('aria-hidden', 'true');
    fitbInput.value = '';

    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.id = 'opt-' + i;
      btn.setAttribute('aria-label', 'Option ' + letters[i] + ': ' + opt);

      btn.innerHTML = `<span class="opt-letter">${letters[i]}</span><span class="opt-text">${opt}</span>`;
      btn.addEventListener('click', () => handleOptionClick(btn, i, q));
      optionsGrid.appendChild(btn);
    });
  }

  // Timer
  startTimer();
}

/* ── Timer ────────────────────────────────────────────────── */
function startTimer() {
  timeLeft = TIMER_MAX;
  updateTimerUI(timeLeft);

  timerFill.classList.remove('danger');
  timerLabel.classList.remove('danger');

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerUI(timeLeft);

    if (timeLeft <= 10) {
      timerFill.classList.add('danger');
      timerLabel.classList.add('danger');
    }

    if (timeLeft <= 0) {
      clearTimer();
      handleTimeout();
    }
  }, 1000);
}

function clearTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

function updateTimerUI(t) {
  timerLabel.textContent = t;
  const offset = TIMER_CIRCUMFERENCE * (1 - t / TIMER_MAX);
  timerFill.style.strokeDashoffset = offset;
}

/* ── Handle Answer ────────────────────────────────────────── */
function handleOptionClick(btn, index, q) {
  if (answered) return;
  answered = true;
  clearTimer();
  disableOptions();

  const isCorrect = index === q.correct;

  if (isCorrect) {
    btn.classList.add('correct');
    score++;
    correctCount++;
    scoreLiveVal.textContent = score;
    showFeedback(true, '');
  } else {
    btn.classList.add('wrong');
    btn.classList.add('shake');
    wrongCount++;
    // Reveal correct
    const correctBtn = document.getElementById('opt-' + q.correct);
    if (correctBtn) correctBtn.classList.add('correct-reveal');
    showFeedback(false, 'Correct answer: ' + q.options[q.correct]);
  }

  autoNext();
}

function handleFitbSubmit() {
  if (answered) return;
  const q = QUESTIONS[currentIndex];
  const val = fitbInput.value.trim().toLowerCase().replace(/[-\s]/g, '');
  const correctVal = q.correct.toLowerCase().replace(/[-\s]/g, '');

  answered = true;
  clearTimer();
  fitbInput.disabled = true;

  if (val === correctVal) {
    fitbInput.classList.add('correct-input');
    score++;
    correctCount++;
    scoreLiveVal.textContent = score;
    showFeedback(true, '');
  } else {
    fitbInput.classList.add('wrong-input');
    wrongCount++;
    showFeedback(false, 'Correct answer: ' + q.correct);
  }

  autoNext();
}

function handleTimeout() {
  if (answered) return;
  answered = true;
  skippedCount++;
  disableOptions();

  const q = QUESTIONS[currentIndex];
  if (q.type !== 'fitb') {
    const correctBtn = document.getElementById('opt-' + q.correct);
    if (correctBtn) correctBtn.classList.add('correct-reveal');
  } else {
    fitbInput.disabled = true;
  }

  showFeedback(null, 'Time\'s up! Correct answer: ' + (q.type === 'fitb' ? q.correct : q.options[q.correct]));
  autoNext();
}

function disableOptions() {
  const btns = optionsGrid.querySelectorAll('.option-btn');
  btns.forEach(b => b.disabled = true);
}

/* ── Feedback Banner ──────────────────────────────────────── */
function showFeedback(isCorrect, extra) {
  feedbackBanner.classList.remove('correct-fb', 'wrong-fb', 'timeout-fb');

  if (isCorrect === true) {
    feedbackIcon.textContent = '✓';
    feedbackText.textContent = 'Correct! Well done.';
    feedbackBanner.classList.add('correct-fb');
  } else if (isCorrect === false) {
    feedbackIcon.textContent = '✗';
    feedbackText.innerHTML = 'Incorrect. <span style="opacity:0.8">' + extra + '</span>';
    feedbackBanner.classList.add('wrong-fb');
  } else {
    feedbackIcon.textContent = '⏱';
    feedbackText.innerHTML = '<span style="opacity:0.8">' + extra + '</span>';
    feedbackBanner.classList.add('timeout-fb');
  }

  feedbackBanner.classList.add('show');
}

/* ── Auto-advance ─────────────────────────────────────────── */
function autoNext() {
  btnNext.hidden = false;
  // Auto-advance after 1.8 seconds
  setTimeout(() => {
    if (!btnNext.hidden) advanceQuestion();
  }, 1800);
}

function advanceQuestion() {
  btnNext.hidden = true;
  currentIndex++;
  if (currentIndex >= TOTAL) {
    showResults();
  } else {
    loadQuestion(false);
  }
}

/* ── Results Screen ───────────────────────────────────────── */
function showResults() {
  clearTimer();

  // Progress bar full
  progressBar.style.width = '100%';

  showScreen(screenResults);

  const pct = Math.round((score / TOTAL) * 100);

  // Animate score number
  animateCount(scoreBig, 0, score, 900);
  animateCount(pctNum, 0, pct, 1000, '%');

  // Percentage ring
  setTimeout(() => {
    const circumference = 326.73;
    const offset = circumference * (1 - pct / 100);
    pctFill.style.strokeDashoffset = offset;
  }, 200);

  // Summary stats
  sumCorrect.textContent = correctCount;
  sumWrong.textContent   = wrongCount;
  sumSkipped.textContent = skippedCount;

  // Performance label & stars
  let stars = 0, perf = '';
  if (pct >= 80) { stars = 3; perf = '🏆 Outstanding!'; }
  else if (pct >= 50) { stars = 2; perf = '👏 Good Job!'; }
  else { stars = 1; perf = '📚 Keep Learning!'; }
  perfLabel.textContent = perf;

  // Animate stars one by one
  starEls.forEach((s, i) => {
    s.classList.remove('lit');
    if (i < stars) {
      setTimeout(() => s.classList.add('lit'), 400 + i * 260);
    }
  });

  // Confetti if score ≥ 8
  if (score >= 8) {
    setTimeout(launchConfetti, 600);
  }
}

/* ── Count Animation ──────────────────────────────────────── */
function animateCount(el, from, to, duration, suffix) {
  suffix = suffix || '';
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (to - from) * ease) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ── Confetti ─────────────────────────────────────────────── */
function launchConfetti() {
  const canvas = confettiCanvas;
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#00d4ff','#7c3aed','#f59e0b','#22c55e','#ef4444','#ffffff'];
  const particles = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: -10 - Math.random() * 100,
    w: 8 + Math.random() * 8,
    h: 4 + Math.random() * 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: (Math.random() - 0.5) * 3,
    vy: 2.5 + Math.random() * 3,
    angle: Math.random() * 360,
    spin: (Math.random() - 0.5) * 8,
    alpha: 1
  }));

  let frame;
  let elapsed = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    elapsed++;

    particles.forEach(p => {
      p.x     += p.vx;
      p.y     += p.vy;
      p.angle += p.spin;
      if (elapsed > 80) p.alpha -= 0.012;
      p.alpha = Math.max(0, p.alpha);

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.angle * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    const alive = particles.some(p => p.alpha > 0 && p.y < canvas.height + 20);
    if (alive) { frame = requestAnimationFrame(draw); }
    else { ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }

  frame = requestAnimationFrame(draw);
}

/* ── Add gradient def to SVG rings ───────────────────────── */
function injectSvgGradients() {
  // Inject pct gradient defs
  const pctSvg = document.querySelector('.pct-svg');
  if (pctSvg) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <linearGradient id="pct-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stop-color="#00d4ff"/>
        <stop offset="100%" stop-color="#7c3aed"/>
      </linearGradient>`;
    pctSvg.prepend(defs);
  }
}

/* ── Event Listeners ──────────────────────────────────────── */
btnStart.addEventListener('click', startQuiz);

btnNext.addEventListener('click', advanceQuestion);

btnPlayAgain.addEventListener('click', () => {
  // Clear confetti
  const ctx = confettiCanvas.getContext('2d');
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  // Reset star UI
  starEls.forEach(s => s.classList.remove('lit'));
  // Reset pct ring
  pctFill.style.strokeDashoffset = '326.73';
  // Go back to start
  showScreen(screenStart);
});

fitbSubmit.addEventListener('click', handleFitbSubmit);
fitbInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleFitbSubmit();
});

/* ── Init ─────────────────────────────────────────────────── */
injectSvgGradients();
