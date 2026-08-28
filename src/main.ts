import './style.css';
import { cardSvg } from './card-svg';
import { decodeSyntax, encodeSyntax, parseSyntax, sampleSyntax } from './model';
import { downloadPng, downloadSvg } from './export';
import { cachedLicenseIsValid, captureReturnedLicense, checkoutUrl, hasStoredLicense, restoreLicense, verifyStoredLicense } from './license';

const app = document.querySelector<HTMLDivElement>('#app') as HTMLDivElement;
if (!app) throw new Error('App root not found');

const realStorageKey = 'lesson-tab-card:source:v1';
let isDemo = false;
let source = '';
let paid = false;
let sharedError = '';
let returnedLicense = false;
let licenseNotice = '';

boot();

function boot() {
  returnedLicense = captureReturnedLicense();
  paid = cachedLicenseIsValid();
  history.scrollRestoration = 'manual';
  history.replaceState({ ...history.state, scrollY: scrollY }, '');
  route(false);
  addEventListener('popstate', (event) => {
    route(false);
    requestAnimationFrame(() => {
      scrollTo({ top: Number(event.state?.scrollY ?? 0), behavior: 'auto' });
      document.querySelector<HTMLElement>('h1')?.focus();
    });
  });
  document.addEventListener('click', handleRouteClick);
  document.addEventListener('keydown', editorShortcuts);
  if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('/service-worker.js').catch(() => undefined));
}

function route(moveFocus = true) {
  const url = new URL(location.href);
  isDemo = url.pathname === '/demo' || url.searchParams.get('demo') === '1';
  setMetadata(isDemo ? '/demo' : url.pathname);
  if (url.pathname === '/' || isDemo) renderEditorPage(url);
  else if (url.pathname === '/privacy') renderPolicy('privacy');
  else if (url.pathname === '/terms') renderPolicy('terms');
  else renderNotFound();
  if (moveFocus) {
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    requestAnimationFrame(() => document.querySelector<HTMLElement>('h1')?.focus());
  }
}

function setMetadata(path: string) {
  const values: Record<string, [string, string]> = {
    '/': ['Lesson Tab Card — Make guitar lesson handouts', 'Type a chord, fingering, and short tab. Export one clear guitar lesson card as SVG or PNG.'],
    '/demo': ['Demo — Lesson Tab Card', 'Edit a sample guitar lesson card in a sandbox. Nothing is saved.'],
    '/privacy': ['Privacy — Lesson Tab Card', 'Read how Lesson Tab Card stores lesson syntax and license details in your browser.'],
    '/terms': ['Terms — Lesson Tab Card', 'Read the terms for using Lesson Tab Card and its optional worksheet license.'],
  };
  const [title, description] = values[path] ?? ['Page not found — Lesson Tab Card', 'Return to the Lesson Tab Card editor.'];
  document.title = title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', `https://lesson-tab-card.sociobot.in${path}`);
}

