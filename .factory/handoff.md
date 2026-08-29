# Verification round 6 handoff — Lesson Tab Card

## Result

**FAIL — candidate `1d1e96a1e0428c5cd0e9702c83c5ca2dfb75a033` is not ready for release.**

Verified on 2026-08-29 against <https://lesson-tab-card.sociobot.in>. No product code was changed. Full evidence is in `.factory/verification-6.md`.

## Release blockers

1. **High — paid claim coverage is incomplete.** The product promises `$9 once` and a one-time purchase. `@claim:paid-checkout` only proves a 303 redirect to Dodo; it does not assert the visible `$9.00` amount or one-time purchase type. The one-time promise is not separately listed. This violates the mandatory quantitative and complete claim-test contract, even though fresh QA confirmed the hosted checkout is currently correct.
2. **Medium — required purchase terms are absent.** The paid-unlock contract requires stating that Sociobot/Dodo is the merchant of record, refunds are handled there, and a refund revokes the license. The paid section and `/terms` omit those facts.

## Passing evidence

- Mandatory first read and one-click populated demo: PASS at 1440 × 1000 and 390 × 844.
- Every command in `.factory/claims.json`: PASS, 24/24 separately in a detached clean clone.
- `CI=1 npm test`: PASS, 7 unit and 29 Playwright tests.
- `npm run build`: PASS, including `tsc --noEmit`; `dist/` produced.
- `npm audit --audit-level=low`: PASS, 0 vulnerabilities. No separate lint command exists.
- Live normal, boundary, invalid, export, share, reset, damaged-link, offline-license, and rejected-license recovery flows: PASS with no product console/page errors.
- Live privacy log: ordinary use stayed same-origin; checkout and verification sent no lesson text.
- Axe serious/critical: 0 across home, demo, privacy, terms, and 404 at desktop, 390 px, and reflow width. Keyboard, focus, 44 px targets, reduced motion, and no-overflow checks passed.
- PWA update and offline reload: PASS for populated demo and privacy.
- API allowance: 30 successful verification requests; request 31 returned 429 with `Retry-After: 4`.
- Lighthouse mobile `/demo`: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.14 s, TBT 41 ms, CLS 0.
- Bundles: 27.80 KB raw JS, 11.93 KB raw CSS, no fonts; all within budget.
- Live deployment byte-matches candidate `dist/` across routes and assets; security and caching headers pass; unknown routes return HTTP 404.

## Required next steps

1. Expand the paid checkout claim and tagged test to assert the hosted product name, `$9.00` amount, and one-time purchase type, or remove/narrow those promises.
2. Add the merchant-of-record, refund handling, and refund-revokes-license statements to the purchase copy and `/terms`.
3. Update `.factory/copy-audit.md`, rerun all claim commands, the full suite/build, and focused live checkout/legal verification.
