import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

const base = 'https://lesson-tab-card.sociobot.in';
const failures = [];
const result = { testedAt: new Date().toISOString(), base, failures };
const check = (value, message) => { if (!value) failures.push(message); };
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const browser = await chromium.launch({ headless: true });

// Independent desktop job flow, including request privacy and adversarial input.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: base });
  const page = await context.newPage();
  const requests = [];
  const errors = [];
  page.on('request', (request) => requests.push({
    method: request.method(), url: request.url(), referer: request.headers().referer ?? '', body: request.postData() ?? '',
  }));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  page.on('pageerror', (error) => errors.push(`page: ${error.message}`));

  const response = await page.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  const axeDesktop = await new AxeBuilder({ page }).analyze();
  const seriousDesktop = axeDesktop.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''));

  const validSource = `title: QA boundary\nchord: Cmaj7\nfrets: 0 12 x 0 12 x\nfingers: 0 4 x 0 4 x\ncapo: 12\ntab:\ne|--0-12--|\nB|--1-12--|\nG|--0-12--|\nD|--2-12--|\nA|--3-12--|\nE|--x-12--|\nnote: Check the lower and upper limits.`;
  const input = page.getByLabel('Lesson syntax');
  await input.fill(validSource);
  const ready = await page.getByText('Ready to export and share.').isVisible();

  const svgEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export SVG' }).click();
  const svgDownload = await svgEvent;
  const svgBytes = await readFile(await svgDownload.path());
  const svgText = svgBytes.toString('utf8');

  const pngEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export PNG' }).click();
  const pngDownload = await pngEvent;
  const pngBytes = await readFile(await pngDownload.path());

  await page.getByRole('button', { name: 'Copy share link' }).click();
  const shareLink = await page.evaluate(() => navigator.clipboard.readText());
  const shareUrl = new URL(shareLink);
  await page.goto(shareLink, { waitUntil: 'networkidle' });
  const restoredSource = await input.inputValue();

  await input.fill('title: Invalid recovery\nchord: C\nfrets: -1 13 x 0 12 x\nfingers: -1 5 x 0 4 x\ncapo: 13');
  const invalidText = await page.locator('#errors').innerText();
  const invalidPreview = await page.locator('#preview').innerHTML();
  let invalidDownloaded = false;
  page.once('download', () => { invalidDownloaded = true; });
  await page.getByRole('button', { name: 'Export SVG' }).click();
  await delay(250);

  const xssSource = 'title: <script>x</script>\nchord: <img>\nfrets: x 3 2 0 1 0\nfingers: x 3 2 0 1 0\ncapo: 0\nnote: <img src=x onerror=alert(1)>';
  await input.fill(xssSource);
  const injectedNodes = await page.locator('#preview script, #preview img').count();
  const xssPreview = await page.locator('#preview').innerHTML();

  const source4000 = `title: ${'A'.repeat(3993)}`;
  const source4001 = `${source4000}A`;
  await input.fill(source4000);
  const at4000HasLengthError = (await page.locator('#errors').innerText()).includes('over 4,000');
  await input.fill(source4001);
  const over4000Text = await page.locator('#errors').innerText();
  await page.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Reset demo' }).click();
  const resetValue = await input.inputValue();

  await page.goto(`${base}/#c=%%%`, { waitUntil: 'networkidle' });
  const damagedText = await page.locator('body').innerText();

  const sensitive = ['QA boundary', 'Check the lower and upper limits'];
  const privacyLeaks = requests.filter((request) => sensitive.some((term) => request.url.includes(term) || request.referer.includes(term) || request.body.includes(term)));
  const externalRequests = requests.filter((request) => new URL(request.url).origin !== base);

  result.desktopFlow = {
    status: response?.status(), ready,
    svg: { name: svgDownload.suggestedFilename(), bytes: svgBytes.length, hasTitle: svgText.includes('QA boundary') },
    png: { name: pngDownload.suggestedFilename(), bytes: pngBytes.length, signature: [...pngBytes.subarray(0, 8)] },
    share: { query: shareUrl.search, hashPrefix: shareUrl.hash.slice(0, 4), exactRestore: restoredSource === validSource },
    invalid: { text: invalidText, hasNaN: invalidPreview.includes('NaN'), downloaded: invalidDownloaded },
    xss: { injectedNodes, escaped: xssPreview.includes('&lt;script&gt;') && xssPreview.includes('&lt;img&gt;') },
    sourceLength: { at4000HasLengthError, over4000Text, resetRestoredSample: resetValue.includes('title: G to C change') },
    damagedFragmentHasRecovery: damagedText.includes('This share link is damaged or too long'),
    requestCount: requests.length, externalRequests, privacyLeaks, requests,
    seriousCriticalAxe: seriousDesktop.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })), errors,
  };

  check(response?.status() === 200, 'Demo did not return 200.');
  check(ready, 'Valid boundary card was not accepted.');
  check(svgBytes.length > 1000 && svgText.includes('QA boundary'), 'SVG export was not valid.');
  check(pngBytes.length > 10000 && [...pngBytes.subarray(0, 4)].join(',') === '137,80,78,71', 'PNG export was not valid.');
  check(shareUrl.search === '' && shareUrl.hash.startsWith('#c=') && restoredSource === validSource, 'Private share link did not restore exactly.');
  check(invalidText.includes('Frets value 1 is invalid.') && invalidText.includes('Frets value 2 is invalid.') && invalidText.includes('invalid capo'), 'Adjacent invalid bounds were not named.');
  check(!invalidPreview.includes('NaN') && !invalidDownloaded, 'Invalid input rendered NaN or downloaded.');
  check(injectedNodes === 0 && xssPreview.includes('&lt;script&gt;'), 'Markup-like lesson text was not escaped.');
  check(!at4000HasLengthError && over4000Text.includes('The card is over 4,000 characters. Shorten it and try again.'), '4,000/4,001 source boundary failed.');
  check(resetValue.includes('title: G to C change'), 'Reset demo did not recover the sample.');
  check(damagedText.includes('This share link is damaged or too long'), 'Damaged share fragment lacked recovery feedback.');
  check(externalRequests.length === 0 && privacyLeaks.length === 0, 'Ordinary editor flow leaked data or made a cross-origin request.');
  check(seriousDesktop.length === 0 && errors.length === 0, 'Desktop flow had serious/critical Axe or browser errors.');
  await context.close();
}

