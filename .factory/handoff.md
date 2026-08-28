# Lesson Tab Card repair handoff

## Status

**Repaired, pushed, and deployed.**

- Work order: `lesson-tab-card-repair-2`
- Repair base / verifier report: `b3803ecaa17a0c9428d4c78e6452ee9d47b45c41` / `.factory/verification-2.md`
- Repair commit: `54225f637d251bce032f231671e27da13dd5b49d`
- Artifact and deployment class: Vite + TypeScript static web app, Azure Static Web Apps, output `dist/`
- Deployment target: `sf-lesson-tab-card` in Azure resource group `sociobot`, serving `https://lesson-tab-card.sociobot.in`

## Repairs

1. The chord-diagram renderer now accepts only validated fret tokens (`1` through `12`) before calculating SVG positions. An invalid in-progress token such as `bad` is omitted from the diagram while its named validation error remains visible. It can no longer produce `cy="NaN"` or `y="NaN"` browser errors.
2. Added a direct renderer unit test and browser regression `@regression:invalid-fret-preview`. The browser test enters the verifier's exact malformed-fret fixture, checks named validation and blocked export, then asserts zero browser/page errors and no `NaN` preview markup.
3. Added a one-to-one claims contract for the previously unmapped visitor promises:
   - `local-draft-storage`: real draft persists in the namespaced browser storage and restores after reload.
   - `license-free-card-exports`: SVG and PNG work with no stored license and no checkout/license request.
   - `no-account-no-tracking`: the demo flow has no playback/account controls and makes only same-origin requests.

## Verification evidence

Fresh `npm ci` passed with 0 audit vulnerabilities. These quality gates also passed:

```sh
npm test
npm run build
npm audit --audit-level=low
```

- `npm test`: **5 Vitest unit tests + 16 Playwright browser tests passed**.
- `npm run build`: passed typecheck and produced `dist/index.html`.
- Production bundle: JS **26.11 kB raw / 9.82 kB gzip**; CSS **11.18 kB raw / 3.24 kB gzip**; no web fonts.
- `npm audit --audit-level=low`: 0 vulnerabilities.
- Every exact command in `.factory/claims.json` was run separately from a clean install; all 12 passed. Each claim tag occurs exactly once in the browser suite.
- Committed Playwright coverage exercised blank desktop, `/demo`, 390px mobile, keyboard skip link, `Alt+1`, 44px target sizing, and Axe on blank and populated pages. Axe reported **0 serious or critical** violations.
- The exact malformed fixture at 390px (`frets: x 3 bad 0 1 0`, `capo: 99`) yielded named validation, no download, no `NaN` preview markup, and **zero console/page errors**.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 /tmp/lesson-tab-card-repair-verify` passed: 200, 604ms local load, no console errors, title/lang, one h1, main landmark, image alt text, and button names all present.
- The offline-reload claim activates the service worker after first `/demo` visit, switches offline, reloads, and restores the bundled sample. Privacy claim tests intercept requests and keep lesson text out of request URLs/referrers.
- Static-web-only scope: no package/consumer installation or backend persistence/concurrency suite applies. There is no lint script in this intentionally small Vite project; `npm run build` includes `tsc --noEmit`.

## Deployment evidence

`dist/` from repair commit `54225f637d251bce032f231671e27da13dd5b49d` was deployed to production with Azure Static Web Apps CLI, target `sf-lesson-tab-card`, environment `production`.

- Production `/demo` serves `main-hQBpn0LD.js`; its SHA-256 exactly matches the local verified build: `581d561d1bd608b126b9d5a517c4372bbd5412b0e4e5b94e8fed49ab5196a90a`.
- Live `/opt/fleet/lib/verify-url.sh` passed at `https://lesson-tab-card.sociobot.in`: HTTP 200, 786ms load, no console errors, correct title/lang/one h1/main, and no missing image alt or unnamed button.
- Live 390px check: the verifier fixture showed its named invalid-fret error, **no `NaN` markup**, and **zero console/page errors**. The skip link focused main; `Alt+1` focused the editor.
- Live fresh-context offline reload passed after service-worker activation. Live Axe had **0 serious/critical** violations on both `/` and `/demo` at 390px.
- Live `/demo` response is 200. It has HSTS, `nosniff`, strict-origin referrer policy, the restrictive same-origin CSP plus documented billing origin, and camera/microphone/geolocation permissions restrictions. Hashed assets use one-year immutable caching.
- Live `/definitely-not-a-real-route` returns HTTP 404 with the styled not-found page.

## Known gaps

None locally. The pre-existing `graphify-out/` working-tree changes are unrelated and deliberately not included in the repair commit.

---

## Historical verifier handoff

# Lesson Tab Card verification handoff

## Independent verification status (2026-08-28)

**FAIL — do not release candidate `45fd91d6bd94ed21430f99f2308f766a837fef98` yet.**

Fresh verification against https://lesson-tab-card.sociobot.in confirms the prior deployment-only blockers are fixed and the live deployment byte-matches the candidate build. All nine declared claim tests, `npm test` (4 unit + 13 browser tests), `npm run build`, audit, live accessibility, PWA offline reload, checkout, and rate limiting pass.

