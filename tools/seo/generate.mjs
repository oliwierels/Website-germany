#!/usr/bin/env node
/* ============================================================
   Generator für die SEO-Unterseiten von robotollern.de:
     /roboter-mieten/            — Städte-Hub (30 Städte)
     /roboter-mieten/<slug>/     — Stadt-Landingpages
     /blog/                      — Blog-Hub
     /blog/<slug>/               — Artikel
     /sitemap.xml, /robots.txt
   Aufruf:  node tools/seo/generate.mjs   (aus dem Repo-Root)
   Quelldaten: tools/seo/cities.mjs, tools/seo/blog.mjs
   ============================================================ */
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CITIES } from './cities.mjs';
import { POSTS } from './blog.mjs';
import { USECASES } from './usecases.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SITE = 'https://robotollern.de';
const BRAND = 'Ludwig II. von Robotollern';
const EMAIL = 'info@robotollern.de';
const TODAY = '2026-07-15';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const cityBySlug = Object.fromEntries(CITIES.map((c) => [c.slug, c]));
/* Entity-Verknüpfung: deutsche Wikipedia-Artikel der Städte (Titel = Stadtname) */
const wikiUrl = (name) => 'https://de.wikipedia.org/wiki/' + encodeURIComponent(name.replace(/ /g, '_'));
const wordCount = (html) => String(html).replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length;
const OG_IMG = { url: `${SITE}/og.jpg`, w: 1200, h: 630, alt: 'Ludwig II. von Robotollern — humanoider Event-Roboter mit Krone und rotem Umhang' };
/* CSS wird inline eingebettet: eine Request weniger, schnellerer LCP.
   Quelle bleibt assets/seo.css (wird weiterhin mit deployt, z. B. für 404-Fallbacks). */
const INLINE_CSS = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'assets', 'seo.css'), 'utf8');

/* ---------- shared building blocks ---------- */

const NAV = `
<a href="#main" class="skip-link">Zum Inhalt springen</a>
<nav class="nav" aria-label="Hauptnavigation">
  <div class="nav__in">
    <a class="nav__brand" href="/">Ludwig II<span class="dot">.</span></a>
    <div class="nav__links">
      <a href="/">Start</a>
      <a href="/roboter-mieten/">Einsatzorte</a>
      <a href="/preise/">Preise</a>
      <a href="/blog/">Blog</a>
      <a href="/#faq">FAQ</a>
      <a class="btn btn--primary btn--sm" href="/#contact">Roboter buchen</a>
    </div>
  </div>
</nav>`;

function footer() {
  const top = CITIES.slice(0, 10);
  return `
<footer class="footer">
  <div class="container">
    <div class="footer__grid">
      <div>
        <div class="footer__brand">Ludwig II<span class="dot">.</span> von Robotollern</div>
        <p class="footer__note">Humanoider Event-Roboter (Unitree G1) mit Operator — für Messen, Konferenzen und Firmenevents. Deutschland, Österreich, Schweiz.</p>
        <p class="footer__note"><a href="mailto:${EMAIL}">${EMAIL}</a></p>
      </div>
      <div>
        <h4>Roboter mieten in</h4>
        <ul>${top.slice(0, 5).map((c) => `<li><a href="/roboter-mieten/${c.slug}/">${esc(c.name)}</a></li>`).join('')}
        <li><a href="/roboter-mieten/">Alle Einsatzorte →</a></li></ul>
      </div>
      <div>
        <h4>Beliebte Städte</h4>
        <ul>${top.slice(5, 10).map((c) => `<li><a href="/roboter-mieten/${c.slug}/">${esc(c.name)}</a></li>`).join('')}
        <li><a href="/blog/">Blog &amp; Ratgeber</a></li></ul>
      </div>
      <div>
        <h4>Leistungen</h4>
        <ul>${USECASES.slice(0, 6).map((u) => `<li><a href="/${u.slug}/">${esc(u.kicker)}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h4>Service</h4>
        <ul>
          <li><a href="/#contact">Anfrage &amp; Buchung</a></li>
          <li><a href="/preise/">Preise &amp; Pakete</a></li>
          <li><a href="/unitree-g1-mieten/">Unitree G1 mieten</a></li>
          <li><a href="/roboter-show/">Roboter-Show buchen</a></li>
          <li><a href="/roboter-hochzeit/">Roboter für Hochzeiten</a></li>
          <li><a href="/#faq">Häufige Fragen</a></li>
          <li><a href="/">Impressum &amp; Datenschutz</a></li>
        </ul>
      </div>
    </div>
    <div class="footer__base">
      <span>© 2026 GERA · Alle Rechte vorbehalten. B2B-Angebot.</span>
      <span>Berlin · Unitree G1 · Deutschlandweit im Einsatz</span>
    </div>
  </div>
</footer>`;
}

function ctaBand(city, hasForm) {
  const where = city ? ` in ${esc(city.name)}` : '';
  const href = hasForm ? '#anfrage' : '/#contact';
  return `
<section class="cta-band" aria-label="Anfrage">
  <div class="cta-band__in">
    <p class="kicker">Anfrage &amp; Buchung</p>
    <h2>Bereit für eine Audienz${where}?</h2>
    <p>Schildern Sie Ihr Event in zwei Sätzen — Sie erhalten zeitnah ein individuelles Angebot. Einsätze ab 2.500&nbsp;€ zzgl. USt., Operator und Versicherung inklusive.</p>
    <div class="hero__cta">
      <a class="btn btn--primary" href="${href}">Jetzt unverbindlich anfragen</a>
      <a class="btn btn--ghost" href="mailto:${EMAIL}">E-Mail schreiben</a>
    </div>
  </div>
</section>`;
}

/* ---------- Lead-Formular (POST → CRM, wie auf der Startseite) ---------- */
const CRM_ENDPOINT = 'https://crm.robotollern.de/api/lead-form';

function leadForm(source, cityName) {
  const where = cityName ? ` in ${esc(cityName)}` : '';
  return `
<section class="section section--alt" id="anfrage">
  <div class="container">
    <p class="kicker">Anfrage &amp; Buchung</p>
    <h2>Roboter${where} anfragen</h2>
    <p class="intro">Schildern Sie kurz Ihr Event — Sie erhalten zeitnah ein individuelles Angebot. Keine Warteschleifen: Das Team antwortet schnell, der KI-Assistent (Chat unten rechts) rund um die Uhr.</p>
    <form class="lead-form" method="post" action="${CRM_ENDPOINT}" data-endpoint="${CRM_ENDPOINT}">
      <input type="hidden" name="source" value="${esc(source)}">
      <div class="lead-row">
        <label>Firma&nbsp;*<input name="company" required autocomplete="organization" placeholder="Unternehmen"></label>
        <label>Ansprechpartner&nbsp;*<input name="name" required autocomplete="name" placeholder="Vor- und Nachname"></label>
      </div>
      <div class="lead-row">
        <label>E-Mail&nbsp;*<input type="email" name="email" required autocomplete="email" placeholder="name@firma.de"></label>
        <label>Anlass &amp; Wunschtermin&nbsp;*<input name="occasion" required placeholder="z. B. Messe-Eröffnung, 14.09."></label>
      </div>
      <label>Nachricht<textarea name="message" rows="4" placeholder="Ort, ungefähre Gästezahl, Besonderheiten …"></textarea></label>
      <p class="lead-note">Mit * markierte Felder sind Pflichtfelder. Unser Angebot richtet sich an Geschäftskunden (B2B). Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Angaben gemäß unserer <a href="/">Datenschutzerklärung</a> zu.</p>
      <button class="btn btn--primary" type="submit">Anfrage senden</button>
      <div class="lead-ok" hidden tabindex="-1"><strong>Anfrage eingegangen.</strong> Vielen Dank — der Hofstaat meldet sich zeitnah mit einem Angebot.</div>
    </form>
  </div>
</section>`;
}

/* Scroll-Reveal: rein progressive — ohne JS/bei Reduced Motion bleibt alles sichtbar. */
const REVEAL_JS = `
<script>
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  var els = document.querySelectorAll('.card, .step, .faq details, .check li, .postcard, .section .intro');
  els.forEach(function (el, i) { el.classList.add('will-reveal'); el.style.transitionDelay = (i % 6) * 55 + 'ms'; });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px' });
  els.forEach(function (el) { io.observe(el); });
})();
</script>`;

const LEAD_JS = `
<script>
document.querySelectorAll('.lead-form').forEach(function (f) {
  f.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!f.reportValidity()) return;
    try { fetch(f.dataset.endpoint, { method: 'POST', body: new FormData(f) }).catch(function () {}); } catch (e) {}
    Array.prototype.forEach.call(f.children, function (el) {
      if (!el.classList.contains('lead-ok')) el.style.display = 'none';
    });
    var ok = f.querySelector('.lead-ok');
    ok.hidden = false; ok.focus();
    ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});