// Mobile, keyboard-only, focus styling, target sizing, and reduced motion.
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  const axeMobile = await new AxeBuilder({ page }).analyze();
  const seriousMobile = axeMobile.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''));
  const layout = await page.evaluate(() => ({ clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
  const undersized = await page.locator('a:visible, button:visible, input:visible, textarea:visible, summary:visible').evaluateAll((elements) => elements.map((element) => {
    const box = element.getBoundingClientRect();
    return { label: (element.textContent || element.getAttribute('aria-label') || element.tagName).trim(), width: box.width, height: box.height };
  }).filter((item) => item.width < 44 || item.height < 44));
  const skip = page.getByRole('link', { name: 'Skip to main content' });
  for (let i = 0; i < 5 && !(await skip.evaluate((element) => element === document.activeElement)); i += 1) {
    await page.keyboard.press('Tab');
  }
  const focusStyle = await skip.evaluate((element) => {
    const style = getComputedStyle(element);
    return { outline: style.outline, outlineColor: style.outlineColor, outlineWidth: style.outlineWidth, outlineOffset: style.outlineOffset };
  });
  await page.keyboard.press('Enter');
  const skipTargetFocused = await page.locator('#main').evaluate((element) => element === document.activeElement);
  await page.getByRole('button', { name: 'Export PNG' }).focus();
  await page.keyboard.press('Alt+1');
  const alt1Focused = await page.getByLabel('Lesson syntax').evaluate((element) => element === document.activeElement);
  const motion = await page.evaluate(() => {
    const toMs = (value) => value.split(',').map((part) => part.trim().endsWith('ms') ? Number.parseFloat(part) : Number.parseFloat(part) * 1000).filter(Number.isFinite);
    const values = [...document.querySelectorAll('*')].flatMap((element) => {
      const style = getComputedStyle(element);
      return [...toMs(style.animationDuration), ...toMs(style.transitionDuration)];
    });
    return { reducedMatches: matchMedia('(prefers-reduced-motion: reduce)').matches, maxDurationMs: Math.max(0, ...values) };
  });
  await page.screenshot({ path: '.factory/qa-evidence/live-independent-mobile.png', fullPage: true });
  result.mobile = {
    layout, undersized, focusStyle, skipTargetFocused, alt1Focused, motion,
    seriousCriticalAxe: seriousMobile.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })), errors,
  };
  check(layout.scrollWidth === layout.clientWidth, 'Mobile page has horizontal overflow.');
  check(undersized.length === 0, 'Mobile has interactive targets below 44px.');
  check(skipTargetFocused && alt1Focused, 'Keyboard focus paths failed.');
  check(Number.parseFloat(focusStyle.outlineWidth) > 0, 'Focus indicator is not visible.');
  check(motion.reducedMatches && motion.maxDurationMs <= 0.02, 'Reduced motion leaves meaningful animation enabled.');
  check(seriousMobile.length === 0 && errors.length === 0, 'Mobile flow had serious/critical Axe or browser errors.');
  await context.close();
}

