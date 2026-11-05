#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Convierte las capturas PNG temporales a WebP liviano (calidad 78)."""

import glob
import os
import sys

from PIL import Image

carpeta = sys.argv[1]
total = 0
for png in sorted(glob.glob(os.path.join(carpeta, "__tmp-*.png"))):
    webp = png.replace("__tmp-", "").replace(".png", ".webp")
    im = Image.open(png).convert("RGB")
    im.save(webp, "WEBP", quality=78, method=6)
    kb = os.path.getsize(webp) / 1024
    total += kb
    os.remove(png)
    print("%-28s %-10.1f KB" % (os.path.basename(webp), kb))
print("TOTAL %.0f KB" % total)