</script>`;

function page({ path, title, desc, ogTitle, jsonld, body, ogType = 'website', article = null, noindex = false }) {
  /* Jede Seite bekommt zusätzlich einen WebPage-Knoten im Graph —
     verknüpft mit WebSite + Organization (Entity-Graph für Google & LLMs). */
  const graph = jsonld && Array.isArray(jsonld['@graph']) ? jsonld : { '@context': 'https://schema.org', '@graph': jsonld ? [jsonld] : [] };
  graph['@graph'] = [
    {
      '@type': 'WebPage',
      '@id': `${SITE}${path}#webpage`,
      url: `${SITE}${path}`,
      name: ogTitle || title,
      description: desc,
      inLanguage: 'de-DE',
      isPartOf: { '@id': `${SITE}/#website` },
      about: { '@id': `${SITE}/#org` },
      primaryImageOfPage: { '@type': 'ImageObject', contentUrl: OG_IMG.url, width: OG_IMG.w, height: OG_IMG.h },
      ...(article ? { datePublished: article.published, dateModified: article.modified } : {}),
    },
    ...graph['@graph'],
  ];
  const articleMeta = article
    ? `\n<meta property="article:published_time" content="${article.published}">\n<meta property="article:modified_time" content="${article.modified}">\n<meta property="article:section" content="${esc(article.section || 'Events & Robotik')}">`
    : '';
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1'}">
<meta name="theme-color" content="#0A0A0A">
${noindex ? '' : `<link rel="canonical" href="${SITE}${path}">\n`}<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-96.png" type="image/png" sizes="96x96">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="alternate" type="application/rss+xml" title="Robotollern Blog — Event-Roboter Ratgeber" href="${SITE}/feed.xml">
<link rel="preconnect" href="https://crm.robotollern.de">
<meta property="og:type" content="${ogType}">
<meta property="og:url" content="${SITE}${path}">
<meta property="og:site_name" content="${esc(BRAND)}">
<meta property="og:title" content="${esc(ogTitle || title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${OG_IMG.url}">
<meta property="og:image:width" content="${OG_IMG.w}">
<meta property="og:image:height" content="${OG_IMG.h}">
<meta property="og:image:alt" content="${esc(OG_IMG.alt)}">
<meta property="og:locale" content="de_DE">
<meta property="og:locale:alternate" content="de_AT">
<meta property="og:locale:alternate" content="de_CH">${articleMeta}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(ogTitle || title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${OG_IMG.url}">
<meta name="twitter:image:alt" content="${esc(OG_IMG.alt)}">
<script type="application/ld+json">${JSON.stringify(graph)}</script>
<style>
${INLINE_CSS}</style>
</head>
<body>
${NAV}
<main id="main">
${body}
</main>
${footer()}
${LEAD_JS}
${REVEAL_JS}
<script src="https://crm.robotollern.de/widget.js" defer></script>
</body>
</html>
`;
}

const breadcrumbLd = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, url], i) => ({
    '@type': 'ListItem', position: i + 1, name,
    ...(url ? { item: SITE + url } : {}),
  })),
});
const faqLd = (items) => ({
  '@type': 'FAQPage',
  mainEntity: items.map(({ q, a }) => ({
    '@type': 'Question', name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
});
const ORG_REF = { '@id': `${SITE}/#org` };

function crumbsHtml(items) {
  return `<div class="container"><nav class="crumbs" aria-label="Breadcrumb">${items
    .map(([name, url]) => (url ? `<a href="${url}">${esc(name)}</a>` : `<span aria-current="page">${esc(name)}</span>`))
    .join(' › ')}</nav></div>`;
}

/* ---------- city pages ---------- */

const USE_CASES = [
  { t: 'Messen & Kongresse', r: '„Audienz auf dem Messestand.“', d: 'Standmagnet mit Anziehungskraft — zieht Besucher an und bringt Gespräche in Gang.' },
  { t: 'Konferenzen & Tagungen', r: '„Der König eröffnet.“', d: 'Keynote-Opening, Empfang oder Pausen-Highlight — Aufmerksamkeit, die bleibt.' },
  { t: 'Firmenfeiern & Jubiläen', r: '„Hofstaat trifft Belegschaft.“', d: 'Sommerfest, Weihnachtsfeier, Jubiläum — der Auftritt, über den alle sprechen.' },
  { t: 'Produktlaunches', r: '„Seine Majestät enthüllt.“', d: 'Ein Launch-Moment mit Bühne und Reichweite — Ihr Produkt im Rampenlicht.' },
  { t: 'Eröffnungen & Retail', r: '„Royale Eröffnung.“', d: 'Store- und Filialeröffnungen mit einem Anziehungspunkt, über den man spricht.' },
  { t: 'Premium-Feiern & Hochzeiten', r: '„Der König gratuliert.“', d: 'Exklusive Feiern — in Zusammenarbeit mit Eventagenturen und Locations.' },
];

const SCOPE = [
  'Ludwig II. in vollem Ornat — Krone, Umhang, königliche Laune',
  'Geschulter Operator während des gesamten Einsatzes',
  'Anreise, Aufbau, Technik-Check und Abbau',
  'Abgestimmter Ablauf und Sicherheitskonzept für Ihre Fläche',
  'Live-Interaktion auf Deutsch und Englisch',
  'Versicherter Betrieb',
  'Auf Wunsch: Content-Aufnahmen vom Einsatz für Ihre Kanäle',
];

const STEPS = [
  { n: '01', t: 'Anfrage', d: 'Event, Datum und Ort kurz schildern — Sie erhalten zeitnah ein individuelles Angebot.' },
  { n: '02', t: 'Abstimmung', d: 'Ablauf, Sicherheitskonzept und Technik werden gemeinsam festgelegt.' },
  { n: '03', t: 'Auftritt', d: 'Ludwig II. kommt mit Operator und Equipment — betreut von Aufbau bis Abbau.' },
];

function cityFaq(c) {
  return [
    { q: `Was kostet es, einen Roboter in ${c.name} zu mieten?`, a: `Einsätze in ${c.name} beginnen ab 2.500 € zzgl. USt. — der Startpreis für ein kompaktes Format ab ca. 2 Stunden inklusive Operator, Anreise, Aufbau und versichertem Betrieb. Der konkrete Preis richtet sich nach Format, Dauer und Programm; Sie erhalten immer ein individuelles Angebot.` },
    { q: `Für welche Locations in ${c.name} eignet sich der Roboter?`, a: c.faqLoc },
    { q: `Wie kurzfristig ist ein Roboter-Auftritt in ${c.name} möglich?`, a: `Fragen Sie idealerweise 2–4 Wochen im Voraus an — besonders in Messewochen sind Termine schnell vergeben. Kurzfristige Anfragen für ${c.name} versuchen wir möglich zu machen; die Anreise ist ${c.country ? 'in der gesamten DACH-Region' : 'deutschlandweit'} organisiert.` },
    { q: 'Ist der Roboter-Auftritt sicher und versichert?', a: 'Ja. Ludwig wird durchgehend von einem erfahrenen Operator begleitet und gesteuert; Ablauf und Sicherheitskonzept werden vorab mit Ihnen geplant. Der Betrieb ist versichert.' },
    { q: 'Spricht der Roboter Deutsch und Englisch?', a: 'Ja — Ludwig interagiert live auf Deutsch und Englisch. Ideal für internationales Messe- und Konferenzpublikum.' },
  ];
}

function cityPage(c) {
  const path = `/roboter-mieten/${c.slug}/`;
  const title = `Roboter mieten in ${c.name} — Event-Roboter für Messen & Events`;
  const desc = `Roboter mieten in ${c.name}: humanoider Event-Roboter (Unitree G1) mit Operator für Messen, Konferenzen & Events. Versichert, ab 2.500 € zzgl. USt. Jetzt anfragen!`;
  const faq = cityFaq(c);
  const nearby = c.nearby.map((s) => cityBySlug[s]).filter(Boolean);

  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${SITE}${path}#service`,
        name: `Humanoiden Roboter mieten in ${c.name}`,
        serviceType: 'Vermietung humanoider Roboter für Events, Messen und Konferenzen',
        provider: { '@type': 'Organization', '@id': `${SITE}/#org`, name: 'Robotollern', url: `${SITE}/`, email: EMAIL },
        areaServed: { '@type': 'City', name: c.name, sameAs: wikiUrl(c.name), containedInPlace: { '@type': 'AdministrativeArea', name: c.state } },
        image: `${SITE}/assets/robots/king.webp`,
        url: `${SITE}${path}`,
        offers: { '@type': 'Offer', priceCurrency: 'EUR', price: '2500', priceSpecification: { '@type': 'PriceSpecification', minPrice: '2500', priceCurrency: 'EUR' }, url: `${SITE}/#contact` },
      },
      faqLd(faq),
      breadcrumbLd([['Start', '/'], ['Roboter mieten', '/roboter-mieten/'], [c.name, null]]),
    ],
  };

  const body = `
${crumbsHtml([['Start', '/'], ['Roboter mieten', '/roboter-mieten/'], [c.name, null]])}
<header class="hero">
  <div class="container hero__grid">
    <div>
      <p class="kicker">Einsatzort · ${esc(c.state)}</p>
      <h1>Humanoiden Roboter in <em>${esc(c.name)}</em> mieten</h1>
      <p class="lead">${esc(c.intro)}</p>
      <div class="hero__cta">
        <a class="btn btn--primary" href="/#contact">Roboter buchen</a>
        <a class="btn btn--ghost" href="#faq">Häufige Fragen</a>
      </div>
      <ul class="chips">
        <li>Operator inklusive</li><li>Versichert</li><li>Deutsch &amp; English</li><li>Ab 2.500 € zzgl. USt.</li>
      </ul>
    </div>
    <div class="hero__img">
      <img src="/assets/robots/king.webp" width="640" height="960" alt="Ludwig II. von Robotollern — humanoider Event-Roboter (Unitree G1) für Events in ${esc(c.name)}" fetchpriority="high">
    </div>
  </div>
</header>

<section class="section">
  <div class="container">
    <p class="kicker">Events in ${esc(c.name)}</p>
    <h2>Ihr Event in ${esc(c.name)} — mit königlichem Hauptdarsteller</h2>
    <div class="intro"><p>${esc(c.scene)}</p></div>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <p class="kicker">Einsatzorte</p>
    <h2>Wo Ludwig in ${esc(c.name)} Hof hält</h2>
    <div class="cards cards--2">
      ${c.venues.map((v) => `<div class="card"><h3>${esc(v.n)}</h3><p>${esc(v.d)}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <p class="kicker">Einsatzbereiche</p>
    <h2>Wofür Sie den Event-Roboter in ${esc(c.name)} buchen können</h2>
    <div class="cards">
      ${USE_CASES.map((u) => `<div class="card"><span class="royal">${esc(u.r)}</span><h3>${esc(u.t)}</h3><p>${esc(u.d)}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <p class="kicker">Leistungsumfang</p>
    <h2>Was die Audienz umfasst</h2>
    <p class="intro">Kein Baukasten mit Sternchen: Jeder Einsatz in ${esc(c.name)} wird individuell auf Ihr Event zugeschnitten — und beinhaltet standardmäßig:</p>
    <ul class="check">
      ${SCOPE.map((s) => `<li>${esc(s)}</li>`).join('\n      ')}
    </ul>
    <p class="price">Einsätze ab 2.500 € zzgl. USt.<small>Das konkrete Angebot richtet sich nach Format, Dauer und Ort. Anreise nach ${esc(c.name)} und Logistik werden im Angebot berücksichtigt.</small></p>
  </div>
</section>

<section class="section">
  <div class="container">
    <p class="kicker">Ablauf</p>
    <h2>So funktioniert die Buchung</h2>
    <div class="steps">
      ${STEPS.map((s) => `<div class="step" data-n="${s.n}"><span class="n">${s.n}</span><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--alt" id="faq">
  <div class="container">
    <p class="kicker">Häufige Fragen</p>
    <h2>Roboter mieten in ${esc(c.name)} — FAQ</h2>
    <div class="faq">
      ${faq.map((f) => `<details><summary>${esc(f.q)}</summary><div><p>${esc(f.a)}</p></div></details>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <p class="kicker">Weitere Einsatzorte</p>
    <h2>Roboter mieten in der Nähe von ${esc(c.name)}</h2>
    <div class="linkrow">
      ${nearby.map((n) => `<a href="/roboter-mieten/${n.slug}/">Roboter mieten in ${esc(n.name)}</a>`).join('\n      ')}
      <a href="/roboter-mieten/">Alle Einsatzorte →</a>
    </div>
    <p class="kicker" style="margin-top:34px">Leistungen</p>
    <div class="linkrow">
      <a href="/preise/">Preise &amp; Pakete</a>
      ${USECASES.map((u) => `<a href="/${u.slug}/">${esc(u.kicker)}</a>`).join('\n      ')}
    </div>
  </div>
</section>

${leadForm('seo-stadt-' + c.slug, c.name)}
${ctaBand(c, true)}`;

  return { path, html: page({ path, title: `${title} | Robotollern`, ogTitle: title, desc, jsonld, body }) };
}

/* ---------- cities hub ---------- */

function hubPage() {
  const path = '/roboter-mieten/';
  const title = 'Roboter mieten — Einsatzorte in 40 Städten (DE, AT, CH)';
  const desc = 'Humanoiden Event-Roboter mieten — in 40 Städten: Berlin, Hamburg, München, Köln, Wien, Zürich u. v. m. Für Messen, Konferenzen & Events. Ab 2.500 € zzgl. USt.';
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage', '@id': `${SITE}${path}#page`, url: `${SITE}${path}`,
        name: title, inLanguage: 'de-DE', isPartOf: { '@id': `${SITE}/#website` },
      },
      {
        '@type': 'ItemList',
        itemListElement: CITIES.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: `Roboter mieten in ${c.name}`, url: `${SITE}/roboter-mieten/${c.slug}/` })),
      },
      breadcrumbLd([['Start', '/'], ['Roboter mieten', null]]),
    ],
  };
  const body = `
${crumbsHtml([['Start', '/'], ['Roboter mieten', null]])}
<header class="hero">
  <div class="container hero__grid">
    <div>
      <p class="kicker">Einsatzorte · DACH</p>
      <h1>Roboter mieten — <em>deutschlandweit</em> und in der DACH-Region</h1>
      <p class="lead">Ludwig II. von Robotollern, der humanoide Event-Roboter (Unitree G1), reist mit Operator und Equipment in jede Stadt Deutschlands — und nach Österreich und in die Schweiz. Hier finden Sie 40 Einsatzorte mit lokalen Details zu Messen, Locations und Formaten.</p>
      <div class="hero__cta">
        <a class="btn btn--primary" href="#anfrage">Roboter buchen</a>
        <a class="btn btn--ghost" href="/blog/">Ratgeber lesen</a>
      </div>
      <ul class="chips"><li>40 Städte · DE, AT, CH</li><li>Operator inklusive</li><li>Versichert</li><li>Ab 2.500 € zzgl. USt.</li></ul>
    </div>
    <div class="hero__img">
      <img src="/assets/robots/walk.webp" width="640" height="960" alt="Humanoider Event-Roboter Ludwig II. läuft — deutschlandweit für Events mietbar" fetchpriority="high">
    </div>
  </div>
</header>

${['DE', 'AT', 'CH'].map((cc, i) => {
  const label = { DE: 'Deutschland', AT: 'Österreich', CH: 'Schweiz' }[cc];
  const list = CITIES.filter((c) => (c.country || 'DE') === cc);
  return `<section class="section${i % 2 ? ' section--alt' : ''}">
  <div class="container">
    <p class="kicker">${label}</p>
    <h2>Roboter mieten in ${label} — ${list.length} Städte</h2>
    <div class="cards">
      ${list.map((c) => `<div class="card"><h3><a href="/roboter-mieten/${c.slug}/">Roboter mieten in ${esc(c.name)}</a></h3><p>${esc(c.state)} · ${esc(c.pop)} Einwohner — u.&nbsp;a. ${esc(c.venues[0].n)}.</p></div>`).join('\n      ')}
    </div>
  </div>
