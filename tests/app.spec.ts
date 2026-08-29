import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile, stat } from 'node:fs/promises';

test('exports working SVG and PNG files @claim:free-exports', async ({ page }) => {
  await page.goto('/demo');

  const svgDownloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export SVG' }).click();
  const svgDownload = await svgDownloadPromise;
  const svgPath = await svgDownload.path();
  expect(svgDownload.suggestedFilename()).toBe('g-to-c-change.svg');
  expect(svgPath).toBeTruthy();
  const svg = await readFile(svgPath!, 'utf8');
  expect(svg).toContain('G to C change');
  expect(svg).toContain('width="900" height="540"');

  const pngDownloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export PNG' }).click();
  const pngDownload = await pngDownloadPromise;
  const pngPath = await pngDownload.path();
  expect(pngDownload.suggestedFilename()).toBe('g-to-c-change.png');
  expect((await stat(pngPath!)).size).toBeGreaterThan(10_000);
  expect([...((await readFile(pngPath!)).subarray(0, 4))]).toEqual([137, 80, 78, 71]);
});

test('restores the exact lesson from its private fragment link @claim:share-link', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/demo');
  const original = await page.getByLabel('Lesson syntax').inputValue();
  await page.getByRole('button', { name: 'Copy share link' }).click();
  const link = await page.evaluate(() => navigator.clipboard.readText());
  expect(link).toContain('/#c=');
  await page.goto(link);
  await expect(page.getByLabel('Lesson syntax')).toHaveValue(original);
  await expect(page.getByText('Ready to export and share.')).toBeVisible();
});

test('shows the populated sample on the first demo screen @claim:demo-first-screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.locator('#preview > svg')).toHaveAttribute('aria-label', 'Lesson card for G to C change');
  const mobileTitle = await page.locator('#preview .title').boundingBox();
  expect(mobileTitle).not.toBeNull();
  expect(mobileTitle!.y).toBeLessThan(844);

  await page.goto('/?demo=1');
  await expect(page.getByLabel('Lesson syntax')).toHaveValue(/title: G to C change/);
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.reload();
  const desktopTitle = await page.locator('#preview .title').boundingBox();
  expect(desktopTitle).not.toBeNull();
  expect(desktopTitle!.y).toBeLessThan(1000);
});

test('updates the rendered card while the lesson changes @claim:preview-updates', async ({ page }) => {
  await page.goto('/demo');
  const input = page.getByLabel('Lesson syntax');
  await input.fill((await input.inputValue()).replace('title: G to C change', 'title: D chord change').replace('chord: G', 'chord: D'));
  await expect(page.locator('#preview .title')).toHaveText('D chord change');
  await expect(page.locator('#preview .chord')).toHaveText('D');
  await expect(page.locator('#preview > svg')).toHaveAttribute('aria-label', 'Lesson card for D chord change');
});

test('renders every lesson-card field from the sample @claim:lesson-card-fields', async ({ page }) => {
  await page.goto('/demo');
  const preview = page.locator('#preview');
  await expect(preview.locator('.chord-grid .string')).toHaveCount(6);
  await expect(preview.locator('.chord-grid')).toHaveAttribute('aria-label', 'G chord diagram, frets 3 2 0 0 0 3');
  await expect(preview.locator('.finger')).toHaveText(['2', '1', '3']);
  await expect(preview.getByText('CAPO 0')).toBeVisible();
  await expect(preview.locator('.tab')).toHaveCount(6);
  await expect(preview.getByText('Count four beats. Keep every change quiet.')).toBeVisible();
});

test('names invalid lesson fields before export without malformed preview SVG @claim:syntax-validation @regression:invalid-fret-preview', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/demo');
  await page.getByLabel('Lesson syntax').fill('title: C chord\nchord: C\nfrets: x 3 bad 0 1 0\nfingers: x 3 2 0 1 0\ncapo: 20');
  await expect(page.getByText('Frets value 3 is invalid.')).toBeVisible();
  await expect(page.getByText('Line 5 has an invalid capo. Use a whole number from 0 to 12.')).toBeVisible();
  await expect(page.locator('#preview')).not.toContainText('NaN');
  expect(await page.locator('#preview').innerHTML()).not.toContain('NaN');
  const downloads: string[] = [];
  page.on('download', (download) => downloads.push(download.suggestedFilename()));
  await page.getByRole('button', { name: 'Export SVG' }).click();
  expect(downloads).toEqual([]);
  expect(errors).toEqual([]);
});

