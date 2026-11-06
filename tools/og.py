#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Recorta la captura del hero al tamaño de imagen social (1200x630) y la guarda
como JPEG. Formato elegido a propósito: Facebook y WhatsApp no pintan siempre
vistas previas en WebP, así que og:image debe ser JPG o PNG.

Uso: python3 tools/og.py captura.png destino.jpg
"""

import os
import sys

from PIL import Image

ANCHO = 1200
ALTO = 630

captura, destino = sys.argv[1], sys.argv[2]
im = Image.open(captura).convert("RGB")

# Recorte centrado con la relación 1200x630 (1.905:1), nunca más ancho que el original.
proporcion = ANCHO / ALTO
alto = min(int(im.width / proporcion), im.height)
left = (im.width - int(alto * proporcion)) // 2
top = (im.height - alto) // 2
im = im.crop((left, top, left + int(alto * proporcion), top + alto))
im = im.resize((ANCHO, ALTO), Image.LANCZOS)

# Paleta plana tipo interfaz: 4:2:0 con calidad 84 pesa poco y se ve nítida.
im.save(destino, "JPEG", quality=84, optimize=True, progressive=True)
print(
    "%-24s %dx%d  %.1f KB"
    % (destino.split("/")[-1], ANCHO, ALTO, os.path.getsize(destino) / 1024)
)
