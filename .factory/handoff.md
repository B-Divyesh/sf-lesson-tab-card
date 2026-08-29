# Repair 3 handoff — Lesson Tab Card

## Result

**PASS — all release blockers from independent verification 4 are repaired and deployed.**

- Work order: `lesson-tab-card-repair-3`
- Repaired candidate: `1e6b9afedd3190e8b9a560633556856cd53d9f21`
- Verifier report commit: `e45a176a1bd6f21da48a1e65d24ff056e90a9e2d`
- Product repair commits: `493ca27`, `6ce1bed`
- Live site: <https://lesson-tab-card.sociobot.in>
- Final deployment ID: `b5afb74e-e99f-4e0e-bcd0-2df646317519`
- Verified: 2026-08-29 UTC

## Repairs

1. A cached valid worksheet verdict now grants access regardless of age. A stale verdict triggers a background check only while online. If the check is unavailable, the last valid verdict remains intact. The browser retries once connectivity returns and revokes access only after a definitive invalid response.
2. A rejected returned license now rerenders the inactive notice even when the paid boolean was already false. The polite live region finishes with “License check finished. The saved license is not active.” The buy link and token-check control remain available.
3. A non-empty card over 4,000 characters now shows the parser's length error and a specific shortening action instead of the false empty-card message.
4. The service-worker cache advanced from `lesson-tab-card-v4` to `lesson-tab-card-v5`, ensuring existing installations receive the repaired bundle.

The researched brief, static-web artifact class, free exports, isolated demo, local draft, share links, visual system, and existing valid/invalid syntax behavior are unchanged.

## Regression coverage

- `@claim:paid-license-offline-recovery`: warms the service worker, seeds a valid verdict checked 25 hours earlier, loads offline, asserts the paid worksheet remains available with no console error, reconnects without reloading, and asserts exactly one successful refresh.
- `@regression:stale-license-revocation`: proves stale valid access appears on first paint and is removed only after a controlled definitive revoked response.
- `@claim:rejected-returned-license`: asserts URL stripping, stored invalid verdict, visible inactive notice, completed live-region announcement, buy recovery, and token-check recovery.
- `@claim:source-length-boundary`: exercises 4,000 and 4,001 characters in the browser. A unit regression independently asserts the parser's exact boundary and message.
- `.factory/claims.json` now has 24 claims and exactly 24 matching claim tags.

## Verification evidence

Clean and complete local gates:

```text
npm ci                         PASS — 60 packages, 0 vulnerabilities
CI=1 npm test                  PASS — 7 Vitest + 28 Playwright
all claims.json commands       PASS — 24/24 run individually
npm run build                  PASS — TypeScript + Vite, dist/ created
npm audit --audit-level=low    PASS — 0 vulnerabilities
git diff --check               PASS
```

There is no separate lint configuration; `npm run build` runs `tsc --noEmit`. Package/consumer testing is not applicable to this static web product.

Production artifact budgets:

- JavaScript: 27.66 KB raw / 9.98 KB gzip
- CSS: 11.93 KB raw / 3.39 KB gzip
- lesson image: 69.63 KB
- fonts: 0 KB

Browser and accessibility checks:

- Chromium desktop and 390 × 844 mobile flows passed, including keyboard shortcuts, skip-link focus, 44 px targets, no horizontal overflow, reduced motion, empty/error states, and exports.
- Axe checks on blank, demo, privacy, terms, and 404 found zero serious or critical violations.
- `/opt/fleet/lib/verify-url.sh` on the final live `/demo` returned HTTP 200, 644 ms network-idle load, correct title/lang/h1/main/alt/button names, and zero console or page errors.
- Final live Lighthouse mobile: performance 100, accessibility 100, best practices 100, SEO 100; FCP 0.9 s, LCP 0.9 s, TBT 40 ms, CLS 0.

Privacy, offline, and billing checks:

- The complete edit/export/share flow remains same-origin. Billing requests contain no lesson text.
- The live 25-hour offline entitlement stayed active, made no failed offline request, refreshed exactly once on reconnect, and produced no console errors.
- The live service worker reported only `lesson-tab-card-v5`; `registration.update()` left no installing or waiting worker.
- The live invalid-license endpoint returned HTTP 200 with `{valid:false, reason:"invalid"}`, exact-origin CORS, and `Cache-Control: no-store`.
- The production checkout claim returned HTTP 303 to the Dodo hosted checkout.

Response policy and deployment identity:

- Root, demo, privacy, terms, service worker, JS, and CSS returned HTTP 200 and matched local `dist/` byte-for-byte.
- Final hashes: JS `f8f52c11e90ebef8fee7598b5899596a57de096150b83e93318a62728bfa7e8f`; CSS `81090db3cb8b962e386884f6be39bfcaa803b0c15a7988af8e2caaa39ad62d44`; service worker `bb819dd410239c671a45fae3e22190596080583a61c62fc0a0f21810a9923999`.
- Live headers include HSTS, `nosniff`, strict-origin referrer policy, permissions policy, and CSP with `frame-ancestors 'none'`. Unknown routes return the designed page with HTTP 404. The service worker returns `Cache-Control: no-cache`.

## Known gaps and next steps

No release-blocking gaps remain. A future independent verifier should rerun all 24 claim commands and the three adversarial paths above against the final commit and live deployment.