</section>`;
}).join('\n')}

<section class="section">
  <div class="container">
    <p class="kicker">Und darüber hinaus</p>
    <h2>Ihre Stadt ist nicht dabei?</h2>
    <p class="intro">Kein Problem: Ludwig II. ist in der gesamten DACH-Region im Einsatz. Anfahrt und Logistik werden im Angebot individuell berücksichtigt. <a href="#anfrage">Fragen Sie unverbindlich an</a> und schildern Sie Ort und Anlass.</p>
    <p class="kicker" style="margin-top:34px">Leistungen</p>
    <div class="linkrow">
      <a href="/preise/">Preise &amp; Pakete</a>
      ${USECASES.map((u) => `<a href="/${u.slug}/">${esc(u.kicker)}</a>`).join('\n      ')}
    </div>
  </div>
</section>

${leadForm('seo-hub-staedte', null)}
${ctaBand(null, true)}`;
  return { path, html: page({ path, title: `${title} | Robotollern`, ogTitle: title, desc, jsonld, body }) };
}

/* ---------- use-case / service pages ---------- */

function usecasePage(u) {
  const path = `/${u.slug}/`;
  const [h1a, h1em, h1b] = u.h1;
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${SITE}${path}#service`,
        name: u.title,
        serviceType: 'Vermietung humanoider Roboter für Events, Messen und Konferenzen',
        provider: { '@type': 'Organization', '@id': `${SITE}/#org`, name: 'Robotollern', url: `${SITE}/`, email: EMAIL },
        areaServed: [{ '@type': 'Country', name: 'Deutschland' }, { '@type': 'Country', name: 'Österreich' }, { '@type': 'Country', name: 'Schweiz' }],
        image: `${SITE}/assets/robots/king-wave.webp`,
        url: `${SITE}${path}`,
        offers: { '@type': 'Offer', priceCurrency: 'EUR', price: '2500', priceSpecification: { '@type': 'PriceSpecification', minPrice: '2500', priceCurrency: 'EUR' }, url: `${SITE}${path}#anfrage` },
      },
      faqLd(u.faq),
      breadcrumbLd([['Start', '/'], [u.kicker, null]]),
    ],
  };
  const related = u.relatedPosts.map((s) => POSTS.find((p) => p.slug === s)).filter(Boolean);
  const topCities = CITIES.slice(0, 8);
  const body = `
${crumbsHtml([['Start', '/'], [u.kicker, null]])}
<header class="hero">
  <div class="container hero__grid">
    <div>
      <p class="kicker">${esc(u.kicker)}</p>
      <h1>${esc(h1a)}<em>${esc(h1em)}</em>${esc(h1b)}</h1>
      <p class="lead">${esc(u.intro)}</p>
      <div class="hero__cta">
        <a class="btn btn--primary" href="#anfrage">Roboter buchen</a>
        <a class="btn btn--ghost" href="#faq">Häufige Fragen</a>
      </div>
      <ul class="chips">
        <li>Operator inklusive</li><li>Versichert</li><li>Deutsch &amp; English</li><li>Ab 2.500 € zzgl. USt.</li>
      </ul>
    </div>
    <div class="hero__img">
      <img src="/assets/robots/king-wave.webp" width="640" height="960" alt="${esc(u.title)} — Ludwig II. von Robotollern (Unitree G1)" fetchpriority="high">
    </div>
  </div>
</header>

<section class="section">
  <div class="container">
    <p class="kicker">Ihre Vorteile</p>
    <h2>Warum sich der Auftritt rechnet</h2>
    <div class="cards">
      ${u.benefits.map((b) => `<div class="card"><h3>${esc(b.t)}</h3><p>${esc(b.d)}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <p class="kicker">So läuft es ab</p>
    <h2>Vom Erstkontakt zum Auftritt</h2>
    <div class="intro"><p>${esc(u.body)}</p></div>
    <div class="steps">
      ${STEPS.map((s) => `<div class="step" data-n="${s.n}"><span class="n">${s.n}</span><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div>`).join('\n      ')}
    </div>
    <p class="price">Einsätze ab 2.500 € zzgl. USt.<small>Das konkrete Angebot richtet sich nach Format, Dauer und Ort — Operator, Anreise, Technik und Versicherung inklusive. Alle Details: <a href="/preise/">Preise &amp; Pakete</a>.</small></p>
  </div>
