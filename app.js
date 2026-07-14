/* ============================================================
   app.js — König Ludwig II von Robotollern
   Vanilla render layer + interactions. No framework, no build step.
   Content = content.js / legal-content.js · Data = config.js
   ============================================================ */
(function () {
  'use strict';

  var cfg = window.LVD_CONFIG;
  var state = { lang: 'de', active: 'what', formSent: false };
  var C = function () { return window.LVD_CONTENT[state.lang]; };
  var royalReady = function () { return !!(cfg && cfg.royalPhotosReady); };

  /* ---------- tiny hyperscript DOM builder ---------- */
  function h(tag, attrs) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class' || k === 'className') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k === 'on') Object.keys(v).forEach(function (ev) { node.addEventListener(ev, v[ev]); });
      else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
      else node.setAttribute(k, v === true ? '' : v);
    });
    for (var i = 2; i < arguments.length; i++) append(node, arguments[i]);
    return node;
  }
  function append(node, kid) {
    if (kid == null || kid === false) return;
    if (Array.isArray(kid)) { kid.forEach(function (k) { append(node, k); }); return; }
    node.appendChild(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  function icon(name) { return h('i', { 'data-lucide': name, 'aria-hidden': 'true' }); }
  var BRAND_SVG = {
    'brand-x': '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    'brand-tiktok': '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.34-1.48z"/></svg>',
    'brand-threads': '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.781 3.631 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221Z"/></svg>'
  };
  function lucide() { if (window.lucide) window.lucide.createIcons(); }

  /* ---------- shared wordmark ----------
     German orthography: Roman ordinal after a ruler's name takes a period
     (Ludwig II. von Bayern) — so the dot renders in DE only. */
  function markInner() {
    return [ 'Ludwig ', h('span', { class: 'ii' }, state.lang === 'de' ? 'II.' : 'II'), ' ', h('em', null, 'von'), ' Robotollern' ];
  }

  /* ---------- cleanup registry (observers / rAF / listeners) ---------- */
  var cleanups = [];
  function onCleanup(fn) { cleanups.push(fn); }
  function runCleanups() { cleanups.forEach(function (fn) { try { fn(); } catch (e) {} }); cleanups = []; }

  /* ---------- focus trap helper ---------- */
  function trap(e, nodes) {
    if (e.key !== 'Tab' || !nodes.length) return;
    var first = nodes[0], last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ============================================================
     EMBER PARTICLE FIELD (toned down per review: ~70 cap, lower alpha)
     ============================================================ */
  function emberField(intensity) {
    intensity = intensity || 1;
    var canvas = h('canvas', { class: 'ember-canvas' });
    var wrap = h('div', { class: 'ember-field', 'aria-hidden': 'true' },
      h('div', { class: 'ember-floor' }), canvas, h('div', { class: 'ember-bloom' }), h('div', { class: 'ember-vignette' }));
    requestAnimationFrame(function () { initEmber(canvas, intensity); });
    return wrap;
  }
  function initEmber(canvas, intensity) {
    var ctx = canvas.getContext('2d');
    if (!ctx || !canvas.parentElement) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var w = 0, h0 = 0, parts = [], raf = 0;

    function spawn(anywhere) {
      var z = 0.25 + Math.random() * 0.75;
      return {
        x: Math.random() * w, y: anywhere ? Math.random() * h0 : h0 + 24, z: z,
        r: (0.6 + Math.random() * 2.2) * z,
        vy: (0.06 + Math.random() * 0.3) * z * intensity,
        sway: Math.random() * Math.PI * 2, swaySpeed: (0.002 + Math.random() * 0.004) * intensity,
        swayAmp: (4 + Math.random() * 16) * z,
        a: (0.10 + Math.random() * 0.34) * z, flick: Math.random() * Math.PI * 2
      };
    }
    function reset() { var count = Math.round(Math.min(72, Math.max(34, w / 16))); parts = []; for (var i = 0; i < count; i++) parts.push(spawn(true)); }
    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width; h0 = rect.height;
      canvas.width = w * dpr; canvas.height = h0 * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h0 + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      reset(); if (reduce) frame(true);
    }
    function frame(once) {
      ctx.clearRect(0, 0, w, h0);
      ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        if (!once) { p.y -= p.vy; p.sway += p.swaySpeed; p.flick += 0.03; }
        var x = p.x + Math.sin(p.sway) * p.swayAmp;
        var flick = 0.72 + Math.sin(p.flick) * 0.28;
        var alpha = Math.max(0, p.a * flick);
        ctx.shadowBlur = p.r * 4;
        ctx.shadowColor = 'rgba(255,100,40,' + alpha + ')';
        ctx.fillStyle = 'rgba(255,' + (130 + Math.floor(40 * flick)) + ',' + (50 + Math.floor(30 * flick)) + ',' + alpha + ')';
        ctx.beginPath(); ctx.arc(x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        if (p.y < -24) parts[i] = spawn(false);
      }
      ctx.shadowBlur = 0; ctx.globalCompositeOperation = 'source-over';
      if (!once) raf = requestAnimationFrame(function () { frame(false); });
    }
    resize();
    if (!reduce) frame(false);
    var ro = new ResizeObserver(resize); ro.observe(canvas.parentElement);
    onCleanup(function () { cancelAnimationFrame(raf); ro.disconnect(); });
  }

  function royalNote() {
    if (royalReady()) return null;
    var label = state.lang === 'de' ? 'Krone + roter Umhang — Foto folgt' : 'Crown + red cloak — photo to come';
    return h('span', { class: 'royal-note', role: 'note' }, icon('camera'), label);
  }

  /* ============================================================
     SECTIONS
     ============================================================ */
  function Nav() {
    var t = C().nav;
    var menuOpen = false;

    var deBtn = h('button', { type: 'button', class: state.lang === 'de' ? 'on' : '', 'aria-pressed': state.lang === 'de' ? 'true' : 'false', on: { click: function () { setLang('de'); } } }, 'DE');
    var enBtn = h('button', { type: 'button', class: state.lang === 'en' ? 'on' : '', 'aria-pressed': state.lang === 'en' ? 'true' : 'false', on: { click: function () { setLang('en'); } } }, 'EN');
    var lang = h('div', { class: 'lvd-lang', role: 'group', 'aria-label': t.langLabel }, deBtn, h('span', { class: 'sep', 'aria-hidden': 'true' }, '/'), enBtn);

    var links = h('div', { class: 'lvd-nav__links' }, t.links.map(function (p) {
      return h('a', { href: p[0], 'aria-current': state.active === p[0].slice(1) ? 'true' : null }, p[1]);
    }));

    var panel = h('div', { id: 'lvd-mobile-menu', class: 'lvd-mobile', hidden: true });
    t.links.forEach(function (p) { panel.appendChild(h('a', { href: p[0], on: { click: function () { setMenu(false); } } }, p[1])); });
    panel.appendChild(h('a', { href: '#assistant', class: 'lvd-mobile__cta', on: { click: function () { setMenu(false); } } }, t.cta));

    var burger = h('button', { type: 'button', class: 'lvd-burger', 'aria-expanded': 'false', 'aria-controls': 'lvd-mobile-menu', 'aria-label': t.menuOpen, on: { click: function () { setMenu(!menuOpen); } } }, icon('menu'));

    function onMenuKey(e) {
      if (e.key === 'Escape') { setMenu(false); burger.focus(); return; }
      trap(e, [burger].concat(Array.prototype.slice.call(panel.querySelectorAll('a'))));
    }
    function setMenu(open) {
      menuOpen = open;
      panel.hidden = !open; panel.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? t.menuClose : t.menuOpen);
      burger.innerHTML = ''; burger.appendChild(icon(open ? 'x' : 'menu')); lucide();
      if (open) { document.addEventListener('keydown', onMenuKey); var f = panel.querySelector('a'); f && f.focus(); }
      else document.removeEventListener('keydown', onMenuKey);
    }
    onCleanup(function () { document.removeEventListener('keydown', onMenuKey); });

    var mark = h('a', { href: '#top', class: 'lvd-nav__mark' },
      h('span', { class: 'lvd-nav__crown', 'aria-hidden': 'true' }, icon('crown')), markInner(), h('span', { class: 'dot' }, '.'));

    return h('nav', { class: 'lvd-nav', 'aria-label': state.lang === 'de' ? 'Hauptnavigation' : 'Main navigation' },
      mark, links,
      h('div', { class: 'lvd-nav__right' }, lang,
        h('span', { class: 'lvd-nav__cta' }, h('a', { href: '#assistant', class: 'btn btn--sm btn--primary' }, t.cta)), burger),
      panel);
  }

  function Hero() {
    var t = C().hero;
    var h1 = h('h1', { class: 'lvd-hero__name reveal is-in' }, markInner());
    var figure = h('div', { class: 'lvd-hero__figure reveal is-in' },
      h('span', { class: 'lvd-hero__halo', 'aria-hidden': 'true' }),
      h('img', { src: cfg.images.hero, alt: t.heroAlt }),
      h('span', { class: 'lvd-hero__ground', 'aria-hidden': 'true' }),
      royalNote());
    return h('header', { class: 'lvd-hero', id: 'top' },
      emberField(1),
      h('span', { class: 'lvd-hero__flag', 'aria-hidden': 'true' },
        h('span', { class: 'seg k' }), h('span', { class: 'seg r' }), h('span', { class: 'seg g' })),
      h('div', { class: 'lvd-hero__inner lvd-container' },
        h('div', { class: 'lvd-hero__copy' },
          h1,
          h('p', { class: 'lvd-hero__royal reveal is-in' }, t.royal),
          h('p', { class: 'lvd-hero__tag reveal is-in' }, t.tag),
          h('div', { class: 'lvd-hero__cta reveal is-in' },
            h('a', { href: '#contact', class: 'btn btn--lg btn--primary' }, t.book, icon('arrow-right')),
            h('a', { href: '#booking', class: 'btn btn--lg btn--secondary' }, t.how)),
          h('ul', { class: 'hero-chips reveal is-in' }, t.chips.map(function (c) { return h('li', null, c); }))),
        figure),
      h('span', { class: 'lvd-hero__base-fade', 'aria-hidden': 'true' }),
      h('a', { class: 'lvd-hero__scroll', href: '#what', 'aria-label': t.scroll }, icon('chevron-down')));
  }

  function What() {
    var t = C().what;
    var title = h('h2', { class: 'lvd-h2' }, t.title.map(function (seg) {
      return seg.br ? h('br') : seg.ember ? h('span', { class: 'lvd-ember-text' }, seg.t) : seg.t;
    }));
    var copy = h('div', { class: 'what-copy' }, t.body.map(function (p) { return h('p', null, p); }));
    var specs = h('div', { class: 'what-specs reveal' }, t.specs.map(function (s) {
      return h('div', { class: 'what-spec' }, h('div', { class: 'what-spec__n' }, s[0]), h('div', { class: 'what-spec__l' }, s[1]));
    }));
    return h('section', { class: 'lvd-section', id: 'what' },
      h('div', { class: 'lvd-container' },
        h('div', { class: 'what-grid' },
          h('div', { class: 'reveal' },
            h('div', { class: 'lvd-kicker', style: { marginBottom: '22px' } }, t.kicker), title, copy),
          h('div', { class: 'reveal what-photo' },
            h('span', { class: 'what-photo__glow', 'aria-hidden': 'true' }),
            h('img', { src: cfg.images.what, alt: t.photoAlt }),
            royalNote())),
        specs));
  }

  function Cases() {
    var t = C().cases;
    var grid = h('div', { class: 'cases-grid reveal' }, t.items.map(function (it) {
      return h('div', { class: 'card card--interactive' },
        h('div', { class: 'cases-icon' }, icon(it.icon)),
        h('h3', { class: 'cases-title' }, it.title),
        it.royal ? h('p', { class: 'cases-royal' }, it.royal) : null,
        it.warm ? h('p', { class: 'cases-warm' }, it.warm) : null,
        h('p', { class: 'cases-body' }, it.body));
    }));
    return h('section', { class: 'lvd-section', id: 'cases' },
      h('div', { class: 'lvd-container' },
        h('div', { class: 'cases-head reveal' },
          h('div', null, h('div', { class: 'lvd-kicker', style: { marginBottom: '18px' } }, t.kicker), h('h2', { class: 'lvd-h2' }, t.title)),
          h('p', { class: 'cases-intro' }, t.intro)),
        grid));
  }

  function emberTitle(parts) {
    return h('h2', { class: 'lvd-h2' }, parts.map(function (seg) {
      return seg.br ? h('br') : seg.ember ? h('span', { class: 'lvd-ember-text' }, seg.t) : seg.t;
    }));
  }

  function Why() {
    var t = C().why;
    var grid = h('div', { class: 'cases-grid fleet-grid reveal' }, t.items.map(function (it) {
      return h('div', { class: 'card card--interactive' },
        h('div', { class: 'cases-icon' }, icon(it.icon)),
        h('h3', { class: 'cases-title' }, it.title),
        h('p', { class: 'cases-body' }, it.body));
    }));
    return h('section', { class: 'lvd-section lvd-section--alt', id: 'why' },
      h('div', { class: 'lvd-container' },
        h('div', { class: 'reveal', style: { marginBottom: '18px' } },
          h('div', { class: 'lvd-kicker', style: { marginBottom: '18px' } }, t.kicker), emberTitle(t.title)),
        h('p', { class: 'cases-intro why-intro reveal' }, t.intro),
        grid));
  }

  function Brands() {
    var t = C().brands;
    var grid = h('div', { class: 'cases-grid fleet-grid reveal' }, t.items.map(function (it) {
      return h('div', { class: 'card card--interactive' },
        h('div', { class: 'cases-icon' }, icon(it.icon)),
        h('h3', { class: 'cases-title' }, it.title),
        h('p', { class: 'cases-royal' }, it.royal),
        h('p', { class: 'cases-body' }, it.body));
    }));
    return h('section', { class: 'lvd-section', id: 'brands' },
      h('div', { class: 'lvd-container' },
        h('div', { class: 'cases-head reveal' },
          h('div', null, h('div', { class: 'lvd-kicker', style: { marginBottom: '18px' } }, t.kicker), emberTitle(t.title)),
          h('p', { class: 'cases-intro' }, t.intro)),
        grid,
        h('p', { class: 'fleet-note' }, icon('badge-check'), t.note)));
  }

  function Scope() {
    var t = C().scope;
    var list = h('ul', { class: 'scope-list reveal' }, t.items.map(function (it) {
      return h('li', null, h('span', { class: 'scope-check', 'aria-hidden': 'true' }, icon('check')), it);
    }));
    return h('section', { class: 'lvd-section lvd-section--alt', id: 'scope' },
      h('div', { class: 'lvd-container--narrow lvd-container' },
        h('div', { class: 'reveal', style: { marginBottom: '24px' } },
          h('div', { class: 'lvd-kicker', style: { marginBottom: '18px' } }, t.kicker),
          h('h2', { class: 'lvd-h2' }, t.title),
          h('p', { class: 'scope-intro' }, t.intro)),
        list,
        h('div', { class: 'scope-price reveal' },
          h('span', { class: 'scope-price__tag' }, t.price),
          h('p', { class: 'scope-price__note' }, t.priceNote))));
  }

  /* открыть чат-виджет из любой кнопки сайта; если виджет не загрузился —
     ведём к блоку «Direkter Draht» с альтернативами (TG/E-Mail) */
  function openChatWidget(e) {
    if (e) e.preventDefault();
    var btn = document.querySelector('.gera-w .gera-btn');
    var panel = document.querySelector('.gera-panel');
    if (btn) { if (!panel || !panel.classList.contains('open')) btn.click(); }
    else location.hash = '#assistant';
  }

  function Assistant() {
    var t = C().assistant;
    var openChat = openChatWidget;
    return h('section', { class: 'lvd-section', id: 'assistant' },
      h('div', { class: 'lvd-container--narrow lvd-container' },
        h('div', { class: 'assistant-panel reveal' },
          h('div', { class: 'lvd-kicker', style: { marginBottom: '16px' } }, t.kicker),
          h('h2', { class: 'lvd-h2', style: { marginBottom: '14px' } }, t.title),
          h('p', { class: 'assistant-body' }, t.body),
          h('div', { class: 'assistant-actions' },
            h('button', { type: 'button', class: 'btn btn--md btn--primary', on: { click: openChat } }, icon('message-circle'), t.chat),
            h('a', { href: t.tgHref, target: '_blank', rel: 'noopener noreferrer', class: 'btn btn--md btn--secondary' }, icon('send'), t.tg),
            h('a', { href: 'mailto:' + cfg.contact.email, class: 'btn btn--md btn--secondary' }, icon('mail'), t.mail),
            h('span', { class: 'assistant-soon' }, icon('clock'), t.wa)),
          h('p', { class: 'assistant-note' }, t.note))));
  }

  function CtaBand() {
    var t = C().ctaBand;
    return h('section', { class: 'cta-band', 'aria-label': t.title },
      h('div', { class: 'lvd-container cta-band__inner reveal' },
        h('h2', { class: 'cta-band__t' }, t.title),
        h('p', { class: 'cta-band__s' }, t.sub),
        h('div', { class: 'cta-band__actions' },
          h('button', { type: 'button', class: 'btn btn--lg btn--primary', on: { click: openChatWidget } }, icon('message-circle'), t.primary),
          h('a', { href: '#contact', class: 'btn btn--lg btn--secondary' }, t.secondary))));
  }

  function Fleet() {
    var t = C().fleet;
    var f = cfg.images.fleet || {};
    var photos = [cfg.images.hero, f.dog, f.drone, f.branding];
    var grid = h('div', { class: 'cases-grid fleet-grid reveal' }, t.items.map(function (it, i) {
      /* 0=король и 3=G1-брендинг — поясные кадры: bleed до нижней кромки рамки;
         1=собака стоит на подиуме; 2=дрон летает */
      var pcls = 'fleet-photo' + (i === 2 ? ' fleet-photo--air' : '') + ((i === 0 || i === 3) ? ' fleet-photo--bleed' : '');
      return h('div', { class: 'card card--interactive fleet-card' },
        h('div', { class: pcls },
          photos[i] ? h('img', { src: photos[i], alt: it.title, loading: 'lazy' }) : h('span', { class: 'cases-icon' }, icon(it.icon)),
          it.status ? h('span', { class: 'fleet-status' }, it.status) : null),
        h('h3', { class: 'cases-title' }, it.title),
        h('p', { class: 'cases-royal' }, it.royal),
        h('p', { class: 'cases-body' }, it.body));
    }));
    return h('section', { class: 'lvd-section lvd-section--alt', id: 'fleet' },
      h('div', { class: 'lvd-container' },
        h('div', { class: 'cases-head reveal' },
          h('div', null, h('div', { class: 'lvd-kicker', style: { marginBottom: '18px' } }, t.kicker), h('h2', { class: 'lvd-h2' }, t.title)),
          h('p', { class: 'cases-intro' }, t.intro)),
        grid,
        h('p', { class: 'fleet-note' }, icon('info'), t.note)));
  }

  function Gallery() {
    var t = C().gallery;
    var grid = h('div', { class: 'gal-grid reveal' }, cfg.images.gallery.map(function (g) {
      var cap = state.lang === 'de' ? g.de : g.en;
      var cls = 'gal-tile' + (g.crop ? ' gal-tile--crop' + (g.crop === 'waist' ? ' gal-tile--waist' : '') : '');
      return h('figure', { class: cls },
        h('span', { class: 'gal-glow', 'aria-hidden': 'true' }),
        h('img', { src: g.src, alt: (state.lang === 'de' ? 'Ludwig II.' : 'Ludwig II') + ' — ' + cap, loading: 'lazy' }),
        h('figcaption', { class: 'gal-cap' }, cap));
    }));
    return h('section', { class: 'lvd-section', id: 'gallery' },
      h('div', { class: 'lvd-container' },
        h('div', { class: 'gal-head reveal' },
          h('div', null, h('div', { class: 'lvd-kicker', style: { marginBottom: '18px' } }, t.kicker), h('h2', { class: 'lvd-h2' }, t.title)),
          h('p', { class: 'gal-note' }, icon('camera'), t.note)),
        grid));
  }

  function Faq() {
    var t = C().faq;
    var list = h('div', { class: 'faq-list reveal' }, t.items.map(function (it, i) {
      var panelId = 'faq-p-' + i, btnId = 'faq-b-' + i;
      var body = h('div', { id: panelId, class: 'faq-a', role: 'region', 'aria-labelledby': btnId, hidden: true },
        h('p', null, it.a));
      var btn = h('button', { type: 'button', id: btnId, class: 'faq-q', 'aria-expanded': 'false', 'aria-controls': panelId, on: { click: function () {
        var open = body.hidden;
        body.hidden = !open;
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.parentElement.classList.toggle('is-open', open);
      } } }, h('span', null, it.q), h('span', { class: 'faq-chev', 'aria-hidden': 'true' }, icon('chevron-down')));
      return h('div', { class: 'faq-item' }, btn, body);
    }));
    return h('section', { class: 'lvd-section', id: 'faq' },
      h('div', { class: 'lvd-container--narrow lvd-container' },
        h('div', { class: 'reveal', style: { marginBottom: '32px' } },
          h('div', { class: 'lvd-kicker', style: { marginBottom: '18px' } }, t.kicker),
          h('h2', { class: 'lvd-h2' }, t.title)),
        list));
  }

  function Booking() {
    var t = C().booking;
    var grid = h('div', { class: 'book-grid reveal' }, t.steps.map(function (s, i) {
      return h('div', { class: 'book-step' },
        h('div', { class: 'book-top' }, h('span', { class: 'book-n' }, s.n), h('span', { class: 'book-ico' }, icon(s.icon))),
        h('h3', { class: 'book-title' }, s.title),
        h('p', { class: 'book-royal' }, s.royal),
        h('p', { class: 'book-body' }, s.body),
        i < t.steps.length - 1 ? h('span', { class: 'book-line', 'aria-hidden': 'true' }) : null);
    }));
    return h('section', { class: 'lvd-section lvd-section--alt', id: 'booking' },
      h('div', { class: 'lvd-container' },
        h('div', { class: 'reveal', style: { marginBottom: '40px' } },
          h('div', { class: 'lvd-kicker', style: { marginBottom: '18px' } }, t.kicker), h('h2', { class: 'lvd-h2' }, t.title)),
        grid));
  }

  function Contact() {
    var t = C().contact;
    var statusBox;

    if (state.formSent) {
      statusBox = h('div', { class: 'contact-ok reveal is-in', tabindex: '-1', role: 'status', 'aria-live': 'polite' },
        h('span', { class: 'contact-ok__ico', 'aria-hidden': 'true' }, icon('check')),
        h('h3', { class: 'contact-ok__t' }, t.okTitle),
        h('p', { class: 'contact-ok__b' }, t.okBody));
    }

    var fieldRefs = {};
    function Field(name, opts) {
      opts = opts || {};
      var id = 'f-' + name, errId = id + '-err';
      var input = opts.multiline
        ? h('textarea', { id: id, name: name, rows: '4', placeholder: t.ph[name], class: 'fld-input' })
        : h('input', { id: id, name: name, type: opts.type || 'text', placeholder: t.ph[name], class: 'fld-input' });
      if (opts.required) input.setAttribute('aria-required', 'true');
      var errSpan = h('span', { id: errId, role: 'alert', class: 'fld-err', style: { display: 'none' } });
      var wrap = h('div', { class: 'fld' + (opts.multiline ? ' fld--wide' : '') },
        h('label', { class: 'fld-label', for: id },
          t.fields[name],
          opts.required ? h('span', { class: 'fld-req' }, ' *') : h('span', { class: 'fld-opt' }, ' ' + t.optional)),
        input, errSpan);
      fieldRefs[name] = { input: input, err: errSpan, id: errId };
      return wrap;
    }

    function setErr(name, msg) {
      var f = fieldRefs[name]; if (!f) return;
      if (msg) {
        f.input.classList.add('is-err');
        f.input.setAttribute('aria-invalid', 'true');
        f.input.setAttribute('aria-describedby', f.id);
        f.err.innerHTML = ''; f.err.appendChild(icon('alert-circle')); f.err.appendChild(document.createTextNode(msg));
        f.err.style.display = ''; lucide();
      } else {
        f.input.classList.remove('is-err');
        f.input.removeAttribute('aria-invalid');
        f.input.removeAttribute('aria-describedby');
        f.err.style.display = 'none'; f.err.textContent = '';
      }
    }

    function onSubmit(ev) {
      ev.preventDefault();
      var order = ['company', 'name', 'email', 'occasion'];
      var errs = {};
      var get = function (n) { return (fieldRefs[n].input.value || '').trim(); };
      if (!get('company')) errs.company = t.errReq;
      if (!get('name')) errs.name = t.errReq;
      if (!get('email')) errs.email = t.errReq;
      else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(get('email'))) errs.email = t.errEmail;
      if (!get('occasion')) errs.occasion = t.errReq;

      order.forEach(function (n) { setErr(n, errs[n] || null); });
      var firstBad = order.filter(function (n) { return errs[n]; })[0];
      if (firstBad) { fieldRefs[firstBad].input.focus(); return; }

      if (cfg.contact.endpoint) {
        try { fetch(cfg.contact.endpoint, { method: 'POST', body: new FormData(ev.target) }); } catch (e) {}
      }
      state.formSent = true;
      render();
      requestAnimationFrame(function () { var ok = document.querySelector('.contact-ok'); ok && ok.focus(); });
    }

    var form = h('form', { class: 'contact-form reveal', 'aria-labelledby': 'contact-title', novalidate: true, on: { submit: onSubmit } },
      h('div', { class: 'contact-row' }, Field('company', { required: true }), Field('name', { required: true })),
      h('div', { class: 'contact-row' }, Field('email', { type: 'email', required: true }), Field('occasion', { required: true })),
      Field('message', { multiline: true }),
      h('p', { class: 'contact-note' }, t.note),
      h('div', { class: 'contact-actions' },
        h('button', { type: 'submit', class: 'btn btn--lg btn--primary' }, t.submit, icon('send'))));

    return h('section', { class: 'lvd-section lvd-section--alt', id: 'contact' },
      h('div', { class: 'lvd-container--narrow lvd-container' },
        h('div', { class: 'reveal', style: { textAlign: 'center', marginBottom: '32px' } },
          h('div', { class: 'lvd-kicker', style: { marginBottom: '18px', justifyContent: 'center' } }, t.kicker),
          h('h2', { class: 'lvd-h2', id: 'contact-title', style: { margin: '8px 0 14px' } }, t.title),
          h('p', { class: 'contact-body' }, t.body),
          h('p', { class: 'contact-wit' }, t.wit),
          h('p', { class: 'contact-avail' }, icon('clock'), t.avail)),
        statusBox || form));
  }

  function Footer() {
    var t = C().footer;
    var socials = h('ul', { class: 'foot-socials' }, cfg.socials.map(function (s) {
      var inner = BRAND_SVG[s.icon] ? h('span', { 'aria-hidden': 'true', html: BRAND_SVG[s.icon] }) : icon(s.icon);
      var ext = /^https?:/.test(s.href);
      return h('li', null, h('a', { href: s.href, 'aria-label': 'Ludwig ' + t.on + ' ' + s.label,
        target: ext ? '_blank' : null, rel: ext ? 'noopener noreferrer' : null }, inner));
    }));
    var brand = h('div', { class: 'foot-brand' },
      h('div', { class: 'foot-mark' },
        h('span', { class: 'foot-crown', 'aria-hidden': 'true' }, icon('crown')), markInner(), h('span', { class: 'dot' }, '.')),
      h('p', { class: 'foot-court' }, h('strong', null, t.courtH), t.courtSub),
      socials,
      /* без имени/адреса/телефона на витрине — полные юр-данные только в Impressum */
      h('p', { class: 'foot-company', html:
        '<a href="mailto:' + esc(cfg.contact.email) + '">' + esc(cfg.contact.email) + '</a><br>' +
        (state.lang === 'de' ? 'Vollständige Anbieterangaben: siehe Impressum.' : 'Full provider details: see Imprint.') }));

    var navCol = h('nav', { class: 'foot-col', 'aria-label': t.navLabel },
      h('span', { class: 'foot-col__h' }, t.navLabel), t.nav.map(function (p) { return h('a', { href: p[0] }, p[1]); }));

    /* SEO: Einsatzorte-Spalte — interne Links auf die Stadt-Landingpages + Blog */
    var citiesCol = t.cities ? h('nav', { class: 'foot-col', 'aria-label': t.citiesLabel },
      h('span', { class: 'foot-col__h' }, t.citiesLabel),
      t.cities.map(function (p) { return h('a', { href: p[0] }, p[1]); }),
      h('a', { href: t.citiesAll[0], style: { color: 'var(--ember-300)' } }, t.citiesAll[1]),
      h('a', { href: t.blogLink[0], style: { color: 'var(--ember-300)' } }, t.blogLink[1])) : null;

    var legalCol = h('div', { class: 'foot-col' }, h('span', { class: 'foot-col__h' }, t.legalLabel));
    t.legal.forEach(function (p) { legalCol.appendChild(h('button', { type: 'button', class: 'foot-legalbtn', on: { click: function () { openLegal(p[0]); } } }, p[1])); });
    legalCol.appendChild(h('button', { type: 'button', class: 'foot-legalbtn', on: { click: openCookieSettings } }, t.cookies));
    legalCol.appendChild(h('button', { type: 'button', class: 'foot-legalbtn foot-a11ybtn', on: { click: function () { if (window.LVD_openA11y) window.LVD_openA11y(); } } },
      h('span', { class: 'foot-a11yico', 'aria-hidden': 'true' }, icon('person-standing')), t.a11ySettings));

    var year = new Date().getFullYear();
    return h('footer', { class: 'lvd-footer' },
      h('div', { class: 'lvd-container' },
        h('div', { class: 'foot-ai' },
          h('span', { class: 'badge-live' }, h('span', { class: 'dot', 'aria-hidden': 'true' }), t.ai),
          h('p', null, t.aiBody)),
        h('div', { class: 'foot-grid' }, brand, navCol, citiesCol, legalCol),
        h('p', { class: 'foot-b2b' }, t.b2b),
        h('div', { class: 'foot-base' },
          h('span', null, '© ' + year + ' ' + (cfg.legal.publicBrand || 'GERA') + ' · ' + t.rights),
          h('span', { class: 'foot-made' }, t.made))));
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }

  /* ============================================================
     LEGAL MODAL (focus-trapped dialog, tab-switchable)
     ============================================================ */
  var modalRoot = null, modalPrevFocus = null;
  function openLegal(doc) {
    closeLegal();
    var lg = C().legal;
    var tab = doc || 'impressum';
    modalPrevFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('modal-open');

    var titleEl = h('h2', { id: 'legal-title', class: 'legal-h2' });
    var bodyEl = h('div', null);
    function paint() {
      var label = lg.tabs.filter(function (p) { return p[0] === tab; })[0][1];
      titleEl.textContent = label;
      bodyEl.innerHTML = window.LVD_LEGAL[tab](state.lang);
      Array.prototype.forEach.call(tabsWrap.querySelectorAll('.legal-tab'), function (b) {
        var on = b.getAttribute('data-doc') === tab; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      lucide();
    }
    var tabsWrap = h('div', { class: 'legal-tabs', role: 'tablist', 'aria-label': lg.docsLabel });
    lg.tabs.forEach(function (p) {
      tabsWrap.appendChild(h('button', { type: 'button', role: 'tab', 'data-doc': p[0], class: 'legal-tab', on: { click: function () { tab = p[0]; paint(); } } }, p[1]));
    });
    var closeBtn = h('button', { type: 'button', class: 'legal-close', 'aria-label': lg.close, on: { click: closeLegal } }, icon('x'));
    var modal = h('div', { class: 'legal-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'legal-title' },
      h('header', { class: 'legal-head' }, tabsWrap, closeBtn),
      h('div', { class: 'legal-scroll' }, titleEl, bodyEl));
    modalRoot = h('div', { class: 'legal-overlay', on: { mousedown: function (e) { if (e.target === e.currentTarget) closeLegal(); } } }, modal);

    function onKey(e) {
      if (e.key === 'Escape') { closeLegal(); return; }
      trap(e, Array.prototype.slice.call(modal.querySelectorAll('a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])')));
    }
    modalRoot._onKey = onKey;
    document.addEventListener('keydown', onKey);
    document.body.appendChild(modalRoot);
    paint(); closeBtn.focus();
  }
  function closeLegal() {
    if (!modalRoot) return;
    document.removeEventListener('keydown', modalRoot._onKey);
    modalRoot.remove(); modalRoot = null;
    document.body.style.overflow = '';
    document.documentElement.classList.remove('modal-open');
    if (modalPrevFocus && modalPrevFocus.focus) modalPrevFocus.focus();
  }

  /* ============================================================
     COOKIE CONSENT (granular, non-essential OFF by default)
     ============================================================ */
  var CK_KEY = 'lvd2_consent';
  var ckRoot = null;
  function readConsent() { try { return JSON.parse(localStorage.getItem(CK_KEY) || 'null'); } catch (e) { return null; } }
  function openCookieSettings() {
    var s = readConsent();
    showCookie(true, s ? { analytics: !!s.analytics, marketing: !!s.marketing } : null);
  }
  function showCookie(details, pre) {
    if (ckRoot) { ckRoot.remove(); ckRoot = null; }
    var t = C().cookie;
    var analytics = pre ? pre.analytics : false;
    var marketing = pre ? pre.marketing : false;

    function save(a, m) {
      try { localStorage.setItem(CK_KEY, JSON.stringify({ essential: true, analytics: a, marketing: m, ts: Date.now() })); } catch (e) {}
      ckRoot && ckRoot.remove(); ckRoot = null;
      document.documentElement.classList.remove('ck-open');
      loadAnalytics({ analytics: a, marketing: m });
    }
    function toggle(opts) {
      var input = h('input', { type: 'checkbox' });
      if (opts.locked) { input.checked = true; input.disabled = true; }
      else { input.checked = opts.on; input.addEventListener('change', function () { opts.set(input.checked); }); }
      return h('label', { class: 'ck-toggle' + (opts.locked ? ' is-locked' : '') }, input,
        h('span', { class: 'ck-toggle__box', 'aria-hidden': 'true' }, icon('check')),
        h('span', { class: 'ck-toggle__txt' }, h('b', null, opts.label), h('span', null, opts.note)));
    }

    var grid = details ? h('div', { class: 'ck-grid' },
      toggle({ locked: true, label: t.essential, note: t.essentialNote }),
      toggle({ on: analytics, set: function (v) { analytics = v; }, label: t.analytics, note: t.analyticsNote }),
      toggle({ on: marketing, set: function (v) { marketing = v; }, label: t.marketing, note: t.marketingNote })) : null;

    var actions = h('div', { class: 'ck-actions' });
    if (!details) actions.appendChild(h('button', { type: 'button', class: 'ck-btn ck-btn--ghost', on: { click: function () { ckRoot.remove(); ckRoot = null; showCookie(true, { analytics: analytics, marketing: marketing }); } } }, t.settings));
    /* "Alles ablehnen" must be as prominent as "Alle akzeptieren" on the first
       layer (VG Hannover, 19.03.2025, 10 A 5385/22) — outline, not ghost */
    actions.appendChild(h('button', { type: 'button', class: 'ck-btn ck-btn--outline', on: { click: function () { save(false, false); } } }, t.reject));
    if (details) actions.appendChild(h('button', { type: 'button', class: 'ck-btn ck-btn--outline', on: { click: function () { save(analytics, marketing); } } }, t.save));
    actions.appendChild(h('button', { type: 'button', class: 'ck-btn ck-btn--primary', on: { click: function () { save(true, true); } } }, t.accept));

    var inner = h('div', { class: 'ck-inner' },
      h('div', { class: 'ck-head' },
        h('span', { class: 'ck-ico', 'aria-hidden': 'true' }, icon('cookie')),
        h('div', null,
          h('h2', { id: 'ck-title', class: 'ck-title' }, t.title),
          h('p', { class: 'ck-body' }, t.body + ' ',
            h('button', { type: 'button', class: 'ck-link', on: { click: function () { openLegal('datenschutz'); } } }, t.privacy)))),
      grid, actions);
    ckRoot = h('div', { class: 'ck', role: 'dialog', 'aria-modal': 'false', 'aria-labelledby': 'ck-title' }, inner);
    document.body.appendChild(ckRoot); lucide();
    /* while the banner is open, the floating a11y + chat buttons would sit on
       top of its buttons (esp. on phones) — hide them until consent is given */
    document.documentElement.classList.add('ck-open');
  }
  function initCookie() {
    var c = readConsent();
    if (!c) showCookie(false, null);
    else loadAnalytics(c);
  }

  /* ---------- consent-gated analytics (Microsoft Clarity: heatmaps, recordings)
     Loads ONLY after the visitor opted into "Statistik". No consent — no tag.
     Enable by setting config.analytics.clarityId; empty id = no-op. ---------- */
  var analyticsLoaded = false;
  function loadAnalytics(consent) {
    var id = cfg.analytics && cfg.analytics.clarityId;
    if (analyticsLoaded || !id || !consent || !consent.analytics) return;
    analyticsLoaded = true;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', id);
  }

  /* ============================================================
     REVEAL + SCROLLSPY
     ============================================================ */
  function setupReveal() {
    if (!('IntersectionObserver' in window)) { Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (el) { el.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(document.querySelectorAll('.reveal:not(.is-in)'), function (el) { io.observe(el); });
    onCleanup(function () { io.disconnect(); });
  }
  function setupSpy() {
    if (!('IntersectionObserver' in window)) return;
    var ids = ['top', 'cases', 'booking'];
    var links = document.querySelectorAll('.lvd-nav__links a, .lvd-mobile a');
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          state.active = e.target.id;
          Array.prototype.forEach.call(links, function (a) {
            if (a.getAttribute('href').slice(1) === state.active) a.setAttribute('aria-current', 'true');
            else a.removeAttribute('aria-current');
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ids.forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });
    onCleanup(function () { spy.disconnect(); });
  }

  /* ============================================================
     RENDER / LANGUAGE
     ============================================================ */
  function render() {
    runCleanups();
    var app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(Nav());
    app.appendChild(h('main', { id: 'main', tabindex: '-1' },
      Hero(), What(), Why(), CtaBand(), Cases(), Fleet(), Brands(), Booking(), Gallery(), Assistant(), Scope(), Faq(), Contact()));
    app.appendChild(Footer());
    document.documentElement.lang = state.lang;
    var skip = document.querySelector('.skip-link'); if (skip) skip.textContent = C().skip;
    document.title = state.lang === 'de'
      ? 'Humanoiden Roboter mieten für Events, Messen & Konferenzen | Ludwig II. von Robotollern'
      : 'Rent a humanoid robot for events, trade fairs & conferences | Ludwig II von Robotollern';
    lucide();
    setupReveal(); setupSpy();
  }
  function setLang(l) { if (l !== state.lang) { state.lang = l; render(); } }

  /* ---------- KI-Chat-Widget (config.chatWidget) ----------
     Грузится с CRM-сервера (crm.robotollern.de) — квалифицирует запросы и
     складывает лиды в дашборд. Технически необходимый localStorage-ключ
     сессии описан в Datenschutzerklärung §6. */
  function initChatWidget() {
    var cw = (window.LVD_CONFIG || {}).chatWidget;
    if (!cw || !cw.enabled || !cw.src) return;
    var s = document.createElement('script');
    s.src = cw.src; s.defer = true;
    document.body.appendChild(s);
  }

  /* ---------- Barrierefreiheit-Panel ----------
     Один доступный сайт вместо отдельной «версии» (анти-паттерн).
     Три честные настройки: размер текста, светлая тема, анимации.
     Хранится в localStorage 'lvd2_a11y', применяется до отрисовки. */
  var A11Y_KEY = 'lvd2_a11y';

  function a11yLoad() {
    try { return JSON.parse(localStorage.getItem(A11Y_KEY)) || {}; } catch (e) { return {}; }
  }

  function a11yApply(s) {
    var root = document.documentElement;
    root.classList.toggle('a11y-font-115', s.font === '115');
    root.classList.toggle('a11y-font-130', s.font === '130');
    root.classList.toggle('a11y-light', s.theme === 'light');
    root.classList.toggle('a11y-contrast', s.contrast === 'high');
    root.classList.toggle('a11y-still', s.motion === 'off');
  }

  function initA11y() {
    var s = a11yLoad();
    a11yApply(s);

    var svg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="12" cy="5" r="2"/><path d="M5 9.5 12 11l7-1.5"/><path d="M12 11v4"/><path d="m9 21 3-6 3 6"/></svg>';

    var btn = h('button', { class: 'a11y-btn', 'aria-label': 'Barrierefreiheit-Einstellungen öffnen', 'aria-expanded': 'false' });
    btn.innerHTML = svg;

    var panel = h('div', { class: 'a11y-panel', role: 'dialog', 'aria-label': 'Barrierefreiheit' });

    function opt(label, pressed, onClick) {
      return h('button', { class: 'a11y-opt', type: 'button', 'aria-pressed': pressed ? 'true' : 'false',
        on: { click: onClick } }, label);
    }

    function set(key, value) {
      s[key] = value;
      try { localStorage.setItem(A11Y_KEY, JSON.stringify(s)); } catch (e) {}
      a11yApply(s);
      renderPanel();
    }

    function renderPanel() {
      panel.innerHTML = '';
      panel.appendChild(h('h2', {}, 'Barrierefreiheit'));

      var g1 = h('div', { class: 'a11y-group' }, h('span', {}, 'Textgröße'));
      g1.appendChild(h('div', { class: 'a11y-row' },
        opt('Standard', !s.font || s.font === '100', function () { set('font', '100'); }),
        opt('Groß', s.font === '115', function () { set('font', '115'); }),
        opt('Sehr groß', s.font === '130', function () { set('font', '130'); })));
      panel.appendChild(g1);

      var g2 = h('div', { class: 'a11y-group' }, h('span', {}, 'Darstellung'));
      g2.appendChild(h('div', { class: 'a11y-row' },
        opt('Dunkel', s.theme !== 'light', function () { set('theme', 'dark'); }),
        opt('Hell', s.theme === 'light', function () { set('theme', 'light'); })));
      panel.appendChild(g2);

      var g2b = h('div', { class: 'a11y-group' }, h('span', {}, 'Kontrast'));
      g2b.appendChild(h('div', { class: 'a11y-row' },
        opt('Standard', s.contrast !== 'high', function () { set('contrast', 'standard'); }),
        opt('Hoch', s.contrast === 'high', function () { set('contrast', 'high'); })));
      panel.appendChild(g2b);

      var g3 = h('div', { class: 'a11y-group' }, h('span', {}, 'Animationen'));
      g3.appendChild(h('div', { class: 'a11y-row' },
        opt('An', s.motion !== 'off', function () { set('motion', 'on'); }),
        opt('Aus', s.motion === 'off', function () { set('motion', 'off'); })));
      panel.appendChild(g3);

      panel.appendChild(h('button', { class: 'a11y-reset', type: 'button', on: { click: function () {
        s = {};
        try { localStorage.removeItem(A11Y_KEY); } catch (e) {}
        a11yApply(s);
        renderPanel();
      } } }, 'Zurücksetzen'));
    }

    btn.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) renderPanel();
    });
    /* footer "Barrierefreiheit" link opens the same panel */
    window.LVD_openA11y = function () {
      panel.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      renderPanel();
      panel.scrollIntoView({ block: 'nearest' });
      var f = panel.querySelector('.a11y-opt'); f && f.focus();
    };
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('open')) {
        panel.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });

    document.body.appendChild(panel);
    document.body.appendChild(btn);
  }

  /* ---------- Cursor-Glow ----------
     Мягкое ember-свечение, плавно следующее за курсором — добавляет динамики.
     Только для мыши (не тач), с инерцией через rAF. Отключается при
     prefers-reduced-motion и в режиме «Animationen: Aus» (html.a11y-still,
     скрыт по CSS). На светлой теме тоже скрыт. */
  function initCursorGlow() {
    if (!window.matchMedia) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var glow = h('div', { class: 'cursor-glow', 'aria-hidden': 'true' });
    document.body.appendChild(glow);

    var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    var cx = tx, cy = ty, raf = 0, running = true;
    function loop() {
      cx += (tx - cx) * 0.16; cy += (ty - cy) * 0.16;
      glow.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
      if (running) raf = requestAnimationFrame(loop);
    }
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY;
      glow.classList.add('is-on');
    }, { passive: true });
    document.addEventListener('mouseleave', function () { glow.classList.remove('is-on'); });
    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(loop); else cancelAnimationFrame(raf);
    });
    loop();
  }

  /* ---------- boot ---------- */
  function boot() { render(); initCookie(); initChatWidget(); initA11y(); initCursorGlow(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  // expose a couple of hooks for debugging / future use
  window.LVD = { render: render, setLang: setLang, openLegal: openLegal };
})();
