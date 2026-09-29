/* =========================================================
   L'Angolo del Compleanno, Montesilvano
   Dati modificabili qui in alto.
   ========================================================= */

const CONFIG = {
  nome: "L'Angolo del Compleanno",
  indirizzoMappe: "L'Angolo del Compleanno, Viale Europa 1C, 65015 Montesilvano PE",
  telefono: '348 730 9497',
  telefonoLink: '+393487309497',
  whatsapp: '393487309497', // si assume che il cellulare sia anche su WhatsApp: da confermare
  email: 'langolodelcompleanno@gmail.com',
  whatsappTesto: "Ciao Martina! Vorrei qualche informazione per una festa.",
  // 0 = domenica … 6 = sabato. null = chiuso. Fonte: schede online pubbliche, da verificare.
  orari: {
    1: [['09:30', '13:00'], ['16:30', '19:30']],
    2: [['09:30', '13:00'], ['16:30', '19:30']],
    3: [['09:30', '13:00'], ['16:30', '19:30']],
    4: [['09:30', '13:00']],
    5: [['09:30', '13:00'], ['16:30', '19:30']],
    6: [['09:30', '13:00'], ['16:30', '19:30']],
    0: null,
  },
};

// Colori dei palloncini proposti nel compositore
const COLORI = {
  coral: { nome: 'Corallo', l: '#FFB0A3', b: '#FF6F5E', d: '#D94430' },
  blush: { nome: 'Rosa cipria', l: '#FFE3DD', b: '#FFB8AC', d: '#EE8C7A' },
  sun: { nome: 'Giallo sole', l: '#FFEBAE', b: '#FFC940', d: '#E29E12' },
  butter: { nome: 'Burro', l: '#FFF6D6', b: '#FFE7A0', d: '#EDC65A' },
  sky: { nome: 'Azzurro', l: '#CDEEFC', b: '#7CCBF0', d: '#3E9FD0' },
  azure: { nome: 'Blu mare', l: '#9FD3F2', b: '#3A9BD5', d: '#1F74AE' },
  pearl: { nome: 'Perla', l: '#FFFFFF', b: '#EEF1F6', d: '#BFCAD9' },
  gold: { nome: 'Oro', l: '#FFF3C4', b: '#F7C948', d: '#C98A0B' },
  sage: { nome: 'Salvia', l: '#E0EEDC', b: '#A9C9A4', d: '#769E73' },
  lilac: { nome: 'Lilla', l: '#EDE4FF', b: '#C9B6F2', d: '#9A80D6' },
};
const PALETTE_START = ['coral', 'gold', 'pearl'];

/* ---------------------------------------------------------
   Utilità
   --------------------------------------------------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
const ORDINE_GIORNI = [1, 2, 3, 4, 5, 6, 0];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
const hh = (hhmm) => hhmm.replace(/^0/, '');
const mapsDir = () => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CONFIG.indirizzoMappe)}`;
const mapsPlace = () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.indirizzoMappe)}`;
const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

/* ---------------------------------------------------------
   Contatti
   --------------------------------------------------------- */
