#!/usr/bin/env bash
# ============================================================
# build.sh — assembles a SINGLE self-contained index.html from the modular
# source files (styles.css, config.js, content.js, legal-content.js, app.js)
# + lucide icons + the robot photos (base64-inlined).
#
# Why: so the page renders fully even when opened directly (file://) or in a
# preview panel that blocks external files. Only the web fonts stay external
# (they fall back to Georgia / system-ui cleanly if blocked).
#
# Edit the SOURCE files, then run:  bash build.sh
# ============================================================
set -e
cd "$(dirname "$0")"
OUT=index.html

# --- head ---
cat > "$OUT" <<'HTML_HEAD'
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Humanoiden Roboter mieten für Events, Messen & Konferenzen | Ludwig II. von Robotollern</title>
<meta name="description" content="Humanoider Event-Roboter (Unitree G1) mit Operator für Messen, Konferenzen & Firmenevents — deutschlandweit mieten. Versichert, Deutsch & Englisch, ab 2.500 € zzgl. USt.">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
<meta name="theme-color" content="#0A0A0A">
<link rel="canonical" href="https://robotollern.de/">
<meta property="og:type" content="website">
<meta property="og:url" content="https://robotollern.de/">
<meta property="og:site_name" content="Ludwig II. von Robotollern">
<meta property="og:title" content="Humanoiden Roboter mieten für Events, Messen & Konferenzen">
<meta property="og:description" content="Humanoider Event-Roboter mit königlichem Auftritt — Messen, Konferenzen, Firmenevents. Operator inklusive, versichert, deutschlandweit. Ab 2.500 € zzgl. USt.">
<meta property="og:image" content="https://robotollern.de/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Ludwig II. von Robotollern — humanoider Event-Roboter mit Krone und rotem Umhang">
<meta property="og:locale" content="de_DE">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Humanoiden Roboter mieten für Events, Messen & Konferenzen">
<meta name="twitter:description" content="Humanoider Event-Roboter mit Operator — Messen, Konferenzen, Firmenevents. Deutschlandweit, versichert, ab 2.500 € zzgl. USt.">
<meta name="twitter:image" content="https://robotollern.de/og.jpg">
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"Organization","@id":"https://robotollern.de/#org","name":"Robotollern","alternateName":"Ludwig II. von Robotollern","legalName":"GERA – Maksym Herasymenko","url":"https://robotollern.de/","logo":"https://robotollern.de/og.jpg","email":"info@robotollern.de","address":{"@type":"PostalAddress","streetAddress":"Welserstraße 3","postalCode":"87463","addressLocality":"Dietmannsried","addressCountry":"DE"},"sameAs":["https://www.instagram.com/robotollern","https://www.tiktok.com/@robotollern","https://www.youtube.com/@LudwigIIvonRobottollern","https://www.threads.com/@robotollern","https://www.facebook.com/share/1BYhCKFLCV/","https://x.com/robotollern"]},
{"@type":"WebSite","@id":"https://robotollern.de/#website","url":"https://robotollern.de/","name":"Ludwig II. von Robotollern","inLanguage":"de-DE","publisher":{"@id":"https://robotollern.de/#org"}},
{"@type":"Service","@id":"https://robotollern.de/#service","name":"Humanoiden Roboter mieten — Event-Roboter mit Operator","serviceType":"Vermietung humanoider Roboter für Events, Messen und Konferenzen","provider":{"@id":"https://robotollern.de/#org"},"areaServed":[{"@type":"Country","name":"Deutschland"},{"@type":"Country","name":"Österreich"},{"@type":"Country","name":"Schweiz"}],"offers":{"@type":"Offer","priceCurrency":"EUR","price":"2500","priceSpecification":{"@type":"PriceSpecification","minPrice":"2500","priceCurrency":"EUR"},"availability":"https://schema.org/InStock","url":"https://robotollern.de/#contact"}},
{"@type":"FAQPage","@id":"https://robotollern.de/#faq","mainEntity":[
{"@type":"Question","name":"Was kann Ludwig auf einem Event?","acceptedAnswer":{"@type":"Answer","text":"Ludwig begrüßt Gäste, bewegt sich frei durch den Raum, interagiert mit dem Publikum und sorgt für Foto- und Videomomente, die geteilt werden. Er wird immer von einem professionellen Operator begleitet."}},
{"@type":"Question","name":"Was kostet ein Auftritt?","acceptedAnswer":{"@type":"Answer","text":"Einsätze beginnen ab 2.500 € zzgl. USt. — der Startpreis für ein kompaktes Format (ab ca. 2 Stunden). Der konkrete Preis hängt von Format, Dauer, Programm und Individualisierung ab; Sie erhalten immer ein individuelles Angebot."}},
{"@type":"Question","name":"Für welche Anlässe kann man Ludwig buchen?","acceptedAnswer":{"@type":"Answer","text":"Store- und Showroom-Eröffnungen, Messen und Konferenzen, Firmenfeiern, Produktpräsentationen, Presse-Events, Premium-Hochzeiten — und Marken-Kooperationen im Content-Bereich."}},
{"@type":"Question","name":"In welchen Städten und Ländern seid ihr verfügbar?","acceptedAnswer":{"@type":"Answer","text":"Deutschland, Österreich und die Schweiz — Anfahrt und Logistik werden im Angebot individuell berücksichtigt. Weitere Länder und Sprachen sind auf Anfrage möglich."}},
{"@type":"Question","name":"Wie weit im Voraus muss ich buchen?","acceptedAnswer":{"@type":"Answer","text":"Je früher, desto besser — beliebte Termine (Wochenenden, Messezeiten) sind schnell vergeben. Fragen Sie am besten 2–4 Wochen im Voraus an; kurzfristige Anfragen versuchen wir möglich zu machen."}},
{"@type":"Question","name":"Ist das sicher für die Gäste?","acceptedAnswer":{"@type":"Answer","text":"Ja. Ludwig wird durchgehend von einem erfahrenen Operator begleitet und gesteuert; Ablauf und Sicherheitskonzept werden vorab mit Ihnen geplant. Der Betrieb ist versichert."}}
]}
]}
</script>
<style>
/* Schriftarten lokal gehostet (kein Google Fonts — DSGVO) */
HTML_HEAD

