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
<title>Ludwig II. von Robotollern — Der König unter den Robotern</title>
<meta name="description" content="Ludwig II. von Robotollern — humanoider Event-Roboter (Unitree G1) mit königlichem Auftritt, professionell betreut. Einsätze ab 2.500 € zzgl. USt. Deutschland, Österreich, Schweiz.">
<meta name="theme-color" content="#0A0A0A">
<link rel="canonical" href="https://robotollern.de/">
<meta property="og:type" content="website">
<meta property="og:url" content="https://robotollern.de/">
<meta property="og:title" content="Ludwig II. von Robotollern — Der König unter den Robotern">
<meta property="og:description" content="Humanoider Event-Roboter mit königlichem Auftritt — Events, Marken-Kooperationen, Content. Einsätze ab 2.500 € zzgl. USt.">
<meta property="og:image" content="https://robotollern.de/og.jpg">
<meta property="og:locale" content="de_DE">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://robotollern.de/og.jpg">
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