test('keeps the real draft in this browser after reload @claim:local-draft-storage', async ({ page }) => {
  const source = 'title: Browser draft\nchord: C\nfrets: x 3 2 0 1 0\nfingers: x 3 2 0 1 0\ncapo: 0\nnote: Stored in this browser.';
  await page.goto('/');
  await page.getByLabel('Lesson syntax').fill(source);
  expect(await page.evaluate(() => localStorage.getItem('lesson-tab-card:source:v1'))).toBe(source);
  await page.reload();
  await expect(page.getByLabel('Lesson syntax')).toHaveValue(source);
});

test('keeps SVG and PNG exports available without a license or checkout @claim:license-free-card-exports', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:lesson-tab-card'))).toBeNull();

  const svgDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export SVG' }).click();
  expect((await svgDownload).suggestedFilename()).toBe('g-to-c-change.svg');

  const pngDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export PNG' }).click();
  expect((await pngDownload).suggestedFilename()).toBe('g-to-c-change.png');
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBeTruthy();
});

test('uses no song library, playback, account, or tracking request to make a card @claim:no-account-no-tracking', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await expect(page.getByText('There is no song library, playback, account, or tracking.')).toBeVisible();
  expect(await page.locator('audio, video, input[type="password"], input[type="email"], a[href*="login" i], a[href*="account" i]').count()).toBe(0);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export SVG' }).click();
  await download;
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBeTruthy();
});

test('keeps every real storage key unchanged throughout demo mode @claim:demo-isolation', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.addInitScript(() => {
    if (location.origin === 'http://127.0.0.1:4173') {
      localStorage.setItem('lesson-tab-card:source:v1', 'title: Private saved draft');
      localStorage.setItem('sb_license:lesson-tab-card', 'private-license');
      localStorage.setItem('sb_license_verdict:lesson-tab-card', JSON.stringify({ valid: true, checkedAt: 4_000_000_000_000 }));
    }
  });
  const expected = {
    'lesson-tab-card:source:v1': 'title: Private saved draft',
    'sb_license:lesson-tab-card': 'private-license',
    'sb_license_verdict:lesson-tab-card': JSON.stringify({ valid: true, checkedAt: 4_000_000_000_000 }),
  };
  await page.goto('/demo?license=review-demo-token');
  await expect(page).toHaveURL('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByLabel('License token')).toHaveCount(0);
  await page.getByLabel('Lesson syntax').fill('title: Demo-only change');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByLabel('Lesson syntax')).toHaveValue(/title: G to C change/);
  const demoStorage = await page.evaluate(() => ({
    draft: localStorage.getItem('lesson-tab-card:source:v1'),
    license: localStorage.getItem('sb_license:lesson-tab-card'),
    verdict: localStorage.getItem('sb_license_verdict:lesson-tab-card'),
  }));
  expect(demoStorage.draft).toBe(expected['lesson-tab-card:source:v1']);
  expect(demoStorage.license).toBe(expected['sb_license:lesson-tab-card']);
  expect(demoStorage.verdict).toBe(expected['sb_license_verdict:lesson-tab-card']);

  await page.getByRole('button', { name: 'Open my saved card' }).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByLabel('Lesson syntax')).toHaveValue('title: Private saved draft');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:lesson-tab-card'))).toBe('private-license');
  expect(await page.evaluate(() => localStorage.getItem('sb_license_verdict:lesson-tab-card'))).toBe(expected['sb_license_verdict:lesson-tab-card']);
  expect(await page.evaluate(() => Object.keys(localStorage).sort())).toEqual(Object.keys(expected).sort());
  expect(requests.filter((url) => new URL(url).origin !== 'http://127.0.0.1:4173')).toEqual([]);
});

