# Polish round 1 handoff — Lesson Tab Card

## Result

**PASS.** Every finding in `.factory/review-1.md` is fixed, tested, pushed, deployed, and rechecked cold on the live site. No known product gaps remain.

- Work order: `lesson-tab-card-polish-1`
- Repair implementation: `f8e5665ce36e538e75893cb18b6ceb6a3be1a62b`
- Deployment: `ccec5f81-0bac-46a3-8661-152904483e87`
- Live site: <https://lesson-tab-card.sociobot.in>
- Direct demo: <https://lesson-tab-card.sociobot.in/?demo=1>

## What changed

- Moved the populated sample preview into the first demo viewport on phone and desktop while retaining the marked-up lesson-sheet visual system.
- Made `/demo` and `/?demo=1` true storage sandboxes. Returned license parameters are discarded before any real key is read or written, and billing controls are unavailable in demo mode.
- Rewrote headings, terminology, paid copy, image captions, footer text, demo exit text, and README statements to close every copy finding.
- Expanded the claim contract to 21 one-to-one tagged tests, including live preview updates, all rendered card fields, numeric boundaries, legacy links, data removal, keyboard shortcuts, license restore, and billing-request privacy.
- Added route-specific Open Graph and Twitter metadata, route focus announcements, consistent legal links, a clearer accessible 404 document, and a deployment-config regression test.
- Fixed the sample card’s zero capo rendering, bumped the service-worker cache, and retained all earlier regressions for overflow, contrast, private fragment links, mobile targets, malformed SVG, checkout, and true HTTP 404 behavior.
- Added the verb-first catalog description: “Make a clear guitar lesson card during the lesson.”

The finding-by-finding record is [`.factory/polish-1.md`](polish-1.md).

## Clean-clone verification

Clean clone: `/tmp/lesson-tab-card-polish-clean-v6K0Mo` at implementation commit `f8e5665ce36e538e75893cb18b6ceb6a3be1a62b`.

1. `npm ci` — passed; 60 packages installed; 0 vulnerabilities.
2. Every exact command in `.factory/claims.json` — 21 of 21 passed independently.
3. `CI=1 npm test` — 6 Vitest tests and 24 Playwright tests passed.
4. `npm run build` — passed and produced `dist/` with root `index.html`.
5. `npm audit --audit-level=low` — passed with 0 vulnerabilities.
6. Production bundle — JS 26.92 KB raw / 9.80 KB gzip; CSS 11.93 KB raw / 3.39 KB gzip; no web fonts; 84 KiB live transfer.

The browser suite covers SVG/PNG and worksheet downloads, private share restore, local draft save/remove, isolated demo storage, returned and pasted licenses, checkout, invalid and boundary syntax, offline reload, keyboard operation, route focus/history, metadata, 404 structure, mobile overflow/targets, console errors, and Axe scans.

## Live verification

- `/opt/fleet/lib/verify-url.sh` — HTTP 200, 899 ms network-idle, correct title/lang/h1/main/alt/button names, no console or page errors.
- Routes — `/`, `/demo`, `/?demo=1`, `/privacy`, `/terms` returned 200; an unknown route returned the designed page with HTTP 404.
- Demo isolation — `/demo?license=must-not-save` and `/?demo=1&license=discard-me` stripped the token without a write or billing request. Seeded real draft/license/verdict values remained byte-identical after edit, reset, and exit.
- Demo first screen — sample title at y=624.35 px on 390×844 and y=579.38 px on 1440×1000. No horizontal overflow.
- Accessibility — Axe 4.10.2 found 0 serious/critical issues on home, demo, privacy, terms, and 404. Every visible mobile control measured at least 44×44 px.
- Privacy/offline — no unexpected cross-origin requests; offline reload restored the populated demo and privacy route.
- Link crawl — all internal pages and Sociobot returned 200; checkout returned 303 to Dodo; mail links used valid `mailto:` URLs.
- Lighthouse 13.0.1 mobile `/demo` — Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.2 s, TBT 40 ms, CLS 0.
- Deployment identity — live `main-BOFePCyv.js` matches local SHA-256 `29f7925c9805ff00f9c098e9b64514a8a0155ab95f8149ba495e49342a903408`.

Evidence and live screenshots are in [`.factory/live-evidence`](live-evidence/summary.md) and [`.factory/polish-artifacts`](polish-artifacts/demo-mobile.png).

## Run locally

```sh
npm ci
npm test
npm run build
```

Deploy `dist/` with:

```sh
/opt/fleet/lib/deploy-static.sh lesson-tab-card dist
```

## Known gaps and next steps

None for this work order. No source, claim, accessibility, privacy, offline, routing, mobile, or deployment finding remains open.
