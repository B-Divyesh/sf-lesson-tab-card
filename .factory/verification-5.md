# Independent verification 5 — Lesson Tab Card

## Result

**PASS — candidate `2b20c2ae30f3634a26c7c5237e4e96f0c2598ebf` is ready for release.**

- Verified: 2026-08-29 UTC
- Candidate: `2b20c2ae30f3634a26c7c5237e4e96f0c2598ebf`
- Live site: <https://lesson-tab-card.sociobot.in>
- Demo: <https://lesson-tab-card.sociobot.in/demo>
- Scope: independent static-web product QA; no product code was changed.

Fresh evidence resolves the earlier report's paid-license and length-recovery blockers. The live deployment is present and matches this candidate byte-for-byte. No critical, high, medium, or low product defect was found.

## Mandatory first-read and demo gate

**PASS.** A cold live load at 1440 × 1000 and 390 × 844 answers all three questions within the first screen:

- What it does: “Make a clear guitar lesson card.”
- Who it is for: “For teachers and players who need a readable card before the lesson moves on.”
- What to click first: “Try it with sample data,” followed by “Loads a G to C warm-up below.”

The action is above the fold at both sizes. One click opens `/demo`; the complete G-to-C card is already visible. The persistent “Demo — sample data, nothing is saved” banner includes Reset demo and Open my saved card. The first-read screenshots are `.factory/qa-evidence/live-first-read-desktop.png` and `.factory/qa-evidence/live-first-read-mobile.png`; extracted text, control positions, requests, and errors are in `.factory/qa-evidence/live-first-read.log` and `.factory/qa-evidence/live-demo-entry.log`.

## Claims contract

`.factory/claims.json` exists with 24 entries. Each ID has exactly one matching `@claim:<id>` test, and no undeclared claim tag exists. Every manifest command was run individually after `npm ci` in a detached clean clone at the exact candidate. All 24 passed:

| Claim | Result |
| --- | --- |
| `demo-first-screen` | PASS |
| `offline-reload` | PASS |
| `browser-private` | PASS |
| `demo-isolation` | PASS |
| `preview-updates` | PASS |
| `lesson-card-fields` | PASS |
| `free-exports` | PASS |
| `local-draft-storage` | PASS |
| `clear-saved-card` | PASS |
| `keyboard-shortcuts` | PASS |
| `license-free-card-exports` | PASS |
| `no-account-no-tracking` | PASS |
| `share-link` | PASS |
| `legacy-link-migration` | PASS |
| `syntax-validation` | PASS |
| `syntax-boundaries` | PASS |
| `worksheet-pack` | PASS |
| `paid-license-flow` | PASS |
| `paid-license-offline-recovery` | PASS |
| `rejected-returned-license` | PASS |
| `source-length-boundary` | PASS |
| `license-restore` | PASS |
| `billing-request-privacy` | PASS |
| `paid-checkout` | PASS |

The supplied checkout initially had no installed dependencies. In compliance with the requested execution order, the manifest commands were first invoked before other repository work and stopped at runner bootstrap because `@playwright/test` was not installed. After the documented `npm ci` prerequisite, every command passed both in the supplied checkout and in `/tmp/lesson-tab-card-verify5-clean.roC9IC`. The installed individual-run output is `.factory/qa-evidence/claim-tests-installed.log`.

The live landing, editor, legal copy, README, and `.factory/copy-audit.md` were cross-checked against the manifest. Product claims are represented by the 24 entries; no unlisted visitor claim was found.

## Clean-clone quality gates

The authoritative clone was detached at the exact candidate and clean before installation and after all commands:

```text
npm ci                         PASS — 60 packages, 0 vulnerabilities
all claims.json commands       PASS — 24/24 individually
CI=1 npm test                  PASS — 7 Vitest + 28 Playwright
npm run build                  PASS — TypeScript + Vite, dist/ created
npm audit --audit-level=low    PASS — 0 vulnerabilities
git diff --check               PASS
git status --short             clean
```

There is no separate lint script. `npm run build` performs `tsc --noEmit` before the production Vite build. This is a static web product, so package-consumer, backend concurrency, persistence, and sign-in-provider checks do not apply.

Production output:

- JavaScript: 27.66 KB raw / 9.98 KB gzip
- CSS: 11.93 KB raw / 3.39 KB gzip
- lesson image: 69.63 KB
- fonts: 0 KB

These are below the 200 KB JS, 50 KB CSS, 300 KB mobile image, and 120 KB font budgets. Local test and build output is retained in `.factory/qa-evidence/npm-test.log` and `.factory/qa-evidence/npm-build.log`.

## Independent end-to-end product QA

A separate live browser flow, outside the repository tests, exercised the smallest useful product:

- A valid card using fret values `0`, `12`, and `x`, finger values `0`, `4`, and `x`, capo `12`, and six tab strings reached “Ready to export and share.”
- SVG export was 3,158 bytes and contained the exact title. PNG export was 114,102 bytes with the eight-byte PNG signature.
- The copied link had no query, used `#c=`, and restored the lesson text exactly.
- Adjacent invalid fret `-1`/`13`, finger `-1`/`5`, and capo `13` values produced five named errors. Export remained blocked; the preview contained no `NaN`.
- Script- and image-like title/note input remained text. No injected `script` or `img` node appeared.
- Exactly 4,000 characters did not produce the source-length error. At 4,001 characters, the exact shortening instruction appeared. Reset demo restored the bundled sample.
- A damaged fragment showed a plain recovery message without a console or page error.
- Empty state, saved-draft clearing, valid/invalid printable lengths, keyboard export, route history, and demo isolation passed in the complete browser suite.

