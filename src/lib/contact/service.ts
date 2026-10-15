import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import type { Catalog } from '../content/schemas';
const line = z.string().trim().min(1).max(160).refine(v => !/[\r\n]/.test(v));
export const contactSchema = z.object({
  type: z.enum(['company-message', 'company-submission', 'correction', 'platform-contact']),
  name: line, email: z.union([z.email().max(254), z.literal('')]).default(''), phone: z.string().max(30).default(''),
  message: z.string().trim().max(4000).default(''), companyId: z.string().max(100).optional(),
  companyName: z.string().max(160).optional(), services: z.string().max(500).optional(),
  headquarters: z.string().max(300).optional(), coverage: z.string().max(500).optional(),
  source: z.string().max(500).optional(), publicPhone: z.string().max(30).optional(),
  page: z.string().max(500).regex(/^\/(?!\/)[^\r\n\\]*$/),
  website: z.string().max(200).default(''), acknowledged: z.literal(true),
}).strict().superRefine((v, ctx) => {
  if (v.type === 'company-message' && !v.companyId) ctx.addIssue({ code: 'custom', message: 'Firma lipsește.' });
  if (v.type === 'company-submission') {
    if (!v.companyName?.trim()) ctx.addIssue({ code: 'custom', path: ['companyName'], message: 'Numele firmei este obligatoriu.' });
    if (!/^\+?[0-9 ()-]{7,30}$/.test(v.phone) || v.phone.replace(/\D/g, '').length < 7) ctx.addIssue({ code: 'custom', path: ['phone'], message: 'Introdu un telefon valid.' });
  } else {
    if (!v.email) ctx.addIssue({ code: 'custom', path: ['email'], message: 'Email obligatoriu.' });
    if (v.message.length < 10) ctx.addIssue({ code: 'custom', path: ['message'], message: 'Mesajul trebuie să aibă minimum 10 caractere.' });
  }
});
export type Mail = { from: string; to: string; bcc?: string; replyTo: string; subject: string; text: string };
export type Sender = (mail: Mail) => Promise<{ accepted: string[] }>;
export async function deliverContact(raw: unknown, catalog: Catalog, config: { from: string; admin: string }, send: Sender) {
  const data = contactSchema.parse(raw);
  if (data.website) throw new Error('INVALID');
  const company = data.type === 'company-message' ? catalog.companies.find(c => c.id === data.companyId && c.status === 'published' && c.email && c.evidence.email?.length) : undefined;
  if (data.type === 'company-message' && !company) throw new Error('INVALID');
  const id = randomUUID();
  const to = company?.email ?? config.admin;
  const labels = { 'company-message': 'Mesaj către firmă', 'company-submission': 'Înscriere firmă', correction: 'Corectură', 'platform-contact': 'Contact platformă' };
  const text = [`Solicitare DirectLocal.ro: ${id}`, `Data: ${new Date().toISOString()}`, `Tip: ${labels[data.type]}`, `Firmă: ${company?.name ?? data.companyName ?? '-'}`, `Pagina de origine (declarată de utilizator): ${data.page}`, `Nume: ${data.name}`, `Email: ${data.email || "Nefurnizat"}`, `Telefon: ${data.phone || '-'}`, '', data.message || "Solicit înscrierea firmei și doresc să fiu contactat.", '', 'Acest mesaj provine din formularul DirectLocal.ro. Nu reprezintă o programare confirmată.'].join('\n');
  const result = await send({ from: config.from, to, ...(company && to !== config.admin ? { bcc: config.admin } : {}), replyTo: data.email || config.admin, subject: `[DirectLocal.ro] ${labels[data.type]} — ${id}`, text });
  if (!result.accepted.some(a => a.toLowerCase() === to.toLowerCase())) throw new Error('DELIVERY');
  return { id, copyAccepted: !company || result.accepted.some(a => a.toLowerCase() === config.admin.toLowerCase()) };
}
export function createLimiter() {
  const attempts = new Map<string, { count: number; until: number }>();
  return (key: string, now = Date.now()) => {
    for (const [k, v] of attempts) if (v.until <= now) attempts.delete(k);
    const value = attempts.get(key) ?? { count: 0, until: now + 600_000 };
    if (attempts.size >= 10000 && !attempts.has(key)) return false;
    value.count++; attempts.set(key, value); return value.count <= 5;
  };
}