function applyConfig() {
  $$('.js-directions').forEach((a) => { a.href = mapsDir(); });
  $$('.js-reviews').forEach((a) => { a.href = mapsPlace(); });
  $$('.js-phone').forEach((a) => { a.href = `tel:${CONFIG.telefonoLink}`; });
  $$('.js-email').forEach((a) => { a.href = `mailto:${CONFIG.email}`; });
  $$('.js-whatsapp').forEach((a) => {
    a.href = waLink(CONFIG.whatsappTesto);
    a.target = '_blank';
    a.rel = 'noopener';
  });
  $$('[data-bind]').forEach((el) => { const v = CONFIG[el.dataset.bind]; if (v) el.textContent = v; });
  const y = $('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------
   Aperto adesso?
   --------------------------------------------------------- */
function getStatus(d = new Date()) {
  const day = d.getDay();
  const mins = d.getHours() * 60 + d.getMinutes();
  const turni = CONFIG.orari[day] || [];
  for (const [a, b] of turni) {
    if (mins >= toMin(a) && mins < toMin(b)) {
      const left = toMin(b) - mins;
      return { open: true, text: left <= 30 ? `Aperto ora, chiude tra ${left} minuti` : `Aperto ora, fino alle ${hh(b)}` };
    }
  }
  const next = turni.find(([a]) => mins < toMin(a));
  if (next) return { open: false, text: `Chiuso ora, riapriamo oggi alle ${hh(next[0])}` };
  for (let k = 1; k <= 7; k++) {
    const nd = (day + k) % 7;
    const nt = CONFIG.orari[nd];
    if (nt && nt.length) return { open: false, text: `Chiuso ora, riapriamo ${k === 1 ? 'domani' : GIORNI[nd]} alle ${hh(nt[0][0])}` };
  }
  return { open: false, text: 'Chiuso' };
}

function renderStatus() {
  const s = getStatus();
  $$('[data-status]').forEach((el) => { el.textContent = s.text; });
  $$('[data-status-wrap]').forEach((el) => el.classList.toggle('is-closed', !s.open));
}

function renderHours() {
  const tbody = $('[data-hours]');
  if (!tbody) return;
  const today = new Date().getDay();
  tbody.textContent = '';
  ORDINE_GIORNI.forEach((d) => {
    const tr = document.createElement('tr');
    if (d === today) tr.className = 'is-today';
    const th = document.createElement('th');
    th.scope = 'row';
    th.textContent = GIORNI[d][0].toUpperCase() + GIORNI[d].slice(1);
    const td = document.createElement('td');
    const t = CONFIG.orari[d];
    if (t && t.length) {
      t.forEach(([a, b]) => { const s = document.createElement('span'); s.textContent = `${hh(a)}–${hh(b)}`; td.append(s); });
    } else td.textContent = 'Chiuso';
    tr.append(th, td);
    tbody.append(tr);
  });
}

/* ---------------------------------------------------------
   Titoli parola per parola (costruiti via DOM: compatibile con la CSP)
   --------------------------------------------------------- */
function splitWords() {
  if (reduceMotion) return;
  $$('[data-split]').forEach((el) => {
    const text = el.textContent.trim();
    el.textContent = '';
    const sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = text;
    const words = document.createElement('span');
    words.setAttribute('aria-hidden', 'true');
    text.split(/\s+/).forEach((w, i) => {
      const outer = document.createElement('span');
      outer.className = 'w';
      const inner = document.createElement('span');
      inner.textContent = w;
      inner.style.setProperty('--i', i);
      outer.append(inner);
      if (i) words.append(' ');
      words.append(outer);
    });
    el.append(sr, words);
    el.classList.add('split');
  });
}

/* ---------------------------------------------------------
   Apertura: l'allestimento si monta pezzo per pezzo
   --------------------------------------------------------- */
function initHero() {
  const hero = $('.hero');
  if (!hero) return;
  $$('[data-hero-in]').forEach((el, i) => el.style.setProperty('--d', i));
  const go = () => {
    hero.classList.add('is-ready');
    const h1 = $('.hero [data-split]');
    if (h1) h1.classList.add('is-in');
  };
  // aspetta i caratteri (max 600 ms) così il titolo non cambia forma a metà animazione
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise((r) => setTimeout(r, 600))]).then(() => requestAnimationFrame(go));
}

/* ---------------------------------------------------------
   L'allestimento illustrato si monta quando entra nello schermo
   --------------------------------------------------------- */
function initSetup() {
  const fig = $('[data-setup]');
  if (!fig) return;
  $$('.hero-svg .h-b', fig).forEach((b, i) => b.style.setProperty('--i', i));
  if (!('IntersectionObserver' in window) || reduceMotion) { fig.classList.add('is-ready'); return; }
  const io = new IntersectionObserver((entries) => {
    if (entries.some((en) => en.isIntersecting)) { fig.classList.add('is-ready'); io.disconnect(); }
  }, { threshold: 0.35 });
  io.observe(fig);
}