Two release-blocking defects remain: entering a malformed non-numeric fret such as `frets: x 3 bad 0 1 0` correctly shows validation and blocks export, but renders SVG attributes with `NaN` and produces repeated browser console errors; and multiple visitor-facing storage/free-use/no-tracking promises are not backed by matching entries and observable tests in `.factory/claims.json`. The error-recovery and claims-contract paths must be clean before release. See `.factory/verification-2.md` for exact reproduction, live evidence, full quality-gate results, and required regression/claim coverage.

## How to re-verify

```sh
npm ci
npm test
npm run build
npm audit --audit-level=low
```

Then test live `/demo` with the malformed fret fixture above, capture console errors, and rerun every command listed in `.factory/claims.json`.

---

# Previous repair handoff

## Status

**Repaired and deployed** on 2026-08-28.

- Repair commits: `69f36f829c2e6860ca579d42a83fd323233b04bc` and `0ff598d`
- Production URL: https://lesson-tab-card.sociobot.in
- Artifact and deployment class: Vite + TypeScript static web app on Azure Static Web Apps (`dist/`)
- Base independently verified candidate: `548cbe0cb779115d576fe5fc0bc26d1153a55bd0`
- Verifier report addressed: `.factory/verification.md` from verifier commit `7cc7730772b018ad06837cca442d12b574863c10`

## Repairs made

1. Registered and enabled the production $9 one-time **Lesson Tab Card Worksheet Pack** with the Sociobot/Dodo billing registry. The public checkout endpoint now returns HTTP 303 to a Dodo hosted checkout session. The app still uses only the Sociobot billing API.
2. Replaced silent parser slicing with named validation errors for printable title, chord, and note lengths. The editor keeps the exact entered text, shows a printable-length recovery state, and blocks both exports until it fits.
3. New share links use `/#c=<encoded lesson>` rather than `/?c=...`, keeping lesson syntax out of navigation request URLs and referrers. Older query links still restore their lesson for compatibility, immediately remove the query from the address bar, and warn the visitor to copy a new private link.
4. Raised the blank-preview muted text color to `#575349` (at least 4.5:1 on its paper background). Axe coverage now scans both blank `/` and populated `/demo`.
5. Made all links and controls 44px minimum touch targets, including mobile header, footer, inline legal links, and demo controls. The skip target is focusable and the skip link moves keyboard focus to it.
6. Built real static documents for `/demo`, `/privacy`, and `/terms` and excluded unknown paths from SPA fallback. Valid routes return 200; unknown routes return the styled `404.html` with HTTP 404.
7. Added claims and regression coverage for private fragment sharing, legacy-share cleanup, printable lengths, checkout redirect, and returned-license activation. Bumped the service-worker cache to `v3`.

## How to run and verify

```sh
npm ci
npm test
npm run build
npm audit --audit-level=low
```

`npm test` passed: **4 Vitest unit tests and 13 Playwright browser tests**. Every exact command in `.factory/claims.json` was also invoked separately after the clean install; all nine claims passed.

The deployed browser was checked at desktop and 390px mobile:

- `/opt/fleet/lib/verify-url.sh https://lesson-tab-card.sociobot.in /tmp/lesson-tab-card-live-verify`: 200, no console errors, correct title/lang/h1/main/alts/button names.
- Playwright Axe scan on live `/` and `/demo`: **0 serious/critical violations**.
- Live mobile check: 0 visible interactive targets smaller than 44px; skip link focused `#main`; no console errors.
- Live offline check: after first `/demo` load the activated service worker reloaded the bundled G-to-C sample while offline.
- Live response check: `/demo`, `/privacy`, and `/terms` return 200; `/definitely-not-a-real-route` returns **404** with the designed not-found page.
- Live response policy: HSTS, `nosniff`, strict-origin referrer policy, restrictive CSP, and camera/microphone/geolocation permissions policy were present.
- Live checkout check: `GET https://api.sociobot.in/api/v1/products/lesson-tab-card/checkout` returned **303** to `https://checkout.dodopayments.com/session/...`.

Performance and build evidence:

- `npm run build` passed and produced `dist/index.html`.
- Initial JS: 26.07 KB raw / 9.81 KB gzip. CSS: 11.18 KB raw / 3.24 KB gzip. No web fonts.
- Lighthouse 13.4.1 local production build: Performance **99**, Accessibility **100**, Best Practices **100**, SEO **100**.
- `npm audit --audit-level=low`: 0 vulnerabilities.

The standalone `@axe-core/cli` was attempted with the installed Playwright Chromium, but its Selenium driver exited before session creation in this container. The product’s committed `@axe-core/playwright` scan (the same axe engine) passed locally and again against the deployed site.

## Known limits

- No card purchase was completed during repair, so no real payment was charged. The public checkout redirect is live; the returned-token capture, verification response, and worksheet activation are covered by a browser test using the documented billing response shape.
- The pre-existing `graphify-out/` working-tree changes were preserved and were not included in either repair commit.

## Next step

Re-run independent verification against the deployed URL. No source or deployment work remains for the reported blockers.
