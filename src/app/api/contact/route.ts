import { contactOrigin } from '@/lib/contact/origin';
import nodemailer from 'nodemailer';
import { createHash } from 'node:crypto';
import { loadCatalog } from '@/lib/content/load';
import { contactSchema, createLimiter, deliverContact } from '@/lib/contact/service';
import { site } from '@/config/site';
export const runtime = 'nodejs';
const allow = createLimiter();
const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' };
const reply = (status: number, message: string, extra = {}) => Response.json({ message, ...extra }, { status, headers });
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const expected = contactOrigin(request.url, site.url, process.env);
  if (!expected || origin !== expected) return reply(403, 'Solicitarea nu provine din site.');
  const key = createHash('sha256').update(request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown').digest('hex');
  if (!allow(key)) return reply(429, 'Prea multe încercări. Reîncearcă în 10 minute sau contactează-ne direct.');
  if (!request.headers.get('content-type')?.startsWith('application/json')) return reply(415, 'Format neacceptat.');
  let raw: unknown;
  try {
    const reader = request.body?.getReader(); if (!reader) return reply(400, 'Completează formularul.');
    let size = 0; const chunks: Uint8Array[] = [];
    while (true) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > 16000) { await reader.cancel(); return reply(413, 'Mesajul este prea lung.'); } chunks.push(value); }
    raw = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch { return reply(400, 'Date invalide.'); }
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success || parsed.data.website) return reply(400, 'Verifică toate câmpurile obligatorii.');
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) return reply(503, 'Trimiterea din site nu este disponibilă momentan. Folosește telefonul sau emailul afișat.');
  const transport = nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT), secure: SMTP_PORT === '465', requireTLS: SMTP_PORT !== '465', auth: { user: SMTP_USER, pass: SMTP_PASS }, connectionTimeout: 10000, socketTimeout: 15000 });
  try {
    const result = await deliverContact(parsed.data, await loadCatalog(), { from: SMTP_FROM, admin: site.contactEmail }, async mail => {
      const sent = await transport.sendMail(mail); return { accepted: sent.accepted.map(String) };
    });
    if (!result.copyAccepted) console.error('Contact administrator copy rejected', result.id);
    return reply(200, 'Mesajul a fost acceptat la trimitere. Nu reprezintă o programare confirmată.', { id: result.id });
  } catch (error) { return reply(error instanceof Error && error.message === 'INVALID' ? 400 : 502, 'Mesajul nu a putut fi trimis. Datele au rămas în formular; poți folosi contactul direct.'); }
  finally { transport.close(); }
}
