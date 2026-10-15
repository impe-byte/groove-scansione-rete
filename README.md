# Groove SRL – Scansione di rete in omaggio

Pagina di benvenuto raggiungibile tramite QR code stampato sui ticket: spiega la scansione di rete gratuita offerta da Groove SRL e raccoglie le richieste con un modulo. Le richieste vengono inviate via email tramite **FormSubmit** (formsubmit.co), senza login, senza server e senza build.

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
| `wrangler.toml` | Configurazione Cloudflare Pages |
| `qr/` | Script e immagini del QR (non pubblicati) |

## 1. Invio delle richieste via email (FormSubmit)

L'indirizzo di destinazione è la costante `RECIPIENT` in `public/index.html` (`commerciale@groovesrl.com`).

Attivazione (una sola volta per indirizzo): al primo invio FormSubmit manda a `commerciale@groovesrl.com` una mail con oggetto simile a *"Action Required: Activate FormSubmit…"* e il pulsante **Activate Form**, da cliccare una volta.
Il mittente è `noreply@formsubmit.co`: se non arriva, controllare spam/quarantena del filtro antispam aziendale e far consentire il mittente/dominio `formsubmit.co`.
Finché il modulo non è attivo la pagina mostra "Modulo in attivazione".

## 2. Deploy

Importare il repository GitHub, **nessun comando di build**, cartella di output `public`. Ogni push su `main` ripubblica automaticamente.

> Il sito è in uso su **Netlify**. Il modulo usa FormSubmit, quindi funziona su qualsiasi host.

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
