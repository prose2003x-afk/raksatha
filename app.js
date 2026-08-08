/**
 * FOREVER WITH YOU — PROSE & RAKSATHA
 * Interactive Romantic Web Experience (Tanglish Edition)
 */

(function () {
  'use strict';

  // ================= 1. STATE & DEFAULT CONFIGURATION =================
  const DEFAULT_CONFIG = {
    partner1: 'Prose',
    partner2: 'Raksatha',
    startDate: '2023-01-01T00:00:00',
    heroImage: 'Hero_main_photo.jpeg',
    surpriseImage: 'Scratch_Secret_photo.jpeg',
    spotlightImage: 'Spotlight.jpeg',
    photo1: 'Polaroid_1.jpeg',
    photo2: 'Polaroid_2.jpeg',
    photo3: 'Polaroid_3.jpeg',
    letterContent: `Un kitta solla nariya vishayam manasula irukku thangamey... En life la nee vandhadhuku apram dhaan ellaame romba azhaga maariduchu.

Unnoda anbu, unnoda chinna chinna sirippu, un kooda irukura andha nimmathi... idhu edhuvume enaku vera engaum kedaikaadhu. Un kooda pesura ovvoru nimishamum enaku romba special.

En kastamaana nerathula en kooda nikurathula irundhu, enna purinjikuradhu varaikum nee thaan enaku ellame. Thank you for being my best friend, my soulmate, and my forever love.

Indha ulagathula ethana kodi per irundhalum, en idhayam un kaila thaan eppavume safe-ah irukum. Unna sirika vechi, un koodave nalla paathukanum nu aasa padrann.

Life full-ah un koodave unna thaangi pidichu vazhanum nu aasa padrann. Love you to the moon and back Raksatha! ❤️`,
    scratchMessage: `Indha coupon vechu lifetime full-ah unlimited hugs, spontaneous late-night ice cream runs, forehead kisses, and Prose-oda unconditional true love redeem pannikalam! ❤️`
  };

  // Load from localStorage or default
  let userConfig = { ...DEFAULT_CONFIG };
  try {
    const saved = localStorage.getItem('prose_raksatha_love_config_v4');
    if (saved) {
      userConfig = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('LocalStorage not available, using default config');
  }

  // ================= ROMANTIC TOAST NOTIFICATION (NO BROWSER ALERT) =================
  const toastContainer = document.getElementById('romantic-toast-container');
  function showRomanticToast(text, icon = '💖', duration = 3800) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'romantic-toast';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${text}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('is-hiding');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 350);
    }, duration);
  }

  // ================= 2. AUDIO SYNTHESIZER (WEB AUDIO API) =================
  let audioCtx = null;
  let isPlayingMusic = false;
  let melodyInterval = null;

  const ROMANTIC_CHORDS = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [196.00, 246.94, 293.66, 349.23], // G7
    [164.81, 220.00, 261.63, 329.63], // Em7
    [174.61, 261.63, 329.63, 392.00]  // Fmaj9
  ];

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, type = 'sine', duration = 1.8, delay = 0, gainLevel = 0.08) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, audioCtx.currentTime + delay);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(gainLevel, audioCtx.currentTime + delay + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime + delay);
      osc.stop(audioCtx.currentTime + delay + duration);
    } catch (e) {
      console.warn('Audio tone error:', e);
    }
  }

  function playRomanticChime() {
    initAudioContext();
    if (!audioCtx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      playTone(freq, 'triangle', 1.2, idx * 0.12, 0.07);
    });
  }

  function playHeartChime() {
    initAudioContext();
    if (!audioCtx) return;
    playTone(587.33, 'sine', 0.8, 0, 0.09);
    playTone(880.00, 'triangle', 1.2, 0.08, 0.08);
  }

  function startBackgroundMelody() {
    initAudioContext();
    if (!audioCtx) return;
    isPlayingMusic = true;
    updateMusicUI(true);

    let chordIdx = 0;
    const playChordSequence = () => {
      if (!isPlayingMusic || !audioCtx) return;
      const chord = ROMANTIC_CHORDS[chordIdx % ROMANTIC_CHORDS.length];
      chord.forEach((freq, idx) => {
        playTone(freq, 'sine', 3.5, idx * 0.15, 0.035);
        playTone(freq * 2, 'triangle', 2.0, idx * 0.15 + 0.05, 0.015);
      });
      chordIdx++;
    };

    playChordSequence();
    if (melodyInterval) clearInterval(melodyInterval);
    melodyInterval = setInterval(playChordSequence, 3200);
  }

  function stopBackgroundMelody() {
    isPlayingMusic = false;
    if (melodyInterval) clearInterval(melodyInterval);
    updateMusicUI(false);
  }

  function updateMusicUI(active) {
    const btn = document.getElementById('music-toggle-btn');
    const disc = document.getElementById('vinyl-disc');
    const label = document.getElementById('music-label');
    if (btn) btn.classList.toggle('is-playing', active);
    if (disc) disc.classList.toggle('is-spinning', active);
    if (label) label.textContent = active ? 'Melody Playing' : 'Romantic Melody';
  }

  // ================= 3. PARTICLE ENGINE (SKY CANVAS & CURSOR) =================
  const skyCanvas = document.getElementById('sky-canvas');
  const skyCtx = skyCanvas ? skyCanvas.getContext('2d') : null;
  const cursorCanvas = document.getElementById('cursor-canvas');
  const cursorCtx = cursorCanvas ? cursorCanvas.getContext('2d') : null;

  let width = (window.innerWidth || 1200);
  let height = (window.innerHeight || 800);

  function resizeCanvases() {
    width = window.innerWidth;
    height = window.innerHeight;
    if (skyCanvas) {
      skyCanvas.width = width;
      skyCanvas.height = height;
    }
    if (cursorCanvas) {
      cursorCanvas.width = width;
      cursorCanvas.height = height;
    }
  }
  window.addEventListener('resize', resizeCanvases);
  resizeCanvases();

  const stars = [];
  const heartEmbers = [];
  const fireworks = [];

  for (let i = 0; i < 90; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.02 + 0.005,
      twinkleDir: Math.random() > 0.5 ? 1 : -1
    });
  }

  for (let i = 0; i < 24; i++) {
    heartEmbers.push({
      x: Math.random() * width,
      y: height + Math.random() * 200,
      size: Math.random() * 14 + 10,
      speedY: Math.random() * 0.8 + 0.4,
      swaySpeed: Math.random() * 0.02 + 0.01,
      swayOffset: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.7 + 0.2,
      hue: Math.random() > 0.3 ? 340 : 45
    });
  }

  function drawHeartPath(ctx, x, y, size) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.2, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
  }

  function renderSky() {
    if (!skyCtx) return;
    skyCtx.clearRect(0, 0, width, height);

    stars.forEach(s => {
      s.alpha += s.speed * s.twinkleDir;
      if (s.alpha > 0.95) { s.alpha = 0.95; s.twinkleDir = -1; }
      if (s.alpha < 0.15) { s.alpha = 0.15; s.twinkleDir = 1; }

      skyCtx.fillStyle = `rgba(255, 245, 230, ${s.alpha})`;
      skyCtx.beginPath();
      skyCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      skyCtx.fill();
    });

    heartEmbers.forEach(h => {
      h.y -= h.speedY;
      h.x += Math.sin(h.swayOffset) * 0.6;
      h.swayOffset += h.swaySpeed;

      if (h.y < -50) {
        h.y = height + 40;
        h.x = Math.random() * width;
      }

      skyCtx.save();
      skyCtx.fillStyle = h.hue === 340
        ? `rgba(255, 60, 110, ${h.alpha})`
        : `rgba(246, 211, 101, ${h.alpha})`;
      skyCtx.shadowColor = 'rgba(255, 51, 102, 0.6)';
      skyCtx.shadowBlur = 10;
      drawHeartPath(skyCtx, h.x, h.y, h.size);
      skyCtx.fill();
      skyCtx.restore();
    });

    for (let i = fireworks.length - 1; i >= 0; i--) {
      const p = fireworks[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08;
      p.alpha -= 0.015;
      p.size = Math.max(0.1, p.size * 0.98);

      if (p.alpha <= 0) {
        fireworks.splice(i, 1);
        continue;
      }

      skyCtx.save();
      skyCtx.fillStyle = p.color;
      skyCtx.globalAlpha = p.alpha;
      if (p.isHeart) {
        drawHeartPath(skyCtx, p.x, p.y, p.size * 2);
        skyCtx.fill();
      } else {
        skyCtx.beginPath();
        skyCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        skyCtx.fill();
      }
      skyCtx.restore();
    }

    requestAnimationFrame(renderSky);
  }
  renderSky();

  function triggerFireworksBurst(originX, originY, count = 60) {
    const colors = ['#ff3366', '#ff5e83', '#f6d365', '#ffffff', '#ff70a6', '#ffd166'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      fireworks.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        isHeart: Math.random() > 0.4
      });
    }
  }

  // Cursor Sparkle Trail
  const cursorSparkles = [];
  window.addEventListener('pointermove', (e) => {
    if (cursorSparkles.length < 40) {
      cursorSparkles.push({
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 4 + 2,
        alpha: 0.9,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 - 0.5,
        color: Math.random() > 0.5 ? '#ff4d80' : '#f6d365'
      });
    }
  });

  function renderCursorTrail() {
    if (!cursorCtx) return;
    cursorCtx.clearRect(0, 0, width, height);

    for (let i = cursorSparkles.length - 1; i >= 0; i--) {
      const sp = cursorSparkles[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.alpha -= 0.025;
      sp.size *= 0.96;

      if (sp.alpha <= 0) {
        cursorSparkles.splice(i, 1);
        continue;
      }

      cursorCtx.save();
      cursorCtx.fillStyle = sp.color;
      cursorCtx.globalAlpha = sp.alpha;
      cursorCtx.shadowColor = sp.color;
      cursorCtx.shadowBlur = 6;
      cursorCtx.beginPath();
      cursorCtx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      cursorCtx.fill();
      cursorCtx.restore();
    }
    requestAnimationFrame(renderCursorTrail);
  }
  renderCursorTrail();

  // ================= 4. SURPRISE INTRO GATE =================
  const introGate = document.getElementById('intro-gate');
  const introHeartBtn = document.getElementById('intro-heart-btn');

  function openIntroGate() {
    if (!introGate || introGate.classList.contains('is-opened')) return;

    playRomanticChime();
    const rect = introHeartBtn ? introHeartBtn.getBoundingClientRect() : { left: width / 2, top: height / 2 };
    triggerFireworksBurst(rect.left + 50, rect.top + 45, 90);

    introGate.classList.add('is-opened');
    document.body.classList.remove('is-locked');

    setTimeout(() => {
      startBackgroundMelody();
    }, 600);

    setTimeout(() => {
      if (introGate.parentNode) {
        introGate.style.display = 'none';
      }
    }, 1300);
  }

  if (introHeartBtn) {
    introHeartBtn.addEventListener('click', openIntroGate);
    introHeartBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openIntroGate();
      }
    });
  }

  // ================= 5. LIVE LOVE CLOCK COUNTER =================
  function updateLoveClock() {
    const start = new Date(userConfig.startDate).getTime();
    const now = new Date().getTime();
    let diff = Math.max(0, now - start);

    const secondsTotal = Math.floor(diff / 1000);
    const minutesTotal = Math.floor(secondsTotal / 60);
    const hoursTotal = Math.floor(minutesTotal / 60);
    const daysTotal = Math.floor(hoursTotal / 24);
    const years = Math.floor(daysTotal / 365);
    const daysRemaining = daysTotal % 365;

    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const elYears = document.getElementById('clock-years');
    const elDays = document.getElementById('clock-days');
    const elHours = document.getElementById('clock-hours');
    const elMins = document.getElementById('clock-minutes');
    const elSecs = document.getElementById('clock-seconds');

    if (elYears) elYears.textContent = years;
    if (elDays) elDays.textContent = String(daysRemaining).padStart(2, '0');
    if (elHours) elHours.textContent = String(hours).padStart(2, '0');
    if (elMins) elMins.textContent = String(minutes).padStart(2, '0');
    if (elSecs) elSecs.textContent = String(seconds).padStart(2, '0');
  }
  setInterval(updateLoveClock, 1000);
  updateLoveClock();

  // ================= 6. INTERACTIVE WAX SEAL & DEDICATED FULLSCREEN LOVE LETTER =================
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const toggleLetterBtn = document.getElementById('toggle-letter-expand-btn');
  const readAloudBtn = document.getElementById('read-aloud-letter-btn');
  const letterModal = document.getElementById('letter-modal');
  const closeLetterModalBtn = document.getElementById('close-letter-modal-btn');
  const modalLetterCloseBottom = document.getElementById('modal-letter-close-bottom');

  function openLetterModal() {
    playRomanticChime();
    if (letterModal) {
      letterModal.classList.add('is-active');
      triggerFireworksBurst(width / 2, height / 3, 60);
    }
  }

  function toggleEnvelope() {
    if (!envelopeWrapper) return;
    const isOpen = envelopeWrapper.classList.toggle('is-open');
    playRomanticChime();
    if (isOpen) {
      const rect = envelopeWrapper.getBoundingClientRect();
      triggerFireworksBurst(rect.left + rect.width / 2, rect.top + 80, 45);
    }
  }

  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', () => {
      toggleEnvelope();
    });
  }

  if (toggleLetterBtn) {
    toggleLetterBtn.addEventListener('click', openLetterModal);
  }

  if (closeLetterModalBtn && letterModal) {
    closeLetterModalBtn.addEventListener('click', () => {
      letterModal.classList.remove('is-active');
    });
  }
  if (modalLetterCloseBottom && letterModal) {
    modalLetterCloseBottom.addEventListener('click', () => {
      letterModal.classList.remove('is-active');
    });
  }

  // Read Aloud Letter Feature (Speech Synthesis)
  if (readAloudBtn) {
    readAloudBtn.addEventListener('click', () => {
      if ('speechSynthesis' in window) {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          readAloudBtn.innerHTML = '<span>🔊</span><span>Read Aloud</span>';
          return;
        }

        const letterText = document.getElementById('letter-content-text');
        const textToRead = letterText ? letterText.innerText : userConfig.letterContent;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 0.88;
        utterance.pitch = 1.05;

        utterance.onstart = () => {
          readAloudBtn.innerHTML = '<span>⏹️</span><span>Stop Voice</span>';
          showRomanticToast('Reading our love letter for Raksatha... 💌', '💌');
        };
        utterance.onend = () => {
          readAloudBtn.innerHTML = '<span>🔊</span><span>Read Aloud</span>';
        };

        window.speechSynthesis.speak(utterance);
      } else {
        showRomanticToast('Voice synthesis is not supported on this browser', 'ℹ️');
      }
    });
  }

  // ================= 7. INTERACTIVE SCRATCH-TO-REVEAL SURPRISE & POP-UP MODAL =================
  const scratchCanvas = document.getElementById('scratch-canvas');
  const scratchCardBox = document.getElementById('scratch-card-box');
  const scratchFill = document.getElementById('scratch-fill');
  const scratchPct = document.getElementById('scratch-pct');
  const autoRevealBtn = document.getElementById('auto-reveal-scratch-btn');
  const surprisePhotoModal = document.getElementById('surprise-photo-modal');
  const closeSurpriseModalBtn = document.getElementById('close-surprise-modal-btn');
  const surpriseModalLoveBtn = document.getElementById('surprise-modal-love-btn');

  let isScratching = false;
  let scratchComplete = false;

  function openSurpriseModal() {
    playRomanticChime();
    if (surprisePhotoModal) {
      surprisePhotoModal.classList.add('is-active');
      triggerFireworksBurst(width / 2, height / 2, 90);
    }
  }

  function initScratchCard() {
    if (!scratchCanvas) return;
    const ctx = scratchCanvas.getContext('2d');
    const rect = scratchCanvas.getBoundingClientRect();
    scratchCanvas.width = rect.width || 680;
    scratchCanvas.height = rect.height || 380;

    const grad = ctx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
    grad.addColorStop(0, '#e2a93b');
    grad.addColorStop(0.3, '#fbe082');
    grad.addColorStop(0.6, '#d1942b');
    grad.addColorStop(1, '#ff6987');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    for (let i = 0; i < scratchCanvas.width; i += 24) {
      for (let j = 0; j < scratchCanvas.height; j += 24) {
        if ((i + j) % 48 === 0) {
          ctx.beginPath();
          ctx.arc(i + 12, j + 12, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.fillStyle = '#2b0b28';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH WITH MOUSE OR FINGER ✨', scratchCanvas.width / 2, scratchCanvas.height / 2 - 14);
    ctx.font = '16px "Playfair Display", serif';
    ctx.fillStyle = '#4a1540';
    ctx.fillText('To reveal the secret surprise photo & love coupon for Raksatha ❤️', scratchCanvas.width / 2, scratchCanvas.height / 2 + 18);

    scratchComplete = false;
  }

  function scratch(x, y) {
    if (!scratchCanvas || scratchComplete) return;
    const ctx = scratchCanvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 36, 0, Math.PI * 2);
    ctx.fill();

    checkScratchProgress();
  }

  function checkScratchProgress() {
    if (!scratchCanvas || scratchComplete) return;
    const ctx = scratchCanvas.getContext('2d');
    try {
      const imgData = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
      let transparentCount = 0;
      for (let i = 3; i < imgData.data.length; i += 16 * 4) {
        if (imgData.data[i] === 0) transparentCount++;
      }
      const sampledTotal = (imgData.data.length / 4) / 16;
      const pct = Math.min(100, Math.round((transparentCount / sampledTotal) * 100));

      if (scratchFill) scratchFill.style.width = `${pct}%`;
      if (scratchPct) scratchPct.textContent = `${pct}%`;

      if (pct >= 35 && !scratchComplete) {
        revealFullScratch();
      }
    } catch (e) {
      console.warn('Scratch calculation error:', e);
    }
  }

  function revealFullScratch() {
    if (!scratchCanvas || scratchComplete) return;
    scratchComplete = true;
    const ctx = scratchCanvas.getContext('2d');
    ctx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
    if (scratchFill) scratchFill.style.width = '100%';
    if (scratchPct) scratchPct.textContent = '100%';

    playRomanticChime();
    const rect = scratchCanvas.getBoundingClientRect();
    triggerFireworksBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 85);

    // Automatically trigger romantic pop-up modal
    setTimeout(() => {
      openSurpriseModal();
    }, 400);
  }

  if (scratchCanvas) {
    scratchCanvas.addEventListener('mousedown', (e) => {
      isScratching = true;
      const rect = scratchCanvas.getBoundingClientRect();
      scratch(e.clientX - rect.left, e.clientY - rect.top);
    });
    window.addEventListener('mouseup', () => { isScratching = false; });
    scratchCanvas.addEventListener('mousemove', (e) => {
      if (!isScratching) return;
      const rect = scratchCanvas.getBoundingClientRect();
      scratch(e.clientX - rect.left, e.clientY - rect.top);
    });

    scratchCanvas.addEventListener('touchstart', (e) => {
      isScratching = true;
      const rect = scratchCanvas.getBoundingClientRect();
      const touch = e.touches[0];
      scratch(touch.clientX - rect.left, touch.clientY - rect.top);
    }, { passive: true });
    scratchCanvas.addEventListener('touchmove', (e) => {
      if (!isScratching) return;
      const rect = scratchCanvas.getBoundingClientRect();
      const touch = e.touches[0];
      scratch(touch.clientX - rect.left, touch.clientY - rect.top);
    }, { passive: true });
    scratchCanvas.addEventListener('touchend', () => { isScratching = false; });

    setTimeout(initScratchCard, 300);
    window.addEventListener('resize', initScratchCard);
  }

  if (autoRevealBtn) {
    autoRevealBtn.addEventListener('click', () => {
      revealFullScratch();
      openSurpriseModal();
    });
  }

  if (scratchCardBox) {
    scratchCardBox.addEventListener('click', () => {
      if (scratchComplete) {
        openSurpriseModal();
      }
    });
  }

  if (closeSurpriseModalBtn && surprisePhotoModal) {
    closeSurpriseModalBtn.addEventListener('click', () => {
      surprisePhotoModal.classList.remove('is-active');
    });
  }
  if (surpriseModalLoveBtn && surprisePhotoModal) {
    surpriseModalLoveBtn.addEventListener('click', () => {
      playRomanticChime();
      triggerFireworksBurst(width / 2, height / 2, 70);
      surprisePhotoModal.classList.remove('is-active');
      showRomanticToast('Love you forever Raksatha! ❤️', '💖');
    });
  }

  // ================= 8. MEMORY POLAROID GALLERY & SPOTLIGHT & LIGHTBOX =================
  const polaroids = document.querySelectorAll('.polaroid-card, .spotlight-polaroid-frame');
  const lightbox = document.getElementById('photo-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

  polaroids.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.polaroid-heart-react')) {
        const heartBtn = e.target.closest('.polaroid-heart-react');
        const countSpan = heartBtn.querySelector('.heart-count');
        if (countSpan) {
          countSpan.textContent = '❤️ Loved';
        }
        playHeartChime();
        const rect = heartBtn.getBoundingClientRect();
        triggerFireworksBurst(rect.left + 20, rect.top + 10, 20);
        showRomanticToast('Memory loved and cherished! ❤️', '💖');
        return;
      }

      const img = card.querySelector('.gallery-img, .spotlight-img');
      const title = card.querySelector('.polaroid-title, .spotlight-title');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        if (lightboxCaption && title) {
          lightboxCaption.textContent = title.textContent;
        }
        lightbox.classList.add('is-active');
        playHeartChime();
      }
    });
  });

  if (lightboxCloseBtn && lightbox) {
    lightboxCloseBtn.addEventListener('click', () => {
      lightbox.classList.remove('is-active');
    });
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('is-active');
    });
  }

  // ================= 9. THE FOREVER PROMISE / PLAYFUL PROPOSAL =================
  const proposalYesBtn = document.getElementById('proposal-yes-btn');
  const proposalNoBtn = document.getElementById('proposal-no-btn');
  const proposalFeedback = document.getElementById('proposal-feedback-msg');
  const certModal = document.getElementById('certificate-modal');
  const closeCertBtn = document.getElementById('close-cert-modal-btn');
  const downloadCertBtn = document.getElementById('download-cert-btn');

  if (proposalYesBtn) {
    proposalYesBtn.addEventListener('click', () => {
      playRomanticChime();
      triggerFireworksBurst(width / 2, height / 2, 120);
      triggerFireworksBurst(width / 4, height / 3, 80);
      triggerFireworksBurst((3 * width) / 4, height / 3, 80);

      if (proposalFeedback) {
        proposalFeedback.classList.add('is-visible');
      }

      showRomanticToast('Raksatha said YES! Celebrate with fireworks! 💍❤️', '💍');

      setTimeout(() => {
        if (certModal) certModal.classList.add('is-active');
      }, 1000);
    });
  }

  // Playful runaway "No" Button
  if (proposalNoBtn) {
    const moveNoButton = () => {
      const randomX = (Math.random() - 0.5) * 220;
      const randomY = (Math.random() - 0.5) * 120;
      proposalNoBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;

      const playfulRemarks = ['No solla mudiyadhu! 😉', 'Not an option! ❤️', 'Nope, only YES! 🥰', 'Can’t escape love! 💕'];
      const randomText = playfulRemarks[Math.floor(Math.random() * playfulRemarks.length)];
      proposalNoBtn.querySelector('span').textContent = randomText;
      playTone(440, 'sine', 0.2, 0, 0.05);
    };

    proposalNoBtn.addEventListener('mouseenter', moveNoButton);
    proposalNoBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      moveNoButton();
    });
  }

  if (closeCertBtn && certModal) {
    closeCertBtn.addEventListener('click', () => {
      certModal.classList.remove('is-active');
    });
  }

  if (downloadCertBtn) {
    downloadCertBtn.addEventListener('click', () => {
      playRomanticChime();
      showRomanticToast('Certificate of Eternal Love registered and celebrated forever for Prose & Raksatha! 💍❤️', '💍');
      if (certModal) certModal.classList.remove('is-active');
    });
  }

  // ================= 10. QUICK ACTIONS: SEND LOVE BURST =================
  const sendLoveBurstBtn = document.getElementById('send-love-burst-btn');
  if (sendLoveBurstBtn) {
    sendLoveBurstBtn.addEventListener('click', () => {
      playRomanticChime();
      const rect = sendLoveBurstBtn.getBoundingClientRect();
      triggerFireworksBurst(rect.left + 30, rect.top + 30, 80);

      const emojis = ['💖', '🌹', '✨', '💕', '🥰', '💍', '🌸'];
      for (let i = 0; i < 15; i++) {
        const floater = document.createElement('div');
        floater.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        floater.style.position = 'fixed';
        floater.style.left = `${rect.left + (Math.random() - 0.5) * 60}px`;
        floater.style.top = `${rect.top}px`;
        floater.style.fontSize = `${Math.random() * 20 + 24}px`;
        floater.style.zIndex = '99999';
        floater.style.pointerEvents = 'none';
        floater.style.transition = 'all 2.2s cubic-bezier(0.16, 1, 0.3, 1)';
        floater.style.opacity = '1';
        document.body.appendChild(floater);

        setTimeout(() => {
          floater.style.top = `${rect.top - Math.random() * 400 - 200}px`;
          floater.style.left = `${rect.left + (Math.random() - 0.5) * 300}px`;
          floater.style.opacity = '0';
          floater.style.transform = `scale(${Math.random() * 1.5 + 1}) rotate(${(Math.random() - 0.5) * 90}deg)`;
        }, 30);

        setTimeout(() => {
          if (floater.parentNode) floater.parentNode.removeChild(floater);
        }, 2400);
      }
    });
  }

  const makeWishBtn = document.getElementById('make-a-wish-btn');
  if (makeWishBtn) {
    makeWishBtn.addEventListener('click', () => {
      playRomanticChime();
      triggerFireworksBurst(width / 2, height / 2, 70);
      showRomanticToast('Namma wish shooting stars kitta pochu: Eternal happiness & love for Prose & Raksatha! 💫', '💫');
    });
  }

  const musicToggleBtn = document.getElementById('music-toggle-btn');
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      if (isPlayingMusic) {
        stopBackgroundMelody();
        showRomanticToast('Romantic melody paused 🎵', '🎵');
      } else {
        startBackgroundMelody();
        showRomanticToast('Romantic melody playing ✨', '🎵');
      }
    });
  }

  // ================= 11. PERSONALIZATION & PHOTO MANAGER =================
  const openCustomizerBtn = document.getElementById('open-customizer-btn');
  const customizerModal = document.getElementById('customizer-modal');
  const closeCustomizerModalBtn = document.getElementById('close-customizer-modal-btn');
  const saveCustomizerBtn = document.getElementById('save-customizer-btn');
  const resetDefaultsBtn = document.getElementById('reset-defaults-btn');

  const inputPartner1 = document.getElementById('input-partner-1');
  const inputPartner2 = document.getElementById('input-partner-2');
  const inputStartDate = document.getElementById('input-start-date');
  const inputLetterBody = document.getElementById('input-letter-body');
  const inputScratchMsg = document.getElementById('input-scratch-msg');

  const fileHero = document.getElementById('file-hero');
  const previewHero = document.getElementById('preview-hero');
  const fileSurprise = document.getElementById('file-surprise');
  const previewSurprise = document.getElementById('preview-surprise');
  const fileSpotlight = document.getElementById('file-spotlight');
  const previewSpotlight = document.getElementById('preview-spotlight');
  const filePhoto1 = document.getElementById('file-photo-1');
  const previewPhoto1 = document.getElementById('preview-photo-1');
  const filePhoto2 = document.getElementById('file-photo-2');
  const previewPhoto2 = document.getElementById('preview-photo-2');
  const filePhoto3 = document.getElementById('file-photo-3');
  const previewPhoto3 = document.getElementById('preview-photo-3');

  function openCustomizer() {
    if (!customizerModal) return;
    if (inputPartner1) inputPartner1.value = userConfig.partner1;
    if (inputPartner2) inputPartner2.value = userConfig.partner2;
    if (inputStartDate) inputStartDate.value = userConfig.startDate.split('T')[0];
    if (inputLetterBody) inputLetterBody.value = userConfig.letterContent;
    if (inputScratchMsg) inputScratchMsg.value = userConfig.scratchMessage;

    if (previewHero) previewHero.src = userConfig.heroImage;
    if (previewSurprise) previewSurprise.src = userConfig.surpriseImage || 'Scratch_Secret_photo.jpeg';
    if (previewSpotlight) previewSpotlight.src = userConfig.spotlightImage || 'Spotlight.jpeg';
    if (previewPhoto1) previewPhoto1.src = userConfig.photo1;
    if (previewPhoto2) previewPhoto2.src = userConfig.photo2;
    if (previewPhoto3) previewPhoto3.src = userConfig.photo3 || 'Polaroid_3.jpeg';

    customizerModal.classList.add('is-active');
  }

  if (openCustomizerBtn) openCustomizerBtn.addEventListener('click', openCustomizer);
  if (closeCustomizerModalBtn && customizerModal) {
    closeCustomizerModalBtn.addEventListener('click', () => {
      customizerModal.classList.remove('is-active');
    });
  }

  function bindImageInput(fileInput, previewImg, configKey) {
    if (!fileInput) return;
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        if (previewImg) previewImg.src = base64;
        userConfig[configKey] = base64;
      };
      reader.readAsDataURL(file);
    });
  }

  bindImageInput(fileHero, previewHero, 'heroImage');
  bindImageInput(fileSurprise, previewSurprise, 'surpriseImage');
  bindImageInput(fileSpotlight, previewSpotlight, 'spotlightImage');
  bindImageInput(filePhoto1, previewPhoto1, 'photo1');
  bindImageInput(filePhoto2, previewPhoto2, 'photo2');
  bindImageInput(filePhoto3, previewPhoto3, 'photo3');

  function applyConfigToUI() {
    document.querySelectorAll('.name-prose').forEach(el => el.textContent = userConfig.partner1);
    document.querySelectorAll('.name-raksatha').forEach(el => el.textContent = userConfig.partner2);
    document.querySelectorAll('.hero-name-partner').forEach(el => el.textContent = userConfig.partner2);
    document.querySelectorAll('.sig-name').forEach(el => el.textContent = userConfig.partner1);
    document.querySelectorAll('.cert-names').forEach(el => el.textContent = `${userConfig.partner1} & ${userConfig.partner2}`);

    const heroCoupleImg = document.getElementById('hero-couple-img');
    if (heroCoupleImg) heroCoupleImg.src = userConfig.heroImage;

    const scratchSurpriseImg = document.getElementById('scratch-surprise-photo');
    if (scratchSurpriseImg) scratchSurpriseImg.src = userConfig.surpriseImage || 'Scra.jpg';

    const modalSurpriseImg = document.getElementById('modal-surprise-img');
    if (modalSurpriseImg) modalSurpriseImg.src = userConfig.surpriseImage || 'Scratch_Secret_photo.jpeg';

    const spotlightPhotoImg = document.getElementById('spotlight-photo-img');
    if (spotlightPhotoImg) spotlightPhotoImg.src = userConfig.spotlightImage || 'Spotlight.jpeg',;

    const galleryImg1 = document.getElementById('gallery-img-1');
    if (galleryImg1) galleryImg1.src = userConfig.photo1;
    const galleryImg2 = document.getElementById('gallery-img-2');
    if (galleryImg2) galleryImg2.src = userConfig.photo2;
    const galleryImg3 = document.getElementById('gallery-img-3');
    if (galleryImg3) galleryImg3.src = userConfig.photo3 || 'Polaroid_3.jpeg';

    // Update In-Envelope Love Letter
    const letterTextEl = document.getElementById('letter-content-text');
    if (letterTextEl) {
      const paragraphs = userConfig.letterContent.split('\n\n');
      letterTextEl.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
    }

    // Update Fullscreen Parchment Love Letter
    const modalLetterFullText = document.getElementById('modal-letter-full-text');
    if (modalLetterFullText) {
      const paragraphs = userConfig.letterContent.split('\n\n');
      modalLetterFullText.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
    }

    // Update Scratch Message
    const secretMsgEl = document.getElementById('secret-card-msg');
    if (secretMsgEl) {
      secretMsgEl.textContent = `"${userConfig.scratchMessage}"`;
    }
    const modalSurpriseText = document.getElementById('modal-surprise-text');
    if (modalSurpriseText) {
      modalSurpriseText.textContent = `"${userConfig.scratchMessage}"`;
    }

    updateLoveClock();
  }

  if (saveCustomizerBtn) {
    saveCustomizerBtn.addEventListener('click', () => {
      if (inputPartner1) userConfig.partner1 = inputPartner1.value.trim() || 'Prose';
      if (inputPartner2) userConfig.partner2 = inputPartner2.value.trim() || 'Raksatha';
      if (inputStartDate && inputStartDate.value) {
        userConfig.startDate = `${inputStartDate.value}T00:00:00`;
      }
      if (inputLetterBody) userConfig.letterContent = inputLetterBody.value.trim();
      if (inputScratchMsg) userConfig.scratchMessage = inputScratchMsg.value.trim();

      try {
        localStorage.setItem('prose_raksatha_love_config_v4', JSON.stringify(userConfig));
      } catch (e) {
        console.warn('Could not save to localStorage:', e);
      }

      applyConfigToUI();
      playRomanticChime();
      if (customizerModal) customizerModal.classList.remove('is-active');
      showRomanticToast('Changes saved and applied to your universe! ✨', '✨');
    });
  }

  if (resetDefaultsBtn) {
    resetDefaultsBtn.addEventListener('click', () => {
      userConfig = { ...DEFAULT_CONFIG };
      try {
        localStorage.removeItem('prose_raksatha_love_config_v4');
      } catch (e) { }
      applyConfigToUI();
      openCustomizer();
      playRomanticChime();
      showRomanticToast('Universe reset back to default romantic settings! 🌸', '🌸');
    });
  }

  // Initial UI Render
  applyConfigToUI();

  // Close modals with Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (surprisePhotoModal) surprisePhotoModal.classList.remove('is-active');
      if (certModal) certModal.classList.remove('is-active');
      if (customizerModal) customizerModal.classList.remove('is-active');
      if (letterModal) letterModal.classList.remove('is-active');
      if (lightbox) lightbox.classList.remove('is-active');
    }
  });

})();