function renderEditorPage(url: URL) {
  sharedError = '';
  if (isDemo) source = sampleSyntax;
  else {
    const fragmentEncoded = new URLSearchParams(url.hash.startsWith('#') ? url.hash.slice(1) : '').get('c');
    const legacyEncoded = url.searchParams.get('c');
    if (legacyEncoded) {
      url.searchParams.delete('c');
      history.replaceState(history.state, '', url.pathname + url.search + url.hash);
      sharedError = 'This older share link put lesson text in the request address. Copy a new private link before sharing.';
    }
    const encoded = fragmentEncoded ?? legacyEncoded;
    if (encoded) {
      const decoded = decodeSyntax(encoded);
      if (decoded === null) sharedError = 'This share link is damaged or too long. Start a new card below.';
      else source = decoded;
    } else source = localStorage.getItem(realStorageKey) ?? '';
  }

  app.innerHTML = `${isDemo ? demoBanner() : ''}${header()}
    <main id="main">
      <section class="hero" aria-labelledby="page-title">
        <div class="hero-copy">
          <p class="kicker">LESSON-SPEED NOTATION / 01</p>
          <h1 id="page-title" tabindex="-1">${isDemo ? 'Edit the sample lesson card' : 'Make a clear guitar lesson card'}</h1>
          <p class="lede">${isDemo ? 'Change the G to C exercise. This sandbox never touches your saved card.' : 'For teachers and players who need a readable handout before the lesson moves on.'}</p>
          ${isDemo ? '' : `<div class="hero-action"><a class="button primary" href="/demo" data-route>Try it with sample data</a><span>Loads a G to C warm-up below.</span></div>`}
          <ul class="plain-facts" aria-label="Product facts">
            <li>Works offline after the first visit</li>
            <li>Your card stays in this browser</li>
            <li>SVG and PNG exports stay free</li>
          </ul>
        </div>
        <div class="hero-stamp" aria-hidden="true"><b>6</b><span>strings</span><i>→</i><b>1</b><span>clear card</span></div>
      </section>
      ${editorSection()}
      <section class="process" aria-labelledby="how-heading">
        <div class="section-label">THE SHORT ROUTE</div>
        <h2 id="how-heading">How to make a card</h2>
        <ol class="steps">
          <li><b>01 / Type</b><span>Fill the seven short lines. The preview changes as you type.</span></li>
          <li><b>02 / Check</b><span>Fix any named line before you hand the card over.</span></li>
          <li><b>03 / Share</b><span>Export an image or copy a link for the student.</span></li>
        </ol>
        <figure class="desk-art">
          <img src="/assets/lesson-desk.webp" width="960" height="640" loading="lazy" decoding="async" alt="A blank cream lesson card sits beside guitar strings, a yellow note, and a blue marker." />
          <figcaption>A card-sized space keeps the lesson focused. Original image made for this product.</figcaption>
        </figure>
      </section>
      <section class="limits" aria-labelledby="limits-heading">
        <div><p class="section-label">KEEPS OUT OF THE WAY</p><h2 id="limits-heading">A handout, not a score editor</h2></div>
    <p>There is no song library, playback, account, or tracking. Lesson Tab Card stores one draft in your browser. New share links keep lesson text after the # sign.</p>
      </section>
      ${paidSection()}
    </main>${footer()}${liveRegions()}`;
  bindEditor();
  bindPaid();
  updatePreview();
  if (!isDemo) void verifyStoredLicense().then((valid) => {
    if (!valid && hasStoredLicense()) licenseNotice = 'The saved license is no longer active. You can check the token or buy the pack again.';
    if (valid !== paid) { paid = valid; renderEditorPage(new URL(location.href)); }
  });
  if (returnedLicense) {
    returnedLicense = false;
    announce('License received. Checking the worksheet pack now.');
  }
}

function editorSection() {
  return `<section class="workbench" id="editor" aria-labelledby="editor-heading">
    <div class="syntax-panel">
      <div class="panel-heading"><div><p class="section-label">INPUT</p><h2 id="editor-heading">Type the lesson</h2></div><span class="validity" id="validity">READY</span></div>
      ${sharedError ? `<p class="message error" role="alert">${sharedError}</p>` : ''}
      <label for="syntax">Lesson syntax</label>
      <textarea id="syntax" rows="14" spellcheck="false" autocapitalize="off" placeholder="title: First chord\nchord: C\nfrets: x 3 2 0 1 0\nfingers: x 3 2 0 1 0\ncapo: 0\nnote: Let every string ring."></textarea>
      <div class="editor-tools">
        <button type="button" class="button primary" id="export-svg">Export SVG</button>
        <button type="button" class="button" id="export-png">Export PNG</button>
        <button type="button" class="button" id="copy-link">Copy share link</button>
        <button type="button" class="text-button" id="clear-card">Clear card</button>
      </div>
      <div id="errors" class="validation" aria-live="polite"></div>
      <details class="syntax-help"><summary>Show the seven-line format</summary><pre>title: G to C change
chord: G
frets: 3 2 0 0 0 3
fingers: 2 1 0 0 0 3
capo: 0
tab:
e|--3---0--|  (then B, G, D, A, E)
note: Count four quiet beats.</pre><p>Use <b>x</b> for a muted string and <b>0</b> for an open string. Fret values run from 0 to 12.</p></details>
      <p class="shortcut"><kbd>Ctrl</kbd> + <kbd>Enter</kbd> exports SVG. <kbd>Alt</kbd> + <kbd>1</kbd> returns to the editor.</p>
    </div>
    <div class="preview-panel" aria-labelledby="preview-heading">
      <div class="panel-heading"><div><p class="section-label">OUTPUT</p><h2 id="preview-heading">Check the card</h2></div><span>900 × 540</span></div>
      <div id="preview" class="preview-sheet" tabindex="0" aria-label="Scrollable lesson card preview"></div>
    </div>
  </section>`;
}

