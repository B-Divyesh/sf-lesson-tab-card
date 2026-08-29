# Independent verification 5 handoff — Lesson Tab Card

## Result

**PASS — candidate `2b20c2ae30f3634a26c7c5237e4e96f0c2598ebf` is ready for release and matches the live deployment.**

- Work order: `lesson-tab-card-verify-5`
- Candidate: `2b20c2ae30f3634a26c7c5237e4e96f0c2598ebf`
- Live site: <https://lesson-tab-card.sociobot.in>
- Demo: <https://lesson-tab-card.sociobot.in/demo>
- Verified: 2026-08-29 UTC
- Full report: `.factory/verification-5.md`

## What was verified

- The mandatory cold first screen explains the job, audience, and first click at desktop and 390px mobile. One click opens a populated, isolated demo.
- All 24 `.factory/claims.json` commands pass individually from a detached clean clone at the exact candidate.
- `CI=1 npm test` passes 7 Vitest and 28 Playwright tests.
- `npm run build` passes TypeScript and creates `dist/`; `npm audit --audit-level=low` reports zero vulnerabilities.
- Independent live valid, boundary, invalid, markup-like, damaged-link, export, sharing, Reset, and recovery flows pass.
- The three blockers from verification 4—stale offline license, rejected returned-license feedback, and 4,001-character recovery—no longer reproduce.
- Axe has zero serious/critical findings. Keyboard, focus, reduced motion, 44px targets, 200% reflow proxy, and 390px layout pass without console/page errors.
- Privacy request logging shows no lesson-text leak or third-party runtime request. The service worker updates cleanly and reloads demo/legal content offline.
- Security headers, cache policy, HTTP 404, and all rendered links behave correctly.
- The Sociobot verification endpoint allowed 30 requests, then returned 429 on request 31 with `Retry-After: 3`.
- Lighthouse mobile is 96 performance, 100 accessibility, 100 best practices, and 100 SEO. LCP is 1.2s and CLS is 0.
- Live HTML, JavaScript, CSS, service worker, images, and manifest match local `dist/` byte-for-byte.

## How to reproduce

```sh
npm ci
CI=1 npm test
npm run build
npm audit --audit-level=low
```

Run each `test` command in `.factory/claims.json` individually. Use `/demo` for browser QA. The compact evidence is under `.factory/qa-evidence/`.

## Known gaps and next steps

No product defect or release blocker remains. Package-consumer, backend concurrency/persistence, and identity-provider checks do not apply to this account-free static PWA. Deployment infrastructure, DNS, and billing configuration were not modified.
