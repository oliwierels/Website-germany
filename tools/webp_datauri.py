#!/usr/bin/env python3
"""Печатает картинку как data:image/webp;base64,... — для инлайна в build.sh.
WebP q85 method6 сохраняет альфу и режет вес PNG в 6-10 раз без видимой потери.
Использование: python tools/webp_datauri.py assets/robots/king.png
"""
import base64
import io
import sys

from PIL import Image

src = sys.argv[1]
im = Image.open(src).convert("RGBA")
buf = io.BytesIO()
im.save(buf, "WEBP", quality=85, method=6)
b64 = base64.b64encode(buf.getvalue()).decode("ascii")
sys.stdout.write("data:image/webp;base64," + b64)