</section>

<section class="section" id="faq">
  <div class="container">
    <p class="kicker">Häufige Fragen</p>
    <h2>${esc(u.kicker)} — FAQ</h2>
    <div class="faq">
      ${u.faq.map((f) => `<details><summary>${esc(f.q)}</summary><div><p>${esc(f.a)}</p></div></details>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <p class="kicker">Vertiefen</p>
    <h2>Ratgeber zum Thema</h2>
    <div class="cards">
      ${related.map((r) => `<div class="card postcard"><time datetime="${r.date}">${fmtDate(r.date)}</time><h3><a href="/blog/${r.slug}/">${esc(r.title)}</a></h3><p>${esc(r.excerpt)}</p><span class="more">Weiterlesen →</span></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <p class="kicker">Einsatzorte</p>
    <h2>Verfügbar in Ihrer Stadt</h2>
    <div class="linkrow">
      ${topCities.map((c) => `<a href="/roboter-mieten/${c.slug}/">Roboter mieten in ${esc(c.name)}</a>`).join('\n      ')}
      <a href="/roboter-mieten/">Alle 40 Einsatzorte →</a>
    </div>
  </div>
</section>

${leadForm('seo-leistung-' + u.slug, null)}
${ctaBand(null, true)}`;
  return { path, html: page({ path, title: `${u.title} | Robotollern`, ogTitle: u.title, desc: u.metaDesc, jsonld, body }) };
}

/* ---------- pricing page (/preise/) ---------- */

function pricingPage() {
  const path = '/preise/';
  const title = 'Roboter mieten: Preise & Kosten — ab 2.500 €';
  const desc = 'Was kostet es, einen Roboter zu mieten? Event-Roboter mit Operator ab 2.500 € zzgl. USt. — was enthalten ist, welche Faktoren zählen. Jetzt Angebot anfragen!';
  const faq = [
    { q: 'Was kostet es, einen humanoiden Roboter zu mieten?', a: 'Einsätze beginnen ab 2.500 € zzgl. USt. — der Startpreis für ein kompaktes Format ab ca. 2 Stunden inklusive Operator, Anreise, Aufbau, Technik-Check und versichertem Betrieb. Ganztägige Messe-Einsätze und Show-Formate werden individuell kalkuliert.' },
    { q: 'Was ist im Mietpreis enthalten?', a: 'Immer enthalten: der Roboter in vollem königlichem Ornat, ein geschulter Operator während des gesamten Einsatzes, Anreise, Aufbau, Technik-Check und Abbau, ein abgestimmter Ablauf samt Sicherheitskonzept, Live-Interaktion auf Deutsch und Englisch sowie versicherter Betrieb.' },
    { q: 'Wovon hängt der Preis ab?', a: 'Von fünf Faktoren: Dauer des Einsatzes, Format und Programm (Meet & Greet bis choreografierte Show), Ort und Logistik, Grad der Individualisierung (eigene Texte, Branding, Show-Einlagen) und Termin — Messewochen und Wochenenden sind besonders gefragt.' },
    { q: 'Gibt es versteckte Kosten?', a: 'Nein. Sie erhalten vorab ein individuelles Angebot mit Festpreis — Anreise, Logistik, Operator und Versicherung sind darin bereits berücksichtigt. Es kommt nichts Überraschendes dazu.' },
    { q: 'Lohnt sich der Kauf eines Roboters statt der Miete?', a: 'Für einzelne Events praktisch nie: Ein Unitree G1 kostet in der Anschaffung einen mittleren fünfstelligen Betrag — plus Software, Schulung, Wartung, Versicherung und ein Team für den sicheren Betrieb. Die Miete liefert das komplette Paket zum planbaren Preis pro Einsatz.' },
    { q: 'Wie erhalte ich ein Angebot?', a: 'Schildern Sie Event, Datum und Ort kurz über das Anfrageformular oder per E-Mail an info@robotollern.de — Sie erhalten zeitnah ein individuelles, verbindliches Angebot.' },
  ];
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${SITE}${path}#service`,
        name: 'Humanoiden Event-Roboter mieten — Preise & Pakete',
        serviceType: 'Vermietung humanoider Roboter für Events, Messen und Konferenzen',
        provider: { '@type': 'Organization', '@id': `${SITE}/#org`, name: 'Robotollern', url: `${SITE}/`, email: EMAIL },
        areaServed: [{ '@type': 'Country', name: 'Deutschland' }, { '@type': 'Country', name: 'Österreich' }, { '@type': 'Country', name: 'Schweiz' }],
        image: `${SITE}/assets/robots/king.webp`,
        url: `${SITE}${path}`,
        offers: {
          '@type': 'Offer', priceCurrency: 'EUR', price: '2500',
          priceSpecification: { '@type': 'PriceSpecification', minPrice: '2500', priceCurrency: 'EUR', valueAddedTaxIncluded: false },
          availability: 'https://schema.org/InStock', url: `${SITE}${path}#anfrage`,
        },
      },
      faqLd(faq),
      breadcrumbLd([['Start', '/'], ['Preise', null]]),
    ],
  };
  const costPost = POSTS.find((p) => p.slug === 'humanoiden-roboter-mieten-kosten');
  const related = ['humanoiden-roboter-mieten-kosten', 'roboter-verleih-deutschland-guide', 'roboter-vs-klassische-showacts']
    .map((s) => POSTS.find((p) => p.slug === s)).filter(Boolean);
  const topCities = CITIES.slice(0, 8);
  const body = `
${crumbsHtml([['Start', '/'], ['Preise', null]])}
<header class="hero">
  <div class="container hero__grid">
    <div>
      <p class="kicker">Preise &amp; Pakete</p>
      <h1>Roboter mieten: <em>Preise</em> &amp; Leistungen</h1>
      <p class="lead">Keine Preisliste mit Sternchen, keine versteckten Posten: Einsätze von Ludwig II. beginnen ab 2.500 € zzgl. USt. — inklusive Operator, Anreise, Technik und Versicherung. Hier sehen Sie, was Sie fürs Budget bekommen und wovon der Preis abhängt.</p>
      <div class="hero__cta">
        <a class="btn btn--primary" href="#anfrage">Individuelles Angebot anfragen</a>
        <a class="btn btn--ghost" href="#faq">Häufige Fragen</a>
      </div>
      <ul class="chips">
        <li>Operator inklusive</li><li>Versichert</li><li>Anreise inklusive</li><li>Festpreis-Angebot</li>
      </ul>
    </div>
    <div class="hero__img">
      <img src="/assets/robots/king.webp" width="640" height="960" alt="Humanoiden Event-Roboter mieten — Ludwig II. von Robotollern (Unitree G1), Preise ab 2.500 €" fetchpriority="high">
    </div>
  </div>
</header>

<section class="section">
  <div class="container">
    <p class="kicker">Preisübersicht</p>
    <h2>Formate &amp; Preise auf einen Blick</h2>
    <div class="cards">
      <div class="card"><span class="royal">Ab 2.500 € zzgl. USt.</span><h3>Kompakter Auftritt</h3><p>Ab ca. 2 Stunden: Meet &amp; Greet, Gästebegrüßung, Foto-Momente — ideal für Firmenfeiern, Eröffnungen und Empfänge. Operator, Anreise, Aufbau und Versicherung inklusive.</p></div>
      <div class="card"><span class="royal">Individuelles Angebot</span><h3>Messetag</h3><p>Ganztägiger Standbetrieb mit geplanten Aktivphasen und Akku-Wechseln — der Standmagnet für Messen und Kongresse. Kalkulation nach Laufzeit und Programm.</p></div>
      <div class="card"><span class="royal">Individuelles Angebot</span><h3>Show, Launch &amp; Sonderformate</h3><p>Choreografierte Bühnenmomente, Produktenthüllungen, individuelle Texte und Branding — je nach Drehbuch und Vorbereitung kalkuliert.</p></div>
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <p class="kicker">Leistungsumfang</p>
    <h2>Das ist immer im Preis enthalten</h2>
    <p class="intro">Sie mieten keinen Roboter „im Karton“, sondern einen betreuten Auftritt. Jeder Einsatz beinhaltet standardmäßig:</p>
    <ul class="check">
      ${SCOPE.map((s) => `<li>${esc(s)}</li>`).join('\n      ')}
    </ul>
    <p class="price">Einsätze ab 2.500 € zzgl. USt.<small>Sie erhalten vorab ein individuelles Angebot mit Festpreis — es kommt nichts Überraschendes dazu.</small></p>
  </div>
</section>

<section class="section">
  <div class="container">
    <p class="kicker">Preisfaktoren</p>
    <h2>Wovon der Preis abhängt</h2>
    <div class="cards">
      <div class="card"><h3>Dauer</h3><p>Ein zweistündiger Highlight-Auftritt kostet weniger als ein ganzer Messetag. Aktivphasen und kurze Akku-Wechsel werden gemeinsam geplant.</p></div>
      <div class="card"><h3>Format &amp; Programm</h3><p>Freies Meet &amp; Greet, moderierte Bühnenshow oder choreografierter Launch — je individueller das Drehbuch, desto mehr Vorbereitung.</p></div>
      <div class="card"><h3>Ort &amp; Logistik</h3><p>Anfahrt und Aufbau sind im Angebot berücksichtigt — deutschlandweit sowie in Österreich und der Schweiz.</p></div>
      <div class="card"><h3>Individualisierung</h3><p>Eigene Begrüßungstexte, Branding-Elemente oder abgestimmte Show-Einlagen erhöhen Aufwand — und Wirkung.</p></div>
      <div class="card"><h3>Termin</h3><p>Messewochen und Wochenenden sind schnell vergeben. Wer 2–4 Wochen im Voraus anfragt, hat die beste Auswahl.</p></div>
      <div class="card"><h3>Mieten statt kaufen</h3><p>Anschaffung, Software, Schulung, Wartung und Team kosten ein Vielfaches — für Events ist die Miete der planbare Weg.</p></div>
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <p class="kicker">Ablauf</p>
    <h2>Vom Budget zum Angebot in drei Schritten</h2>
    <div class="steps">
      ${STEPS.map((s) => `<div class="step" data-n="${s.n}"><span class="n">${s.n}</span><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div>`).join('\n      ')}
    </div>
    ${costPost ? `<p class="intro">Tiefer einsteigen? Der Ratgeber <a href="/blog/${costPost.slug}/">${esc(costPost.title)}</a> erklärt alle Kostenpunkte im Detail.</p>` : ''}
  </div>
</section>

<section class="section" id="faq">
  <div class="container">
    <p class="kicker">Häufige Fragen</p>
    <h2>Preise &amp; Kosten — FAQ</h2>
    <div class="faq">
      ${faq.map((f) => `<details><summary>${esc(f.q)}</summary><div><p>${esc(f.a)}</p></div></details>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <p class="kicker">Vertiefen</p>
    <h2>Ratgeber zum Thema Kosten &amp; Planung</h2>
    <div class="cards">
      ${related.map((r) => `<div class="card postcard"><time datetime="${r.date}">${fmtDate(r.date)}</time><h3><a href="/blog/${r.slug}/">${esc(r.title)}</a></h3><p>${esc(r.excerpt)}</p><span class="more">Weiterlesen →</span></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <p class="kicker">Einsatzorte</p>
    <h2>Gleicher Startpreis — in Ihrer Stadt</h2>
    <div class="linkrow">
      ${topCities.map((c) => `<a href="/roboter-mieten/${c.slug}/">Roboter mieten in ${esc(c.name)}</a>`).join('\n      ')}
      <a href="/roboter-mieten/">Alle 40 Einsatzorte →</a>
    </div>
    <p class="kicker" style="margin-top:34px">Leistungen</p>
    <div class="linkrow">
      ${USECASES.map((u) => `<a href="/${u.slug}/">${esc(u.kicker)}</a>`).join('\n      ')}
    </div>
  </div>
</section>

${leadForm('seo-preise', null)}
${ctaBand(null, true)}`;
  return { path, html: page({ path, title: `${title} | Robotollern`, ogTitle: title, desc, jsonld, body }) };
}

/* ---------- Unitree G1 model page (/unitree-g1-mieten/) ---------- */

function unitreePage() {
  const path = '/unitree-g1-mieten/';
  const title = 'Unitree G1 mieten — mit Operator, Show-Charakter & Versicherung';
  const desc = 'Unitree G1 mieten für Messen & Events: der humanoide Roboter als Ludwig II. — mit Operator, versichert, Deutsch & Englisch. Ab 2.500 € zzgl. USt. Jetzt anfragen!';
  const faq = [
    { q: 'Kann man einen Unitree G1 in Deutschland mieten?', a: 'Ja — bei Robotollern mieten Sie den Unitree G1 als betreuten Auftritt: Roboter im königlichen Ornat, geschulter Operator, Anreise, Sicherheitskonzept und versicherter Betrieb. Einsätze ab 2.500 € zzgl. USt., deutschlandweit sowie in Österreich und der Schweiz.' },
    { q: 'Wie groß ist der Unitree G1?', a: 'Rund 1,30 m — groß genug für Bühnenpräsenz, kompakt genug für sichere Interaktion im Publikum und den Einsatz auf normalen Messeständen.' },
    { q: 'Läuft der G1 wirklich frei auf zwei Beinen?', a: 'Ja. Der G1 geht dynamisch, dreht sich, balanciert und zeigt Show-Bewegungen — durchgehend begleitet und gesteuert von einem erfahrenen Operator.' },
    { q: 'Wie lange hält der Akku bei einem Event?', a: '1,5–2 Stunden aktiver Betrieb; der Wechsel dauert nur Minuten und wird bei längeren Events als kurze Programmpause eingeplant.' },
    { q: 'Warum mieten statt kaufen?', a: 'Ein G1 kostet in der Anschaffung einen mittleren fünfstelligen Betrag — plus Software, Schulung, Wartung, Versicherung und ein Team für den Betrieb. Die Miete liefert den fertigen Auftritt mit Charakter, Operator und Versicherung zum planbaren Preis pro Einsatz.' },
    { q: 'Spricht der Roboter mit den Gästen?', a: 'Ja — KI-gesteuert, live auf Deutsch und Englisch, immer im Charakter des Königs. Die Kennzeichnung erfolgt gemäß EU AI Act (Art. 50): Gäste wissen, dass sie mit einer KI sprechen.' },
  ];
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${SITE}${path}#service`,
        name: 'Unitree G1 mieten — humanoider Event-Roboter mit Operator',
        serviceType: 'Vermietung humanoider Roboter (Unitree G1) für Events, Messen und Konferenzen',
        provider: { '@type': 'Organization', '@id': `${SITE}/#org`, name: 'Robotollern', url: `${SITE}/`, email: EMAIL },
        areaServed: [{ '@type': 'Country', name: 'Deutschland' }, { '@type': 'Country', name: 'Österreich' }, { '@type': 'Country', name: 'Schweiz' }],
        image: `${SITE}/assets/robots/walk.webp`,
        url: `${SITE}${path}`,
        offers: {
          '@type': 'Offer', priceCurrency: 'EUR', price: '2500',
          priceSpecification: { '@type': 'PriceSpecification', minPrice: '2500', priceCurrency: 'EUR', valueAddedTaxIncluded: false },
          availability: 'https://schema.org/InStock', url: `${SITE}${path}#anfrage`,
        },
      },
      faqLd(faq),
      breadcrumbLd([['Start', '/'], ['Unitree G1 mieten', null]]),
    ],
  };
  const g1Post = POSTS.find((p) => p.slug === 'unitree-g1-event-einsatz');
  const related = ['unitree-g1-event-einsatz', 'humanoiden-roboter-mieten-kosten', 'roboter-vs-klassische-showacts']
    .map((s) => POSTS.find((p) => p.slug === s)).filter(Boolean);
  const topCities = CITIES.slice(0, 8);
  const body = `
${crumbsHtml([['Start', '/'], ['Unitree G1 mieten', null]])}
<header class="hero">
  <div class="container hero__grid">
    <div>
      <p class="kicker">Die Plattform · Unitree G1</p>
      <h1><em>Unitree G1</em> mieten — als König, nicht als Karton</h1>
      <p class="lead">Der Unitree G1 gehört zu den fortschrittlichsten humanoiden Robotern, die kommerziell verfügbar sind. Bei Robotollern mieten Sie ihn nicht als nackte Technik, sondern als fertigen Auftritt: Ludwig II. — mit Charakter, Operator, Sicherheitskonzept und Versicherung.</p>
      <div class="hero__cta">
        <a class="btn btn--primary" href="#anfrage">G1 für Ihr Event anfragen</a>
        <a class="btn btn--ghost" href="#faq">Häufige Fragen</a>
      </div>
      <ul class="chips">
        <li>Ca. 1,30 m · zweibeinig</li><li>Deutsch &amp; English</li><li>Operator inklusive</li><li>Ab 2.500 € zzgl. USt.</li>
      </ul>
    </div>
    <div class="hero__img">
      <img src="/assets/robots/walk.webp" width="640" height="960" alt="Unitree G1 mieten — humanoider Roboter Ludwig II. von Robotollern läuft frei" fetchpriority="high">
    </div>
  </div>
</header>

<section class="section">
  <div class="container">
    <p class="kicker">Technik im Überblick</p>
    <h2>Was der Unitree G1 auf Ihrem Event leistet</h2>
    <div class="cards">
      <div class="card"><h3>Freies Gehen</h3><p>Dynamisch auf zwei Beinen: gehen, drehen, balancieren, Show-Moves — kein Roboter auf Rollen, sondern ein Auftritt, der lebendig wirkt.</p></div>
      <div class="card"><h3>Live-Interaktion</h3><p>KI-gesteuerte Gespräche auf Deutsch und Englisch — Begrüßung, Fragen, Komplimente, immer im Charakter des Königs. Gekennzeichnet gemäß EU AI Act.</p></div>
      <div class="card"><h3>Foto- &amp; Video-Momente</h3><p>Posiert mit Gästen, winkt in Kameras und liefert die Clips, die Ihr Event viral machen.</p></div>
      <div class="card"><h3>Ca. 1,30 m Größe</h3><p>Groß genug für Bühnenpräsenz, kompakt genug für sichere Interaktion im Publikum und normale Messestände.</p></div>
      <div class="card"><h3>1,5–2 Std. Akku</h3><p>Aktiver Betrieb pro Ladung; Wechsel in Minuten — bei längeren Events als kurze Programmpause eingeplant.</p></div>
      <div class="card"><h3>Sicher &amp; versichert</h3><p>Erfahrener Operator, Sicherheitskonzept für Ihre Fläche, versicherter Betrieb — Betriebsgrundlage, keine Nebensache.</p></div>
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <p class="kicker">Der Unterschied</p>
    <h2>Nackte Hardware mieten — oder einen Auftritt buchen?</h2>
    <div class="intro"><p>Einen G1 „im Karton“ zu mieten bringt Ihrem Event nichts: Ohne Charakter, Drehbuch und geschulten Operator steht da nur Technik. Robotollern liefert das Gesamtpaket — Ludwig II. von Robotollern, den König unter den Event-Robotern: mit Krone, Umhang, königlicher Laune und einem Team, das Ablauf und Sicherheit im Griff hat. ${g1Post ? `Einen ehrlichen Blick auf Fähigkeiten und Grenzen der Plattform gibt der Ratgeber <a href="/blog/${g1Post.slug}/">${esc(g1Post.title)}</a>.` : ''}</p></div>
    <ul class="check">
      ${SCOPE.map((s) => `<li>${esc(s)}</li>`).join('\n      ')}
    </ul>
    <p class="price">Einsätze ab 2.500 € zzgl. USt.<small>Alle Details: <a href="/preise/">Preise &amp; Pakete</a>. Das konkrete Angebot richtet sich nach Format, Dauer und Ort.</small></p>
  </div>
</section>

<section class="section">
  <div class="container">
    <p class="kicker">Ablauf</p>
    <h2>So kommt der G1 auf Ihr Event</h2>
    <div class="steps">
      ${STEPS.map((s) => `<div class="step" data-n="${s.n}"><span class="n">${s.n}</span><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--alt" id="faq">
  <div class="container">
    <p class="kicker">Häufige Fragen</p>
    <h2>Unitree G1 mieten — FAQ</h2>
    <div class="faq">
      ${faq.map((f) => `<details><summary>${esc(f.q)}</summary><div><p>${esc(f.a)}</p></div></details>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <p class="kicker">Vertiefen</p>
    <h2>Ratgeber zur Plattform</h2>
    <div class="cards">
      ${related.map((r) => `<div class="card postcard"><time datetime="${r.date}">${fmtDate(r.date)}</time><h3><a href="/blog/${r.slug}/">${esc(r.title)}</a></h3><p>${esc(r.excerpt)}</p><span class="more">Weiterlesen →</span></div>`).join('\n      ')}
    </div>
    <p class="kicker" style="margin-top:34px">Einsatzorte</p>
    <div class="linkrow">
      ${topCities.map((c) => `<a href="/roboter-mieten/${c.slug}/">Roboter mieten in ${esc(c.name)}</a>`).join('\n      ')}
      <a href="/roboter-mieten/">Alle 40 Einsatzorte →</a>
    </div>
  </div>
</section>

${leadForm('seo-unitree-g1', null)}
${ctaBand(null, true)}`;
  return { path, html: page({ path, title: `${title} | Robotollern`, ogTitle: title, desc, jsonld, body }) };
}

/* ---------- blog ---------- */

const fmtDate = (iso) => new Date(iso + 'T12:00:00Z').toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });

function postPage(p, all) {
  const path = `/blog/${p.slug}/`;
  const related = all.filter((x) => x.slug !== p.slug).slice(0, 3);
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${SITE}${path}#post`,
        headline: p.title,
        description: p.metaDesc,
        datePublished: p.date,
        dateModified: p.date,
        inLanguage: 'de-DE',
        image: `${SITE}/og.jpg`,
        wordCount: wordCount(p.html),
        articleSection: 'Events & Robotik',
        timeRequired: `PT${p.readMin}M`,
        author: { '@type': 'Organization', name: 'Robotollern', url: `${SITE}/` },
        publisher: ORG_REF,
        isPartOf: { '@id': `${SITE}/blog/#blog` },
        mainEntityOfPage: `${SITE}${path}`,
      },
      faqLd(p.faq),
      breadcrumbLd([['Start', '/'], ['Blog', '/blog/'], [p.title, null]]),
    ],
  };
  const body = `
${crumbsHtml([['Start', '/'], ['Blog', '/blog/'], [p.title, null]])}
<header class="hero">
  <div class="container">
    <p class="kicker">Blog &amp; Ratgeber</p>
    <h1>${esc(p.title)}</h1>
    <div class="meta-row"><time datetime="${p.date}">${fmtDate(p.date)}</time><span>${p.readMin} Min. Lesezeit</span><span>Robotollern Redaktion</span></div>
  </div>
</header>
<article class="container prose">
${p.html}
</article>
<section class="section" id="faq">
  <div class="container">
    <p class="kicker">Häufige Fragen</p>
    <h2>FAQ zum Thema</h2>
    <div class="faq">
      ${p.faq.map((f) => `<details><summary>${esc(f.q)}</summary><div><p>${esc(f.a)}</p></div></details>`).join('\n      ')}
    </div>
  </div>
</section>
<section class="section section--alt">
  <div class="container">
    <p class="kicker">Weiterlesen</p>
    <h2>Das könnte Sie auch interessieren</h2>
    <div class="cards">
      ${related.map((r) => `<div class="card postcard"><time datetime="${r.date}">${fmtDate(r.date)}</time><h3><a href="/blog/${r.slug}/">${esc(r.title)}</a></h3><p>${esc(r.excerpt)}</p><span class="more">Weiterlesen →</span></div>`).join('\n      ')}
    </div>
  </div>
</section>
${ctaBand(null)}`;
  return { path, html: page({ path, title: `${p.title} | Robotollern Blog`, ogTitle: p.title, desc: p.metaDesc, jsonld, body, ogType: 'article', article: { published: p.date, modified: p.date } }) };
}

