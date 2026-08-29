# Review 1 handoff — Lesson Tab Card

## Result

**FAIL.** Product code was not modified. Full findings and evidence are in `.factory/review-1.md`.

## Work completed

- Opened the live landing cold at 390 × 844 and 1440 × 1000, plus the live demo, legal routes, and designed 404.
- Created a fresh clone at `/tmp/lesson-tab-card-review-tQ4xyC`; ran `npm ci`, every exact command declared in `.factory/claims.json`, `npm test`, and `npm run build`. All declared commands passed.
- Checked request logs, console/page errors, live metadata/routes/links, Back/focus behaviour, and Axe serious/critical violations.
- Read the brief, design record, claims, demo document, README, existing handoff, and all prior verification records. There are no previous numbered review/polish findings.

## Blocking gaps

1. `/demo` does not show the populated card in the initial viewport on phone or desktop.
2. `/demo?license=review-demo-token` writes `sb_license:lesson-tab-card` to real local storage while displaying “Demo — sample data, nothing is saved”.

## Next step

Fix both demo defects and the copy/claim items in `review-1.md`, add the missing sandbox and viewport tests, then rerun this full first-read review from a fresh clone. Do not treat the passing existing `demo-isolation` claim as sufficient; it misses the licence-storage path.