test('keeps editing, exports, and private share text out of HTTP requests @claim:browser-private', async ({ page, context }) => {
  const requests: { url: string; referer: string }[] = [];
  page.on('request', (request) => {
    requests.push({ url: request.url(), referer: request.headers().referer ?? '' });
  });
  await page.goto('/');
  const privateSource = 'title: Casey warmup\nchord: C\nfrets: x 3 2 0 1 0\nfingers: x 3 2 0 1 0\ncapo: 0\nnote: Student name Casey';
  await page.getByLabel('Lesson syntax').fill(privateSource);
  const exportDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export SVG' }).click();
  await exportDownload;
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copy share link' }).click();
  const link = await page.evaluate(() => navigator.clipboard.readText());
  expect(new URL(link).search).toBe('');
  expect(new URL(link).hash).toContain('c=');
  await page.goto(link);
  await expect(page.getByLabel('Lesson syntax')).toHaveValue(privateSource);
  expect(requests.filter(({ url }) => new URL(url).origin !== 'http://127.0.0.1:4173')).toEqual([]);
  for (const { url, referer } of requests) {
    expect(url).not.toContain('Student name Casey');
    expect(url).not.toContain('?c=');
    expect(referer).not.toContain('Student name Casey');
    expect(referer).not.toContain('?c=');
  }
});

test('removes the saved lesson when Clear card is confirmed @claim:clear-saved-card', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Lesson syntax').fill('title: Remove me\nchord: C\nfrets: x 3 2 0 1 0\nfingers: x 3 2 0 1 0\ncapo: 0');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Clear card' }).click();
  await expect(page.getByLabel('Lesson syntax')).toHaveValue('');
  expect(await page.evaluate(() => localStorage.getItem('lesson-tab-card:source:v1'))).toBeNull();
  await expect(page.getByText('Your card will appear here.')).toBeVisible();
});

test('runs the documented editor keyboard shortcuts @claim:keyboard-shortcuts', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Lesson syntax').focus();
  const download = page.waitForEvent('download');
  await page.keyboard.press('Control+Enter');
  expect((await download).suggestedFilename()).toBe('g-to-c-change.svg');
  await page.getByRole('button', { name: 'Export PNG' }).focus();
  await page.keyboard.press('Alt+1');
  await expect(page.getByLabel('Lesson syntax')).toBeFocused();
});

test('reloads the demo offline after one visit @claim:offline-reload', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(async () => {
    if ('serviceWorker' in navigator) await navigator.serviceWorker.ready;
  });
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Edit the sample lesson card' })).toBeVisible();
  await expect(page.getByLabel('Lesson syntax')).toHaveValue(/title: G to C change/);
  await page.goto('/privacy');
  await expect(page).toHaveTitle('Privacy — Lesson Tab Card');
  await expect(page.getByRole('heading', { level: 1, name: 'Your lesson stays on your device' })).toBeVisible();
  await context.setOffline(false);
});

test('exports a four-card sample worksheet @claim:worksheet-pack', async ({ page }) => {
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export sample 4-card worksheet' }).click();
  const download = await downloadPromise;
  const path = await download.path();
  const svg = await readFile(path!, 'utf8');
  expect(download.suggestedFilename()).toBe('g-to-c-change-worksheet.svg');
  expect(svg.match(/translate\(\d+ \d+\) scale\(\.48\)/g)).toHaveLength(4);
});

