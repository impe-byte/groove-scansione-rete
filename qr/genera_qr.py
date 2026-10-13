"""Genera il QR code stampabile per la pagina della scansione di rete Groove SRL.

Uso:
    pip install qrcode pillow
    python genera_qr.py https://tuodominio.it/scansione

Crea qr_scansione.png (alta risoluzione, adatto alla stampa) e qr_scansione.svg (vettoriale).
Il QR è statico: non scade mai e funziona finché l'URL che contiene resta raggiungibile.
"""
import sys
from pathlib import Path

import qrcode
import qrcode.image.svg

url = sys.argv[1] if len(sys.argv) > 1 else "https://scansione.groovesrl.com/"
out = Path(__file__).parent

qr = qrcode.QRCode(
    error_correction=qrcode.constants.ERROR_CORRECT_H,  # tollera ~30% di danni/sporco sul ticket
    box_size=40,  # ~1300 px di lato: nitido anche stampato grande
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

qr.make_image(fill_color="black", back_color="white").save(out / "qr_scansione.png")
qr.make_image(image_factory=qrcode.image.svg.SvgPathImage).save(out / "qr_scansione.svg")
print(f"QR generato per: {url}")
