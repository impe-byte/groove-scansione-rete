// Riceve il modulo della pagina e lo invia via email tramite la casella SMTP di Groove.
// Configurazione in Netlify → Site configuration → Environment variables:
//   SMTP_HOST, SMTP_PORT (465 o 587), SMTP_USER, SMTP_PASS, MAIL_TO, MAIL_FROM (facoltativa, default SMTP_USER)
import nodemailer from "nodemailer";

const FIELDS = [
  "Nome", "Cognome", "Azienda", "email", "Telefono", "Sede", "Tipo rete",
  "Dispositivi stimati", "Disponibilita", "Note", "Presa visione privacy", "Consenso marketing", "Inviato il",
];
const REQUIRED = ["Nome", "Cognome", "Azienda", "email", "Telefono", "Sede", "Tipo rete", "Presa visione privacy"];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export default async (req) => {
  if (req.method !== "POST") return json(405, { ok: false });

  let data;
  try {
    data = await req.json();
  } catch {
    return json(400, { ok: false, error: "Richiesta non valida" });
  }
  if (data._honey) return json(200, { ok: true }); // bot: finta conferma, nessun invio

  const clean = {};
  for (const f of FIELDS) clean[f] = String(data[f] ?? "").trim().slice(0, 2000);
  if (REQUIRED.some((f) => !clean[f]) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) {
    return json(400, { ok: false, error: "Campi obbligatori mancanti" });
  }

  const { SMTP_HOST, SMTP_PORT = "587", SMTP_USER, SMTP_PASS, MAIL_TO, MAIL_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !MAIL_TO) {
    console.error("Variabili SMTP mancanti");
    return json(500, { ok: false, error: "Servizio non configurato" });
  }

  const rows = FIELDS.filter((f) => clean[f])
    .map((f) => `<tr><th align="left" style="padding:6px 12px;background:#f3f1f7">${esc(f)}</th><td style="padding:6px 12px">${esc(clean[f]).replace(/\n/g, "<br>")}</td></tr>`)
    .join("");
  const text = FIELDS.filter((f) => clean[f]).map((f) => `${f}: ${clean[f]}`).join("\n");

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    await transporter.sendMail({
      from: `"Richieste scansione di rete" <${MAIL_FROM || SMTP_USER}>`,
      to: MAIL_TO,
      replyTo: clean.email,
      subject: `Nuova richiesta scansione di rete – ${clean.Azienda} (${clean.Nome} ${clean.Cognome})`,
      text,
      html: `<h2 style="font-family:sans-serif">Nuova richiesta scansione di rete</h2><table style="font-family:sans-serif;border-collapse:collapse">${rows}</table>`,
    });
  } catch (err) {
    console.error("Invio SMTP fallito:", err.message);
    return json(502, { ok: false, error: "Invio email non riuscito" });
  }
  return json(200, { ok: true });
};

export const config = { path: "/api/invia-richiesta" };
