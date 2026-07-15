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
import { OCCASIONS } from './occasions.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SITE = 'https://robotollern.de';
const BRAND = 'Ludwig II. von Robotollern';
const EMAIL = 'info@robotollern.de';
const TODAY = '2026-07-14';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const cityBySlug = Object.fromEntries(CITIES.map((c) => [c.slug, c]));
const postBySlug = Object.fromEntries(POSTS.map((p) => [p.slug, p]));

/* deterministische Rotation: verteilt interne Links gleichmäßig über alle Seiten */
const rot = (arr, start, n) => Array.from({ length: Math.min(n, arr.length) }, (_, k) => arr[((start % arr.length) + arr.length + k) % arr.length]);

/* Kurztitel für Footer-/Linklisten */
const POST_SHORT = {
  'humanoiden-roboter-mieten-kosten': 'Kosten & Preise 2026',
  'roboter-auf-messen-standmagnet': 'Roboter auf Messen',
  'event-roboter-ideen-konferenzen': 'Ideen für Konferenzen',
  'unitree-g1-event-einsatz': 'Unitree G1 im Einsatz',
  'roboter-event-planen-checkliste': 'Planungs-Checkliste',
};
const postShort = (p) => POST_SHORT[p.slug] || p.title;

/* ---------- shared building blocks ---------- */

const NAV = `
<a href="#main" class="skip-link">Zum Inhalt springen</a>
<nav class="nav" aria-label="Hauptnavigation">
  <div class="nav__in">
    <a class="nav__brand" href="/">Ludwig II<span class="dot">.</span></a>
    <div class="nav__links">
      <a href="/">Start</a>
      <a href="/roboter-mieten/">Einsatzorte</a>
      <a href="/event-roboter/">Anlässe</a>
      <a href="/blog/">Blog</a>
      <a href="/#faq">FAQ</a>
      <a class="btn btn--primary btn--sm" href="/#contact">Roboter buchen</a>
    </div>
  </div>
</nav>`;

