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
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CITIES } from './cities.mjs';
import { POSTS } from './blog.mjs';
import { USECASES } from './usecases.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SITE = 'https://robotollern.de';
const BRAND = 'Ludwig II. von Robotollern';
const EMAIL = 'info@robotollern.de';
const TODAY = '2026-07-14';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const cityBySlug = Object.fromEntries(CITIES.map((c) => [c.slug, c]));

/* ---------- shared building blocks ---------- */

const NAV = `
<a href="#main" class="skip-link">Zum Inhalt springen</a>
<nav class="nav" aria-label="Hauptnavigation">
  <div class="nav__in">
    <a class="nav__brand" href="/">Ludwig II<span class="dot">.</span></a>
    <div class="nav__links">
      <a href="/">Start</a>
      <a href="/roboter-mieten/">Einsatzorte</a>
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

function page({ path, title, desc, ogTitle, jsonld, body }) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
<meta name="theme-color" content="#0A0A0A">
<link rel="canonical" href="${SITE}${path}">
<link rel="stylesheet" href="/assets/seo.css">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE}${path}">
<meta property="og:site_name" content="${esc(BRAND)}">
<meta property="og:title" content="${esc(ogTitle || title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE}/og.jpg">
<meta property="og:locale" content="de_DE">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${SITE}/og.jpg">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body>
${NAV}
<main id="main">
${body}
</main>
${footer()}
${LEAD_JS}
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
  const title = `Roboter mieten in ${c.name} — humanoider Event-Roboter für Messen & Events`;
  const desc = `Humanoiden Roboter in ${c.name} mieten: Event-Roboter Ludwig II. (Unitree G1) für Messen, Konferenzen & Firmenevents in ${c.name}. Mit Operator, versichert, ab 2.500 € zzgl. USt.`;
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
        areaServed: { '@type': 'City', name: c.name, containedInPlace: { '@type': 'AdministrativeArea', name: c.state } },
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
      ${STEPS.map((s) => `<div class="step"><span class="n">${s.n}</span><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div>`).join('\n      ')}
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
  const title = 'Roboter mieten — Einsatzorte: humanoider Event-Roboter in 40 Städten (DE, AT, CH)';
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
      ${STEPS.map((s) => `<div class="step"><span class="n">${s.n}</span><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div>`).join('\n      ')}
    </div>
    <p class="price">Einsätze ab 2.500 € zzgl. USt.<small>Das konkrete Angebot richtet sich nach Format, Dauer und Ort — Operator, Anreise, Technik und Versicherung inklusive.</small></p>
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
        author: { '@type': 'Organization', name: 'Robotollern', url: `${SITE}/` },
        publisher: ORG_REF,
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
  return { path, html: page({ path, title: `${p.title} | Robotollern Blog`, ogTitle: p.title, desc: p.metaDesc, jsonld, body }) };
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

function sitemap(paths) {
  const urls = [
    { loc: '/', pri: '1.0', freq: 'weekly' },
    { loc: '/roboter-mieten/', pri: '0.9', freq: 'weekly' },
    ...USECASES.map((u) => ({ loc: `/${u.slug}/`, pri: '0.9', freq: 'monthly' })),
    ...CITIES.map((c) => ({ loc: `/roboter-mieten/${c.slug}/`, pri: '0.8', freq: 'monthly' })),
    { loc: '/blog/', pri: '0.7', freq: 'weekly' },
    ...POSTS.map((p) => ({ loc: `/blog/${p.slug}/`, pri: '0.7', freq: 'monthly' })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u.loc}</loc><lastmod>${TODAY}</lastmod><changefreq>${u.freq}</changefreq><priority>${u.pri}</priority></url>`).join('\n')}
</urlset>
`;
}

const ROBOTS = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

/* ---------- write everything ---------- */

const LLMS_TXT = `# Ludwig II. von Robotollern — robotollern.de

> Vermietung humanoider Event-Roboter (Unitree G1) mit Operator für Messen,
> Konferenzen und Firmenevents in Deutschland, Österreich und der Schweiz.
> Einsätze ab 2.500 € zzgl. USt. Kontakt: ${EMAIL}

## Leistungen
${USECASES.map((u) => `- [${u.title}](${SITE}/${u.slug}/)`).join('\n')}

## Einsatzorte
- [Alle 40 Städte](${SITE}/roboter-mieten/)
${CITIES.slice(0, 10).map((c) => `- [Roboter mieten in ${c.name}](${SITE}/roboter-mieten/${c.slug}/)`).join('\n')}

## Ratgeber
${POSTS.map((p) => `- [${p.title}](${SITE}/blog/${p.slug}/)`).join('\n')}
`;

const pages = [hubPage(), ...CITIES.map(cityPage), ...USECASES.map(usecasePage), blogHub(), ...POSTS.map((p) => postPage(p, POSTS))];
for (const { path, html } of pages) {
  const file = join(ROOT, path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}
writeFileSync(join(ROOT, 'sitemap.xml'), sitemap());
writeFileSync(join(ROOT, 'robots.txt'), ROBOTS);
writeFileSync(join(ROOT, 'llms.txt'), LLMS_TXT);
console.log(`Generated ${pages.length} pages + sitemap.xml + robots.txt + llms.txt`);
