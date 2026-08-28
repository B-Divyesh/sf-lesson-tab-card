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

test('restores the exact lesson from its link @claim:share-link', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/demo');
  const original = await page.getByLabel('Lesson syntax').inputValue();
  await page.getByRole('button', { name: 'Copy share link' }).click();
  const link = await page.evaluate(() => navigator.clipboard.readText());
  expect(link).toContain('/?c=');
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

test('makes no cross-origin request during the demo @claim:browser-private', async ({ page }) => {
  const crossOrigin: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') crossOrigin.push(request.url());
  });
  await page.goto('/demo');
  await page.getByLabel('Lesson syntax').pressSequentially('\n');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(crossOrigin).toEqual([]);
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

test('has a clean accessible structure on desktop and mobile', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('main')).toHaveCount(1);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.getByRole('button', { name: 'Export SVG' })).toBeVisible();
  await page.keyboard.press('Alt+1');
  await expect(page.getByLabel('Lesson syntax')).toBeFocused();
});

test('uses real route titles and renders legal pages', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page).toHaveTitle('Privacy — Lesson Tab Card');
  await expect(page.locator('h1')).toHaveText('Your lesson stays on your device');
  await page.getByRole('link', { name: 'Terms' }).click();
  await expect(page).toHaveURL('/terms');
  await expect(page).toHaveTitle('Terms — Lesson Tab Card');
});