// Real routes, titles, landmark basics, service worker update, and offline reload.
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const routeResults = [];
  for (const path of ['/', '/demo', '/privacy', '/terms', '/does-not-exist-qa5']) {
    const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    routeResults.push(await page.evaluate(({ path, status }) => ({
      path, status, title: document.title, lang: document.documentElement.lang,
      h1: document.querySelectorAll('h1').length, main: document.querySelectorAll('main').length,
      imagesMissingAlt: [...document.images].filter((image) => !image.hasAttribute('alt')).length,
    }), { path, status: response?.status() }));
  }
  await page.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  const swBefore = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    await registration?.update();
    return { caches: await caches.keys(), active: registration?.active?.state, waiting: registration?.waiting?.state ?? null, installing: registration?.installing?.state ?? null };
  });
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  const offlineDemo = await page.getByRole('heading', { level: 1, name: 'Edit the sample lesson card' }).isVisible();
  await page.goto(`${base}/privacy`, { waitUntil: 'domcontentloaded' });
  const offlinePrivacy = await page.getByRole('heading', { level: 1, name: 'Your lesson stays on your device' }).isVisible();
  await context.setOffline(false);
  result.routesAndOffline = { routeResults, swBefore, offlineDemo, offlinePrivacy };
  check(routeResults.slice(0, 4).every((route) => route.status === 200 && route.lang === 'en' && route.h1 === 1 && route.main === 1 && route.imagesMissingAlt === 0), 'A standard live route failed semantic/status checks.');
  check(routeResults[4].status === 404 && routeResults[4].title.includes('Page not found'), 'Unknown live route is not a designed HTTP 404.');
  check(swBefore.active === 'activated' && !swBefore.waiting && !swBefore.installing, 'Service worker update has a pending worker.');
  check(offlineDemo && offlinePrivacy, 'Offline demo/privacy reload failed.');
  await context.close();
}

// Fresh live checks for the three defects reported by verification 4.
{
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.evaluate(() => {
    localStorage.setItem('sb_license:lesson-tab-card', 'qa-stale-offline-license-5');
    localStorage.setItem('sb_license_verdict:lesson-tab-card', JSON.stringify({ valid: true, checkedAt: Date.now() - 25 * 60 * 60 * 1000 }));
  });
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  const staleOffline = {
    activeMessage: await page.getByText('Worksheet pack active on this browser.').isVisible(),
    worksheetButton: await page.getByRole('button', { name: 'Export 4-card worksheet' }).isVisible(),
    buyLinkCount: await page.getByRole('link', { name: 'Buy worksheet pack — $9' }).count(),
  };
  await context.setOffline(false);
  result.staleOfflineLicense = staleOffline;
  check(staleOffline.activeMessage && staleOffline.worksheetButton && staleOffline.buyLinkCount === 0, 'Stale valid license did not remain active offline.');
  await context.close();
}

{
  const context = await browser.newContext();
  const page = await context.newPage();
  const token = `qa-invalid-returned-license-5-${Date.now()}`;
  const responses = [];
  page.on('response', (response) => { if (response.url().includes('/verify?license=')) responses.push({ url: response.url(), status: response.status(), headers: response.headers() }); });
  await page.goto(`${base}/?license=${token}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('#announcer')?.textContent?.includes('License check finished'), null, { timeout: 15000 });
  const rejected = await page.evaluate((token) => ({
    url: location.href,
    storedToken: localStorage.getItem('sb_license:lesson-tab-card') === token,
    verdict: localStorage.getItem('sb_license_verdict:lesson-tab-card'),
    notice: document.body.innerText.includes('The saved license is not active.'),
    announcement: document.querySelector('#announcer')?.textContent,
    buyRecovery: Boolean([...document.querySelectorAll('a')].find((a) => a.textContent?.includes('Buy worksheet pack'))),
    pasteRecovery: Boolean(document.querySelector('#license-token')),
  }), token);
  result.rejectedReturnedLicense = { ...rejected, responses };
  check(rejected.url === `${base}/` && rejected.storedToken && rejected.verdict?.includes('"valid":false'), 'Rejected returned license was not stripped/stored as invalid.');
  check(rejected.notice && rejected.announcement?.includes('not active') && rejected.buyRecovery && rejected.pasteRecovery, 'Rejected returned license lacks feedback or recovery.');
  check(responses.some((response) => response.status === 200), 'Live license rejection endpoint did not answer 200.');
  await context.close();
}

await browser.close();
console.log(JSON.stringify(result, null, 2));
process.exit(failures.length ? 1 : 0);
