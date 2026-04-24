// ── Canvas Waveform (Hero) ──
(function() {
  const canvas = document.getElementById('waveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, t = 0;
  function resize() { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let l = 0; l < 4; l++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(200,165,80,${0.07 + l * 0.03})`;
      ctx.lineWidth = 1;
      for (let x = 0; x <= w; x += 2) {
        const nx = x / w;
        const y = h * 0.5
          + Math.sin(nx * 8 + t + l * 1.2) * (h * 0.06)
          + Math.sin(nx * 14 - t * 1.3 + l * 0.7) * (h * 0.04)
          + Math.sin(nx * 3 + t * 0.7) * (h * 0.08);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    t += 0.012;
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── Lightbox ──
function openLightbox(src, alt) {
  const lb = document.getElementById('flyerLightbox');
  if (!lb) return;
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightboxImg').alt = alt || '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

(function() {
  const lb = document.getElementById('flyerLightbox');
  if (!lb) return;
  document.getElementById('lightboxClose').addEventListener('click', function() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  });
  lb.addEventListener('click', function(e) {
    if (e.target === lb) { lb.classList.remove('open'); document.body.style.overflow = ''; }
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lb.classList.contains('open')) {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();

// ── Header scroll ──
const hdr = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  hdr.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Mobile nav ──
(function() {
  const btn = document.getElementById('mobMenuBtn');
  const nav = document.getElementById('mobNav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function() {
    nav.classList.toggle('open');
  });
  nav.querySelectorAll('.mob-nav-link').forEach(function(link) {
    link.addEventListener('click', function() {
      nav.classList.remove('open');
    });
  });
})();


// ── Ticker ──
const tItems = ['Afrobeats','Amapiano','Dancehall','Festivals','Private Events','Hip-Hop','International Tours','Boiler Room','R&B','Dance Mixes','AV Rentals'];
const tk = document.getElementById('ticker');
if (tk) {
  [...tItems, ...tItems, ...tItems].forEach(t => {
    const d = document.createElement('div');
    d.className = 'tick-item';
    d.innerHTML = '<span class="tick-dot"></span>' + t;
    tk.appendChild(d);
  });
}

// ── Waveforms ──
function buildWaveform(el) {
  if (!el) return;
  for (let j = 0; j < 80; j++) {
    const b = document.createElement('div');
    b.className = 'wf u';
    b.style.height = (Math.random() * 55 + 20) + '%';
    el.appendChild(b);
  }
}

// ── Audio playback ──
let _audio = null;

function togglePlay(btn) {
  const row = btn.closest('.mix-row');
  const url = row && row.dataset.audioUrl;
  const on = btn.classList.contains('active');

  document.querySelectorAll('.mix-play').forEach(b => { b.classList.remove('active'); b.textContent = '▶'; });
  if (_audio) { _audio.pause(); _audio = null; }

  if (!on && url) {
    _audio = new Audio(url);
    _audio.play();
    btn.classList.add('active');
    btn.textContent = '■';
    _audio.addEventListener('ended', function() {
      btn.classList.remove('active');
      btn.textContent = '▶';
      _audio = null;
    });
  }
}

// ── Scroll reveal ──
const obs = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });
window._revealObs = obs;
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = ((i % 4) * 0.08) + 's';
  obs.observe(el);
});

// ── Custom Select ──
(function() {
  const input = document.getElementById('eventTypeInput');
  const popup = document.getElementById('eventTypePopup');
  if (!input) return;

  input.addEventListener('click', function(e) {
    e.stopPropagation();
    popup.classList.toggle('open');
  });

  popup.querySelectorAll('li').forEach(function(li) {
    li.addEventListener('click', function(e) {
      e.stopPropagation();
      popup.querySelectorAll('li').forEach(el => el.classList.remove('selected'));
      li.classList.add('selected');
      input.value = li.textContent;
      popup.classList.remove('open');
    });
  });

  document.addEventListener('click', function(e) {
    if (!popup.contains(e.target) && e.target !== input) popup.classList.remove('open');
  });
})();

// ── Date Picker ──
(function() {
  const input   = document.getElementById('eventDateInput');
  const popup   = document.getElementById('datePickerPopup');
  const grid    = document.getElementById('dpGrid');
  const label   = document.getElementById('dpMonthLabel');
  const prev    = document.getElementById('dpPrev');
  const next    = document.getElementById('dpNext');
  const confirm = document.getElementById('dpConfirm');

  if (!input) return;

  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  let view = new Date(); view.setDate(1);
  let selected = null;
  const today = new Date(); today.setHours(0,0,0,0);

  function render() {
    const y = view.getFullYear(), m = view.getMonth();
    label.textContent = MONTHS[m] + ' ' + y;
    grid.innerHTML = '';
    const first = new Date(y, m, 1).getDay();
    const days  = new Date(y, m + 1, 0).getDate();
    for (let i = 0; i < first; i++) {
      const el = document.createElement('div');
      el.className = 'dp-day other-month';
      grid.appendChild(el);
    }
    for (let d = 1; d <= days; d++) {
      const date = new Date(y, m, d);
      const el = document.createElement('div');
      el.className = 'dp-day';
      el.textContent = d;
      if (date.toDateString() === today.toDateString()) el.classList.add('today');
      if (selected && date.toDateString() === selected.toDateString()) el.classList.add('selected');
      el.addEventListener('click', function() { selected = date; render(); });
      grid.appendChild(el);
    }
  }

  prev.addEventListener('click', function(e) { e.stopPropagation(); view.setMonth(view.getMonth() - 1); render(); });
  next.addEventListener('click', function(e) { e.stopPropagation(); view.setMonth(view.getMonth() + 1); render(); });

  input.addEventListener('click', function(e) { e.stopPropagation(); popup.classList.toggle('open'); render(); });

  confirm.addEventListener('click', function(e) {
    e.stopPropagation();
    if (!selected) { popup.classList.remove('open'); return; }
    const h   = document.getElementById('dpHour').value || '--';
    const mn  = (document.getElementById('dpMin').value || '--').toString().padStart(2, '0');
    const ap  = document.getElementById('dpAmPm').value;
    const h2  = document.getElementById('dpHourEnd').value || '--';
    const mn2 = (document.getElementById('dpMinEnd').value || '--').toString().padStart(2, '0');
    const ap2 = document.getElementById('dpAmPmEnd').value;
    const dateStr = selected.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    input.value = dateStr + '  ·  ' + h + ':' + mn + ' ' + ap + ' – ' + h2 + ':' + mn2 + ' ' + ap2;

    function toISO(dateObj, hour12, min, ampm) {
      let hr = parseInt(hour12);
      if (!hr) return '';
      if (ampm === 'AM' && hr === 12) hr = 0;
      if (ampm === 'PM' && hr !== 12) hr += 12;
      const y  = dateObj.getFullYear();
      const mo = String(dateObj.getMonth() + 1).padStart(2, '0');
      const d  = String(dateObj.getDate()).padStart(2, '0');
      const hh = String(hr).padStart(2, '0');
      const mm = String(parseInt(min) || 0).padStart(2, '0');
      return y + '-' + mo + '-' + d + 'T' + hh + ':' + mm + ':00';
    }

    const startISO = toISO(selected, h, mn, ap);
    let endDate = new Date(selected);
    if (ap === 'PM' && ap2 === 'AM') endDate.setDate(endDate.getDate() + 1);
    const endISO = toISO(endDate, h2, mn2, ap2);

    document.getElementById('eventStartISO').value = startISO;
    document.getElementById('eventEndISO').value   = endISO;
    popup.classList.remove('open');
  });

  document.addEventListener('click', function(e) {
    if (!popup.contains(e.target) && e.target !== input) popup.classList.remove('open');
  });

  render();
})();