function bindEditor() {
  const input = document.querySelector<HTMLTextAreaElement>('#syntax');
  if (!input) return;
  input.value = source;
  input.addEventListener('input', () => {
    source = input.value;
    if (!isDemo) localStorage.setItem(realStorageKey, source);
    updatePreview();
  });
  document.querySelector('#export-svg')?.addEventListener('click', () => exportCard('svg'));
  document.querySelector('#export-png')?.addEventListener('click', () => exportCard('png'));
  document.querySelector('#copy-link')?.addEventListener('click', copyShareLink);
  document.querySelector('#clear-card')?.addEventListener('click', () => {
    if (source && !confirm('Clear this lesson card? You cannot undo this action.')) return;
    source = '';
    input.value = '';
    if (!isDemo) localStorage.removeItem(realStorageKey);
    updatePreview();
    input.focus();
    announce('The card is clear. Type a title to start again.');
  });
  document.querySelector('#reset-demo')?.addEventListener('click', () => {
    source = sampleSyntax;
    input.value = source;
    updatePreview();
    announce('The sample lesson card is reset.');
  });
  document.querySelector('#start-real')?.addEventListener('click', () => {
    source = '';
    navigate('/');
  });
}

function editorShortcuts(event: KeyboardEvent) {
  if (event.altKey && event.key === '1') {
    event.preventDefault();
    document.querySelector<HTMLTextAreaElement>('#syntax')?.focus();
  } else if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    exportCard('svg');
  }
}

function updatePreview() {
  const preview = document.querySelector<HTMLDivElement>('#preview');
  const errors = document.querySelector<HTMLDivElement>('#errors');
  const validity = document.querySelector<HTMLSpanElement>('#validity');
  if (!preview || !errors || !validity) return;
  const result = parseSyntax(source);
  if (!result.card) {
    preview.innerHTML = `<div class="empty-preview"><b>Your card will appear here.</b><span>Type a title, chord, and six fret values to make it.</span></div>`;
    errors.innerHTML = '<p>No lesson yet. Start with a title: line.</p>';
    validity.textContent = 'EMPTY';
    validity.className = 'validity';
    return;
  }
  const printableErrors = result.errors.some((error) => error.includes('is too long'));
  preview.innerHTML = printableErrors
    ? '<div class="preview-error"><b>Shorten the named line before previewing.</b><span>The export stays blocked until every line fits the card.</span></div>'
    : cardSvg(result.card);
  if (result.errors.length) {
    errors.innerHTML = `<p><b>${result.errors.length} ${result.errors.length === 1 ? 'fix' : 'fixes'} needed:</b></p><ul>${result.errors.map((error) => `<li>${escapeHtml(error)}</li>`).join('')}</ul>`;
    validity.textContent = 'CHECK';
    validity.className = 'validity bad';
  } else {
    errors.innerHTML = '<p class="success">Ready to export and share.</p>';
    validity.textContent = 'VALID';
    validity.className = 'validity good';
  }
}

