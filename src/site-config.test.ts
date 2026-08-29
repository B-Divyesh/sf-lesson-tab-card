import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { releaseLabel, siteOrigin } from './site-config';

describe('static deployment routes', () => {
  it('serves a designed document with an HTTP 404 override', () => {
    const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8'));
    expect(config.navigationFallback).toEqual({ rewrite: '/index.html', exclude: ['/*'] });
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });

    const page = readFileSync('404.html', 'utf8');
    expect(page).toContain('<title>Page not found — Lesson Tab Card</title>');
    expect(page).toContain('<main id="main"');
    expect(page.match(/<h1/g)).toHaveLength(1);
    expect(page).toContain('<h1>This page does not exist</h1>');
    expect(page).toContain('href="/privacy"');
    expect(page).toContain('href="/terms"');
    expect(page).toContain(`href="%SITE_ORIGIN%/404.html"`);
    expect(page).toContain('<meta property="og:title" content="Page not found — Lesson Tab Card" />');
    expect(page).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(siteOrigin).toBe('https://lesson-tab-card.sociobot.in');
    expect(page).toContain('%RELEASE_LABEL%');
    expect(releaseLabel).toBe('v1.2 / build 2026.08.29');
  });
});
