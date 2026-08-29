# Repair 4 handoff — Lesson Tab Card

## Result

**PASS — the release blockers in verification commit `cee704758d7c7a4b014c6adcb1d29e9c11ef9a8c` are repaired and deployed.**

- Repaired candidate: `1d1e96a1e0428c5cd0e9702c83c5ca2dfb75a033`
- Repair commit: `d00972f7c06b91a8bc4679630565bac27b1cafd2`
- Production: <https://lesson-tab-card.sociobot.in>
- Demo: <https://lesson-tab-card.sociobot.in/demo>
- Azure deployment: `4882bb33-cc1c-4a7b-990f-ee1d3cdf9e3a`
- Verified: 2026-08-29 UTC

## Repairs

1. The `paid-checkout` claim now states the product name, `$9.00` price, and one-time purchase. Its tagged test follows the production Sociobot redirect and checks those three facts in the visible Dodo order summary.
2. The paid section, `/terms`, and README now state that Sociobot uses Dodo as merchant of record, Dodo handles refunds, and a refund revokes the license automatically.
3. The new `merchant-refund-policy` claim and regression test check the disclosure on the product and Terms pages, simulate a definitive revoked billing verdict, and prove that worksheet access is removed.
4. `.factory/copy-audit.md` includes every new sentence. All remain within the 22-word limit and contain no banned wording.

The brief, visual thesis, static Vite/TypeScript artifact, free exports, local-first storage, demo isolation, and all previously passing behavior remain unchanged.

## Clean and automated verification

- `npm ci`: PASS — 60 packages installed; 0 vulnerabilities.
- Claim manifest integrity: PASS — 25 unique IDs and exactly one matching `@claim:<id>` test each.
- Every command in `.factory/claims.json`, run separately with `CI=1`: PASS, 25/25.
- `CI=1 npm test`: PASS — 7 Vitest tests and 29 Playwright tests.
- Focused blockers: `@claim:paid-checkout` and `@claim:merchant-refund-policy`: PASS.
- `npm run build`: PASS — `tsc --noEmit` and Vite; `dist/index.html` exists.
- No separate lint command exists; the production build performs the TypeScript check.
- `npm audit --audit-level=low`: PASS — 0 vulnerabilities.
- `git diff --check`: PASS.
- Package/consumer checks: not applicable to this static web product.

Production bundles are within budget: JavaScript 27,967 bytes raw / 10.09 KB gzip; CSS 11,934 bytes raw / 3.39 KB gzip; no web fonts.

## Browser, accessibility, privacy, and offline evidence

- Local and live Chromium matrices covered `/`, `/demo`, `/privacy`, `/terms`, and `/404.html` at 1440 × 1000 and 390 × 844.
- All 10 live route/viewport combinations had one `h1`, one `main`, `lang="en"`, zero console/page errors, zero horizontal overflow, zero undersized interactive targets, and zero serious/critical Axe 4.10.2 findings.
- Keyboard: skip link focused `main`; `Alt+1` focused the editor; the full suite also proves `Ctrl+Enter` exports SVG.
- Reduced motion: maximum computed animation or transition duration was 0.01 ms.
- Privacy flow: 11 live requests, 0 external requests, and 0 occurrences of the unique lesson text in URLs, bodies, or referrers.
- Service worker: only `lesson-tab-card-v5`; update left an active worker with no installing or waiting worker. Populated demo and `/terms` both loaded offline.
- `/opt/fleet/lib/verify-url.sh` on live `/demo`: HTTP 200, 1,093 ms, zero console/page errors, title/lang/main/alt/button checks passed.
- Visual evidence: `.factory/repair-4-evidence/screenshot-desktop.png` and `screenshot-mobile.png`.

## Checkout, response policy, performance, and identity

- Production checkout: HTTP 303 from Sociobot to Dodo; the visible order item is “Lesson Tab Card Worksheet Pack”, `$9.00`, and “One-time worksheet license for Lesson Tab Card.”
- Live unknown route: HTTP 404 with the designed not-found page. Root is HTTP 200; ETag revalidation returns 304.
- Live headers: HSTS, `nosniff`, strict-origin referrer policy, restrictive permissions policy, and CSP with header-delivered `frame-ancestors 'none'` and only the documented Sociobot API connection.
- Caching: HTML `max-age=30, must-revalidate`; hashed asset one-year immutable; service worker `no-cache`.
- Live identity: all 21 publicly served files match local `dist/` byte-for-byte, 309,943 bytes total. Azure correctly consumes rather than serves `staticwebapp.config.json`.
- JavaScript SHA-256: `193cc592926b3563e7ac095e115ed56a76e8a3f19f1644393461dbaac1afd101`.
- CSS SHA-256: `81090db3cb8b962e386884f6be39bfcaa803b0c15a7988af8e2caaa39ad62d44`.
- Service worker SHA-256: `bb819dd410239c671a45fae3e22190596080583a61c62fc0a0f21810a9923999`.
- Lighthouse 12.8.2 mobile `/demo`: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.90 s, LCP 0.93 s, TBT 57 ms, CLS 0, Speed Index 0.90 s, 84,847 transferred bytes.

## Deployment and remaining work

`/opt/fleet/lib/deploy-static.sh lesson-tab-card dist` reused `sf-lesson-tab-card` in Central US and completed production deployment. The custom domain reports `Ready` and HTTPS returns 200.

Known release-blocking gaps: none.
