# Strategia SEO / lead-gen — robotollern.de

Stan po tej gałęzi (`claude/seo-leads-strategy-guer9f`). Cel: maksimum leadów B2B
z organicznego ruchu na frazy typu „Roboter mieten", „Messe-Roboter", „Event-Roboter".

## Struktura strony (46 podstron SEO + strona główna)

```
/                              ← strona główna (SPA, pełne meta + JSON-LD)
/roboter-mieten/               ← hub 30 miast (frazy: "roboter mieten <miasto>")
/roboter-mieten/<miasto>/      ← 30 landingów miejskich, unikalna treść per miasto
/event-roboter/                ← hub 8 okazji (fraza: "event-roboter mieten")
/event-roboter/<okazja>/       ← messe, konferenz, firmenfeier, weihnachtsfeier,
                                 produktpraesentation, eroeffnung, gala, hochzeit
/blog/                         ← hub bloga
/blog/<artykul>/               ← 5 artykułów poradnikowych (longform)
```

Wszystko generowane z `tools/seo/generate.mjs` (dane: `cities.mjs`, `occasions.mjs`,
`blog.mjs`). Po każdej zmianie danych: `node tools/seo/generate.mjs`.

## Cross-linking (siatka linków wewnętrznych)

- **Miasto → miasto**: 8 linków „w pobliżu" (redakcyjne `nearby` + deterministyczny
  pierścień, żeby każde miasto dostawało równą liczbę linków przychodzących).
- **Miasto → okazje**: każda strona miasta linkuje do wszystkich 8 okazji + hub.
- **Miasto → blog**: 3 rotowane artykuły (rotacja per miasto — równy rozkład).
- **Okazja → miasta/blog/okazje**: 8 miast dobranych tematycznie, 3 artykuły,
  4 pokrewne okazje.
- **Blog → miasta/okazje**: 10 rotowanych miast + wszystkie okazje pod artykułem;
  linki kontekstowe w treści artykułów.
- **Stopka (podstrony SEO)**: 5 kolumn — 6 rotowanych miast (rotacja per strona),
  6 okazji, wszystkie artykuły, service. Stopka SPA (strona główna): kolumna
  miast + nowa kolumna „Nach Anlass" (DE/EN).
- Zweryfikowane skryptem: 0 martwych linków; każde miasto ≥16 linków
  przychodzących, okazje 43–89, artykuły 71–78.

## Dane strukturalne

Każda podstrona: `Service` (z ceną od 2500 €), `FAQPage`, `BreadcrumbList`;
huby: `CollectionPage` + `ItemList`; blog: `BlogPosting`. Strona główna:
`Organization` + `WebSite` + `Service` + `FAQPage`.

## Co dalej (poza kodem — do zrobienia ręcznie)

1. **Google Search Console + Bing Webmaster**: zgłosić `sitemap.xml`, monitorować
   indeksację 47 URL-i.
2. **Google Business Profile** dla firmy (kategoria: wynajem sprzętu eventowego).
3. **Backlinki**: katalogi branżowe eventowe (eventbranche.de, eventsofa,
   fiylo, eventinc), prasa lokalna przy każdym wdrożeniu, partnerstwa
   z agencjami eventowymi i lokacjami z landingów miejskich.
4. **Rozbudowa bloga**: 1–2 artykuły/mies. pod long-tail
   (np. „Roboter mieten Preis pro Tag", „Messestand Ideen 2026").
5. **Kolejne miasta/kraje**: dane w `cities.mjs` — Wiedeń, Zurych, Salzburg (DACH).
6. **Pomiar leadów**: eventy na formularz `#contact` + parametry UTM w CRM,
   żeby wiedzieć, które landingi konwertują.