# --- fonts (self-hosted, base64-inlined woff2 — no Google Fonts, DSGVO) ---
PY=./.venv/bin/python
"$PY" tools/fonts_css.py >> "$OUT"

# --- styles (strip the old @import line if any) ---
grep -v 'fonts.googleapis.com' styles.css >> "$OUT"

# --- body shell ---
cat >> "$OUT" <<'HTML_MID'
</style>
</head>
<body>
<a href="#main" class="skip-link">Zum Inhalt springen</a>
<div id="app"></div>
<noscript>
  <div style="max-width:720px;margin:80px auto;padding:0 24px;font-family:Georgia,serif;color:#C9C9C2;line-height:1.6">
    <h1 style="color:#F5F5F0">Ludwig II. von Robotollern</h1>
    <p>Diese Seite benötigt JavaScript. Für eine Buchungsanfrage schreiben Sie bitte an die im Impressum angegebene E-Mail-Adresse.</p>
  </div>
</noscript>
<script>
HTML_MID

# --- icons (lucide, inlined) ---
cat vendor-lucide.js >> "$OUT"
echo "" >> "$OUT"

# --- swappable config ---
cat config.js >> "$OUT"

# --- inline the robot photos as WebP data-URIs (q85: ~7-10x smaller than PNG,
#     no visible loss) so the page stays self-contained AND loads fast ---
inline_img() { # $1 = JS lvalue, $2 = image path
  printf "%s='" "$1" >> "$OUT"
  "$PY" tools/webp_datauri.py "$2" >> "$OUT"
  printf "';\n" >> "$OUT"
}
echo "(function(){var I=window.LVD_CONFIG.images;" >> "$OUT"
inline_img "I.hero" assets/robots/king.png
inline_img "I.what" assets/robots/king-wave.png
# порядок = порядку gallery[] в config.js!
inline_img "I.gallery[0].src" assets/robots/walk.png
inline_img "I.gallery[1].src" assets/robots/front2.png
inline_img "I.gallery[2].src" assets/robots/kick.png
inline_img "I.gallery[3].src" assets/robots/bust.png
inline_img "I.gallery[4].src" assets/robots/squat.png
inline_img "I.gallery[5].src" assets/robots/sit.png
inline_img "I.fleet.dog" assets/robots/fleet-dog.png
inline_img "I.fleet.drone" assets/robots/fleet-drone.png
inline_img "I.fleet.branding" assets/robots/bust.png
echo "})();" >> "$OUT"

# --- content + legal + app engine ---
cat content.js      >> "$OUT"
cat legal-content.js >> "$OUT"
cat app.js          >> "$OUT"

cat >> "$OUT" <<'HTML_FOOT'
</script>
</body>
</html>
HTML_FOOT

echo "Built $OUT — $(du -h "$OUT" | cut -f1), $(wc -l < "$OUT" | tr -d ' ') lines"
