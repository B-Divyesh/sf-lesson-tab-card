# Lesson Tab Card v1 handoff

Completed 2026-08-28 for work order `lesson-tab-card-build-1`.

## What was built

- A responsive, keyboard-first editor for title, chord, six fret values, six finger values, capo, six tab lines, and a teacher note.
- Strict client-side validation with line-specific fixes for untrusted or incomplete syntax.
- A live six-string chord card preview with SVG, PNG, encoded share-link, and print output.
- An isolated `/demo` with a complete G to C exercise, reset action, and no demo persistence.
- A service worker that caches the app shell and bundled sample for offline reloads.
- A $9 one-time worksheet pack using the Sociobot checkout and license verification contract. The free editor, validation, sharing, SVG, and PNG remain available without a license. Demo mode can export a sample worksheet without writing license state.
- Browser-local real draft storage under `lesson-tab-card:source:v1`. License storage uses `sb_license:lesson-tab-card` and a once-daily cached verdict.
- Real `/privacy`, `/terms`, `/demo`, and in-app 404 routes, plus a static styled `404.html` for Azure Static Web Apps.
- Product metadata, sitemap, robots rules, security headers, PWA manifest, and an original generated lesson-desk image with provenance.

## Run and verify

```sh
npm ci
npm test
npm run build
```

The exact deploy command is `npm run build`. Output lands in `dist/`, with `dist/index.html` at its root.

Verification completed against the production build:

- Unit tests: 3 passed.
- Playwright tests: 9 passed, including every entry in `.factory/claims.json`.
- Axe browser scan: 0 serious or critical violations.
- Factory URL check: title present, `lang="en"`, one `h1`, one `main`, no missing alt text, no unlabeled buttons, and no console errors.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100.
- Lighthouse lab metrics: FCP 1.0 s, LCP 1.0 s, CLS 0, TBT 60 ms. INP is not produced by a non-interactive lab run.
- Production assets: JavaScript 9.45 KB gzip; CSS 3.20 KB gzip; hero WebP 68 KB; social WebP 72 KB.
- `npm audit`: 0 vulnerabilities.

## Design and content records

- `.factory/design.md` contains palette, type, spacing, shape, motion, art direction, and image provenance.
- `.factory/copy-audit.md` contains first-screen and landing sentence counts plus the terminology table.
- `.factory/demo.md` documents sandbox entry points, sample data, reset behavior, and storage isolation.
- `.factory/claims.json` maps each visitor promise to one demo-based test.

## Known gaps and next steps

- The production billing product must still be registered by the factory. No provider product ID is embedded in this repository.
- Browser SVG text uses system Arial and Consolas-style fonts. Exact line breaks can vary slightly by operating system.
- The format intentionally supports one compact chord and short tab. Multi-chord score layout, playback, accounts, and song libraries remain out of scope.
