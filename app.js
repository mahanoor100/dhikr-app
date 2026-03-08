// ===== DHIKR DATA =====
const dhikrList = [
  {
    label: "پہلا عشرہ — رحمت",
    name: "Dua — 1st Ashra",
    arabic: "رَبِّ اغْفِرْ وَارْحَمْ وَأَنْتَ خَيْرُ الرَّاحِمِينَ ",
    urdu: "اے میرے رب! مجھے بخش دے اور مجھ پر رحم فرما، اور تو سب سے بہتر رحم کرنے والا ہے"
  },
  {
    label: "دوسرا عشرہ — مغفرت",
    name: "Dua — 2nd Ashra",
    arabic: "أَسْتَغْفِرُ اللَّهَ رَبِّي مِنْ كُلِّ ذَنْبٍ وَأَتُوبُ إِلَيْهِ ",
    urdu: "میں اللہ سے معافی مانگتا ہوں جو میرا رب ہے، اپنے ہر گناہ سے، اور میں اسی کی طرف رجوع کرتا ہوں"
  },
  {
    label: "تیسرا عشرہ — جہنم سے نجات",
    name: "Dua — 3rd Ashra",
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    urdu: "اے اللہ! بے شک تو بہت معاف کرنے والا ہے، معاف کرنے کو پسند کرتا ہے، پس تو مجھے معاف فرمادے"
  },
  {
    label: "توبہ و استغفار",
    name: "Tawbah",
    arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
    urdu: "میں اللہ سے مغفرت مانگتا ہوں اور اس کی طرف رجوع کرتا ہوں"
  },
  {
    label: "جامع دعا",
    name: "Jami' Dua",
    arabic: "اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَعَافِنِي وَاهْدِنِي وَارْزُقْنِي",
    urdu: "اے اللہ! مجھے بخش دے، مجھ پر رحم کر، مجھے عافیت دے، مجھے ہدایت دے اور مجھے رزق عطا فرما"
  },
  {
    label: "دعائے یونس",
    name: "Dua-e-Yunus",
    arabic: "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    urdu: "تیرے سوا کوئی معبود نہیں، تو پاک ہے، بیشک میں ظالموں میں سے تھا"
  },
  {
    label: "عافیت کی دعا",
    name: "Dua for 'Afiyah",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ",
    urdu: "اے اللہ! میں تجھ سے عافیت مانگتا ہوں"
  },
  {
    label: "اللہ سے فریاد",
    name: "Ya Hayyu Ya Qayyum",
    arabic: "يَا حَيُّ يَا قَيُّوْمُ بِرَحْمَتِكَ أَسْتَغِيْث",
    urdu: "اے زندہ! اے قائم رہنے والے! میں تیری رحمت کا سہارا مانگتا ہوں"
  },
  {
    label: "توکل علی اللہ",
    name: "Hasbiyallah",
    arabic: "حَسْبِيَ اللهُ وَنِعْمَ الْوَكِيلُ",
    urdu: "اللہ مجھے کافی ہے اور وہ بہترین کارساز ہے"
  },
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
    const d = dhikrList[currentDhikrIndex];
    document.getElementById('dhikrLabel').textContent  = d.label  || '';
    dhikrArabicEl.textContent = d.arabic;
    document.getElementById('dhikrUrdu').textContent   = d.urdu   || '';
    dhikrNameEl.textContent   = d.name;
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
const initDhikr = dhikrList[0];
document.getElementById('dhikrLabel').textContent = initDhikr.label  || '';
dhikrArabicEl.textContent = initDhikr.arabic;
document.getElementById('dhikrUrdu').textContent  = initDhikr.urdu   || '';
dhikrNameEl.textContent   = initDhikr.name;

// ===== SERVICE WORKER =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