async function exportCard(format: 'svg' | 'png') {
  const result = parseSyntax(source);
  if (!result.card || result.errors.length) {
    announce('The card was not exported. Fix the named lesson lines first.');
    document.querySelector('#errors')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  try {
    if (format === 'svg') downloadSvg(result.card);
    else await downloadPng(result.card);
    announce(`${format.toUpperCase()} exported.`);
  } catch (error) {
    announce(error instanceof Error ? error.message : 'The export failed. Try SVG instead.');
  }
}

async function copyShareLink() {
  const result = parseSyntax(source);
  if (!result.card || result.errors.length) {
    announce('The link was not copied. Fix the named lesson lines first.');
    return;
  }
  const url = `${location.origin}/#c=${encodeSyntax(source)}`;
  try {
    await navigator.clipboard.writeText(url);
    announce('Private share link copied. Its lesson text stays after the # sign.');
  } catch {
    const input = document.createElement('input');
    input.value = url;
    document.body.append(input);
    input.select();
    document.execCommand('copy');
    input.remove();
    announce('Private share link copied. Its lesson text stays after the # sign.');
  }
}

function paidSection() {
  return `<section class="paid" id="worksheet-pack" aria-labelledby="paid-heading">
    <div><p class="section-label">OPTIONAL PACK / $9 ONCE</p><h2 id="paid-heading">Print four cards on one sheet</h2><p>The free editor and single-card exports do not change. The worksheet pack adds a four-card SVG page for lesson folders.</p></div>
    <div class="paid-actions">
      ${licenseNotice ? `<p class="message error">${licenseNotice}</p>` : ''}
      ${paid || isDemo ? `<p class="license-state success">${isDemo ? 'Sample worksheet preview is open in this demo.' : 'Worksheet pack active on this browser.'}</p><button class="button primary" id="export-worksheet">${isDemo ? 'Export sample 4-card worksheet' : 'Export 4-card worksheet'}</button>` : `<a class="button primary" href="${checkoutUrl}">Buy worksheet pack — $9</a>`}
      <details><summary>Have a license? Paste it</summary><label for="license-token">License token</label><input id="license-token" autocomplete="off" /><button class="button" id="restore-license" type="button" aria-label="Verify license">Verify license</button><p id="license-message" aria-live="polite"></p></details>
      <p class="fine-print">One-time purchase. Sociobot and Dodo handle checkout and refunds. See <a href="/terms" data-route>terms</a>.</p>
    </div>
  </section>`;
}

function bindPaid() {
  document.querySelector('#export-worksheet')?.addEventListener('click', () => {
    const result = parseSyntax(source);
    if (!result.card || result.errors.length) announce('The worksheet was not exported. Fix the named lesson lines first.');
    else { downloadSvg(result.card, true); announce('Four-card worksheet exported.'); }
  });
  document.querySelector('#restore-license')?.addEventListener('click', async () => {
    const input = document.querySelector<HTMLInputElement>('#license-token');
    const message = document.querySelector<HTMLElement>('#license-message');
    if (!input || !message) return;
    message.textContent = 'Checking this license…';
    const valid = await restoreLicense(input.value);
    if (valid) { paid = true; renderEditorPage(new URL(location.href)); announce('License verified. The worksheet pack is active.'); }
    else message.textContent = 'This license could not be verified. Check the token and try again online.';
  });
}

function renderPolicy(kind: 'privacy' | 'terms') {
  const privacy = kind === 'privacy';
  app.innerHTML = `${header()}<main id="main" class="text-page"><p class="kicker">PLAIN-LANGUAGE POLICY</p><h1 tabindex="-1">${privacy ? 'Your lesson stays on your device' : 'Terms for using Lesson Tab Card'}</h1>
    ${privacy ? `<p class="lede">Lesson Tab Card has no account system and no analytics.</p>
      <h2>What the browser stores</h2><p>The editor stores your current lesson text in local storage. New share links keep the same text after the # sign. Demo mode keeps its sample in memory and does not read or write your saved lesson.</p>
      <h2>What leaves the browser</h2><p>New share-link lesson text and exports do not leave your browser in HTTP requests. If you buy or verify a worksheet license, your browser contacts the Sociobot billing API. We do not send your lesson text with that request.</p>
      <h2>Older share links</h2><p>Older links that use ?c= put lesson text in the request address. Open one only to copy a new link, then remove the old link.</p>
      <h2>How to remove data</h2><p>Use “Clear card” to remove the saved lesson. Clear this site’s browser storage to remove a license token and its last verification result.</p>
      <h2>Questions</h2><p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p>` : `<p class="lede">Use the editor for your own lesson material and original exercises.</p>
      <h2>Free editor</h2><p>You may create, export, print, and share lesson cards. Do not use the product to distribute material you do not have permission to share.</p>
      <h2>Worksheet license</h2><p>The worksheet pack costs $9 as a one-time purchase. A valid license activates it on one browser at a time. You can paste the same token on another device. Accessibility, validation, SVG export, PNG export, and share links remain free.</p>
      <h2>Checkout and refunds</h2><p>Sociobot and Dodo are the merchant of record. They process payment and refunds. A refunded or revoked license stops activating the worksheet pack.</p>
      <h2>No warranty</h2><p>The software is provided under the MIT License without warranty. Check fret numbers and teaching notes before sharing a card.</p>
      <h2>Questions</h2><p>Email <a href="mailto:support@sociobot.in">support@sociobot.in</a>.</p>`}
    <p><a class="button" href="/" data-route>Return to the editor</a></p></main>${footer()}${liveRegions()}`;
}

function renderNotFound() {
  app.innerHTML = `${header()}<main id="main" class="not-found"><div class="broken-grid" aria-hidden="true">× 0 3 ? 2 ×</div><p class="kicker">404 / WRONG FRET</p><h1 tabindex="-1">This page is not on the chart</h1><p>Return to the editor and make a lesson card.</p><a class="button primary" href="/" data-route>Return to the editor</a></main>${footer()}${liveRegions()}`;
}

function header() {
  return `<a class="skip-link" href="#main">Skip to main content</a><header class="site-header"><a class="wordmark" href="/" data-route aria-label="Lesson Tab Card home"><span>LT</span> LESSON TAB CARD</a><nav aria-label="Main navigation"><a href="/#editor" data-route>Editor</a><a href="/demo" data-route>Demo</a><a href="/privacy" data-route>Privacy</a></nav></header>`;
}

function footer() {
  return `<footer><p><b>Lesson Tab Card</b> — Make a clear guitar handout.</p><nav aria-label="Footer navigation"><a href="/privacy" data-route>Privacy</a><a href="/terms" data-route>Terms</a><a href="https://sociobot.in">Built by Param Factory <span class="sr-only">(external site)</span></a></nav><p>v1.0 / build 2026.08.28 · Original generated imagery.</p></footer>`;
}

function demoBanner() {
  return `<aside class="demo-banner" aria-label="Demo status"><strong>Demo — sample data, nothing is saved</strong><div><button type="button" id="reset-demo">Reset demo</button><button type="button" id="start-real">Start for real</button></div></aside>`;
}

function liveRegions() {
  return '<div id="announcer" class="sr-only" aria-live="polite" aria-atomic="true"></div>';
}

function handleRouteClick(event: MouseEvent) {
  const target = (event.target as Element).closest<HTMLAnchorElement>('a[data-route]');
  if (!target || target.origin !== location.origin || event.ctrlKey || event.metaKey || event.shiftKey) return;
  const url = new URL(target.href);
  if (url.pathname === location.pathname && url.hash) return;
  event.preventDefault();
  navigate(url.pathname + url.search + url.hash);
}

function navigate(url: string) {
  history.replaceState({ ...history.state, scrollY: scrollY }, '');
  history.pushState({ scrollY: 0 }, '', url);
  route();
}

function announce(message: string) {
  const region = document.querySelector<HTMLElement>('#announcer');
  if (!region) return;
  region.textContent = '';
  requestAnimationFrame(() => { region.textContent = message; });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character);
}
