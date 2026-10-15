# Groove SRL – Scansione di rete in omaggio

Pagina di benvenuto raggiungibile tramite QR code stampato sui ticket: spiega la scansione di rete gratuita offerta da Groove SRL e raccoglie le richieste con un modulo. Le richieste vengono inviate via email da una Netlify Function tramite la casella SMTP di Groove, senza login per l'utente.

- Indirizzo pubblico: **https://chipper-puffpuff-1bfd9f.netlify.app/** (Netlify)
- Le richieste arrivano a: **commerciale@groovesrl.com**
- QR da stampare: [`qr/qr_scansione.svg`](qr/qr_scansione.svg) (vettoriale, per la tipografia) o [`qr/qr_scansione.png`](qr/qr_scansione.png)

## Struttura

| Percorso | Cosa contiene |
|---|---|
| `public/` | **Il sito pubblicato** (solo questa cartella va online) |
| `public/assets/` | Logo Groove (versione per sfondo scuro) e font Montserrat, ospitati sul sito |
| `public/_headers` | Header di sicurezza per Netlify e Cloudflare Pages |
| `vercel.json` | Configurazione Vercel (cartella `public`, header di sicurezza) |
| `netlify.toml` | Configurazione Netlify |
| `netlify/functions/` | Funzione che invia le richieste via email |
| `package.json` | Dipendenza della funzione (nodemailer), installata da Netlify |
| `wrangler.toml` | Configurazione Cloudflare Pages |
| `qr/` | Script e immagini del QR (non pubblicati) |

## 1. Invio delle richieste via email (Netlify Function + SMTP)

Il modulo invia i dati a `netlify/functions/invia-richiesta.js` (indirizzo `/api/invia-richiesta`), che spedisce l'email usando una casella di posta di Groove. Le Netlify Functions sono incluse nel piano gratuito.
L'email parte dal dominio groovesrl.com, quindi non viene bloccata dal filtro antispam aziendale; il campo *Rispondi a* è l'email del cliente.

In Netlify → **Site configuration → Environment variables** aggiungere (poi Deploys → *Trigger deploy*):

| Variabile | Valore |
|---|---|
| `SMTP_HOST` | server SMTP della casella (es. `smtp.office365.com` per Microsoft 365, `smtps.aruba.it` per Aruba) |
| `SMTP_PORT` | `587` (Microsoft 365) oppure `465` (Aruba) |
| `SMTP_USER` | indirizzo della casella usata per inviare (es. `commerciale@groovesrl.com`) |
| `SMTP_PASS` | password della casella (o *app password*). Impostarla come **secret** |
| `MAIL_TO` | `commerciale@groovesrl.com` |
| `MAIL_FROM` | facoltativa, mittente se diverso da `SMTP_USER` (deve essere autorizzato sulla casella) |

Con Microsoft 365 l'*SMTP AUTH* della casella va abilitato dall'amministratore (Microsoft 365 admin center → utente → Posta → *Gestisci app di posta elettronica* → *SMTP autenticato*).
Gli errori di invio sono visibili in Netlify → **Logs → Functions → invia-richiesta**.

## 2. Deploy

Importare il repository GitHub, **nessun comando di build**, cartella di output `public` (Netlify installa da solo le dipendenze della funzione). Ogni push su `main` ripubblica automaticamente.

> Il sito è in uso su **Netlify**, necessario per il modulo (Netlify Function). Su Cloudflare Pages o Vercel la pagina si apre ma il modulo non invia.

### Cloudflare Pages
Gratuito anche per uso commerciale, banda illimitata.
1. dash.cloudflare.com → Workers & Pages → Create → Pages → *Connect to Git* → `groove-scansione-rete`
2. Framework preset: *None* · Build command: vuoto · Build output directory: `public`
3. Custom domains → *Set up a custom domain* → `scansione.groovesrl.com`

### Netlify (in uso)
Gratuito anche per uso commerciale.
1. app.netlify.com → *Add new site* → *Import from Git* → `groove-scansione-rete` (legge `netlify.toml` da solo)
2. Domain management → *Add a domain* → `scansione.groovesrl.com`

### Vercel
Il piano gratuito *Hobby* è riservato all'uso personale/non commerciale: per un'azienda serve il piano Pro.
1. vercel.com → *Add New Project* → importare `groove-scansione-rete` (legge `vercel.json` da solo)
2. Settings → Domains → `scansione.groovesrl.com`

## 3. DNS di groovesrl.com

Nel pannello del provider del dominio aggiungere **un record CNAME** con nome `scansione`; il valore è quello indicato dall'host quando si aggiunge il dominio:

| Host | Valore tipico del CNAME `scansione` |
|---|---|
| Cloudflare Pages | `groove-scansione-rete.pages.dev` (automatico se il DNS è già su Cloudflare) |
| Netlify | `<nome-sito>.netlify.app` |
| Vercel | `cname.vercel-dns.com` (o il valore mostrato da Vercel) |

Il certificato HTTPS viene emesso gratis e in automatico dall'host appena il DNS è propagato (da pochi minuti a qualche ora).
Il resto del dominio (sito principale, email) non viene toccato.

## QR code

Il QR è statico e non scade: contiene solo `https://chipper-puffpuff-1bfd9f.netlify.app/`. Funziona finché il sito Netlify esiste con questo nome: non eliminare né rinominare il sito su Netlify, altrimenti i ticket stampati smettono di funzionare.
Per ticket indipendenti dall'host, collegare un sottodominio (es. `scansione.groovesrl.com`) e rigenerare il QR con quello.

Per rigenerarlo:

```
pip install qrcode pillow
python qr/genera_qr.py https://chipper-puffpuff-1bfd9f.netlify.app/
```
