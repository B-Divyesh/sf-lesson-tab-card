import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('static deployment routes', () => {
  it('serves a designed document with an HTTP 404 override', () => {
    const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8'));
    expect(config.navigationFallback).toEqual({ rewrite: '/index.html', exclude: ['/*'] });
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });

    const page = readFileSync('public/404.html', 'utf8');
    expect(page).toContain('<title>Page not found — Lesson Tab Card</title>');
    expect(page).toContain('<main id="main"');
    expect(page.match(/<h1/g)).toHaveLength(1);
    expect(page).toContain('<h1>This page does not exist</h1>');
    expect(page).toContain('href="/privacy"');
    expect(page).toContain('href="/terms"');
  });
});
