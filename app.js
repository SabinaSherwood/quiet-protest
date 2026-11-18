// ============================================================================
// The World of Quiet Protest and Soft Light — Screening Room & Mini-Game
// Created by Yerma Woods | Stream-Only & Artwork Protected
// ============================================================================

const EPISODES = [
  {
    id: 'ep0',
    num: 'Episode 0 • Prologue',
    title: 'How They Met',
    runtime: '1:00',
    poster: 'assets/posters/ep0.jpg',
    video1080: 'videos/1080p/ep0-narrator.mp4',
    vertical: false,
    desc: 'On a night when the moon refused to rise and the streets shone like black glass, a candle-carrying snail, a sign-waving carrot, and a tear-smudged bear started walking in the same direction.'
  },
  {
    id: 'ep1',
    num: 'Episode 1',
    title: 'The Myth of “Going Back to Normal”',
    runtime: '1:20',
    poster: 'assets/posters/ep1.jpg',
    video1080: 'videos/1080p/ep1.mp4',
    vertical: false,
    desc: 'At a rain-drizzling neon forest bus stop, Barnaby wraps yards of silver duct tape around his wind-snapped duck-handle umbrella while Shelly and Crunge turn a broken canopy into a boat.'
  },
  {
    id: 'ep2',
    num: 'Episode 2',
    title: 'Glass Sidewalk & Woodland Picnic',
    runtime: '1:20',
    poster: 'assets/posters/ep2.jpg',
    video1080: 'videos/1080p/ep2.mp4',
    vertical: false,
    desc: 'Crunge battles corporate architecture with a stick, discovers all three of their names misspelled in neon (“Why does mine say Cunge?”), and follows Shelly’s flame to quieter ground.'
  },
  {
    id: 'ep3',
    num: 'Episode 3',
    title: 'The Void Is Typing… & Book Sanctuary',
    runtime: '1:33',
    poster: 'assets/posters/ep3.jpg',
    video1080: 'videos/1080p/ep3.mp4',
    vertical: false,
    desc: 'A sterile terminal prescribes drinking water for unquantifiable grief before crashing—leading the trio into the Woodland Book Sanctuary where memory cannot be deleted from paper.'
  },
  {
    id: 'ep4',
    num: 'Episode 4',
    title: 'The Sound of Home',
    runtime: '1:24',
    poster: 'assets/posters/ep4.jpg',
    video1080: 'videos/1080p/ep4.mp4',
    vertical: false,
    desc: 'While Top-Hat Frog cites constitutional law beside a pond and Little Red Hen guards the coop, a screen door slaps shut and the porch light stays warm against the dark.'
  },
  {
    id: 'ep5',
    num: 'Episode 5',
    title: 'Mama Said / Detroit vs. Everybody',
    runtime: '1:30',
    poster: 'assets/posters/ep5.jpg',
    video1080: 'videos/1080p/ep5.mp4',
    vertical: false,
    desc: 'Outside the glowing corner Coney Island at dusk, Barnaby negotiates his Detroit-vs-Everybody boundaries—making gentle exceptions for Shelly, Crunge, extra foil around the fries, and the stray terrier.'
  },
  {
    id: 'ep6',
    num: 'Episode 6',
    title: 'Retrograde (Friday the 13th in November)',
    runtime: '0:53',
    poster: 'assets/posters/ep6.jpg',
    video1080: 'videos/1080p/ep6.mp4',
    vertical: false,
    desc: 'Crunge’s Sharpie freezes at 3:15, Venus and Mercury both clear retrograde, the porch string-lights immediately short out in the November sleet, and Shelly’s single candle lights the dark.'
  },
  {
    id: 'ep0-reel',
    num: 'Bonus • 9:16 Vertical Reel',
    title: 'How They Met (Captioned Short)',
    runtime: '1:00',
    poster: 'assets/posters/ep0-reel.jpg',
    video1080: 'videos/1080p/ep0-reel.mp4',
    vertical: true,
    desc: 'Vertical captioned storybook reel of the trio’s origin story.'
  }
];

// Protect all character, scene, and video elements from right-click save and drag-out
document.addEventListener('contextmenu', e => {
  if (e.target && ['IMG', 'CANVAS', 'VIDEO'].includes(e.target.tagName)) {
    e.preventDefault();
  }
});
document.addEventListener('dragstart', e => {
  if (e.target && ['IMG', 'CANVAS', 'VIDEO'].includes(e.target.tagName)) {
    e.preventDefault();
  }
});

