# Independent verification 4 — Lesson Tab Card

## Result

**FAIL — candidate `1e6b9afedd3190e8b9a560633556856cd53d9f21` is not ready for release.**

- Verified: 2026-08-29 UTC
- Candidate: `1e6b9afedd3190e8b9a560633556856cd53d9f21`
- Live site: <https://lesson-tab-card.sociobot.in>
- Demo: <https://lesson-tab-card.sociobot.in/demo>
- Scope: independent static-web product QA; no product code was changed.

The core free editor, demo, privacy behavior, exports, offline shell, accessibility, performance, deployment identity, and every declared claim test pass. Release is blocked by two paid-license failures and one invalid-input recovery failure found outside the declared happy-path tests.

## Release-blocking findings

### HIGH — a cached paid license loses access offline after 24 hours

The paid-unlock contract requires the product to unlock optimistically from a cached valid verdict and reconcile in the background. The live product instead treats a cached valid verdict as invalid as soon as it is 24 hours old.

Fresh browser reproduction on the live site:

1. Visit `/` once and wait for the service worker.
2. Store `sb_license:lesson-tab-card` and a valid `sb_license_verdict:lesson-tab-card` checked 25 hours earlier.
3. Go offline and reload.

Observed live result: the active-pack message and `Export 4-card worksheet` button are absent, while `Buy worksheet pack — $9` is shown. A control run with a 23-hour-old verdict remains active. This removes a paid, one-time-purchase feature from an offline buyer despite a last-known valid verdict.

Required repair: preserve the last valid cached entitlement on first paint and while offline; perform the once-daily verification in the background and revoke only after a definitive invalid response.

### HIGH — a rejected returned license never gets visible failure feedback

Fresh browser reproduction:

1. Open `/?license=qa-invalid-returned-license-4`.
2. Wait for the real Sociobot verification response.

Observed live state:

- URL is correctly stripped to `/`.
- The token remains stored.
- The stored verdict is `{"valid":false,...}`.
- The buy link is shown and the pack remains locked.
- No “license no longer active” notice appears.
- The live region remains stuck at “License received. Checking the worksheet pack now.”

The code records `licenseNotice`, but it only rerenders when `valid !== paid`; both are already false on this path. This violates the paid-unlock requirement to show a quiet inactive-license notice and fails the error/recovery requirement for a payment-adjacent path.

Required repair: render the invalid result even when the paid boolean did not change, announce completion, and provide the documented check-token/buy recovery action. Add a claim test for the rejected returned-token path.

### MEDIUM — the 4,000-character input boundary gives the wrong recovery message

Entering `title: A` followed by more than 4,000 characters correctly causes `parseSyntax` to return “The card is over 4,000 characters. Shorten it and try again.” The live editor discards that parser error because the card is null and instead displays “No lesson yet. Start with a title: line.” The input already contains a title, so the instruction is false and does not explain recovery. Export remains blocked and no console error occurs.

Required repair: display null-card parser errors before selecting the empty state, and add a boundary test at 4,000/4,001 characters.

## Required first-read and demo gate

**PASS.** A cold load answers all three required questions in plain words:

- What: “Make a clear guitar lesson card.”
- For whom: “For teachers and players who need a readable card before the lesson moves on.”
- First action: “Try it with sample data,” with “Loads a G to C warm-up below.”

The action is visible without scrolling at desktop and 390 × 844. On mobile its top is 526.7 px and the three facts end at 772.9 px. One click opens `/demo`; the populated sample title is at y=579.4 px on 1440 × 1000 and y=624.4 px on 390 × 844. The persistent demo banner, Reset demo, and Open my saved card controls are present.

## Claims contract

`.factory/claims.json` exists with 21 claims. Each ID occurs exactly once as `@claim:<id>` in the browser suite; there are no undeclared claim tags.

The supplied checkout initially had no dependencies. As explicitly ordered, every claim command was invoked before any other repository work; each stopped at runner bootstrap with `ERR_MODULE_NOT_FOUND: @playwright/test`. After the required `npm ci`, an authoritative detached clean clone was created at `/tmp/lesson-tab-card-verify4-clean.CNXpcb`, checked out at the exact candidate, and every listed command was rerun unchanged. All 21 passed:

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
| `license-restore` | PASS |
| `billing-request-privacy` | PASS |
| `paid-checkout` | PASS |

The pre-install bootstrap errors are recorded for execution-order transparency; there was no behavioral claim failure after the repository's documented installation step. The product still fails acceptance because the paid error/offline paths and 4,001-character boundary are not covered by the declared claim tests.

## Clean-clone gates

Run in the detached clean clone at the exact candidate:

```text
npm ci                       PASS — 60 packages, 0 vulnerabilities
every claims.json command    PASS — 21/21
CI=1 npm test                PASS — 6 Vitest + 24 Playwright
npm run build                PASS — TypeScript and Vite
npm audit --audit-level=low  PASS — 0 vulnerabilities
git status --short           clean
```

There is no separate lint script. The exact production build created `dist/`:

- JS: 26.92 KB raw / 9.80 KB gzip
- CSS: 11.93 KB raw / 3.39 KB gzip
- lesson image: 69.63 KB
- no downloaded font files