function blogHub() {
  const path = '/blog/';
  const title = 'Blog & Ratgeber: Humanoide Roboter auf Events, Messen & Konferenzen';
  const desc = 'Ratgeber rund um Event-Roboter: Kosten, Messe-Strategien, Einsatzideen, Technik und Planung. Praxiswissen vom Team hinter Ludwig II. von Robotollern.';
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog', '@id': `${SITE}${path}#blog`, url: `${SITE}${path}`, name: 'Robotollern Blog',
        inLanguage: 'de-DE', publisher: ORG_REF,
        blogPost: POSTS.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${SITE}/blog/${p.slug}/`, datePublished: p.date })),
      },
      breadcrumbLd([['Start', '/'], ['Blog', null]]),
    ],
  };
  const body = `
${crumbsHtml([['Start', '/'], ['Blog', null]])}
<header class="hero">
  <div class="container">
    <p class="kicker">Blog &amp; Ratgeber</p>
    <h1>Wissen vom Hof: <em>Roboter auf Events</em></h1>
    <p class="lead">Kosten, Messe-Strategien, Einsatzideen und Planung — Praxiswissen rund um humanoide Roboter auf Events, Messen und Konferenzen. Vom Team hinter Ludwig II. von Robotollern.</p>
  </div>
</header>
<section class="section">
  <div class="container">
    <div class="cards">
      ${POSTS.map((p) => `<div class="card postcard"><time datetime="${p.date}">${fmtDate(p.date)}</time><h3><a href="/blog/${p.slug}/">${esc(p.title)}</a></h3><p>${esc(p.excerpt)}</p><span class="more">Weiterlesen →</span></div>`).join('\n      ')}
    </div>
  </div>
</section>
${ctaBand(null)}`;
  return { path, html: page({ path, title: `${title} | Robotollern`, ogTitle: title, desc, jsonld, body }) };
}

/* ---------- sitemap + robots ---------- */

function sitemap() {
  const urls = [
    { loc: '/', pri: '1.0', freq: 'weekly', img: '/og.jpg', imgTitle: 'Humanoiden Roboter mieten — Ludwig II. von Robotollern' },
    { loc: '/roboter-mieten/', pri: '0.9', freq: 'weekly', img: '/assets/robots/walk.webp', imgTitle: 'Event-Roboter mieten — 40 Einsatzorte in DE, AT, CH' },
    { loc: '/preise/', pri: '0.9', freq: 'monthly', img: '/assets/robots/king.webp', imgTitle: 'Roboter mieten — Preise ab 2.500 € zzgl. USt.' },
    { loc: '/unitree-g1-mieten/', pri: '0.9', freq: 'monthly', img: '/assets/robots/walk.webp', imgTitle: 'Unitree G1 mieten — humanoider Event-Roboter mit Operator' },
    ...USECASES.map((u) => ({ loc: `/${u.slug}/`, pri: '0.9', freq: 'monthly', img: '/assets/robots/king-wave.webp', imgTitle: u.title })),
    ...CITIES.map((c) => ({ loc: `/roboter-mieten/${c.slug}/`, pri: '0.8', freq: 'monthly', img: '/assets/robots/king.webp', imgTitle: `Roboter mieten in ${c.name}` })),
    { loc: '/blog/', pri: '0.7', freq: 'weekly' },
    ...POSTS.map((p) => ({ loc: `/blog/${p.slug}/`, pri: '0.7', freq: 'monthly', lastmod: p.date })),
  ];
  const urlXml = (u) => {
    const img = u.img
      ? `<image:image><image:loc>${SITE}${u.img}</image:loc><image:title>${esc(u.imgTitle)}</image:title></image:image>`
      : '';
    return `  <url><loc>${SITE}${u.loc}</loc><lastmod>${u.lastmod || TODAY}</lastmod><changefreq>${u.freq}</changefreq><priority>${u.pri}</priority>${img}</url>`;
  };
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(urlXml).join('\n')}
</urlset>
`;
}

