# Independent product verification — PASS

Verified on 2026-08-29 for work order `lesson-tab-card-verify-7`.

- Candidate commit: `e88a2ce0cccacd652a7126b470da5917a01e487f`
- Live URL: <https://lesson-tab-card.sociobot.in>
- Demo URL: <https://lesson-tab-card.sociobot.in/demo>
- Artifact: static Vite/TypeScript offline web app
- Verdict: **PASS — release accepted.**

Fresh testing found no critical, high, medium, or low product defect. The earlier deployment-only concern is not present: production matches the candidate build byte-for-byte, checkout is live, and the rate-limited license endpoint works.

## Mandatory first checks

### First read and one-click demo: PASS

A cold live load at 1440 × 1000 and 390 × 844 answers the required questions in the first viewport:

- What it does: “Make a clear guitar lesson card.”
- Who it is for: teachers and players who need a readable card before the lesson moves on.
- What to click first: “Try it with sample data,” beside “Loads a G to C warm-up below.”

One click opens `/demo`. The populated G-to-C card title is visible at y=629 px in the 844 px mobile viewport. The persistent banner says “Demo — sample data, nothing is saved” and offers Reset demo and Open my saved card.

Evidence: `verification-7-evidence/first-read-desktop.png`, `first-read-mobile.png`, `screenshot-desktop.png`, and `screenshot-mobile.png`.

### Claims: PASS, 25/25

`.factory/claims.json` exists, contains 25 unique IDs, and every ID has exactly one matching `@claim:<id>` test. There are no undeclared claim tags. After `npm ci`, every manifest command was invoked separately from detached clean worktree `/tmp/lesson-tab-card-verify7-clean.C71dlh` at the exact candidate; all passed:

`demo-first-screen`, `offline-reload`, `browser-private`, `demo-isolation`, `preview-updates`, `lesson-card-fields`, `free-exports`, `local-draft-storage`, `clear-saved-card`, `keyboard-shortcuts`, `license-free-card-exports`, `no-account-no-tracking`, `share-link`, `legacy-link-migration`, `syntax-validation`, `syntax-boundaries`, `worksheet-pack`, `paid-license-flow`, `paid-license-offline-recovery`, `rejected-returned-license`, `source-length-boundary`, `license-restore`, `billing-request-privacy`, `merchant-refund-policy`, and `paid-checkout`.

The mandatory immediate invocation before dependency installation could not load `@playwright/test`; no test assertion ran. The acceptance run above used the documented clean-clone prerequisite `npm ci`, which installed 60 packages with zero vulnerabilities.

Cross-checking the live page, policies, README, and copy audit found no unlisted user-facing product promise. Development and deployment instructions were verified separately.

## Clean-checkout quality gates

| Gate | Result |
| --- | --- |
| `npm ci` | PASS — 60 packages; 0 vulnerabilities |
| Every `.factory/claims.json` command separately | PASS — 25/25 |
| `CI=1 npm test` | PASS — 7 Vitest tests and 29 Playwright tests |
| `npx tsc --noEmit` | PASS |
| `npm run build` | PASS — exact production build; `dist/` created |
| `npm audit --audit-level=low` | PASS — 0 vulnerabilities |
| `git diff --check` | PASS |

There is no separate lint script. The production build includes the TypeScript check. This static product is not a library or CLI, so package/consumer testing does not apply.

## Independent end-to-end evidence

- A live boundary card using frets `x`, `0`, `1`, and `12`; fingers `x`, `0`, `1`, and `4`; capo `12`; and six tab strings reached the ready state.
- SVG export was 3,098 bytes and contained the exact title. PNG export was 109,421 bytes with the valid `89 50 4e 47` signature.
- The copied URL used `#c=` with no query and restored the exact source text.
- Invalid frets `-1`, `13`, and text; fingers `-1`, `5`, and text; and capo `13` produced seven named errors, no `NaN`, no malformed SVG, no download, and no console error.
- Markup-like title and note content created no script or image element.
- Exactly 4,000 source characters avoided the global length error; 4,001 produced the required shortening message.
- A damaged share fragment produced a plain recovery message.
- Demo reset, real-draft isolation, clear-card confirmation, returned/pasted/revoked licenses, and the four-card worksheet were covered by the passing claim suite.

## Accessibility, keyboard, responsive layout, and motion

