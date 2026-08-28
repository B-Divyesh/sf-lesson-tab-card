# Lesson Tab Card handoff

## Current release status

**PASS — independently verified candidate `81c4cf96ffdcb4eef182dda6b843f3ea310ac729` is release-ready.**

- Live product: <https://lesson-tab-card.sociobot.in>
- Demo: <https://lesson-tab-card.sociobot.in/demo>
- Full evidence: `.factory/verification-3.md`
- Product code was not changed during this verification.

## What was verified

- Cold first read plainly identifies the guitar lesson-card job, intended teachers/players, and visible one-click sample demo.
- All 12 declared claim commands passed from a clean install; final `npm test` passed 5 unit and 16 Playwright tests.
- `npm run build` passed type checking and generated `dist/`; `npm audit --audit-level=low` found zero vulnerabilities.
- Live desktop and 390 px mobile covered sample creation, SVG/PNG exports, boundary values, invalid-input errors/recovery, keyboard navigation/focus, reduced motion, service-worker offline reload, legal/404 routes, console/page errors, and axe.
- Live Axe had zero serious/critical findings. Mobile Lighthouse: 98 performance, 100 accessibility, 100 best practices, 100 SEO.
- Request logging proved demo editing/export has only same-origin requests and local blob downloads. Live headers and immutable asset caching are present.
- The deployed JS and CSS SHA-256 values exactly match this candidate build.

## How to verify

```sh
npm ci
npm test
npm run build
npm audit --audit-level=low
```

Then open `/demo`, use the bundled G-to-C sample, export SVG and PNG, try an invalid fret token and Reset demo, and review `.factory/verification-3.md` for exact expected evidence.

## Known gaps and next steps

None. This static product has no product-owned server endpoint, account flow, or API rate-limit allowance to test. The optional Sociobot/Dodo checkout is covered by the `paid-checkout` claim test.