test('has a clean accessible structure on blank, demo, desktop, and mobile', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('main')).toHaveCount(1);
  const blankResults = await new AxeBuilder({ page }).analyze();
  expect(blankResults.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);

  await page.goto('/demo');
  const demoResults = await new AxeBuilder({ page }).analyze();
  expect(demoResults.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);

  for (const path of ['/privacy', '/terms', '/404.html']) {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Skip to main content' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await expect(page.getByRole('button', { name: 'Export SVG' })).toBeVisible();
  await page.keyboard.press('Alt+1');
  await expect(page.getByLabel('Lesson syntax')).toBeFocused();
  const undersized = await page.locator('a:visible, button:visible, input:visible, textarea:visible, summary:visible').evaluateAll((elements) => elements
    .map((element) => ({ label: (element.textContent || element.getAttribute('aria-label') || element.tagName).trim(), box: element.getBoundingClientRect() }))
    .filter(({ box }) => box.width < 44 || box.height < 44));
  expect(undersized).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test('uses real route titles and renders legal pages', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Lesson Tab Card — Make clear guitar lesson cards');
  await expect(page.locator('h1')).toHaveText('Make a clear guitar lesson card');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Export one clear guitar lesson card/);
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Lesson Tab Card');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://lesson-tab-card.sociobot.in/demo');
  await page.goto('/privacy');
  await expect(page).toHaveTitle('Privacy — Lesson Tab Card');
  await expect(page.locator('h1')).toHaveText('Your lesson stays on your device');
  await page.getByRole('link', { name: 'Terms' }).click();
  await expect(page).toHaveURL('/terms');
  await expect(page).toHaveTitle('Terms — Lesson Tab Card');
  await expect(page.locator('h1')).toBeFocused();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://lesson-tab-card.sociobot.in/terms');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Terms — Lesson Tab Card');
  await page.goBack();
  await expect(page).toHaveURL('/privacy');
  await expect(page.locator('h1')).toBeFocused();

  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Lesson Tab Card');
  await expect(page.locator('h1')).toHaveText('This page does not exist');
  await expect(page.getByLabel('Footer navigation').getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
  await expect(page.getByLabel('Footer navigation').getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms');
});

test('serves complete metadata and the current release on every not-found route', async ({ page }) => {
  const expected = {
    title: 'Page not found — Lesson Tab Card',
    description: 'Return to the Lesson Tab Card editor.',
    canonical: 'https://lesson-tab-card.sociobot.in/404.html',
    image: 'https://lesson-tab-card.sociobot.in/assets/social-card.webp',
    release: 'v1.2 / build 2026.08.29',
  };

  for (const path of ['/404.html', '/definitely-not-a-real-route']) {
    await page.goto(path);
    await expect(page).toHaveTitle(expected.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', expected.description);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', expected.canonical);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', expected.title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', expected.description);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', expected.canonical);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', expected.image);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', expected.title);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', expected.description);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', expected.image);
    await expect(page.locator('footer')).toContainText(expected.release);
  }

  await page.goto('/');
  await expect(page.locator('footer')).toContainText(expected.release);
});

test('rejects overlong printable text instead of truncating it @regression:printable-lengths', async ({ page }) => {
  await page.goto('/demo');
  const title = 'T'.repeat(27);
  const chord = 'C'.repeat(8);
  const note = 'N'.repeat(65);
  const source = `title: ${title}\nchord: ${chord}\nfrets: x 3 2 0 1 0\nfingers: x 3 2 0 1 0\ncapo: 0\nnote: ${note}`;
  await page.getByLabel('Lesson syntax').fill(source);
  await expect(page.getByText('Line 1 title is too long. Use 26 characters or fewer so it prints on the card.')).toBeVisible();
  await expect(page.getByText('Shorten the named line before previewing.')).toBeVisible();
  await expect(page.getByLabel('Lesson syntax')).toHaveValue(source);
  const downloads: string[] = [];
  page.on('download', (download) => downloads.push(download.suggestedFilename()));
  await page.getByRole('button', { name: 'Export SVG' }).click();
  expect(downloads).toEqual([]);
});

test('restores old query share links, then removes their exposed query @claim:legacy-link-migration @regression:legacy-share-link', async ({ page }) => {
  await page.goto('/demo');
  const source = await page.getByLabel('Lesson syntax').inputValue();
  const encoded = await page.evaluate((lesson) => {
    const bytes = new TextEncoder().encode(lesson);
    return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }, source);
  await page.goto(`/?c=${encoded}`);
  await expect(page.getByLabel('Lesson syntax')).toHaveValue(source);
  await expect(page.getByText('This older share link put lesson text in the request address. Copy a new private link before sharing.')).toBeVisible();
  await expect(page).toHaveURL('/');
});

