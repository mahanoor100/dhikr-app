// ===== DHIKR DATA =====
const dhikrList = [
  { name: "SubhanAllah", arabic: "سُبْحَانَ اللَّهِ" },
  { name: "Alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ" },
  { name: "Allahu Akbar", arabic: "اللَّهُ أَكْبَرُ" },
  { name: "La ilaha illallah", arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ" },
  { name: "Astaghfirullah", arabic: "أَسْتَغْفِرُ اللَّهَ" },
  { name: "SubhanAllahi wa bihamdihi", arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ" },
];

// ===== STATE =====
let currentDhikrIndex = 0;
let count = 0;
let target = 33;
let sessionTotal = 0;

// ===== DOM REFS =====
const splashScreen = document.getElementById('splash-screen');
const counterScreen = document.getElementById('counter-screen');
const beginBtn = document.getElementById('beginBtn');
const backBtn = document.getElementById('backBtn');
const counterBtn = document.getElementById('counterBtn');
const countDisplay = document.getElementById('countDisplay');
const sessionTotalEl = document.getElementById('sessionTotal');
const dhikrNameEl = document.getElementById('dhikrName');
const dhikrArabicEl = document.getElementById('dhikrArabic');
const dhikrNameWrap = document.querySelector('.dhikr-name-wrap');
const prevDhikrBtn = document.getElementById('prevDhikr');
const nextDhikrBtn = document.getElementById('nextDhikr');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const resetBtn = document.getElementById('resetBtn');
const targetBtn = document.getElementById('targetBtn');
const targetLabel = document.getElementById('targetLabel');
const targetModal = document.getElementById('targetModal');
const modalClose = document.getElementById('modalClose');
const targetOpts = document.querySelectorAll('.target-opt');
const customTargetInput = document.getElementById('customTarget');
const setCustomTargetBtn = document.getElementById('setCustomTarget');
const celebration = document.getElementById('celebration');
const confettiCanvas = document.getElementById('confettiCanvas');
const rippleContainer = document.getElementById('rippleContainer');

// ===== SCREEN TRANSITIONS =====
beginBtn.addEventListener('click', () => {
  splashScreen.classList.add('slide-out');
  counterScreen.classList.add('active', 'slide-in');
  setTimeout(() => {
    splashScreen.classList.remove('active');
  }, 400);
});

backBtn.addEventListener('click', () => {
  counterScreen.classList.remove('active', 'slide-in');
  splashScreen.classList.remove('slide-out');
  splashScreen.classList.add('active');
});

// ===== COUNTER =====
function increment() {
  count++;
  sessionTotal++;
  updateDisplay();
  animateCountBump();
  createRipple();
  triggerHaptic();
  if (count === target) {
    setTimeout(showCelebration, 150);
  }
}

function updateDisplay() {
  countDisplay.textContent = count;
  sessionTotalEl.textContent = sessionTotal;
  const pct = Math.min((count / target) * 100, 100);
  progressBar.style.width = pct + '%';
  progressText.textContent = `${count} / ${target}`;
}

function animateCountBump() {
  countDisplay.classList.remove('count-bump');
  void countDisplay.offsetWidth;
  countDisplay.classList.add('count-bump');
}

function createRipple() {
  const btn = counterBtn.getBoundingClientRect();
  const ripple = document.createElement('div');
  ripple.className = 'ripple';
  const size = 200;
  ripple.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${btn.left + btn.width / 2 - size / 2 - rippleContainer.getBoundingClientRect().left}px;
    top: ${btn.top + btn.height / 2 - size / 2 - rippleContainer.getBoundingClientRect().top}px;
  `;
  rippleContainer.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
}

function triggerHaptic() {
  if ('vibrate' in navigator) {
    navigator.vibrate(12);
  }
}

counterBtn.addEventListener('click', increment);
counterBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  counterBtn.classList.add('pressed');
}, { passive: false });
counterBtn.addEventListener('touchend', (e) => {
  e.preventDefault();
  counterBtn.classList.remove('pressed');
  increment();
}, { passive: false });

// ===== DHIKR SWITCHER =====
function setDhikr(index) {
  currentDhikrIndex = (index + dhikrList.length) % dhikrList.length;
  dhikrNameWrap.classList.remove('changing');
  void dhikrNameWrap.offsetWidth;
  dhikrNameWrap.classList.add('changing');
  setTimeout(() => {
    dhikrNameEl.textContent = dhikrList[currentDhikrIndex].name;
    dhikrArabicEl.textContent = dhikrList[currentDhikrIndex].arabic;
  }, 120);
}

prevDhikrBtn.addEventListener('click', () => setDhikr(currentDhikrIndex - 1));
nextDhikrBtn.addEventListener('click', () => setDhikr(currentDhikrIndex + 1));

// ===== RESET =====
resetBtn.addEventListener('click', () => {
  count = 0;
  updateDisplay();
  triggerHaptic();
});

// ===== TARGET MODAL =====
targetBtn.addEventListener('click', () => {
  targetModal.classList.add('open');
  targetOpts.forEach(opt => {
    opt.classList.toggle('selected', parseInt(opt.dataset.val) === target);
  });
});

modalClose.addEventListener('click', () => targetModal.classList.remove('open'));
targetModal.addEventListener('click', (e) => {
  if (e.target === targetModal) targetModal.classList.remove('open');
});

targetOpts.forEach(opt => {
  opt.addEventListener('click', () => {
    target = parseInt(opt.dataset.val);
    applyTarget();
  });
});

setCustomTargetBtn.addEventListener('click', () => {
  const val = parseInt(customTargetInput.value);
  if (val && val > 0 && val <= 9999) {
    target = val;
    applyTarget();
    customTargetInput.value = '';
  }
});

function applyTarget() {
  targetLabel.textContent = target;
  updateDisplay();
  targetModal.classList.remove('open');
}

// ===== CELEBRATION =====
let confettiParticles = [];
let confettiAnimFrame;

function showCelebration() {
  celebration.classList.add('show');
  startConfetti();
  triggerHaptic();
  if ('vibrate' in navigator) navigator.vibrate([50, 30, 80, 30, 120]);
  setTimeout(() => {
    celebration.classList.remove('show');
    stopConfetti();
    count = 0;
    updateDisplay();
  }, 2800);
}

function startConfetti() {
  const ctx = confettiCanvas.getContext('2d');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiParticles = [];
  const colors = ['#c084fc', '#e879f9', '#f9a8d4', '#a78bfa', '#ffffff', '#fde68a'];
  for (let i = 0; i < 80; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: -20,
      r: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 4 + 2,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
    });
  }
  animateConfetti();
}

function animateConfetti() {
  const ctx = confettiCanvas.getContext('2d');
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiParticles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.rotSpeed;
    p.vy += 0.08;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rot * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.max(0, 1 - p.y / confettiCanvas.height);
    if (p.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, p.r, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
    }
    ctx.restore();
  });
  confettiAnimFrame = requestAnimationFrame(animateConfetti);
}

function stopConfetti() {
  cancelAnimationFrame(confettiAnimFrame);
  const ctx = confettiCanvas.getContext('2d');
  if (ctx) ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}

// ===== INIT =====
updateDisplay();
dhikrNameEl.textContent = dhikrList[0].name;
dhikrArabicEl.textContent = dhikrList[0].arabic;

// ===== SERVICE WORKER =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
