import test from 'node:test';
import assert from 'node:assert/strict';
import { contactSchema, createLimiter, deliverContact, type Mail } from '../src/lib/contact/service';
import { loadCatalog } from '../src/lib/content/load';
import { POST } from '../src/app/api/contact/route';
const input = { type: 'company-message', companyId: 'zoom-cleaning', name: 'Test local', email: 'visitor@example.org', message: 'Mesaj fictiv pentru test local.', page: '/firme/zoom-cleaning/', acknowledged: true };
const config = { from: 'portal@example.org', admin: 'admin@example.org' };
test('verified recipient is server resolved, administrator copied, reply-to visitor', async () => {
  let mail: Mail | undefined;
  const result = await deliverContact(input, await loadCatalog(), config, async m => { mail = m; return { accepted: [m.to, m.bcc!] }; });
  assert.equal(mail?.to, 'info@zoomcleaning.ro'); assert.equal(mail?.bcc, config.admin);
  assert.equal(mail?.replyTo, input.email); assert.equal(mail?.from, config.from);
  assert(mail?.text.includes(input.page)); assert(mail?.text.includes(result.id)); assert(result.copyAccepted);
});
test('submission only goes to administrator and includes review details', async () => {
  await deliverContact({ ...input, type: 'company-submission', companyName: 'Test', phone: '0700000000', services: 'Serviciu test', headquarters: 'Oraș test', coverage: 'Zonă test', source: 'https://example.org', publicPhone: '0700000000' }, await loadCatalog(), config, async mail => {
    assert.equal(mail.to, config.admin); assert.equal(mail.bcc, undefined); assert(mail.text.includes('Telefon: 0700000000')); return { accepted: [mail.to] };
  });
});
test('reject missing email, arbitrary recipient, honeypot and incomplete submissions', async () => {
  const catalog = await loadCatalog(); let calls = 0;
  const send = async () => { calls++; return { accepted: [] }; };
  await assert.rejects(deliverContact({ ...input, companyId: 'alpha-cleaning' }, catalog, config, send));
  await assert.rejects(deliverContact({ ...input, to: 'attacker@example.org' }, catalog, config, send));
  await assert.rejects(deliverContact({ ...input, website: 'spam' }, catalog, config, send));
  assert(!contactSchema.safeParse({ ...input, type: 'company-submission' }).success); assert.equal(calls, 0);
});
test('SMTP error or rejected company recipient never reports success; copy rejection distinct', async () => {
  const catalog = await loadCatalog();
  await assert.rejects(deliverContact(input, catalog, config, async () => { throw new Error('SMTP'); }));
  await assert.rejects(deliverContact(input, catalog, config, async () => ({ accepted: [config.admin] })));
  const result = await deliverContact(input, catalog, config, async m => ({ accepted: [m.to] })); assert.equal(result.copyAccepted, false);
});
test('limiter expires, isolates clients and blocks sixth request', () => {
  const allow = createLimiter(); for (let i = 0; i < 5; i++) assert(allow('a', 1));
  assert(!allow('a', 2)); assert(allow('b', 2)); assert(allow('a', 600002));
});
test('API rejects cross-origin, invalid JSON and oversized payload before SMTP', async () => {
  const old = process.env.CONTACT_ORIGIN; process.env.CONTACT_ORIGIN = 'http://localhost:4173';
  try {
    const req = (origin: string, body: string) => new Request('http://localhost:4173/api/contact/', { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body });
    assert.equal((await POST(req('https://bad.example', '{}'))).status, 403);
    assert.equal((await POST(req('http://localhost:4173', '{'))).status, 400);
    assert.equal((await POST(req('http://localhost:4173', 'x'.repeat(17000)))).status, 413);
  } finally { if (old === undefined) delete process.env.CONTACT_ORIGIN; else process.env.CONTACT_ORIGIN = old; }
});
test('API without SMTP returns unavailable without pretending success', async () => {
  const oldOrigin = process.env.CONTACT_ORIGIN; const oldHost = process.env.SMTP_HOST;
  process.env.CONTACT_ORIGIN = 'http://localhost:4173'; delete process.env.SMTP_HOST;
  try {
    const response = await POST(new Request('http://localhost:4173/api/contact/', { method: 'POST', headers: { origin: 'http://localhost:4173', 'content-type': 'application/json', 'x-forwarded-for': '192.0.2.20' }, body: JSON.stringify(input) }));
    assert.equal(response.status, 503); assert.equal(response.headers.get('x-robots-tag'), 'noindex');
  } finally { if (oldOrigin === undefined) delete process.env.CONTACT_ORIGIN; else process.env.CONTACT_ORIGIN = oldOrigin; if (oldHost === undefined) delete process.env.SMTP_HOST; else process.env.SMTP_HOST = oldHost; }
});

test('minimal signup accepts phone without email or message and keeps other forms strict', async () => {
  const minimal = { type: 'company-submission', name: 'Test', companyName: 'Firma test', phone: '0700000000', page: '/inscriere-firma/', acknowledged: true };
  await deliverContact(minimal, await loadCatalog(), config, async mail => {
    assert.equal(mail.replyTo, config.admin); assert.equal(mail.to, config.admin); assert(mail.text.includes('Firma test')); return { accepted: [mail.to] };
  });
  assert(!contactSchema.safeParse({ ...minimal, phone: '' }).success);
  assert(!contactSchema.safeParse({ ...input, email: '' }).success);
  assert(!contactSchema.safeParse({ ...input, message: '' }).success);
});