test('accepts documented input bounds and rejects their neighbours @claim:syntax-boundaries', async ({ page }) => {
  await page.goto('/demo');
  const input = page.getByLabel('Lesson syntax');
  const card = (frets: string, fingers: string, capo: number) => `title: Boundaries\nchord: C\nfrets: ${frets}\nfingers: ${fingers}\ncapo: ${capo}\nnote: Check each limit.`;

  await input.fill(card('0 12 x 0 12 x', '0 4 x 0 4 x', 0));
  await expect(page.getByText('Ready to export and share.')).toBeVisible();
  await input.fill(card('0 12 x 0 12 x', '0 4 x 0 4 x', 12));
  await expect(page.getByText('Ready to export and share.')).toBeVisible();

  await input.fill(card('-1 13 x 0 12 x', '-1 5 x 0 4 x', -1));
  await expect(page.getByText('Frets value 1 is invalid.')).toBeVisible();
  await expect(page.getByText('Frets value 2 is invalid.')).toBeVisible();
  await expect(page.getByText('Fingers value 1 is invalid.')).toBeVisible();
  await expect(page.getByText('Fingers value 2 is invalid.')).toBeVisible();
  await expect(page.getByText('Line 5 has an invalid capo. Use a whole number from 0 to 12.')).toBeVisible();
  await input.fill(card('0 12 x 0 12 x', '0 4 x 0 4 x', 13));
  await expect(page.getByText('Line 5 has an invalid capo. Use a whole number from 0 to 12.')).toBeVisible();
});

test('captures a returned license and activates the worksheet pack @claim:paid-license-flow', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/lesson-tab-card/verify?license=paid-token', async (route) => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }) });
  });
  await page.goto('/?license=paid-token');
  await expect(page.getByText('Worksheet pack active on this browser.')).toBeVisible();
  await expect(page).toHaveURL('/');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:lesson-tab-card'))).toBe('paid-token');
});

test('keeps a stale cached valid worksheet license active while offline, then refreshes it after reconnecting @claim:paid-license-offline-recovery', async ({ page, context }) => {
  let online = false;
  let verificationRequests = 0;
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  await page.route('https://api.sociobot.in/api/v1/products/lesson-tab-card/verify?license=cached-paid-token', async (route) => {
    if (!online) return route.abort('internetdisconnected');
    verificationRequests += 1;
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }) });
  });
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:lesson-tab-card', 'cached-paid-token');
    localStorage.setItem('sb_license_verdict:lesson-tab-card', JSON.stringify({ valid: true, checkedAt: Date.now() - 25 * 60 * 60 * 1000 }));
  });

  await page.goto('/demo');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.goto('/');
  await expect(page.getByText('Worksheet pack active on this browser.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Export 4-card worksheet' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Buy worksheet pack — $9' })).toHaveCount(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('sb_license_verdict:lesson-tab-card') ?? '{}').valid)).toBe(true);

  online = true;
  await context.setOffline(false);
  await expect.poll(() => verificationRequests).toBe(1);
  await expect(page.getByText('Worksheet pack active on this browser.')).toBeVisible();
  const refreshedAt = await page.evaluate(() => JSON.parse(localStorage.getItem('sb_license_verdict:lesson-tab-card') ?? '{}').checkedAt);
  expect(Date.now() - refreshedAt).toBeLessThan(60_000);
  expect(consoleErrors).toEqual([]);
});

test('shows recovery feedback when a returned license is rejected @claim:rejected-returned-license', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/lesson-tab-card/verify?license=rejected-return-token', async (route) => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'invalid', expires_at: null }) });
  });
  await page.goto('/?license=rejected-return-token');
  await expect(page).toHaveURL('/');
  await expect(page.getByText('The saved license is no longer active. You can check the token or buy the pack again.')).toBeVisible();
  await expect(page.getByText('License check finished. The saved license is not active.')).toBeAttached();
  await expect(page.getByRole('link', { name: 'Buy worksheet pack — $9' })).toBeVisible();
  await expect(page.getByText('Have a license? Paste it')).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('sb_license_verdict:lesson-tab-card') ?? '{}').valid)).toBe(false);
});

