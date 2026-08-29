# Polish round 2 handoff — Lesson Tab Card

## Result

The recorded review findings are addressed. Local, clean-clone, and cold-live checks passed for the static-web release.

## Delivered work

- Kept the local-first lesson-card editor, its marked-sheet visual system, and static Vite deployment class.
- Preserved the one-click `?demo=1` / `/demo` sample flow with its banner, reset control, real-storage separation, and offline sample.
- Retained the declared 24-claim contract and its browser assertions for demo, privacy, offline, validation, exports, routes, and optional license behavior.
- Added the missing static 404 release contract: canonical, Open Graph, Twitter title/description/image/URL metadata, plus the shared `v1.2 / build 2026.08.29` footer label. Route metadata now updates the Twitter URL as well.
- Updated the catalog sentence: “Make a clear guitar lesson card during the lesson.”

## Verification

Clean clone: `/tmp/lesson-tab-card-polish-clean.myX2QM`, commit `740b1bca80f9a2f7869d079c990b07aba895824a`.

- `npm ci` — passed; 0 audit findings.
- Every command in `.factory/claims.json` — 24 of 24 passed individually.
- `CI=1 npm test` — passed: 7 Vitest tests and 29 Playwright tests.
- `npm run build` — passed and created `dist/`.
- `npm audit --audit-level=low` — passed; 0 findings.
- `git diff --check` — passed.
- The browser accessibility suite checks blank, demo, privacy, terms, and 404 pages with Axe; serious and critical counts are zero. It also checks keyboard navigation, focus movement, 390 px layout, reduced motion, offline reload, request behavior, and demo storage separation.
- Local 390 px static-404 review: `.factory/qa-evidence/polish-2-404-local.png`. It confirmed one h1, one main landmark, canonical `https://lesson-tab-card.sociobot.in/404.html`, Open Graph and Twitter metadata, and the shared footer label.
- Factory deployment `bf102dcc-9713-4d03-ab65-d24df6b80bc3` completed successfully. A cold 390 × 844 live browser check used `https://lesson-tab-card.sociobot.in` and recorded `.factory/qa-evidence/polish-2-live-demo.png` and `.factory/qa-evidence/polish-2-live-404.png`.
- The live landing returned 200; the demo preview began at y=563.59 px, showed its banner/reset/exit controls, and retained seeded real draft/license/verdict storage while removing a demo `license` parameter.
- Live `/404.html` returned its static document with canonical, Open Graph, and Twitter metadata, one h1, one main landmark, and `v1.2 / build 2026.08.29`. Live `/definitely-not-a-real-route` returned HTTP 404 with the same canonical metadata. `/privacy` and `/terms` returned 200 with one h1 and one main each.
- Cold live Axe serious/critical counts were zero on demo and 404. No page execution errors occurred; the browser reports the expected 404 document response for the intentionally missing URL.
- Production build size: JavaScript 27.80 kB raw / 10.04 kB gzip; CSS 11.93 kB raw / 3.39 kB gzip; locally hosted lesson image 69,632 bytes.

## Documents

- `.factory/polish-2.md` maps every F-1 and F-2 review finding to its change and evidence.
- `.factory/demo.md`, `.factory/claims.json`, `.factory/copy-audit.md`, `.factory/design.md`, README, privacy, and terms remain aligned with the current product behavior.

## Known gaps and next steps

No known product gap or follow-up action.
