#!/usr/bin/env python3
"""Печатает @font-face-блоки с woff2, зашитыми как base64 data-URI.
Шрифты хостятся локально (никакого Google Fonts — DSGVO, LG München 2022).
Источник: assets/fonts/*.woff2 (Google Fonts latin-сабсеты, лицензия OFL).
"""
import base64
from pathlib import Path

HERE = Path(__file__).parent.parent / "assets" / "fonts"

FACES = [
    # (file, family, style, weight-or-range)
    ("dmserif-normal-400.woff2",  "DM Serif Display", "normal", "400"),
    ("dmserif-italic-400.woff2",  "DM Serif Display", "italic", "400"),
    ("inter-normal-400.woff2",    "Inter",            "normal", "400 700"),  # variable
    ("spacemono-normal-400.woff2","Space Mono",       "normal", "400"),
    ("spacemono-normal-700.woff2","Space Mono",       "normal", "700"),
]

for fname, family, style, weight in FACES:
    b64 = base64.b64encode((HERE / fname).read_bytes()).decode("ascii")
    print(f"""@font-face {{
  font-family: '{family}';
  font-style: {style};
  font-weight: {weight};
  font-display: swap;
  src: url(data:font/woff2;base64,{b64}) format('woff2');
}}""")
