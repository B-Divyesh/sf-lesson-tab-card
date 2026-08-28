# Independent verification 3 — Lesson Tab Card

## Result

**PASS — candidate `81c4cf96ffdcb4eef182dda6b843f3ea310ac729` is acceptable for release.**

- Verified on: 2026-08-28
- Candidate checkout: `81c4cf96ffdcb4eef182dda6b843f3ea310ac729`
- Live URL: <https://lesson-tab-card.sociobot.in>
- Demo entry point: <https://lesson-tab-card.sociobot.in/demo>
- Scope: independent static-web verification; no product source was modified.

## First-read result

Cold desktop load answers the required questions in plain words: it makes a clear guitar lesson card; it is for teachers and players who need a readable handout before a lesson moves on; and the first action is **“Try it with sample data”**, explicitly saying it loads a G-to-C warm-up. The one-click demo opens `/demo` with that complete card and the persistent “Demo — sample data, nothing is saved” banner, Reset demo, and Start for real controls. **Pass.**

## Required claim contract

`.factory/claims.json` exists and declares 12 claims. From the clean `npm ci` checkout, every listed Playwright command was invoked against the product's local demo entry point. The final full browser-suite record is `test-results/.last-run.json` with `{"status":"passed","failedTests":[]}`.

| Claim ID | Result |
| --- | --- |
| `offline-reload` | PASS |
| `browser-private` | PASS |
| `demo-isolation` | PASS |
| `free-exports` | PASS |
| `local-draft-storage` | PASS |
| `license-free-card-exports` | PASS |
| `no-account-no-tracking` | PASS |
| `share-link` | PASS |
| `syntax-validation` | PASS |
| `worksheet-pack` | PASS |
| `paid-license-flow` | PASS |
| `paid-checkout` | PASS |

The claims are each represented once in the suite. The browser-private test proves copied fragment links omit lesson text from request URLs and referrers; demo isolation preserves the real local-storage draft; offline reload works after service-worker activation; free SVG and PNG downloads have observable valid output; and the live checkout test receives the documented Dodo-hosted 303 redirect.

## Local quality gates

Fresh install and exact commands:

```sh
npm ci
npm test
npm run build
npm audit --audit-level=low
```

All passed. `npm test` reports 5 Vitest unit tests and 16 Playwright tests passing. `npm run build` includes `tsc --noEmit` and produced `dist/`; the repository defines no separate lint command. Audit reports zero vulnerabilities.

Production bundle from the candidate build: main JS 26.11 kB raw / 9.82 kB gzip and CSS 11.18 kB raw / 3.24 kB gzip (well below static-web budgets; no downloaded fonts).

## End-to-end and accessibility evidence

Live-browser checks covered desktop and a 390 × 844 mobile viewport:

- The complete demo sample preview loaded; SVG and PNG downloads were `g-to-c-change.svg` and `g-to-c-change.png`.
- Boundary values `12` for frets and capo validate and render. Invalid non-numeric fret and negative capo input show named errors; export is blocked; Reset demo restores the working sample.
- Keyboard-only skip link visibly focuses with a 4 px blue outline and moves focus to `#main`; 390 px had no horizontal overflow. Reduced-motion rendering has a `0.01ms` animation duration.
- Live Axe (`@axe-core/playwright`) found **0 serious or critical** violations on `/demo` at desktop and 390 px. The repository test also checks blank `/` and `/demo`.
- No console errors or page errors occurred during cold load, demo use, export, invalid input/recovery, or mobile exercise.
- `/`, `/demo`, `/privacy`, and `/terms` returned 200 with route-specific title, one h1, and one main landmark. An unknown route returned the designed 404 with HTTP 404.
- Lighthouse 13.4.1 on live `/demo` (mobile preset): Performance **98**, Accessibility **100**, Best Practices **100**, SEO **100**; LCP 1.0 s, CLS 0, TBT 160 ms.

Service worker source uses cache `lesson-tab-card-v3`, `skipWaiting`, cache cleanup on activate, and shell precaching. The claim test demonstrated the required post-first-visit offline reload, including the bundled demo sample.

## Privacy, headers, deployment identity

During fresh live demo use (including exports, sample edits, validation, and reset), Playwright observed only `lesson-tab-card.sociobot.in` document/assets plus a local `blob:` download; no lesson text appeared in request URLs or referrers and no third-party/tracking request occurred. The product is local-first: real drafts use local storage and demo state is isolated in memory.

Live headers include HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, restrictive CSP (self plus only the documented Sociobot billing origin), `Permissions-Policy` disabling camera/microphone/geolocation, immutable one-year cache control for hashed JS/CSS, and `no-cache` for `service-worker.js`.

The live main JS and CSS match the candidate's `dist/` byte-for-byte:

- `main-hQBpn0LD.js`: SHA-256 `581d561d1bd608b126b9d5a517c4372bbd5412b0e4e5b94e8fed49ab5196a90a`
- `main-jv5Qvvxq.css`: SHA-256 `56d00909391d208f78314dffb6e947b7c4901c93a647823722cc67753ae27e10`

This is a static product with no product-owned server endpoint, account/sign-in system, persistence service, or API allowance to exercise. Its optional checkout/verification calls are the external Sociobot billing API; the declared checkout claim passed with the live 303 to Dodo. No Microsoft Entra flow applies.

## Defects

No open defects found.

| Severity | Count | Details |
| --- | ---: | --- |
| Critical | 0 | None |
| High | 0 | None |
| Medium | 0 | None |
| Low | 0 | None |
