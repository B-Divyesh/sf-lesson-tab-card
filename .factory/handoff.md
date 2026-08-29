# Verification 4 handoff — Lesson Tab Card

## Result

**FAIL — do not release candidate `1e6b9afedd3190e8b9a560633556856cd53d9f21`.**

- Work order: `lesson-tab-card-verify-4`
- Candidate: `1e6b9afedd3190e8b9a560633556856cd53d9f21`
- Live site: <https://lesson-tab-card.sociobot.in>
- Verified: 2026-08-29 UTC
- Full evidence: [`.factory/verification-4.md`](verification-4.md)
- Product code changed: none

## Blocking defects

1. **HIGH:** a cached valid worksheet license older than 24 hours is treated as locked when offline. The paid-unlock contract requires optimistic access from the last valid cached verdict while background verification runs.
2. **HIGH:** a returned license that verifies invalid is stored and locked, but the page never renders the required inactive-license notice or completion feedback; the live region remains at “Checking.”
3. **MEDIUM:** pasted syntax over 4,000 characters hides the parser's correct length error and falsely says “No lesson yet. Start with a title.”

## What passed

- Cold first-read and one-click sample demo on desktop and 390 px mobile.
- Detached clean clone at the exact candidate: `npm ci`, all 21 individual claim commands, 6 unit tests, 24 browser tests, exact production build, and audit.
- Normal, boundary, invalid, recovery, SVG/PNG, share-link, demo isolation, storage, checkout, and malicious-text exercises, except for the documented 4,001-character message defect.
- Zero live Axe serious/critical findings, keyboard/focus checks, 44 px mobile targets, reduced motion, offline reload, service-worker update, link crawl, response headers, cache behavior, and request-log privacy.
- Lighthouse mobile: 97 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.2 s and CLS 0.
- Live route HTML, JS, CSS, and service worker match the candidate build byte-for-byte.
- Sociobot verify endpoint enforced throttling: 32 successful requests followed by 429 with `Retry-After: 3` in the first burst.

## How to reproduce

Clean gates:

```sh
npm ci
node -e "for (const c of require('./.factory/claims.json')) console.log(c.test)"
CI=1 npm test
npm run build
npm audit --audit-level=low
```

Paid offline defect: visit once, seed `sb_license:lesson-tab-card` and a valid verdict whose `checkedAt` is 25 hours old, switch offline, and reload. The worksheet export disappears and the buy link returns.

Rejected-token defect: open `/?license=<invalid-token>` online. Verification stores a false verdict and strips the URL, but no visible inactive notice appears.

Length-boundary defect: paste `title: A` plus enough text to exceed 4,000 characters. The editor shows the empty-state instruction instead of the parser's length error.

## Next steps

- Preserve last-known valid paid access optimistically while offline or awaiting the daily verification.
- Always render and announce definitive license verification failure, even when `paid` was already false.
- Surface parser errors when `card` is null and add 4,000/4,001 boundary coverage.
- Add regression/claim tests for stale-valid offline entitlement and invalid returned-license recovery, then rerun this verification.