/* robots.txt — alles offen; Such- und KI-Crawler ausdrücklich willkommen
   (Sichtbarkeit in AI Overviews, ChatGPT, Claude, Perplexity & Co.). */
const ROBOTS = `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: ${SITE}/sitemap.xml

# Kompaktübersicht für KI-Assistenten: ${SITE}/llms.txt
`;

/* ---------- RSS-Feed (/feed.xml) — Blog-Distribution + Discovery ---------- */

function rssFeed() {
  const rfc822 = (iso) => new Date(iso + 'T12:00:00Z').toUTCString();
  const items = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1)).map((p) => `  <item>
    <title>${esc(p.title)}</title>
    <link>${SITE}/blog/${p.slug}/</link>
    <guid isPermaLink="true">${SITE}/blog/${p.slug}/</guid>
    <pubDate>${rfc822(p.date)}</pubDate>
    <description>${esc(p.excerpt)}</description>
  </item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Robotollern Blog — Event-Roboter Ratgeber</title>
  <link>${SITE}/blog/</link>
  <description>Kosten, Messe-Strategien, Einsatzideen und Planung — Praxiswissen rund um humanoide Roboter auf Events, Messen und Konferenzen.</description>
  <language>de-DE</language>
  <lastBuildDate>${rfc822(TODAY)}</lastBuildDate>
  <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
</channel>
</rss>
`;
}