test('revokes an optimistically active stale license only after a definitive invalid response @regression:stale-license-revocation', async ({ page }) => {
  let releaseResponse!: () => void;
  const responseGate = new Promise<void>((resolve) => { releaseResponse = resolve; });
  await page.route('https://api.sociobot.in/api/v1/products/lesson-tab-card/verify?license=revoked-paid-token', async (route) => {
    await responseGate;
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'revoked', expires_at: null }) });
  });
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:lesson-tab-card', 'revoked-paid-token');
    localStorage.setItem('sb_license_verdict:lesson-tab-card', JSON.stringify({ valid: true, checkedAt: Date.now() - 25 * 60 * 60 * 1000 }));
  });

  await page.goto('/');
  await expect(page.getByText('Worksheet pack active on this browser.')).toBeVisible();
  releaseResponse();
  await expect(page.getByText('The saved license is no longer active. You can check the token or buy the pack again.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Buy worksheet pack — $9' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Export 4-card worksheet' })).toHaveCount(0);
});

test('shows the exact source-length recovery at 4,001 characters @claim:source-length-boundary', async ({ page }) => {
  await page.goto('/');
  const input = page.getByLabel('Lesson syntax');
  const prefix = 'title: A\n';
  await input.fill(prefix + 'x'.repeat(4_000 - prefix.length));
  await expect(page.getByText('The card is over 4,000 characters. Shorten it and try again.')).toHaveCount(0);
  await input.fill(prefix + 'x'.repeat(4_001 - prefix.length));
  await expect(page.getByText('The card is over 4,000 characters. Shorten it and try again.')).toBeVisible();
  await expect(page.getByText('No lesson yet. Start with a title: line.')).toHaveCount(0);
  await expect(page.getByText('Shorten the lesson before previewing.')).toBeVisible();
});

test('activates the worksheet pack from a pasted valid license @claim:license-restore', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/lesson-tab-card/verify?license=restored-token', async (route) => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }) });
  });
  await page.goto('/');
  await page.getByText('Have a license? Paste it').click();
  await page.getByLabel('License token').fill('restored-token');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('Worksheet pack active on this browser.')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('sb_license:lesson-tab-card'))).toBe('restored-token');
});

test('keeps lesson syntax out of checkout and verification requests @claim:billing-request-privacy', async ({ page }) => {
  const privateText = 'Private student phrase 93842';
  const billingRequests: { url: string; body: string | null }[] = [];
  page.on('request', (request) => {
    if (request.url().startsWith('https://api.sociobot.in/')) billingRequests.push({ url: request.url(), body: request.postData() });
  });
  await page.route('https://api.sociobot.in/api/v1/products/lesson-tab-card/checkout', (route) => route.abort());
  await page.route('https://api.sociobot.in/api/v1/products/lesson-tab-card/verify?license=billing-token', (route) => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }),
  }));
  await page.goto('/');
  await page.getByLabel('Lesson syntax').fill(`title: Private card\nchord: C\nfrets: x 3 2 0 1 0\nfingers: x 3 2 0 1 0\ncapo: 0\nnote: ${privateText}`);
  const buyLink = page.getByRole('link', { name: 'Buy worksheet pack — $9' });
  await buyLink.evaluate((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    void fetch((link as HTMLAnchorElement).href).catch(() => undefined);
  }, { once: true }));
  await Promise.all([
    page.waitForRequest('https://api.sociobot.in/api/v1/products/lesson-tab-card/checkout'),
    buyLink.click(),
  ]);
  await page.getByText('Have a license? Paste it').click();
  await page.getByLabel('License token').fill('billing-token');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('Worksheet pack active on this browser.')).toBeVisible();
  expect(billingRequests.map(({ url }) => new URL(url).pathname)).toEqual([
    '/api/v1/products/lesson-tab-card/checkout',
    '/api/v1/products/lesson-tab-card/verify',
  ]);
  for (const request of billingRequests) {
    expect(`${request.url}${request.body ?? ''}`).not.toContain(privateText);
    expect(`${request.url}${request.body ?? ''}`).not.toContain('Private%20student');
  }
});

test('starts the advertised $9 hosted checkout @claim:paid-checkout', async ({ request }) => {
  const response = await request.get('https://api.sociobot.in/api/v1/products/lesson-tab-card/checkout', { maxRedirects: 0 });
  expect(response.status()).toBe(303);
  expect(response.headers().location).toMatch(/^https:\/\/checkout\.dodopayments\.com\/session\//);
});