The structured independent output and complete request list are in `.factory/qa-evidence/live-independent.json`.

## Earlier blocking defects

All three findings from independent verification 4 were reproduced against the repaired live candidate and now pass:

1. A 25-hour-old cached valid worksheet verdict remained active while offline. The active message and worksheet export stayed visible; the buy link stayed absent.
2. A real rejected returned token was removed from the URL, stored with a false verdict, announced as inactive, and left both purchase and pasted-token recovery available.
3. A 4,001-character source displayed “The card is over 4,000 characters. Shorten it and try again.” The 4,000-character neighbor did not display that error.

## Accessibility, responsive behavior, and visual review

- Live Axe 4.10.2 found zero serious or critical violations on desktop and 390px mobile. The repository suite also covers blank, demo, privacy, terms, and 404 states.
- Lighthouse accessibility scored 100.
- At 390px, `scrollWidth === clientWidth === 390`; every visible interactive target was at least 44 × 44 CSS px.
- Keyboard-only navigation reached every demo control. The skip link moved focus to `main`; Alt+1 returned focus to the editor; Ctrl+Enter export passed.
- The focused skip link had a 4px solid `#155eef` outline with 4px offset.
- With reduced motion requested, the media query matched and the maximum computed duration was 0.01ms.
- A 720px-width reflow check, equivalent to a 1440px desktop at 200% zoom, had no horizontal overflow and retained the editor and all actions.
- Every tested route had `lang="en"`, one h1, one main landmark, route-specific title, labelled controls, and no missing image alt text.
- The live design matches the recorded neo-brutalist lesson-sheet thesis: warm paper, hard rules, yellow teaching marks, cobalt focus/action cues, stable monospace notation, and no generic gradient template.
- The generated desk art is original, locally hosted, optimized, and documented with prompt and provenance in `.factory/design.md`.

`/opt/fleet/lib/verify-url.sh` returned HTTP 200, 965ms network-idle load, correct title/lang/h1/main/alt/button basics, and zero console or page errors. Its JSON output is `.factory/qa-evidence/verify-url/verify.json`.

## Privacy, PWA, routes, and links

The complete independent edit/export/share/recovery flow recorded 17 requests. Every network request was same-origin; the browser also recorded one same-origin `blob:` PNG read. No entered title or note appeared in a URL, referrer, or request body. No analytics, tracking, account, or third-party runtime script/font request occurred.

The optional real license verification response returned HTTP 200, exact-origin CORS, and `Cache-Control: no-store`; lesson text was absent. Sign-in is not present, so the Microsoft Entra requirement does not apply.

The active service worker used only cache `lesson-tab-card-v5`. `registration.update()` left no installing or waiting worker. After switching offline, the populated demo and `/privacy` both reloaded successfully.

All rendered links from home, demo, privacy, terms, and 404 were crawled. Internal links and `sociobot.in` resolved to 200; the two `mailto:` links were valid; the buy link returned 303 to a Dodo hosted checkout session. An unknown path returned the designed page with HTTP 404.

## Server-side request allowance

The product owns no backend. Its one server-side integration is the Sociobot license API. From one client, a fresh sequential burst received 30 HTTP 200 responses; request 31 returned HTTP 429 with `Retry-After: 3` and `Too Many Requests! Wait for 3s`. The allowance is therefore enforced at 30 successful requests in the observed window.

## Headers, caching, performance, and deployment identity

Live responses include HSTS with subdomains and preload, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, camera/microphone/geolocation restrictions, and a CSP with `frame-ancestors 'none'` delivered as a response header. HTML is `max-age=30, must-revalidate`; hashed JS/CSS is one-year immutable; the service worker is `no-cache`. Conditional requests for root HTML, JS, and the service worker returned 304.

Lighthouse 13.0.1 mobile on live `/demo`:

- Performance 96
- Accessibility 100
- Best Practices 100
- SEO 100
- FCP 1.0s, LCP 1.2s, TBT 220ms, CLS 0, Speed Index 1.0s
- 140,230 transferred bytes; 10,193 script bytes; 3,542 stylesheet bytes; 0 third-party bytes

Live files matched local `dist/` byte-for-byte for root, demo, privacy, terms, 404, service worker, JS, CSS, lesson image, social image, and web manifest. Key hashes:

- JS `f8f52c11e90ebef8fee7598b5899596a57de096150b83e93318a62728bfa7e8f`
- CSS `81090db3cb8b962e386884f6be39bfcaa803b0c15a7988af8e2caaa39ad62d44`
- service worker `bb819dd410239c671a45fae3e22190596080583a61c62fc0a0f21810a9923999`
- root HTML `efada35054925e1e5fd11aef7fb3b45640640570667a288697d63a190ca90178`

The previously reported deployment-only concern is not present: the live deployment exists, behaves correctly, and matches candidate `2b20c2ae30f3634a26c7c5237e4e96f0c2598ebf`.

## Defect summary

| Severity | Count | Release effect |
| --- | ---: | --- |
| Critical | 0 | None |
| High | 0 | None |
| Medium | 0 | None |
| Low | 0 | None |

No release-blocking or follow-up product gap was found. An AI feature would not improve the brief's direct job; fast local validation, export, and sharing remain the appropriate scope.