function footer(pageIdx = 0) {
  /* Städte-Auswahl rotiert pro Seite → jede Stadt bekommt Footer-Links von
     vielen verschiedenen Seiten (gleichmäßige interne Verlinkung). */
  const cities = rot(CITIES, pageIdx * 3, 6);
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
        <ul>${cities.map((c) => `<li><a href="/roboter-mieten/${c.slug}/">${esc(c.name)}</a></li>`).join('')}
        <li><a href="/roboter-mieten/">Alle Einsatzorte →</a></li></ul>
      </div>
      <div>
        <h4>Nach Anlass</h4>
        <ul>${OCCASIONS.slice(0, 6).map((o) => `<li><a href="/event-roboter/${o.slug}/">${esc(o.name)}</a></li>`).join('')}
        <li><a href="/event-roboter/">Alle Anlässe →</a></li></ul>
      </div>
      <div>
        <h4>Ratgeber</h4>
        <ul>${POSTS.map((p) => `<li><a href="/blog/${p.slug}/">${esc(postShort(p))}</a></li>`).join('')}
        <li><a href="/blog/">Blog &amp; Ratgeber →</a></li></ul>
      </div>
      <div>
        <h4>Service</h4>
        <ul>
          <li><a href="/#contact">Anfrage &amp; Buchung</a></li>
          <li><a href="/#faq">Häufige Fragen</a></li>
          <li><a href="/#cases">Einsatzbereiche</a></li>
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

function ctaBand(city) {
  const where = city ? ` in ${esc(city.name)}` : '';
  return `
<section class="cta-band" aria-label="Anfrage">
  <div class="cta-band__in">
    <p class="kicker">Anfrage &amp; Buchung</p>
    <h2>Bereit für eine Audienz${where}?</h2>
    <p>Schildern Sie Ihr Event in zwei Sätzen — Sie erhalten zeitnah ein individuelles Angebot. Einsätze ab 2.500&nbsp;€ zzgl. USt., Operator und Versicherung inklusive.</p>
    <div class="hero__cta">
      <a class="btn btn--primary" href="/#contact">Jetzt unverbindlich anfragen</a>
      <a class="btn btn--ghost" href="mailto:${EMAIL}">E-Mail schreiben</a>
    </div>
  </div>
</section>`;
}

function page({ path, title, desc, ogTitle, jsonld, body, idx = 0 }) {
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
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Ludwig II. von Robotollern — humanoider Event-Roboter mit Krone und rotem Umhang">
<meta property="og:locale" content="de_DE">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(ogTitle || title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${SITE}/og.jpg">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body>
${NAV}
<main id="main">
${body}
</main>
${footer(idx)}
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
    { q: `Wie kurzfristig ist ein Roboter-Auftritt in ${c.name} möglich?`, a: `Fragen Sie idealerweise 2–4 Wochen im Voraus an — besonders in Messewochen sind Termine schnell vergeben. Kurzfristige Anfragen für ${c.name} versuchen wir möglich zu machen; die Anreise ist deutschlandweit organisiert.` },
    { q: 'Ist der Roboter-Auftritt sicher und versichert?', a: 'Ja. Ludwig wird durchgehend von einem erfahrenen Operator begleitet und gesteuert; Ablauf und Sicherheitskonzept werden vorab mit Ihnen geplant. Der Betrieb ist versichert.' },
    { q: 'Spricht der Roboter Deutsch und Englisch?', a: 'Ja — Ludwig interagiert live auf Deutsch und Englisch. Ideal für internationales Messe- und Konferenzpublikum.' },
  ];
}

function cityPage(c, i) {
  const path = `/roboter-mieten/${c.slug}/`;
  const title = `Roboter mieten in ${c.name} — humanoider Event-Roboter für Messen & Events`;
  const desc = `Humanoiden Roboter in ${c.name} mieten: Event-Roboter Ludwig II. (Unitree G1) für Messen, Konferenzen & Firmenevents in ${c.name}. Mit Operator, versichert, ab 2.500 € zzgl. USt.`;
  const faq = cityFaq(c);
  /* 8 Nachbar-Links: redaktionelles nearby[] + deterministische Ring-Auffüllung,
     damit jede Stadtseite gleichmäßig eingehende Links erhält */
  const nearby = c.nearby.map((s) => cityBySlug[s]).filter(Boolean);
  for (const cand of rot(CITIES, i + 5, CITIES.length)) {
    if (nearby.length >= 8) break;
    if (cand.slug !== c.slug && !nearby.some((x) => x.slug === cand.slug)) nearby.push(cand);
  }
  const guides = rot(POSTS, i, 3);

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
    <p class="kicker">Nach Anlass</p>
    <h2>Event-Roboter in ${esc(c.name)} — für jeden Anlass</h2>
    <div class="linkrow">
      ${OCCASIONS.map((o) => `<a href="/event-roboter/${o.slug}/">${esc(o.linkLabel)}</a>`).join('\n      ')}
      <a href="/event-roboter/">Alle Anlässe →</a>
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <p class="kicker">Ratgeber</p>
    <h2>Wissen für Ihr Event in ${esc(c.name)}</h2>
    <div class="cards">
      ${guides.map((r) => `<div class="card postcard"><time datetime="${r.date}">${fmtDate(r.date)}</time><h3><a href="/blog/${r.slug}/">${esc(r.title)}</a></h3><p>${esc(r.excerpt)}</p><span class="more">Weiterlesen →</span></div>`).join('\n      ')}
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
  </div>
</section>

${ctaBand(c)}`;

  return { path, html: page({ path, title: `${title} | Robotollern`, ogTitle: title, desc, jsonld, body, idx: i + 1 }) };
}

/* ---------- cities hub ---------- */

function hubPage() {
  const path = '/roboter-mieten/';
  const title = 'Roboter mieten — Einsatzorte: humanoider Event-Roboter in 30 deutschen Städten';
  const desc = 'Humanoiden Event-Roboter mieten — deutschlandweit: Berlin, Hamburg, München, Köln, Frankfurt und 25 weitere Städte. Für Messen, Konferenzen & Events. Ab 2.500 € zzgl. USt.';
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
      <p class="kicker">Einsatzorte · Deutschland</p>
      <h1>Roboter mieten — <em>deutschlandweit</em> im Einsatz</h1>
      <p class="lead">Ludwig II. von Robotollern, der humanoide Event-Roboter (Unitree G1), reist mit Operator und Equipment in jede Stadt Deutschlands — und nach Österreich und in die Schweiz. Hier finden Sie die 30 größten Einsatzorte mit lokalen Details zu Messen, Locations und Formaten.</p>
      <div class="hero__cta">
        <a class="btn btn--primary" href="/#contact">Roboter buchen</a>
        <a class="btn btn--ghost" href="/blog/">Ratgeber lesen</a>
      </div>
      <ul class="chips"><li>30 Städte</li><li>Operator inklusive</li><li>Versichert</li><li>Ab 2.500 € zzgl. USt.</li></ul>
    </div>
    <div class="hero__img">
      <img src="/assets/robots/walk.webp" width="640" height="960" alt="Humanoider Event-Roboter Ludwig II. läuft — deutschlandweit für Events mietbar" fetchpriority="high">
    </div>
  </div>
</header>

<section class="section">
  <div class="container">
    <p class="kicker">Alle Einsatzorte</p>
    <h2>Humanoiden Roboter mieten — wählen Sie Ihre Stadt</h2>
    <div class="cards">
      ${CITIES.map((c) => `<div class="card"><h3><a href="/roboter-mieten/${c.slug}/">Roboter mieten in ${esc(c.name)}</a></h3><p>${esc(c.state)} · ${esc(c.pop)} Einwohner — u.&nbsp;a. ${esc(c.venues[0].n)}.</p></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <p class="kicker">Und darüber hinaus</p>
    <h2>Ihre Stadt ist nicht dabei?</h2>
    <p class="intro">Kein Problem: Ludwig II. ist deutschlandweit im Einsatz — auch in Österreich und der Schweiz. Anfahrt und Logistik werden im Angebot individuell berücksichtigt. <a href="/#contact">Fragen Sie unverbindlich an</a> und schildern Sie Ort und Anlass.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <p class="kicker">Nach Anlass</p>
    <h2>Oder wählen Sie nach Anlass</h2>
    <div class="linkrow">
      ${OCCASIONS.map((o) => `<a href="/event-roboter/${o.slug}/">${esc(o.linkLabel)}</a>`).join('\n      ')}
      <a href="/event-roboter/">Alle Anlässe →</a>
      <a href="/blog/">Blog &amp; Ratgeber →</a>
    </div>
  </div>
</section>

${ctaBand(null)}`;
  return { path, html: page({ path, title: `${title} | Robotollern`, ogTitle: title, desc, jsonld, body }) };
}

/* ---------- blog ---------- */

const fmtDate = (iso) => new Date(iso + 'T12:00:00Z').toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });

function postPage(p, all, i = 0) {
  const path = `/blog/${p.slug}/`;
  const related = all.filter((x) => x.slug !== p.slug).slice(0, 3);
  const linkCities = rot(CITIES, i * 7, 10);
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
<section class="section">
  <div class="container">
    <p class="kicker">Roboter mieten</p>
    <h2>Event-Roboter für Ihren Anlass &amp; Ihre Stadt</h2>
    <div class="linkrow">
      ${OCCASIONS.map((o) => `<a href="/event-roboter/${o.slug}/">${esc(o.linkLabel)}</a>`).join('\n      ')}
    </div>
    <div class="linkrow">
      ${linkCities.map((c) => `<a href="/roboter-mieten/${c.slug}/">Roboter mieten in ${esc(c.name)}</a>`).join('\n      ')}
      <a href="/roboter-mieten/">Alle Einsatzorte →</a>
    </div>
  </div>
</section>
${ctaBand(null)}`;
  return { path, html: page({ path, title: `${p.title} | Robotollern Blog`, ogTitle: p.title, desc: p.metaDesc, jsonld, body, idx: i + 40 }) };
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
<section class="section section--alt">
  <div class="container">
    <p class="kicker">Direkt zum Angebot</p>
    <h2>Roboter mieten — nach Anlass oder Stadt</h2>
    <div class="linkrow">
      ${OCCASIONS.map((o) => `<a href="/event-roboter/${o.slug}/">${esc(o.linkLabel)}</a>`).join('\n      ')}
      <a href="/event-roboter/">Alle Anlässe →</a>
    </div>
    <div class="linkrow">
      ${CITIES.slice(0, 10).map((c) => `<a href="/roboter-mieten/${c.slug}/">${esc(c.name)}</a>`).join('\n      ')}
      <a href="/roboter-mieten/">Alle Einsatzorte →</a>
    </div>
  </div>
</section>
${ctaBand(null)}`;
  return { path, html: page({ path, title: `${title} | Robotollern`, ogTitle: title, desc, jsonld, body }) };
}

/* ---------- occasion pages (/event-roboter/<slug>/) ---------- */

function occasionPage(o, i) {
  const path = `/event-roboter/${o.slug}/`;
  const cities = o.cities.map((s) => cityBySlug[s]).filter(Boolean);
  const guides = o.posts.map((s) => postBySlug[s]).filter(Boolean);
  const relatedOcc = rot(OCCASIONS, i + 1, OCCASIONS.length - 1).filter((x) => x.slug !== o.slug).slice(0, 4);

  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${SITE}${path}#service`,
        name: o.title,
        serviceType: `Vermietung humanoider Roboter — ${o.name}`,
        provider: { '@type': 'Organization', '@id': `${SITE}/#org`, name: 'Robotollern', url: `${SITE}/`, email: EMAIL },
        areaServed: [{ '@type': 'Country', name: 'Deutschland' }, { '@type': 'Country', name: 'Österreich' }, { '@type': 'Country', name: 'Schweiz' }],
        url: `${SITE}${path}`,
        offers: { '@type': 'Offer', priceCurrency: 'EUR', price: '2500', priceSpecification: { '@type': 'PriceSpecification', minPrice: '2500', priceCurrency: 'EUR' }, url: `${SITE}/#contact` },
      },
      faqLd(o.faq),
      breadcrumbLd([['Start', '/'], ['Event-Roboter', '/event-roboter/'], [o.name, null]]),
    ],
  };

  const body = `
${crumbsHtml([['Start', '/'], ['Event-Roboter', '/event-roboter/'], [o.name, null]])}
<header class="hero">
  <div class="container hero__grid">
    <div>
      <p class="kicker">${esc(o.kicker)}</p>
      <h1>${o.h1}</h1>
      <p class="lead">${esc(o.intro)}</p>
      <div class="hero__cta">
        <a class="btn btn--primary" href="/#contact">Roboter buchen</a>
        <a class="btn btn--ghost" href="#faq">Häufige Fragen</a>
      </div>
      <ul class="chips">
        <li>Operator inklusive</li><li>Versichert</li><li>Deutsch &amp; English</li><li>Ab 2.500 € zzgl. USt.</li>
      </ul>
    </div>
    <div class="hero__img">
      <img src="/assets/robots/king-wave.webp" width="640" height="960" alt="Ludwig II. von Robotollern — humanoider Event-Roboter für ${esc(o.name)}" fetchpriority="high">
    </div>
  </div>
</header>

<section class="section">
  <div class="container">
    <p class="kicker">So läuft der Auftritt</p>
    <h2>${esc(o.name)}: der Auftritt, der hängen bleibt</h2>
    <div class="intro"><p>${esc(o.scene)}</p></div>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <p class="kicker">Programmbausteine</p>
    <h2>Was Ludwig bei ${esc(o.name)} übernimmt</h2>
    <div class="cards cards--2">
      ${o.formats.map((f) => `<div class="card"><h3>${esc(f.n)}</h3><p>${esc(f.d)}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <p class="kicker">Leistungsumfang</p>
    <h2>Was die Audienz umfasst</h2>
    <p class="intro">Jeder Einsatz wird individuell auf Ihr Event zugeschnitten — und beinhaltet standardmäßig:</p>
    <ul class="check">
      ${SCOPE.map((s) => `<li>${esc(s)}</li>`).join('\n      ')}
    </ul>
    <p class="price">Einsätze ab 2.500 € zzgl. USt.<small>Das konkrete Angebot richtet sich nach Format, Dauer und Ort. Anreise und Logistik werden im Angebot berücksichtigt.</small></p>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <p class="kicker">Ablauf</p>
    <h2>So funktioniert die Buchung</h2>
    <div class="steps">
      ${STEPS.map((s) => `<div class="step"><span class="n">${s.n}</span><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section" id="faq">
  <div class="container">
    <p class="kicker">Häufige Fragen</p>
    <h2>${esc(o.name)} — FAQ</h2>
    <div class="faq">
      ${o.faq.map((f) => `<details><summary>${esc(f.q)}</summary><div><p>${esc(f.a)}</p></div></details>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <p class="kicker">Ratgeber</p>
    <h2>Weiterlesen zum Thema</h2>
    <div class="cards">
      ${guides.map((r) => `<div class="card postcard"><time datetime="${r.date}">${fmtDate(r.date)}</time><h3><a href="/blog/${r.slug}/">${esc(r.title)}</a></h3><p>${esc(r.excerpt)}</p><span class="more">Weiterlesen →</span></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <p class="kicker">Beliebte Einsatzorte</p>
    <h2>${esc(o.name)} — Roboter mieten in Ihrer Stadt</h2>
    <div class="linkrow">
      ${cities.map((c) => `<a href="/roboter-mieten/${c.slug}/">Roboter mieten in ${esc(c.name)}</a>`).join('\n      ')}
      <a href="/roboter-mieten/">Alle Einsatzorte →</a>
    </div>
    <div class="linkrow">
      ${relatedOcc.map((r) => `<a href="/event-roboter/${r.slug}/">${esc(r.linkLabel)}</a>`).join('\n      ')}
      <a href="/event-roboter/">Alle Anlässe →</a>
    </div>
  </div>
</section>

${ctaBand(null)}`;

  return { path, html: page({ path, title: `${o.title} | Robotollern`, ogTitle: o.title, desc: o.metaDesc, jsonld, body, idx: i + 31 }) };
}

function occasionsHub() {
  const path = '/event-roboter/';
  const title = 'Event-Roboter mieten — für Messe, Konferenz, Firmenfeier & mehr';
  const desc = 'Event-Roboter für jeden Anlass mieten: Messe, Konferenz, Firmenfeier, Weihnachtsfeier, Produktlaunch, Eröffnung, Gala & Hochzeit. Mit Operator, ab 2.500 € zzgl. USt.';
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage', '@id': `${SITE}${path}#page`, url: `${SITE}${path}`,
        name: title, inLanguage: 'de-DE', isPartOf: { '@id': `${SITE}/#website` },
      },
      {
        '@type': 'ItemList',
        itemListElement: OCCASIONS.map((o, i) => ({ '@type': 'ListItem', position: i + 1, name: o.title, url: `${SITE}/event-roboter/${o.slug}/` })),
      },
      breadcrumbLd([['Start', '/'], ['Event-Roboter', null]]),
    ],
  };
  const body = `
${crumbsHtml([['Start', '/'], ['Event-Roboter', null]])}
<header class="hero">
  <div class="container hero__grid">
    <div>
      <p class="kicker">Anlässe · Alle Formate</p>
      <h1>Event-Roboter mieten — <em>für jeden Anlass</em></h1>
      <p class="lead">Vom Messestand bis zur Hochzeit: Ludwig II. von Robotollern, der humanoide Event-Roboter (Unitree G1), hat für jeden Anlass das passende Format — mit Operator, versichert und deutschlandweit unterwegs. Wählen Sie Ihren Anlass und sehen Sie, wie der Auftritt abläuft.</p>
      <div class="hero__cta">
        <a class="btn btn--primary" href="/#contact">Roboter buchen</a>
        <a class="btn btn--ghost" href="/roboter-mieten/">Einsatzorte ansehen</a>
      </div>
      <ul class="chips"><li>8 Anlässe</li><li>Operator inklusive</li><li>Versichert</li><li>Ab 2.500 € zzgl. USt.</li></ul>
    </div>
    <div class="hero__img">
      <img src="/assets/robots/king-wave.webp" width="640" height="960" alt="Humanoider Event-Roboter Ludwig II. winkt — für jeden Event-Anlass mietbar" fetchpriority="high">
    </div>
  </div>
</header>

<section class="section">
  <div class="container">
    <p class="kicker">Alle Anlässe</p>
    <h2>Wofür möchten Sie den Event-Roboter mieten?</h2>
    <div class="cards cards--2">
      ${OCCASIONS.map((o) => `<div class="card"><h3><a href="/event-roboter/${o.slug}/">${esc(o.name)}</a></h3><p>${esc(o.intro)}</p><span class="more"><a href="/event-roboter/${o.slug}/">Zum Anlass →</a></span></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <p class="kicker">Einsatzorte</p>
    <h2>Deutschlandweit im Einsatz — auch in Ihrer Stadt</h2>
    <div class="linkrow">
      ${CITIES.slice(0, 12).map((c) => `<a href="/roboter-mieten/${c.slug}/">${esc(c.name)}</a>`).join('\n      ')}
      <a href="/roboter-mieten/">Alle 30 Einsatzorte →</a>
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
    ...CITIES.map((c) => ({ loc: `/roboter-mieten/${c.slug}/`, pri: '0.8', freq: 'monthly' })),
    { loc: '/event-roboter/', pri: '0.9', freq: 'weekly' },
    ...OCCASIONS.map((o) => ({ loc: `/event-roboter/${o.slug}/`, pri: '0.8', freq: 'monthly' })),
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

const pages = [
  hubPage(),
  ...CITIES.map(cityPage),
  occasionsHub(),
  ...OCCASIONS.map(occasionPage),
  blogHub(),
  ...POSTS.map((p, i) => postPage(p, POSTS, i)),
];
for (const { path, html } of pages) {
  const file = join(ROOT, path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}
writeFileSync(join(ROOT, 'sitemap.xml'), sitemap());
writeFileSync(join(ROOT, 'robots.txt'), ROBOTS);
console.log(`Generated ${pages.length} pages + sitemap.xml + robots.txt`);
