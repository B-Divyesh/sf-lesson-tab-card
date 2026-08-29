# Independent product verification 6 — Lesson Tab Card

## Result

**FAIL — candidate `1d1e96a1e0428c5cd0e9702c83c5ca2dfb75a033` is not ready for release.**

- Verified: 2026-08-29 UTC
- Live site: <https://lesson-tab-card.sociobot.in>
- Demo: <https://lesson-tab-card.sociobot.in/demo>
- Artifact: static Vite/TypeScript PWA
- Scope: fresh independent QA; no product code was changed

The editor, demo, exports, privacy behavior, accessibility, offline flow, performance, deployment identity, and all 24 declared claim commands pass. Release remains blocked because the paid price/one-time promises are not tested as stated, and the required merchant/refund terms are absent.

## Release-blocking findings

### High — the $9 and one-time purchase promises are not enforced by a claim test

The live product says `OPTIONAL PACK / $9 ONCE`, `Buy worksheet pack — $9`, and `One-time purchase`. The terms and README repeat the $9 one-time promise.

`.factory/claims.json` has a `paid-checkout` claim, but its sandbox and test only assert that the billing endpoint returns HTTP 303 to a `checkout.dodopayments.com/session/...` URL. `tests/app.spec.ts:531-534` does not inspect the order summary, amount, or purchase type. It would remain green if the hosted product were changed to another price or a recurring charge. “One-time purchase” is not independently listed in the claims manifest.

Fresh verification followed the redirect without purchasing and found the correct current checkout: “Lesson Tab Card Worksheet Pack”, `$9.00`, and “One-time worksheet license”. The live configuration is correct today, but the mandatory claims contract requires quantitative claims to assert the advertised number and every visitor promise to have an observable test.

Required repair: make the claim explicitly cover `$9` and one-time purchase, and make its tagged test assert those visible checkout facts, or remove/narrow the promises.

### Medium — the terms omit the required merchant and refund disclosure

The paid-unlock contract requires the product to state that Sociobot/Dodo is the merchant of record, refunds are handled there, and a refund revokes the license automatically. The paid section only says checkout opens through Sociobot and Dodo. `/terms` repeats that and directs purchase questions to support; it contains no merchant-of-record, refund, or refund-revocation statement.

Required repair: add the disclosure to `/terms` and concise purchase copy, then update the copy audit and claim coverage as needed.

## Mandatory first-read and demo gate

**PASS.** Cold live loads at 1440 × 1000 and 390 × 844 answer all three questions in the first viewport:

- What it does: “Make a clear guitar lesson card.”
- Who it is for: teachers and players who need a readable card before the lesson moves on.
- What to click: “Try it with sample data”, followed by “Loads a G to C warm-up below.”

One click opens `/demo`. The populated G-to-C card is in the first viewport at both sizes. The persistent banner says “Demo — sample data, nothing is saved” and provides Reset demo and Open my saved card actions.

## Claims and clean-clone gates

`.factory/claims.json` exists with 24 entries. Each ID has exactly one matching `@claim:<id>` tag and there are no undeclared claim tags. After `npm ci`, every manifest command was run separately in both the supplied checkout and a detached clean clone at the exact candidate. All 24 passed:

`demo-first-screen`, `offline-reload`, `browser-private`, `demo-isolation`, `preview-updates`, `lesson-card-fields`, `free-exports`, `local-draft-storage`, `clear-saved-card`, `keyboard-shortcuts`, `license-free-card-exports`, `no-account-no-tracking`, `share-link`, `legacy-link-migration`, `syntax-validation`, `syntax-boundaries`, `worksheet-pack`, `paid-license-flow`, `paid-license-offline-recovery`, `rejected-returned-license`, `source-length-boundary`, `license-restore`, `billing-request-privacy`, and `paid-checkout`.

The separate claim-test adequacy defect above still violates the supplied claims contract.

Detached clean clone: `/tmp/lesson-tab-card-verify6-clean.CzjYOi`.

| Gate | Result |
| --- | --- |
| `npm ci` | PASS — 60 packages, 0 vulnerabilities |
| Every `claims.json` command | PASS — 24/24 separately |
| `CI=1 npm test` | PASS — 7 Vitest + 29 Playwright tests |
| `npm run build` | PASS — `tsc --noEmit` and Vite; `dist/` created |
| `npm audit --audit-level=low` | PASS — 0 vulnerabilities |
| `git diff --check` and clean status | PASS |

There is no separate lint command. The exact production build performs the repository's type check.

## Independent functional evidence