// 1. Ambient Firefly & Candlelight Motes
(function initFireflies() {
  const canvas = document.getElementById('fireflyCanvas');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0;
  const motes = Array.from({ length: 30 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: 1.2 + Math.random() * 2.2,
    vx: (Math.random() - 0.5) * 0.0002,
    vy: -0.00012 - Math.random() * 0.00022,
    phase: Math.random() * Math.PI * 2
  }));

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function tick(t) {
    ctx.clearRect(0, 0, w, h);
    for (const m of motes) {
      m.x = (m.x + m.vx + 1) % 1;
      m.y = (m.y + m.vy + 1) % 1;
      const alpha = 0.2 + 0.45 * (0.5 + 0.5 * Math.sin(t * 0.0016 + m.phase));
      const gx = m.x * w, gy = m.y * h;
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, m.r * 5);
      grad.addColorStop(0, `rgba(255, 214, 128, ${alpha})`);
      grad.addColorStop(1, 'rgba(255, 214, 128, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(gx, gy, m.r * 5, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

// 2. Season 1 Screening Room (Stream Only)
(function initTheater() {
  const playlistEl = document.getElementById('episodePlaylist');
  const videoEl = document.getElementById('mainVideo');
  const stageEl = document.getElementById('videoStage');
  const badgeEl = document.getElementById('nowPlayingBadge');
  const titleEl = document.getElementById('playerTitle');
  const descEl = document.getElementById('playerDesc');

  function applyEpisode(ep, autoplay = false) {
    stageEl.classList.toggle('vertical-mode', Boolean(ep.vertical));
    badgeEl.textContent = `${ep.num} • ${ep.runtime}`;
    titleEl.textContent = ep.title;
    descEl.textContent = ep.desc;

    videoEl.poster = ep.poster;
    videoEl.src = ep.video1080;

    document.querySelectorAll('.ep-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.id === ep.id);
    });

    if (autoplay) {
      videoEl.play().catch(() => {});
    }
  }

  EPISODES.forEach((ep, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ep-item' + (i === 0 ? ' active' : '');
    btn.dataset.id = ep.id;
    btn.innerHTML = `
      <img class="ep-thumb" src="${ep.poster}" alt="${ep.title}" loading="lazy" draggable="false">
      <div>
        <div class="ep-num">${ep.num}</div>
        <div class="ep-name">${ep.title}</div>
        <div class="ep-runtime">Runtime ${ep.runtime}</div>
      </div>
    `;
    btn.addEventListener('click', () => applyEpisode(ep, true));
    playlistEl.appendChild(btn);
  });

  applyEpisode(EPISODES[0], false);
})();

// 3. Sad Bear's Quest Mini-Game (Starts Paused & Silent!)
(function initQuestGame() {
  const canvas = document.getElementById('questCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('questScore');
  const statusEl = document.getElementById('questStatus');
  const startBtn = document.getElementById('questStartBtn');
  const resetBtn = document.getElementById('questResetBtn');
  const muteBtn = document.getElementById('questMuteBtn');
  const mainVideo = document.getElementById('mainVideo');

  const W = canvas.width;
  const H = canvas.height;
  const GOAL = 10;

  const imgs = {
    bg: new Image(),
    barnaby: new Image(),
    barnabyHappy: new Image(),
    shelly: new Image(),
    crunge: new Image(),
    balloon: new Image(),
    tape: new Image(),
    heart: new Image()
  };
  imgs.bg.src = 'assets/backgrounds/winter-porch.jpg';
  imgs.barnaby.src = 'assets/sprites/barnaby-umbrella.png';
  imgs.barnabyHappy.src = 'assets/sprites/barnaby-balloon.png';
  imgs.shelly.src = 'assets/sprites/shelly-content.png';
  imgs.crunge.src = 'assets/sprites/crunge-resist.png';
  imgs.balloon.src = 'assets/sprites/prop-balloon.png';
  imgs.tape.src = 'assets/sprites/prop-ducttape.png';
  imgs.heart.src = 'assets/sprites/prop-heartbadge.png';

  // Starts 100% paused AND muted until visitor explicitly clicks Start / Sound: On
  let playing = false;
  let muted = true;
  let audioCtx = null;

  function chime(freqs, dur = 0.22) {
    if (muted || !playing) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;
      freqs.forEach((f, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.06);
        gain.gain.setValueAtTime(0.08, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + dur);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + dur);
      });
    } catch (_) {}
  }

  const keys = {};
  const bear = { x: 140, y: H * 0.64, speed: 4.1 };
  const snail = { x: W * 0.66, y: H * 0.66, vx: 0.85, vy: 0.55 };
  let item = { x: W * 0.78, y: H * 0.52, kind: 'balloon' };
  let clarity = 0;
  let won = false;
  let bumpCooldown = 0;

  function spawnItem() {
    const kinds = ['balloon', 'tape', 'heart'];
    item = {
      x: 90 + Math.random() * (W - 180),
      y: 135 + Math.random() * (H - 210),
      kind: kinds[Math.floor(Math.random() * kinds.length)]
    };
  }

  function resetGame(keepPaused = false) {
    clarity = 0;
    won = false;
    bear.x = 140;
    bear.y = H * 0.64;
    snail.x = W * 0.66;
    snail.y = H * 0.66;
    bumpCooldown = 0;
    scoreEl.textContent = `0 / ${GOAL}`;
    if (keepPaused) {
      playing = false;
      startBtn.textContent = '▶ Start Game';
      statusEl.textContent = 'Paused — click Start Game whenever you want to play';
    } else {
      statusEl.textContent = 'Gather 10 small comforts while giving Shelly’s candle gentle space';
    }
    spawnItem();
  }

  startBtn.addEventListener('click', () => {
    playing = !playing;
    startBtn.textContent = playing ? '⏸ Pause' : '▶ Start Game';
    statusEl.textContent = playing
      ? 'Use Arrow Keys or WASD to gather 10 small comforts!'
      : 'Paused — click Start Game to resume';
  });

  if (mainVideo) {
    mainVideo.addEventListener('play', () => {
      if (playing) {
        playing = false;
        startBtn.textContent = '▶ Start Game';
        statusEl.textContent = 'Paused while episode video is playing';
      }
    });
  }

  window.addEventListener('keydown', e => {
    if (!playing) return;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }
    keys[e.key.toLowerCase()] = true;
  });
  window.addEventListener('keyup', e => {
    keys[e.key.toLowerCase()] = false;
  });

  document.querySelectorAll('[data-dir]').forEach(btn => {
    const k = btn.dataset.dir;
    const press = (v) => {
      if (v && !playing) {
        playing = true;
        startBtn.textContent = '⏸ Pause';
      }
      keys[k] = v;
    };
    btn.addEventListener('pointerdown', () => press(true));
    btn.addEventListener('pointerup', () => press(false));
    btn.addEventListener('pointerleave', () => press(false));
  });

  resetBtn.addEventListener('click', () => {
    resetGame(false);
    playing = true;
    startBtn.textContent = '⏸ Pause';
    chime([392, 523.25]);
  });

  muteBtn.addEventListener('click', () => {
    muted = !muted;
    muteBtn.textContent = muted ? 'Sound: Off' : 'Sound: On';
  });

  function update() {
    if (!playing || won) return;
    let dx = 0, dy = 0;
    if (keys['arrowleft'] || keys['a']) dx -= 1;
    if (keys['arrowright'] || keys['d']) dx += 1;
    if (keys['arrowup'] || keys['w']) dy -= 1;
    if (keys['arrowdown'] || keys['s']) dy += 1;
    if (dx !== 0 && dy !== 0) { dx *= 0.7071; dy *= 0.7071; }

    bear.x = Math.max(55, Math.min(W - 55, bear.x + dx * bear.speed));
    bear.y = Math.max(115, Math.min(H - 55, bear.y + dy * bear.speed));

    snail.x += snail.vx;
    snail.y += snail.vy;
    if (snail.x < 90 || snail.x > W - 90) snail.vx *= -1;
    if (snail.y < 145 || snail.y > H - 65) snail.vy *= -1;

    if (bumpCooldown > 0) bumpCooldown--;

    const distItem = Math.hypot(bear.x - item.x, bear.y - item.y);
    if (distItem < 58) {
      clarity++;
      scoreEl.textContent = `${clarity} / ${GOAL}`;
      if (clarity >= GOAL) {
        won = true;
        statusEl.textContent = 'Quiet victory! Barnaby gathered enough hope, humor, and duct tape to keep moving.';
        chime([523.25, 659.25, 783.99, 1046.5], 0.34);
      } else {
        statusEl.textContent = 'Small comfort gathered! Keep going gently.';
        chime([523.25, 659.25], 0.18);
        spawnItem();
      }
    }

    const distSnail = Math.hypot(bear.x - snail.x, bear.y - snail.y);
    if (distSnail < 64 && bumpCooldown === 0) {
      bumpCooldown = 48;
      if (clarity > 0) clarity--;
      scoreEl.textContent = `${clarity} / ${GOAL}`;
      statusEl.textContent = 'Oops—give Shelly’s candle a little breathing room!';
      chime([246.94, 196.0], 0.25);
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    if (imgs.bg.complete && imgs.bg.naturalWidth > 0) {
      ctx.drawImage(imgs.bg, 0, 0, W, H);
      ctx.fillStyle = 'rgba(10, 14, 22, 0.46)';
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.fillStyle = '#121926';
      ctx.fillRect(0, 0, W, H);
    }

    if (imgs.crunge.complete && imgs.crunge.naturalWidth > 0) {
      ctx.drawImage(imgs.crunge, W - 108, 42, 82, 130);
    }

    const bob = playing ? Math.sin(t * 0.004) * 5 : 0;
    const itemGlow = ctx.createRadialGradient(item.x, item.y + bob, 4, item.x, item.y + bob, 42);
    itemGlow.addColorStop(0, 'rgba(243, 184, 85, 0.48)');
    itemGlow.addColorStop(1, 'rgba(243, 184, 85, 0)');
    ctx.fillStyle = itemGlow;
    ctx.beginPath();
    ctx.arc(item.x, item.y + bob, 42, 0, Math.PI * 2);
    ctx.fill();

    const propImg = item.kind === 'balloon' ? imgs.balloon : (item.kind === 'tape' ? imgs.tape : imgs.heart);
    if (!won && propImg.complete && propImg.naturalWidth > 0) {
      const ph = item.kind === 'balloon' ? 82 : 56;
      const pw = propImg.naturalWidth * (ph / propImg.naturalHeight);
      ctx.drawImage(propImg, item.x - pw / 2, item.y + bob - ph / 2, pw, ph);
    }

    const pulse = 84 + Math.sin(t * 0.003) * 8;
    const candle = ctx.createRadialGradient(snail.x, snail.y - 12, 6, snail.x, snail.y - 12, pulse);
    candle.addColorStop(0, 'rgba(255, 220, 135, 0.58)');
    candle.addColorStop(0.55, 'rgba(243, 184, 85, 0.18)');
    candle.addColorStop(1, 'rgba(243, 184, 85, 0)');
    ctx.fillStyle = candle;
    ctx.beginPath();
    ctx.arc(snail.x, snail.y - 12, pulse, 0, Math.PI * 2);
    ctx.fill();

    if (imgs.shelly.complete && imgs.shelly.naturalWidth > 0) {
      const sh = 74;
      const sw = imgs.shelly.naturalWidth * (sh / imgs.shelly.naturalHeight);
      ctx.save();
      ctx.translate(snail.x, snail.y);
      if (snail.vx < 0) ctx.scale(-1, 1);
      ctx.drawImage(imgs.shelly, -sw / 2, -sh / 2, sw, sh);
      ctx.restore();
    }

    const bImg = won ? imgs.barnabyHappy : imgs.barnaby;
    if (bImg.complete && bImg.naturalWidth > 0) {
      const bh = 128;
      const bw = bImg.naturalWidth * (bh / bImg.naturalHeight);
      ctx.save();
      if (bumpCooldown > 0 && Math.floor(bumpCooldown / 4) % 2 === 0) ctx.globalAlpha = 0.6;
      ctx.drawImage(bImg, bear.x - bw / 2, bear.y - bh * 0.58, bw, bh);
      ctx.restore();
    }

    if (!playing && !won) {
      ctx.fillStyle = 'rgba(12, 16, 23, 0.56)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = '600 34px "Cormorant Garamond", Georgia, serif';
      ctx.fillStyle = '#f9dfa7';
      ctx.textAlign = 'center';
      ctx.fillText('Sad Bear’s Quest', W / 2, H / 2 - 12);
      ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#f4ecd8';
      ctx.fillText('Click “▶ Start Game” above whenever you’re ready to play', W / 2, H / 2 + 24);
    } else if (won) {
      ctx.fillStyle = 'rgba(12, 16, 23, 0.74)';
      ctx.fillRect(0, H * 0.34, W, 130);
      ctx.font = '600 38px "Cormorant Garamond", Georgia, serif';
      ctx.fillStyle = '#f9dfa7';
      ctx.textAlign = 'center';
      ctx.fillText('Walk slow. I’m already moving at top speed.', W / 2, H * 0.34 + 54);
      ctx.font = '500 17px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#f4ecd8';
      ctx.fillText('Click “↺ Reset” above whenever you want another stroll through the dark.', W / 2, H * 0.34 + 92);
    }
  }

  function loop(t) {
    update();
    draw(t);
    requestAnimationFrame(loop);
  }

  resetGame(true);
  requestAnimationFrame(loop);
})();