- Fresh Axe 4.10.2 scans of `/`, `/demo`, `/privacy`, `/terms`, `/404.html`, and an unknown route found zero serious or critical findings at desktop and 390 px mobile.
- Every tested screen had `lang="en"`, one h1, one main landmark, complete image alt text, no horizontal overflow, and no visible interactive target below 44 × 44 CSS px.
- All interactive controls were reachable in keyboard order and showed a 4 px blue focus outline. The skip link works; `Alt+1` focuses the editor; `Ctrl+Enter` exports SVG.
- SPA navigation and browser Back move focus to the destination h1. Routes keep distinct titles.
- Simulated 200% root text sizing produced no horizontal overflow or lost controls on `/`, `/demo`, `/privacy`, or `/terms` at 390 px.
- Reduced-motion media emulation matched; maximum computed animation/transition duration was 0.01 ms.
- Real routes produced no console or page errors. The intentional unknown URL returns HTTP 404, which Chromium reports as the expected failed top-level resource; the designed page itself has no application error.
- `/opt/fleet/lib/verify-url.sh` on live `/demo`: HTTP 200, 647 ms network-idle load, no errors, and all title/lang/h1/main/alt/button checks passed. Machine output is in `verification-7-evidence/verify.json`.

## Privacy, headers, links, and API policy

- A fresh Playwright context with service workers blocked recorded four requests during edit, SVG export, share creation, and share restoration. All were same-origin GETs. A unique lesson marker appeared in no URL, body, or referrer.
- Explicit browser verification made one disclosed cross-origin GET to `api.sociobot.in`; it carried no lesson text and returned a no-store `{ valid: false, reason: "invalid" }` response.
- No analytics, third-party font/script, Azure endpoint, account, or sign-in flow was found. Microsoft Entra requirements do not apply.
- Browser response headers include HSTS, `nosniff`, strict-origin referrer policy, restrictive permissions policy, and CSP with header-delivered `frame-ancestors 'none'`. The CSP allows only self plus the documented Sociobot API connection.
- HTML is `max-age=30, must-revalidate`; hashed JS/CSS is one-year immutable; the service worker is `no-cache`; ETag revalidation returns 304.
- Every rendered link returned 200, a valid `mailto:`, or the expected 303 checkout redirect. Unknown routes return the designed HTTP 404.
- A single-client license-verification sequence received 30 HTTP 200 responses. Request 31 and the next 14 returned HTTP 429. The first 429 included `Retry-After: 3` and `x-ratelimit-after: 3`. Observed allowance: 30 requests per window.
- Production checkout returns HTTP 303 to `checkout.dodopayments.com`. The clean claim test verified the visible “Lesson Tab Card Worksheet Pack,” `$9.00`, and one-time license description.

## Offline behavior, performance, and deployment identity

- Service worker scope is `/`, active cache is only `lesson-tab-card-v5`, and an explicit update left one activated worker with none installing or waiting.
- After going offline, the populated `/demo` and `/terms` both reloaded with correct titles, headings, and content.
- Build output: JavaScript 27,967 bytes raw / 10.09 KB gzip; CSS 11,934 bytes raw / 3.41 KB gzip; lesson image 69,632 bytes; no web fonts. All are well below contract budgets.
- Lighthouse 12.8.2 mobile `/demo`: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.90 s, LCP 0.94 s, TBT 11 ms, CLS 0, Speed Index 0.90 s, and 86,184 transferred bytes. Machine summary: `verification-7-evidence/lighthouse-summary.json`.
- All 21 publicly served build files matched local `dist/` byte-for-byte, totaling 309,943 bytes. `staticwebapp.config.json` is correctly consumed by the host rather than served.
- Key SHA-256 values: JS `193cc592926b3563e7ac095e115ed56a76e8a3f19f1644393461dbaac1afd101`; CSS `81090db3cb8b962e386884f6be39bfcaa803b0c15a7988af8e2caaa39ad62d44`; service worker `bb819dd410239c671a45fae3e22190596080583a61c62fc0a0f21810a9923999`.

## Scope and findings

The product fulfills the brief’s smallest useful job: a fast, validated, local-first lesson-card editor with chord grid, fingering, capo, short tab, SVG/PNG export, and a private encoded share URL. The one-click sandbox is realistic and isolated. The visual system is product-specific and documented, and the generated image provenance is recorded.

| Severity | Count | Release effect |
| --- | ---: | --- |
| Critical | 0 | None |
| High | 0 | None |
| Medium | 0 | None |
| Low | 0 | None |

No product code was changed during verification.