These are well below the 200 KB JS, 50 KB CSS, 120 KB font, and 300 KB hero-image budgets.

## Independent end-to-end evidence

The live demo was exercised separately from the repository tests on desktop and 390 px mobile.

- Valid limits `frets: 0 12 x 0 12 x`, `fingers: 0 4 x 0 4 x`, and `capo: 12` produced “Ready to export and share.”
- SVG export was valid, contained the entered title, and was 3,187 bytes. PNG export had the correct eight-byte PNG signature and was 98,474 bytes.
- Adjacent invalid values produced six named errors, no `NaN` SVG output, and no browser error. Reset demo restored the complete sample.
- The copied URL used an empty query plus `#c=` and restored the exact sample.
- Script/image-like title and note text was XML-escaped; no injected script or image node was created.
- A damaged fragment displayed its recovery message without a console error.
- The lazy lesson image loaded on mobile when scrolled into view at 960 × 640 with descriptive alt text.
- Every anchor on home, demo, privacy, terms, and 404 resolved. The buy link returned 303 to a Dodo hosted checkout session; `sociobot.in` and all internal links returned 200.

The product does not need an AI feature for this brief: validated local notation, export, and sharing are the direct job. No missed AI leverage finding was raised.

## Accessibility and responsive behavior

- Live Axe 4.10.2: zero serious/critical findings on `/demo` at 1440 × 1000 and 390 × 844. The repository suite also scans blank, demo, privacy, terms, and 404.
- 390 px: `scrollWidth === clientWidth === 390`; no visible interactive target was below 44 × 44 px.
- Keyboard: skip link focused `#main`; Alt+1 focused the lesson textarea; Ctrl+Enter export passed in the claim suite.
- Focus: the skip link showed a designed 4 px solid `rgb(21, 94, 239)` outline with 4 px offset.
- Reduced motion: media query matched; maximum computed animation and transition duration was 0.00001 s.
- Correct `lang`, one h1, one main landmark, route titles, labels, live regions, alt text, and designed HTTP 404 were present.
- No console error, page error, request failure, horizontal overflow, or keyboard trap occurred in the independent flows.

## Privacy, service worker, and headers

The independent edit/export/share/recovery flow made 13 requests, all to `lesson-tab-card.sociobot.in`. No entered lesson text appeared in a URL, referrer, or body. Demo state remained separate from real storage in the claim suite. No analytics, account, or sign-in flow exists, so Microsoft Entra requirements do not apply.

The optional verify call is sent only to `api.sociobot.in`, returns `Cache-Control: no-store`, and explicitly allows the live origin. The production checkout and request-privacy claims pass.

The service worker was active at `/service-worker.js`, `registration.update()` completed with no waiting or installing worker, and the only cache was `lesson-tab-card-v4`. After switching offline, both populated `/demo` and `/privacy` reloaded correctly with no console error.

Live responses include:

- HSTS with subdomains and preload
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- CSP with `frame-ancestors 'none'` as a response header
- camera, microphone, and geolocation disabled by Permissions Policy
- HTML `max-age=30, must-revalidate`
- hashed JS/CSS `max-age=31536000, immutable`
- service worker `no-cache`

Conditional requests for HTML, JS, and service worker returned 304. Initial root HTML + JS + CSS + lesson image total 110,313 uncompressed bytes.

## Server-side allowance

This static product has no product-owned backend. Its license verification uses the factory's Sociobot endpoint. A single-client burst against the invalid-token verification path received 32 successful responses; request 33 returned **429** with **`Retry-After: 3`**. A partial-window confirmation allowed 11 more and returned 429 on request 12 with `Retry-After: 1`, confirming stateful enforcement. The repository does not state a numeric allowance, so the observed window is reported rather than inferred.

## Performance and deployment identity

Lighthouse 13.0.1 mobile audit of live `/demo`:

- Performance 97
- Accessibility 100
- Best Practices 100
- SEO 100
- FCP 1.0 s, LCP 1.2 s, TBT 200 ms, CLS 0, Speed Index 1.0 s

`/opt/fleet/lib/verify-url.sh` returned HTTP 200, 758 ms network-idle load, correct title/lang/h1/main/alt/button names, and zero console/page errors.

The live deployment matches the candidate build byte-for-byte for root, demo, privacy and terms HTML, main JS, main CSS, and service worker. Key hashes:

- `main-BOFePCyv.js`: `29f7925c9805ff00f9c098e9b64514a8a0155ab95f8149ba495e49342a903408`
- `main-Cs2CYvcv.css`: `81090db3cb8b962e386884f6be39bfcaa803b0c15a7988af8e2caaa39ad62d44`
- `service-worker.js`: `d52e9b78fb609f022249ade6f25ecd913a36d6901b2afc96833bab258d32919b`

The earlier reported deployment-only concern is not present: live is deployed and matches this candidate. The fresh failures are product behavior, not deployment identity.

## Defect summary

| Severity | Count | Release effect |
| --- | ---: | --- |
| Critical | 0 | None |
| High | 2 | Blocks release: paid offline entitlement and rejected-license recovery |
| Medium | 1 | Blocks acceptance: incorrect invalid-input recovery at the source-length boundary |
| Low | 0 | None |
