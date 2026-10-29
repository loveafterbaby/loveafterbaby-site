const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const SITE = path.join(__dirname, '..');
const pages = ['index.html','therapy.html','membership.html','shop.html','about.html'];
const read = f => fs.readFileSync(path.join(SITE, f), 'utf8');

test('every page has viewport, title, noindex, shared nav and stylesheet', () => {
  for (const p of pages) {
    const h = read(p);
    assert.match(h, /<meta name="viewport" content="width=device-width, initial-scale=1/, p);
    assert.match(h, /<title>[^<]{10,}<\/title>/, p);
    assert.match(h, /<meta name="robots" content="noindex, nofollow">/, p);
    for (const q of pages) assert.ok(h.includes(`href="${q}"`), `${p} links ${q}`);
    assert.ok(h.includes('<main id="main">'), p);
  }
});

test('local assets referenced by pages and CSS exist', () => {
  const refs = new Set();
  for (const p of pages) for (const m of read(p).matchAll(/(?:src|href)="([^"#:]+)"/g)) refs.add(m[1]);
  for (const m of read('styles.css').matchAll(/url\(([^)]+)\)/g)) refs.add(m[1].replace(/['"]/g,''));
  for (const r of refs) assert.ok(fs.existsSync(path.join(SITE, r)), `missing ${r}`);
});

test('core content: licensing, booking, waitlist, Stan store', () => {
  const t = read('therapy.html');
  assert.match(t, /Licensed in Florida and New York/);
  assert.ok(t.includes('mailto:hello@thriveandshinewellness.com?subject=Free%20consult%20request'));
  assert.match(t, />Book a free consult</);
  const m = read('membership.html');
  assert.match(m, /Closed for enrollment/);
  assert.ok(m.includes('id="wl-name"') && m.includes('id="wl-email"'));
  assert.ok(read('script.js').includes("mailto:hello@loveafterbaby.com?subject="));
  const s = read('shop.html');
  assert.ok(s.includes('https://stan.store/loveafterbaby"'));
  assert.ok(s.includes('https://stan.store/loveafterbaby/p/get-the-love-after-baby-starter-kit-now-'));
  const a = read('about.html');
  assert.match(a, /mom of four/);
  assert.match(a, /MH16586/);
  assert.match(read('index.html'), /Love After Baby/);
});

test('no broken placeholders, no gmail, no calendar booking link', () => {
  for (const f of [...pages, 'script.js']) {
    const h = read(f);
    assert.doesNotMatch(h, /lorem|TODO|PLACEHOLDER|href="#"|\{\{|\{BOOK\}|\{title\}/i, f);
    assert.doesNotMatch(h, /gmail\.com/i, f);
    assert.doesNotMatch(h, /calendly|book-a-15-minute-intro-call/i, f);
  }
});
