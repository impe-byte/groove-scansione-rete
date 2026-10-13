# Groove SRL – Scansione di rete in omaggio

Pagina di benvenuto raggiungibile tramite QR code stampato sui ticket: spiega la scansione di rete gratuita offerta da Groove SRL e raccoglie le richieste con un modulo. I dati arrivano via email, senza login né server.

- Indirizzo pubblico: **https://scansione.groovesrl.com/**
- QR da stampare: [`qr/qr_scansione.svg`](qr/qr_scansione.svg) (vettoriale, per la tipografia) o [`qr/qr_scansione.png`](qr/qr_scansione.png)

## Messa online (una tantum)

### 1. Email di destinazione
In `index.html` sostituire `EMAIL_DESTINATARIO` (3 occorrenze) con l'indirizzo che deve ricevere le richieste.
Fare un invio di prova: FormSubmit manda una mail di attivazione, cliccare il link **una sola volta**.
Facoltativo: dopo l'attivazione FormSubmit fornisce un alias da usare al posto dell'email nella costante `RECIPIENT`, così l'indirizzo non è visibile nel codice.

### 2. GitHub Pages
Settings → Pages → *Deploy from a branch* → branch `main`, cartella `/ (root)` → Save.
Il file `CNAME` imposta già il dominio `scansione.groovesrl.com`.

### 3. DNS di groovesrl.com
Dal pannello del provider del dominio aggiungere:

| Tipo  | Nome        | Valore              |
|-------|-------------|---------------------|
| CNAME | `scansione` | `impe-byte.github.io` |

Quando il DNS è propagato (da pochi minuti a qualche ora), in Settings → Pages spuntare **Enforce HTTPS**.

## QR code

Il QR è statico e non scade: contiene solo `https://scansione.groovesrl.com/`. Finché il record DNS resta attivo, i ticket stampati funzionano anche se in futuro la pagina viene spostata altrove (basta puntare il sottodominio al nuovo hosting).

Per rigenerarlo, anche con un codice evento che precompila il campo "Codice ticket":

```
pip install qrcode pillow
python qr/genera_qr.py https://scansione.groovesrl.com/
python qr/genera_qr.py "https://scansione.groovesrl.com/?src=FIERA-MILANO-2026"
```
