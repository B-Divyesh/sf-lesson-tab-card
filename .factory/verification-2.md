# Independent product verification — FAIL

Verified on 2026-08-28 for work order `lesson-tab-card-verify-2`.

- Candidate commit: `45fd91d6bd94ed21430f99f2308f766a837fef98`
- Live URL: https://lesson-tab-card.sociobot.in
- Artifact: static Vite/TypeScript PWA
- Verdict: **FAIL — do not release until the blockers below are removed.**

The previously reported deployment-only failures are repaired in the live product: checkout returns a Dodo session, private share links use a fragment, printable length is validated, blank-state contrast passes, touch targets meet 44px, and unknown routes return HTTP 404. This verification found one new defect while exercising a representative invalid user-input recovery path.

## Required first checks

### First read and one-click demo: PASS

Cold production load, at both desktop and 390px mobile, plainly answers:

- **Does:** “Make a clear guitar lesson card.”
- **For whom:** “For teachers and players who need a readable handout before the lesson moves on.”
- **First click:** “Try it with sample data,” accompanied by “Loads a G to C warm-up below.”

The action opens `/demo` with a populated G-to-C lesson, persistent “Demo — sample data, nothing is saved” banner, Reset demo, and Start for real. Mobile screenshot evidence is `/tmp/lesson-verify-live/screenshot-mobile.png` in the verification environment.

### Claims: PASS (all nine exact commands)

`.factory/claims.json` exists. After `npm ci`, every listed command was invoked separately against the local `/demo` entry point:

| Claim | Command result | Observable result |
| --- | --- | --- |
| `offline-reload` | PASS | Activated service worker reloads sample offline. |
| `browser-private` | PASS | Private lesson is in a fragment, not request URL/referrer. |
| `demo-isolation` | PASS | Seeded real draft survives demo edit and reset. |
| `free-exports` | PASS | SVG content and valid PNG signature/download. |
| `share-link` | PASS | Exact lesson syntax restores. |
| `syntax-validation` | PASS | Named invalid fret/capo errors and no download. |
| `worksheet-pack` | PASS | Four-card sample SVG worksheet. |
| `paid-license-flow` | PASS | Returned mocked-valid license stores, strips URL, activates pack. |
| `paid-checkout` | PASS | Production billing endpoint returns 303 to Dodo session. |

An initial sequential invocation left a Playwright preview server alive when the command runner yielded, so a concurrent retry reported port 4173 in use. This was runner interference, not a product test failure; after the process exited every exact claim command passed independently.

## Release-blocking finding

### Medium — malformed fret recovery emits repeated browser SVG errors

**Reproduction on the live deployment**

1. Open `https://lesson-tab-card.sociobot.in/demo`.
2. Enter:

   ```text
   title: Broken
   chord: C
   frets: x 3 bad 0 1 0
   fingers: x 3 2 0 1 0
   capo: 99
   ```

3. The page correctly names the invalid fret and capo and blocks export.
4. The same interaction produces 18 browser console errors, repeating:

   ```text
   Error: <circle> attribute cy: Expected length, "NaN".
   Error: <text> attribute y: Expected length, "NaN".
   ```

Root cause is visible in `src/card-svg.ts`: `chordGrid()` calls `Number(fret)` for every non-`x`/`0` fret before the validation error stops export. For `bad`, this renders `cy="NaN"` and `y="NaN"`. The preview must not create malformed SVG for invalid syntax; render an explicit recovery/last-valid state or only calculate diagram coordinates for a validated numeric fret. Add regression coverage that asserts this representative invalid input generates neither console errors nor `NaN` SVG attributes.

This is classified Medium because export remains safely blocked and the error names the corrective action, but it violates the required clean error-recovery experience and the QA console-error check. Under the factory definition of done, the candidate remains **FAIL** until fixed.

### High — several visitor-facing promises are not mapped to claims and observable tests

The mandatory claims contract requires every claim-like statement on the landing page and README to have a matching `.factory/claims.json` entry and one observable sandbox test. The following visible promises do not:

- “Your card stays in this browser.” `browser-private` exercises demo and fragment-link request privacy, but not real-draft storage behavior.
- “SVG and PNG exports stay free.” `free-exports` proves files download, not that the outputs remain ungated/free.
- “There is no song library, playback, account, or tracking.” There is no matching claim test for the no-account/no-tracking assertions.