- A live boundary card using frets `0`, `12`, and `x`; fingers `0`, `4`, and `x`; capo `12`; and six tab strings reached the ready state.
- SVG export was 3,158 bytes and contained the exact title. PNG export was 114,102 bytes with a valid PNG signature.
- A copied share link used `#c=` with no query and restored the exact source.
- Invalid fret `-1`/`13`, finger `-1`/`5`, and capo `13` values produced five named errors, no `NaN`, and no download.
- Markup-like title and note text stayed escaped; no script or image node was injected.
- Exactly 4,000 characters was accepted by the source-length boundary; 4,001 produced the required shortening message. Reset restored the sample.
- A damaged share fragment produced a plain recovery message. Stale paid access stayed active offline; a rejected returned token was stripped, stored as invalid, announced, and left purchase/paste recovery available.
- No console or page errors occurred in the product flows. Every rendered link returned 200, a valid `mailto:`, or the expected 303 checkout redirect.

## Accessibility, keyboard, and responsive evidence

- Fresh Axe 4.10.2 scans of `/`, `/demo`, `/privacy`, `/terms`, and `/404.html` found zero serious or critical findings at 1440 px, 390 px, and a 720 px reflow viewport.
- Every route had `lang="en"`, one h1, one main landmark, and no image missing alt text.
- There was no horizontal overflow and no visible interactive target below 44 × 44 CSS px at any tested size.
- Keyboard traversal reached the demo controls. Every sampled focus target had a 4 px `#155eef` outline with 4 px offset. The skip link, Alt+1 editor focus, Ctrl+Enter SVG export, and native details control worked.
- Reduced-motion emulation matched and the maximum computed animation/transition duration was 0.01 ms.
- `/opt/fleet/lib/verify-url.sh` returned 200, loaded in 697 ms, and reported zero console/page errors, one h1, `lang=en`, a main landmark, complete alt text, and labelled buttons.

## Privacy, PWA, API, and response policy

- The complete ordinary edit/export/share/recovery flow recorded 17 requests. All were same-origin apart from the local `blob:` download; entered lesson text appeared in no URL, referrer, or request body.
- A separate live billing flow stored a unique private lesson locally, then exercised checkout and invalid-token verification. The only external requests were the two documented Sociobot URLs, both GETs with empty bodies and a clean root referrer. Neither contained lesson text.
- No analytics, account, external font/script, Azure model endpoint, or sign-in flow was found. Microsoft Entra requirements do not apply.
- The service worker was activated with only cache `lesson-tab-card-v5`; `registration.update()` left no installing or waiting worker. Populated `/demo` and `/privacy` reloaded offline.
- One client received 30 HTTP 200 license-verification responses; request 31 returned HTTP 429 with `Retry-After: 4`, `x-ratelimit-after: 4`, and `Too Many Requests! Wait for 4s`.
- Live responses include HSTS, `nosniff`, strict-origin referrer policy, restrictive permissions policy, and CSP with header-delivered `frame-ancestors 'none'`. Unknown routes return the designed HTTP 404.
- HTML uses `max-age=30, must-revalidate`; hashed assets use one-year immutable caching; the service worker uses `no-cache`. Conditional requests returned 304.

## Performance and deployment identity

Production output is 27.80 KB raw / 10.01 KB gzip JavaScript, 11.93 KB raw / 3.41 KB gzip CSS, 69.63 KB lesson art, no web fonts, and no runtime third-party bytes during the editor flow.

Fresh Lighthouse 12.8.2 mobile on live `/demo`: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.06 s, LCP 1.14 s, TBT 41 ms, CLS 0, Speed Index 1.08 s, and 140,240 transferred bytes. A 50-sample edit-to-preview measurement was 0.2 ms median, 0.6 ms p95, and 2.2 ms maximum.

Live bytes matched local `dist/` for home, demo, privacy, terms, 404, service worker, manifest, robots, sitemap, icons, both WebP images, and hashed JS/CSS. Key SHA-256 values:

- JS: `d06fc99494c7d0844b43a60f17c57e35151e39a1c6eb5fc985a80d7715815aeb`
- CSS: `81090db3cb8b962e386884f6be39bfcaa803b0c15a7988af8e2caaa39ad62d44`
- service worker: `bb819dd410239c671a45fae3e22190596080583a61c62fc0a0f21810a9923999`
- root HTML: `3eebd7df25f6884fdb274e6dd5941b8e6685c6c1b6508ab83087f45b46a0781f`

The previously reported deployment-only concern is not present. The live deployment is current and matches the candidate artifact.

## Scope and defect summary

This is not a library, CLI, or backend, so package-consumer, backend concurrency, and server persistence checks do not apply. No AI feature is needed for the brief's fast local authoring job.

| Severity | Count | Release effect |
| --- | ---: | --- |
| Critical | 0 | None |
| High | 1 | Release blocking — quantitative/unlisted paid claims are not tested as required |
| Medium | 1 | Release blocking — required merchant/refund terms are absent |
| Low | 0 | None |