/* ---------------------------------------------------------
   Blocchi che compaiono allo scorrimento (fallback senza scroll-timeline)
   --------------------------------------------------------- */
function initReveal() {
  $$('[data-stagger]').forEach((group) => {
    $$('[data-reveal]', group).forEach((el, i) => el.style.setProperty('--s', i % 3));
  });
  const targets = $$('[data-reveal]');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  targets.forEach((el) => io.observe(el));
}

/* ---------------------------------------------------------
   Nastri che scendono lungo i bordi di tutta la pagina.
   Disegnati sulle misure reali di <main>, così restano continui
   da una sezione all'altra; si srotolano mentre si scorre.
   --------------------------------------------------------- */
function initRibbons() {
  const layer = $('[data-ribbons]');
  if (!layer) return;
  const NS = 'http://www.w3.org/2000/svg';
  const el = (name, attrs) => {
    const n = document.createElementNS(NS, name);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    return n;
  };
  const BALLOONS = [['#FFB0A3', '#FF6F5E', '#D94430'], ['#FFF3C4', '#F7C948', '#C98A0B'], ['#FFFFFF', '#F4ECEA', '#D8C6C0'], ['#FFE3DD', '#FFB8AC', '#EE8C7A']];
  let svg = null;
  let H = 0;

  // punti di una curva ondulata: x oscilla intorno a cx con due frequenze, per un andamento morbido e non meccanico
  const wave = (cx, amp, period, phase, y0, y1, step) => {
    const pts = [];
    for (let y = y0; y <= y1 + step; y += step) {
      const t = (y - y0) / period;
      pts.push([cx + amp * Math.sin(t * Math.PI * 2 + phase) + amp * 0.25 * Math.sin(t * Math.PI * 5.3 + phase * 2), Math.min(y, y1)]);
    }
    return pts;
  };
  // nastro di raso: una fascia che si assottiglia e si allarga come se girasse su se stessa
  const ribbonShape = (pts, width, twist) => {
    const left = []; const right = [];
    pts.forEach(([x, y], i) => {
      const [px, py] = pts[Math.max(0, i - 1)];
      const [nx, ny] = pts[Math.min(pts.length - 1, i + 1)];
      let dx = nx - px; let dy = ny - py;
      const len = Math.hypot(dx, dy) || 1;
      dx /= len; dy /= len;
      const w = width * (0.28 + 0.72 * Math.abs(Math.cos((y / twist) * Math.PI)));
      left.push(`${(x - dy * w / 2).toFixed(1)},${(y + dx * w / 2).toFixed(1)}`);
      right.push(`${(x + dy * w / 2).toFixed(1)},${(y - dx * w / 2).toFixed(1)}`);
    });
    return `M${left.join('L')}L${right.reverse().join('L')}Z`;
  };
  const line = (pts) => `M${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L')}`;

  const balloon = (g, x, y, size, col, i) => {
    const b = el('g', { class: 'rb-balloon' });
    const gid = `rb-g${i}`;
    const grad = el('radialGradient', { id: gid, cx: '.4', cy: '.34', r: '.72', fx: '.3', fy: '.24' });
    [['0', col[0]], ['.45', col[1]], ['1', col[2]]].forEach(([o, c]) => grad.append(el('stop', { offset: o, 'stop-color': c })));
    const s = size / 100;
    b.append(grad);
    b.append(el('path', { d: `M${x} ${y}c${-6 * s} ${18 * s} ${8 * s} ${30 * s} ${-2 * s} ${52 * s}`, fill: 'none', stroke: '#3A1F2B', 'stroke-opacity': '.3', 'stroke-width': '1.2' }));
    b.append(el('path', {
      d: `M${x} ${y - 116 * s}c${31 * s} 0 ${50 * s} ${23 * s} ${50 * s} ${50 * s}c0 ${29 * s} ${-22 * s} ${54 * s} ${-45 * s} ${62 * s}l${-5 * s} ${2 * s}l${-5 * s} ${-2 * s}c${-23 * s} ${-8 * s} ${-45 * s} ${-33 * s} ${-45 * s} ${-62 * s}c0 ${-27 * s} ${19 * s} ${-50 * s} ${50 * s} ${-50 * s}z`,
      fill: `url(#${gid})`,
    }));
    b.append(el('path', { d: `M${x - 6 * s} ${y + 6 * s}l${6 * s} ${-9 * s}l${6 * s} ${9 * s}z`, fill: col[2] }));
    b.append(el('ellipse', { cx: x - 21 * s, cy: y - 87 * s, rx: 10 * s, ry: 18 * s, fill: '#fff', opacity: '.5', transform: `rotate(32 ${x - 21 * s} ${y - 87 * s})` }));
    g.append(b);
  };

  const build = () => {
    const W = layer.clientWidth;
    H = layer.clientHeight;
    if (!W || !H) return;
    const hero = $('.hero');
    const start = hero ? hero.offsetHeight * 0.62 : 0;
    const mobile = W < 700;
    // i nastri restano nel margine: mai sotto i testi (il contrasto del testo non cambia)
    const wrap = $('.section .wrap');
    const wr = wrap ? wrap.getBoundingClientRect() : { left: 0 };
    const margin = wrap ? wr.left - layer.getBoundingClientRect().left + parseFloat(getComputedStyle(wrap).paddingLeft) : 40;
    const ribbonW = mobile ? 5 : 12;
    const edge = Math.min(150, margin);
    const amp = Math.max(2, Math.min(edge * 0.34 + 8, (edge / 2 - ribbonW / 2 - 4) / 1.45));
    const period = mobile ? 760 : 1100;
    const step = 14;

    svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, focusable: 'false' });
    const g = el('g', {});
    const sides = [
      { cx: edge * 0.5, phase: 0, fill: '#EBA9B0', thin: '#E3B45C' },
      { cx: W - edge * 0.5, phase: Math.PI * 0.8, fill: '#E9C27A', thin: '#E7A3AA' },
    ];
    sides.forEach((side, k) => {
      const main = wave(side.cx, amp, period, side.phase, start + k * 120, H - 20, step);
      const thin = wave(side.cx, amp * 1.15, period * 0.72, side.phase + 1.9, start + k * 120 + 60, H - 20, step);
      g.append(el('path', { d: ribbonShape(main, ribbonW, mobile ? 150 : 210), fill: side.fill, opacity: mobile ? '.45' : '.6' }));
      g.append(el('path', { d: line(main), fill: 'none', stroke: '#FFFFFF', 'stroke-opacity': '.55', 'stroke-width': '1' }));
      g.append(el('path', { d: line(thin), fill: 'none', stroke: side.thin, 'stroke-width': mobile ? '1.2' : '1.6', 'stroke-opacity': '.8', 'stroke-dasharray': mobile ? '1 6' : '2 7', 'stroke-linecap': 'round' }));
    });
    // qualche palloncino legato ai nastri, alternando i lati
    if (!mobile && edge >= 130) {
      [0.2, 0.38, 0.56, 0.74, 0.9].forEach((f, i) => {
        const side = sides[i % 2];
        const y = start + (H - start) * f;
        const t = (y - (start + (i % 2) * 120)) / period;
        const x = side.cx + amp * Math.sin(t * Math.PI * 2 + side.phase) + amp * 0.25 * Math.sin(t * Math.PI * 5.3 + side.phase * 2);
        balloon(g, x, y - 52 * ((34 + (i % 3) * 6) / 100), 34 + (i % 3) * 6, BALLOONS[i % BALLOONS.length], i);
      });
    }
    svg.append(g);
    layer.replaceChildren(svg);
    reveal();
  };

  // i nastri si srotolano fino al bordo basso dello schermo
  const reveal = () => {
    if (!svg) return;
    if (reduceMotion) { svg.style.clipPath = 'none'; return; }
    const top = layer.getBoundingClientRect().top;
    const shown = Math.max(0, Math.min(H, window.innerHeight - top + 40));
    svg.style.clipPath = `inset(0 0 ${Math.max(0, H - shown)}px 0)`;
  };
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { reveal(); ticking = false; });
  }, { passive: true });

  let t = 0;
  const schedule = () => { clearTimeout(t); t = setTimeout(build, 150); };
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(layer);
  else window.addEventListener('resize', schedule);
  build();
}

