# Groove SRL – Scansione di rete in omaggio

Pagina di benvenuto raggiungibile tramite QR code stampato sui ticket: spiega la scansione di rete gratuita offerta da Groove SRL e raccoglie le richieste con un modulo. I dati arrivano via email (FormSubmit), senza login, senza server e senza build.

- Indirizzo pubblico: **https://chipper-puffpuff-1bfd9f.netlify.app/** (Netlify)
- Le richieste arrivano a: **e.marchesini@groovesrl.com**
- QR da stampare: [`qr/qr_scansione.svg`](qr/qr_scansione.svg) (vettoriale, per la tipografia) o [`qr/qr_scansione.png`](qr/qr_scansione.png)

## Struttura

| Percorso | Cosa contiene |
|---|---|
| `public/` | **Il sito pubblicato** (solo questa cartella va online) |
| `public/_headers` | Header di sicurezza per Cloudflare Pages e Netlify |
| `vercel.json` | Configurazione Vercel (cartella `public`, header di sicurezza) |
| `netlify.toml` | Configurazione Netlify |
| `wrangler.toml` | Configurazione Cloudflare Pages |
| `qr/` | Script e immagini del QR (non pubblicati) |

## 1. Email di destinazione

Configurata in `public/index.html` (costante `RECIPIENT` e link `mailto:`): `e.marchesini@groovesrl.com`.
Dopo la messa online fare un invio di prova: FormSubmit manda una mail di attivazione, cliccare il link **una sola volta**.
Facoltativo: dopo l'attivazione FormSubmit fornisce un alias da usare nella costante `RECIPIENT` al posto dell'email, così l'indirizzo non è visibile nel codice.

## 2. Deploy

Su tutti gli host: importare il repository GitHub, **nessun comando di build**, cartella di output `public`. Ogni push su `main` ripubblica automaticamente.

### Cloudflare Pages (consigliato)
Gratuito anche per uso commerciale, banda illimitata.
1. dash.cloudflare.com → Workers & Pages → Create → Pages → *Connect to Git* → `groove-scansione-rete`
2. Framework preset: *None* · Build command: vuoto · Build output directory: `public`
3. Custom domains → *Set up a custom domain* → `scansione.groovesrl.com`

### Netlify
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

Per rigenerarlo, anche con un codice evento che precompila il campo "Codice ticket":

```
pip install qrcode pillow
python qr/genera_qr.py https://chipper-puffpuff-1bfd9f.netlify.app/
python qr/genera_qr.py "https://chipper-puffpuff-1bfd9f.netlify.app/?src=FIERA-MILANO-2026"
```
