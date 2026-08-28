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
  expect(await readFile(svgPath!, 'utf8')).toContain('G to C change');

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

test('names invalid lesson fields before export @claim:syntax-validation', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Lesson syntax').fill('title: C chord\nchord: C\nfrets: x 3 bad 0 1 0\nfingers: x 3 2 0 1 0\ncapo: 20');
  await expect(page.getByText('Frets value 3 is invalid.')).toBeVisible();
  await expect(page.getByText('Line 5 has an invalid capo. Use a whole number from 0 to 12.')).toBeVisible();
  const downloads: string[] = [];
  page.on('download', (download) => downloads.push(download.suggestedFilename()));
  await page.getByRole('button', { name: 'Export SVG' }).click();
  expect(downloads).toEqual([]);
});

test('keeps demo changes away from the saved draft @claim:demo-isolation', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('lesson-tab-card:source:v1', 'title: Private saved draft'));
  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await page.getByLabel('Lesson syntax').fill('title: Demo-only change');
  const saved = await page.evaluate(() => localStorage.getItem('lesson-tab-card:source:v1'));
  expect(saved).toBe('title: Private saved draft');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByLabel('Lesson syntax')).toHaveValue(/title: G to C change/);
});

test('keeps demo and private share text out of HTTP requests @claim:browser-private', async ({ page, context }) => {
  const requests: { url: string; referer: string }[] = [];
  page.on('request', (request) => {
    requests.push({ url: request.url(), referer: request.headers().referer ?? '' });
  });
  await page.goto('/demo');
  const privateSource = 'title: Casey warmup\nchord: C\nfrets: x 3 2 0 1 0\nfingers: x 3 2 0 1 0\ncapo: 0\nnote: Student name Casey';
  await page.getByLabel('Lesson syntax').fill(privateSource);
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

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
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
  await page.goto('/privacy');
  await expect(page).toHaveTitle('Privacy — Lesson Tab Card');
  await expect(page.locator('h1')).toHaveText('Your lesson stays on your device');
  await page.getByRole('link', { name: 'Terms' }).click();
  await expect(page).toHaveURL('/terms');
  await expect(page).toHaveTitle('Terms — Lesson Tab Card');
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

test('restores old query share links, then removes their exposed query @regression:legacy-share-link', async ({ page }) => {
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

test('captures a returned license and activates the worksheet pack @claim:paid-license-flow', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/lesson-tab-card/verify?license=paid-token', async (route) => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }) });
  });
  await page.goto('/?license=paid-token');
  await expect(page.getByText('Worksheet pack active on this browser.')).toBeVisible();
  await expect(page).toHaveURL('/');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:lesson-tab-card'))).toBe('paid-token');
});

test('starts the advertised $9 hosted checkout @claim:paid-checkout', async ({ request }) => {
  const response = await request.get('https://api.sociobot.in/api/v1/products/lesson-tab-card/checkout', { maxRedirects: 0 });
  expect(response.status()).toBe(303);
  expect(response.headers().location).toMatch(/^https:\/\/checkout\.dodopayments\.com\/session\//);
});