/* ---------------------------------------------------------
   Header, menu mobile, barra fissa, voce di menu attiva
   --------------------------------------------------------- */
function initChrome() {
  const header = $('[data-header]');
  const btn = $('[data-menu-btn]');
  const menu = $('[data-menu]');

  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    const menuOpen = btn.getAttribute('aria-expanded') === 'true';
    header.classList.toggle('is-scrolled', y > 8);
    header.classList.toggle('is-top', y <= 8 && !menuOpen);
    if (!menuOpen && y > 480 && y > lastY + 6) header.classList.add('is-hidden');
    else if (y < lastY - 6 || y < 480) header.classList.remove('is-hidden');
    lastY = y;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
  // navigando da tastiera l'elemento a fuoco non deve mai finire sotto l'header o sotto la barra fissa in basso
  document.addEventListener('focusin', (e) => {
    const t = e.target;
    if (!(t instanceof Element) || t.closest('.site-header, [data-mbar], .skip')) return;
    requestAnimationFrame(() => {
      const r = t.getBoundingClientRect();
      const bar = $('[data-mbar]');
      const barTop = bar && bar.classList.contains('is-visible') && getComputedStyle(bar).display !== 'none' ? bar.getBoundingClientRect().top : window.innerHeight;
      const headBottom = header.classList.contains('is-hidden') ? 0 : header.getBoundingClientRect().bottom;
      if (r.bottom > barTop - 12) window.scrollBy({ top: r.bottom - barTop + 24, behavior: 'instant' });
      else if (r.top < headBottom + 12) window.scrollBy({ top: r.top - headBottom - 24, behavior: 'instant' });
    });
  });

  const setMenu = (open) => {
    btn.setAttribute('aria-expanded', String(open));
    $('.sr-only', btn).textContent = open ? 'Chiudi il menu' : 'Apri il menu';
    menu.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    // con il menu aperto il resto della pagina non riceve il focus (resterebbe nascosto sotto il menu)
    ['main', '.site-footer', '[data-mbar]'].forEach((sel) => { const n = $(sel); if (n) n.inert = open; });
    onScroll();
  };
  btn.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setMenu(false); btn.focus(); }
  });
  window.matchMedia('(min-width: 960px)').addEventListener('change', (m) => { if (m.matches) setMenu(false); });

  if (!('IntersectionObserver' in window)) return;

  // voce di menu della sezione in vista
  const links = new Map($$('.nav-list a').map((a) => [a.getAttribute('href').slice(1), a]));
  const secIo = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      const a = links.get(en.target.id);
      if (a && en.isIntersecting) {
        links.forEach((l) => { l.classList.remove('is-current'); l.removeAttribute('aria-current'); });
        a.classList.add('is-current');
        a.setAttribute('aria-current', 'true');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((_, id) => { const s = document.getElementById(id); if (s) secIo.observe(s); });

  // barra con Chiama / WhatsApp su mobile: compare dopo l'apertura, sparisce su preventivo e contatti
  const bar = $('[data-mbar]');
  const heroCta = $('[data-hero-cta]');
  const hide = [$('#preventivo'), $('#contatti'), $('.site-footer')].filter(Boolean);
  if (!bar || !heroCta) return;
  const seen = new Map();
  const update = () => {
    const show = seen.get(heroCta) === false && !hide.some((el) => seen.get(el));
    bar.classList.toggle('is-visible', show);
    bar.setAttribute('aria-hidden', String(!show));
    $$('a', bar).forEach((a) => { a.tabIndex = show ? 0 : -1; });
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => seen.set(en.target, en.isIntersecting));
    update();
  });
  [heroCta, ...hide].forEach((el) => io.observe(el));
}