All nine declared commands pass, as recorded above, but that does not meet the stated one-claim/one-test rule for these additional promises. Add exact claims and demo-sandbox tests, or remove/narrow the promises.

## Functional, accessibility, privacy, and deployment evidence

- Normal live `/demo`: SVG (`g-to-c-change.svg`) and PNG (`g-to-c-change.png`) download; copied fragment link restores byte-for-byte lesson syntax.
- Invalid live syntax: named errors appear and export creates no download. Printable-length regression passes in the committed browser suite.
- PWA: service worker scope is `/`; `registration.update()` completed; after activation, `/demo` reloaded its bundled sample while offline.
- Keyboard/mobile: desktop and 390px manual automation found visible focus, working skip link to `#main`, `Alt+1` editor shortcut, no undersized visible link/button/input/summary targets, and no normal-flow console/page errors.
- Reduced motion: computed transition and animation duration are `0.01ms` under `prefers-reduced-motion: reduce`.
- Live axe via `@axe-core/playwright` 4.10.2: **0 serious/critical** violations on both blank `/` and populated `/demo` at 390px. The standalone `@axe-core/cli` could not create a Selenium Chrome session in this container; the Playwright axe scan used the preinstalled Chromium successfully.
- `/opt/fleet/lib/verify-url.sh` against live returned 200 in 676ms, title/lang/one h1/main/alt/button-name checks clean, and no load console errors.
- All live app links returned 200, mailto, or (for checkout) 303. `/definitely-not-a-real-route` returned HTTP 404 with the designed 404 page.
- Response policy: HSTS, `nosniff`, strict-origin referrer policy, CSP limited to self plus `https://api.sociobot.in` for connections, frame denial, and camera/microphone/geolocation restrictions are live. Hash-named JS/CSS/images are one-year immutable; service worker is `no-cache`.
- No analytics, third-party fonts/scripts, Azure endpoint, or sign-in flow was found. The only runtime cross-origin request is disclosed Sociobot billing verification; a live invalid-token browser request received HTTP 200, `Access-Control-Allow-Origin: https://lesson-tab-card.sociobot.in`, and `Cache-Control: no-store` with no console error.
- Rate-limit requirement: a 50-request concurrent burst of fake-token verification calls produced **29 HTTP 200 and 21 HTTP 429**. The first sampled 429 included `Retry-After: 2` (and `x-ratelimit-after: 2`). Checkout returns 303 to `https://checkout.dodopayments.com/session/...`.
- Live assets byte-match the production build for root/demo/privacy/terms/404 HTML, hashed JS/CSS, service worker, manifest, robots, sitemap, favicon/apple icon, and both WebP images. The deployment-only failure reported earlier is not present.

## Repository quality gates

| Gate | Result |
| --- | --- |
| `npm ci` | PASS; 0 audit vulnerabilities |
| `npm test` | PASS; 4 Vitest + 13 Playwright tests |
| `npm run build` | PASS; typecheck and Vite production build, `dist/` produced |
| `npm audit --audit-level=low` | PASS; 0 vulnerabilities |
| Bundle budget | PASS; JS 26.07 KB raw / 9.81 KB gzip; CSS 11.18 KB raw / 3.24 KB gzip; no web fonts |
| Lighthouse 12.8.2, live mobile | PASS; Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP/LCP 1.2s, TBT 120ms, CLS 0, 137 KiB transfer |

## Scope notes

This is a static web/PWA product, so library/CLI consumer installation and backend concurrency/persistence checks do not apply. No sign-in or AI feature is present; neither is required by the brief.

## Required remediation and re-verification

1. Prevent malformed fret tokens from reaching numeric SVG layout, and make invalid syntax render without browser console errors or `NaN` attributes.
2. Add a browser test covering `frets: x 3 bad 0 1 0`, asserting named validation, blocked export, zero console/page errors, and no `NaN` in preview SVG.
3. Add exact claim entries/tests for the visitor-facing storage, free-export, and no-account/no-tracking promises (or remove/narrow them), then re-run all claims and the affected live invalid-input flow.
