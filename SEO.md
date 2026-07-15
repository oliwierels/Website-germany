# SEO — robotollern.de

Stan po fazie 3 (2026-07-15). Co jest zrobione w kodzie i co trzeba zrobić
ręcznie poza repozytorium, żeby ruch i pozycje realnie urosły.

## Co jest zrobione (on-page / techniczne)

- **62 podstrony SEO**: hub miast, 40 stron miast (DE/AT/CH), 9 stron usług,
  strona cen `/preise/`, blog (hub + 10 artykułów), strona 404.
- **Meta komplet na każdej stronie**: title/description w limitach SERP,
  canonical, pełny Open Graph (z wymiarami i altem obrazka), Twitter Cards,
  `og:type=article` + daty publikacji dla wpisów blogowych.
- **Dane strukturalne (JSON-LD)**: Organization (z contactPoint), WebSite,
  WebPage na każdej stronie, Service + Offer (cena od 2 500 €), FAQPage,
  BreadcrumbList, BlogPosting (wordCount, timeRequired), ItemList na hubie.
  Miasta powiązane encyjnie z niemiecką Wikipedią (`sameAs`).
- **Sitemap.xml** z rozszerzeniem image i realnymi datami `lastmod`.
- **RSS** (`/feed.xml`) + autodiscovery w `<head>` każdej strony.
- **robots.txt** z jawnym dopuszczeniem crawlerów AI (GPTBot, ClaudeBot,
  PerplexityBot, Google-Extended itd.) + **llms.txt** z pełną mapą oferty
  i sekcją faktów — pod widoczność w ChatGPT/Claude/Perplexity/AI Overviews.
- **Linkowanie wewnętrzne**: nawigacja i stopka na podstronach, miasta ↔
  usługi ↔ blog ↔ ceny, sekcje „w pobliżu" między miastami.
- **Wydajność**: samowystarczalny index.html, WebP, `fetchpriority=high` na
  hero, `preconnect` do CRM, fonty self-hosted (RODO).

Regeneracja podstron: `node tools/seo/generate.mjs` (dane źródłowe w
`tools/seo/*.mjs`). Strona główna: `bash build.sh` (wymaga `.venv`).

## Do zrobienia ręcznie (off-page) — kolejność wg wpływu

1. **Google Search Console** — dodaj domenę, prześlij `sitemap.xml`,
   po tygodniu sprawdź raport „Indeksowanie stron". To warunek wszystkiego.
2. **Google Business Profile** — załóż wizytówkę (adres z Impressum:
   Dietmannsried), kategoria „Wypożyczalnia sprzętu eventowego / Agencja
   eventowa", zdjęcia robota, link do strony. Lokalny pakiet map to darmowe
   leady B2B.
3. **Bing Webmaster Tools** — import z GSC (2 kliknięcia). Bing zasila
   ChatGPT Search i Copilota.
4. **Opinie** — po każdym evencie proś klienta o recenzję Google. 5–10
   opinii z frazami typu „Roboter für Messe" to ogromna dźwignia lokalna.
5. **Backlinki branżowe** — wpisy do katalogów eventowych (eventpeppers,
   fiylo, eventbranche.de, eventlokale.ch), profile w portalach
   messe-/kongress-. Każdy występ = prośba o link od organizatora.
6. **PR/media** — humanoidalny robot-król to gotowy temat dla lokalnych
   mediów przy każdym wydarzeniu (IFA, OMR, gamescom…). Jeden artykuł
   w prasie = najmocniejszy możliwy link.
7. **Treści** — 1–2 wpisy na blogu miesięcznie (dane źródłowe:
   `tools/seo/blog.mjs`). Frazy sezonowe zaplanuj z wyprzedzeniem
   (np. „Roboter Weihnachtsfeier" — publikacja we wrześniu).
8. **Monitoring** — po 2–4 tygodniach sprawdź w GSC, które frazy łapią
   wyświetlenia bez kliknięć i dostrój title/description tych stron.