/* ---------------------------------------------------------
   Componi la festa: palette, bouquet dal vivo, messaggio WhatsApp
   --------------------------------------------------------- */
function initComposer() {
  const form = $('[data-composer]');
  if (!form) return;
  const swatchBox = $('[data-swatches]');
  const preview = $('[data-preview]');
  // segno di spunta costruito via DOM (niente innerHTML: compatibile con Trusted Types)
  const makeCheck = () => {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(NS, 'path');
    [['d', 'M20 6 9 17l-5-5'], ['fill', 'none'], ['stroke', 'currentColor'], ['stroke-width', '3'], ['stroke-linecap', 'round'], ['stroke-linejoin', 'round']].forEach(([k, v]) => path.setAttribute(k, v));
    svg.append(path);
    return svg;
  };
  let chosen = [...PALETTE_START];

  Object.entries(COLORI).forEach(([key, c]) => {
    const label = document.createElement('label');
    label.className = 'swatch';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = 'colori';
    input.value = key;
    const ball = document.createElement('span');
    ball.className = 'swatch-ball';
    ball.style.setProperty('--l', c.l);
    ball.style.setProperty('--b', c.b);
    ball.style.setProperty('--d', c.d);
    ball.append(makeCheck());
    const name = document.createElement('span');
    name.className = 'swatch-name';
    name.textContent = c.nome;
    label.append(input, ball, name);
    swatchBox.append(label);
  });
  const live = document.createElement('p');
  live.className = 'sr-only';
  live.setAttribute('aria-live', 'polite');
  swatchBox.after(live);

  const paint = (popSlots = [1, 2, 3]) => {
    const pal = chosen.length ? chosen : PALETTE_START;
    [1, 2, 3].forEach((slot) => {
      const c = COLORI[pal[(slot - 1) % pal.length]];
      preview.style.setProperty(`--c${slot}-l`, c.l);
      preview.style.setProperty(`--c${slot}-b`, c.b);
      preview.style.setProperty(`--c${slot}-d`, c.d);
    });
    if (reduceMotion) return;
    $$('.pv-bal', preview).forEach((g) => {
      const slot = Number([...g.classList].find((k) => /^pv-s\d$/.test(k)).slice(4));
      if (!popSlots.includes(slot)) return;
      g.classList.remove('is-pop');
      void g.getBoundingClientRect();
      g.classList.add('is-pop');
    });
  };
  const syncInputs = () => {
    $$('input[name="colori"]', swatchBox).forEach((i) => { i.checked = chosen.includes(i.value); });
  };
  swatchBox.addEventListener('change', (e) => {
    const i = e.target;
    if (i.name !== 'colori') return;
    let msg = '';
    if (i.checked) {
      chosen.push(i.value);
      if (chosen.length > 3) {
        const out = chosen.shift();
        msg = `${COLORI[i.value].nome} al posto di ${COLORI[out].nome}.`;
      } else msg = `${COLORI[i.value].nome} aggiunto.`;
    } else {
      chosen = chosen.filter((k) => k !== i.value);
      msg = `${COLORI[i.value].nome} tolto.`;
    }
    syncInputs();
    live.textContent = `${msg} Colori scelti: ${chosen.map((k) => COLORI[k].nome).join(', ') || 'nessuno'}.`;
    const idx = chosen.indexOf(i.value);
    paint(idx >= 0 ? [idx + 1] : [1, 2, 3]);
  });
  syncInputs();
  paint([]);

  // messaggio
  const fieldError = (name) => $(`[data-error-for="${name}"]`, form);
  const setError = (name, on) => {
    const el = fieldError(name);
    if (!el) return;
    el.hidden = !on;
    const host = name === 'occasione' ? $('[data-field="occasione"]', form) : $(`[name="${name}"]`, form);
    host.classList.toggle('is-invalid', on);
    if (name !== 'occasione') host.setAttribute('aria-invalid', String(on));
  };
  const clearError = (name) => setError(name, false);
  form.addEventListener('input', (e) => { if (e.target.name === 'nome' && e.target.value.trim()) clearError('nome'); });
  form.addEventListener('change', (e) => { if (e.target.name === 'occasione') clearError('occasione'); });

  const buildMessage = () => {
    const fd = new FormData(form);
    const nome = (fd.get('nome') || '').toString().trim();
    const occ = fd.get('occasione');
    const data = fd.get('data');
    const righe = [`Ciao Martina! Sono ${nome}.`, `Vorrei un preventivo per: ${occ ? occ.toLowerCase() : 'una festa'}.`];
    if (data) {
      const d = new Date(`${data}T12:00:00`);
      righe.push(`Data: ${d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`);
    }
    const luogo = (fd.get('luogo') || '').toString().trim();
    if (luogo) righe.push(`Luogo: ${luogo}`);
    if (fd.get('invitati')) righe.push(`Invitati: ${fd.get('invitati').toString().toLowerCase()}`);
    const servizi = fd.getAll('servizi');
    if (servizi.length) righe.push(`Mi servono: ${servizi.join(', ')}`);
    if (chosen.length) righe.push(`Colori dei palloncini: ${chosen.map((k) => COLORI[k].nome.toLowerCase()).join(', ')}`);
    const note = (fd.get('note') || '').toString().trim();
    if (note) righe.push(`Note: ${note}`);
    righe.push('Grazie!');
    return righe.join('\n');
  };

  const mail = $('[data-mailto]', form);
  const refreshMail = () => {
    mail.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Richiesta preventivo festa')}&body=${encodeURIComponent(buildMessage())}`;
  };
  form.addEventListener('input', refreshMail);
  form.addEventListener('change', refreshMail);
  refreshMail();

  // dalle schede delle occasioni al preventivo, con l'occasione già scelta
  $$('[data-prefill]').forEach((a) => {
    a.addEventListener('click', () => {
      const occ = $(`input[name="occasione"][value="${a.dataset.prefill}"]`, form);
      if (occ) occ.checked = true;
      clearError('occasione');
      refreshMail();
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const missingOcc = !fd.get('occasione');
    const missingName = !(fd.get('nome') || '').toString().trim();
    setError('occasione', missingOcc);
    setError('nome', missingName);
    if (missingOcc || missingName) {
      const first = missingOcc ? $('input[name="occasione"]', form) : $('#f-nome', form);
      first.focus();
      return;
    }
    window.open(waLink(buildMessage()), '_blank', 'noopener');
    const sent = $('[data-sent]', form);
    sent.hidden = false;
  });
}

/* ---------------------------------------------------------
   Mappa: si carica solo su richiesta (niente dati a Google prima del clic)
   --------------------------------------------------------- */
function initMap() {
  const btn = $('[data-map-load]');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const facade = $('[data-map-facade]');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(CONFIG.indirizzoMappe)}&output=embed`;
    iframe.title = `Mappa: ${CONFIG.nome}, Viale Europa 1C, Montesilvano`;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.setAttribute('allowfullscreen', '');
    // la mappa di Google gira isolata: niente accesso a questa pagina, solo ciò che serve alla mappa
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
    facade.replaceWith(iframe);
    iframe.focus();
  });
}

/* ---------------------------------------------------------
   Avvio
   --------------------------------------------------------- */
document.addEventListener('touchstart', () => {}, { passive: true });

applyConfig();
renderStatus();
renderHours();
splitWords();
initHero();
initSetup();
initRibbons();
initReveal();
initChrome();
initComposer();
initMap();
setInterval(renderStatus, 60 * 1000);