/* ---------- 404-Seite ---------- */

function notFoundPage() {
  const path = '/404.html';
  const body = `
<header class="hero">
  <div class="container">
    <p class="kicker">Fehler 404</p>
    <h1>Diese Seite hält gerade <em>keinen Hof</em></h1>
    <p class="lead">Die angefragte Adresse existiert nicht (mehr). Kein Grund zur Sorge — der König empfängt Sie gern an anderer Stelle:</p>
    <div class="hero__cta">
      <a class="btn btn--primary" href="/">Zur Startseite</a>
      <a class="btn btn--ghost" href="/#contact">Roboter buchen</a>
    </div>
  </div>
</header>
<section class="section">
  <div class="container">
    <p class="kicker">Beliebte Seiten</p>
    <h2>Vielleicht suchen Sie das hier?</h2>
    <div class="linkrow">
      <a href="/roboter-mieten/">Alle Einsatzorte</a>
      <a href="/preise/">Preise &amp; Pakete</a>
      <a href="/messe-roboter/">Messe-Roboter mieten</a>
      <a href="/event-roboter/">Event-Roboter mieten</a>
      <a href="/blog/">Blog &amp; Ratgeber</a>
    </div>
    <p class="kicker" style="margin-top:34px">Top-Städte</p>
    <div class="linkrow">
      ${CITIES.slice(0, 6).map((c) => `<a href="/roboter-mieten/${c.slug}/">Roboter mieten in ${esc(c.name)}</a>`).join('\n      ')}
    </div>
  </div>
</section>
${ctaBand(null)}`;
  return page({
    path, noindex: true, body,
    title: 'Seite nicht gefunden (404) | Ludwig II. von Robotollern',
    desc: 'Diese Seite existiert nicht. Hier geht es zurück zu Einsatzorten, Preisen und dem Ratgeber von Robotollern.',
    jsonld: { '@context': 'https://schema.org', '@graph': [] },
  });
}

/* ---------- write everything ---------- */

const LLMS_TXT = `# Ludwig II. von Robotollern — robotollern.de

> Vermietung humanoider Event-Roboter (Unitree G1) mit Operator für Messen,
> Konferenzen und Firmenevents in Deutschland, Österreich und der Schweiz.
> Einsätze ab 2.500 € zzgl. USt. Kontakt: ${EMAIL}

## Preise
- [Preise & Pakete — Einsätze ab 2.500 € zzgl. USt., Operator & Versicherung inklusive](${SITE}/preise/)

## Leistungen
- [Unitree G1 mieten — humanoider Roboter mit Operator & Versicherung](${SITE}/unitree-g1-mieten/)
${USECASES.map((u) => `- [${u.title}](${SITE}/${u.slug}/)`).join('\n')}

## Einsatzorte
- [Alle 40 Städte](${SITE}/roboter-mieten/)
${CITIES.map((c) => `- [Roboter mieten in ${c.name}](${SITE}/roboter-mieten/${c.slug}/)`).join('\n')}

## Ratgeber
- [RSS-Feed](${SITE}/feed.xml)
${POSTS.map((p) => `- [${p.title}](${SITE}/blog/${p.slug}/)`).join('\n')}

## Fakten
- Roboter: Unitree G1, humanoid, ca. 1,30 m, spricht Deutsch und Englisch
- Immer inklusive: geschulter Operator, Anreise, Aufbau, Sicherheitskonzept, versicherter Betrieb
- Preis: ab 2.500 € zzgl. USt. (kompaktes Format ab ca. 2 Stunden), individuelles Festpreis-Angebot
- Einsatzgebiet: Deutschland, Österreich, Schweiz (DACH)
- Zielgruppe: B2B — Messen, Konferenzen, Firmenevents, Produktlaunches, Premium-Feiern
`;

const pages = [hubPage(), ...CITIES.map(cityPage), ...USECASES.map(usecasePage), pricingPage(), unitreePage(), blogHub(), ...POSTS.map((p) => postPage(p, POSTS))];
for (const { path, html } of pages) {
  const file = join(ROOT, path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}
writeFileSync(join(ROOT, 'sitemap.xml'), sitemap());
writeFileSync(join(ROOT, 'robots.txt'), ROBOTS);
writeFileSync(join(ROOT, 'llms.txt'), LLMS_TXT);
writeFileSync(join(ROOT, 'feed.xml'), rssFeed());
writeFileSync(join(ROOT, '404.html'), notFoundPage());
console.log(`Generated ${pages.length} pages + sitemap.xml + robots.txt + llms.txt + feed.xml + 404.html`);
