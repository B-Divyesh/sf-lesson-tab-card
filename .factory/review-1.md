# Adversarial first-read review 1 — Lesson Tab Card

**Verdict: FAIL.** Two blocking demo failures remain. The exact declared claim commands and full local suite pass, but the declared demo-isolation test does not cover the route that persists a returned licence in demo mode.

Reviewed 2026-08-29 against <https://lesson-tab-card.sociobot.in>, from a fresh Chromium context at 390 × 844 and 1440 × 1000. Product source was inspected but not modified.

## Cold first read

Before scrolling, the landing screen answers the three questions:

- It makes a clear guitar lesson card.
- It is for teachers and players who need a readable handout while teaching.
- Click **Try it with sample data**; it says it loads a G-to-C warm-up.

This part passes on both viewports. The landing has no console or page errors, no horizontal overflow at 390 px, and only same-origin initial requests.

## Findings

### BLOCKING — F-1-1: The one-click demo does not show the product in use on its first screen

- **Location / exact evidence:** `/demo` at 390 × 844. The first screen shows “Edit the sample lesson card”, “Change the G to C exercise”, facts, and a decorative “6 strings → 1 clear card” stamp. The populated preview (`#preview`) starts at **1192 px**, below the 844 px viewport. At 1440 × 1000 it starts at **1002 px**, also below the first screen.
- **Why this fails:** The required first screen after **Try it with sample data** must already show realistic sample data being used. A first-time phone visitor sees more marketing and must scroll before they can verify the sample chord grid, tab, or editor.
- **Concrete fix:** On `/demo`, remove or substantially compress the hero and place the populated editor/preview directly below the persistent demo banner, with at least the G-to-C card visible at 390 × 844. Add a Playwright test that asserts a meaningful part of the populated preview is within the initial viewport.

### BLOCKING — F-1-2: A demo URL can write to production local storage

- **Location / exact quote:** The live persistent banner says **“Demo — sample data, nothing is saved”**. `.factory/demo.md` says **“It does not use local storage”** and **“demo mode never reads or writes that key.”**
- **Reproduction:** In a fresh live browser context, open `https://lesson-tab-card.sociobot.in/demo?license=review-demo-token`. The app removes the query, keeps the demo banner visible, and leaves `localStorage['sb_license:lesson-tab-card'] === 'review-demo-token'`. Source confirms why: `boot()` calls `captureReturnedLicense()` before `route()` derives `isDemo`; `captureReturnedLicense()` writes the production `sb_license:lesson-tab-card` key.
- **Why this fails:** Demo mode has an unconditional isolation promise. A visitor can enter a demo URL and cause a durable real-storage write while the page says nothing is saved. The existing `@claim:demo-isolation` test checks only the lesson-draft key after ordinary editing, so it does not prove the stated isolation boundary.
- **Concrete fix:** Determine demo mode before any licence capture, cached-licence read, licence verification, or licence write. In demo mode, ignore/remove a `license` parameter without persisting it and keep all licence state in a separate demo namespace or omit licence activation entirely. Extend `@claim:demo-isolation` to seed and snapshot all product local-storage keys, open `/demo?license=...`, edit, reset, and exit; assert every real key is unchanged and no cross-origin request occurs.

### MAJOR — F-1-3: README privacy copy incorrectly says licence verification is the only optional cross-origin request

- **Location / exact quote:** `README.md`, “Privacy and offline use”: **“License verification is the only optional cross-origin request.”**
- **Evidence:** The advertised **Buy worksheet pack — $9** link navigates to `https://api.sociobot.in/api/v1/products/lesson-tab-card/checkout`, which then redirects to a Dodo hosted checkout. The declared `@claim:paid-checkout` test itself verifies this external checkout flow.
- **Why this fails:** The statement is false as written and understates the external requests made when a user buys the pack. It is also an unlisted privacy claim.
- **Concrete fix:** Replace it with: “Buying or verifying a worksheet licence contacts the Sociobot billing API. Checkout then moves to Dodo. Neither request includes lesson text.” Add a request-log claim covering both optional flows and asserting the request payload/URL contains no lesson syntax.

### MINOR — F-1-4: The live landing promises a live preview without a corresponding claim entry

- **Location / exact quote:** Landing “How to make a card”: **“The preview changes as you type.”**
- **Why this fails:** This is a visitor-relevant product behaviour. No `claims.json` entry names it, and no tagged test proves a syntax edit appears in the rendered preview.
- **Concrete fix:** Add a `preview-updates` claim and a demo test that changes a title/chord and asserts the SVG preview changes to show the new values. Alternatively remove the promise.

### MINOR — F-1-5: README describes core rendered features without a claim test

- **Location / exact quote:** `README.md`: **“The editor draws a six-string chord grid, fingering, capo, short tab, and teacher note.”**
- **Why this fails:** This is a concrete capability readers may rely on, but no `claims.json` entry/test verifies all of it from sample data.
- **Concrete fix:** Add a `lesson-card-fields` claim that opens `/demo` and checks the rendered card has six strings plus the sample fingering, capo, tab, and note. Keep the sentence only if that observable test passes.

### MINOR — F-1-6: Checkout/refund attribution is an unlisted claim

- **Location / exact quote:** Landing paid section: **“Sociobot and Dodo handle checkout and refunds.”**
- **Why this fails:** Checkout is partly covered by `paid-checkout`; refund handling is not. The combined sentence makes a claim beyond the test contract.
- **Concrete fix:** Change it to “Checkout opens through Sociobot and Dodo.”, which the existing checkout test can prove, or add a documented, testable refund-policy source and claim.

### MINOR — F-1-7: Several headings are jargon or mood labels rather than section names

- **Location / exact quotes:** **“LESSON-SPEED NOTATION / 01”**, **“THE SHORT ROUTE”**, and **“KEEPS OUT OF THE WAY”**.
- **Why this fails:** These labels do not tell a cold visitor or screen-reader heading list what the section contains. “Lesson-speed notation” is also unexplained jargon.
- **Concrete fix:** Delete the first label; use **“How it works”** for “THE SHORT ROUTE”; use **“Limits and privacy”** for “KEEPS OUT OF THE WAY”.

### MINOR — F-1-8: The product alternates between “card” and “handout” for the same output

- **Location / exact quotes:** Hero: **“Make a clear guitar lesson card”**; hero audience: **“need a readable handout”**; limits heading: **“A handout, not a score editor”**; footer: **“Make a clear guitar handout.”**
- **Why this fails:** The product’s own terminology table says the exported teaching item is a “card”. Calling the same output a “handout” makes the scope less precise during a first read.
- **Concrete fix:** Keep “handout” only to describe the teacher’s need. Change the limits heading to **“A lesson card, not a score editor”** and the footer to **“Make a clear guitar lesson card.”**

### MINOR — F-1-9: Demo exit button does not name its result

- **Location / exact quote:** Demo banner button: **“Start for real”**.
- **Why this fails:** It is a vague slogan, not a result-naming verb. It also hides whether an existing saved draft will be opened or a blank card will be created.
- **Concrete fix:** Rename it **“Open my saved card”** (and explain the blank-draft fallback), or **“Start a blank card”** if it must always clear/open a blank draft.

### MINOR — F-1-10: Decorative copy makes unverifiable provenance claims

- **Location / exact quotes:** Figure caption: **“Original image made for this product.”** Footer: **“Original generated imagery.”**
- **Why this fails:** Both are claim-like statements with no `claims.json` entry. They do not help someone make or evaluate a lesson card.
- **Concrete fix:** Delete both from visitor copy. Keep provenance in `.factory/design.md`, where the prompt and source asset record already exist.

### MINOR — F-1-11: README has unlisted input-range and legacy-link promises

- **Location / exact quotes:** Landing: **“Fret values run from 0 to 12.”** README: **“Fret values use x, 0, or a number from 1 to 12.”**, **“Finger values use x or a number from 0 to 4.”**, and **“Older ?c= links should be opened only to copy a new link.”**
- **Why this fails:** The tagged validation claim checks one malformed fret and an invalid capo; it does not prove the advertised accepted bounds or finger range. The old-link test is a regression test, not a `claims.json` claim despite the README privacy instruction.
- **Concrete fix:** Add tagged claims that exercise each lower/upper accepted value and reject neighbouring values, plus a legacy-link privacy/migration claim. Alternatively remove the detailed range and legacy-link promises from README.

### MINOR — F-1-12: README makes unlisted licence-privacy and implementation claims

- **Location / exact quotes:** **“It sends the license token to the Sociobot billing API.”**, **“It does not send lesson text.”**, **“Checkout and license verification use the Sociobot billing API.”**, and **“The product slug is used at runtime, so no provider product ID is embedded.”**
- **Why this fails:** These are concrete claims beyond the declared checkout redirect test. The first two matter to a purchaser's privacy; the last is an internal detail with no visitor value.
- **Concrete fix:** Add one request-inspection claim for the buy/verify flows, asserting their data does not include lesson text, and remove the product-ID sentence.

### MINOR — F-1-13: Two sentences are generic rather than useful product copy

- **Location / exact quotes:** **“A card-sized space keeps the lesson focused.”** and **“The free editor remains complete.”**
- **Why this fails:** Neither says what a visitor can do or what the free tier includes; “complete” is an unsupported marketing adjective.
- **Concrete fix:** Delete the first. Replace the second with **“The free editor exports one lesson card as SVG or PNG.”**

## Claim contract and sandbox checks

A fresh clone was made in `/tmp/lesson-tab-card-review-tQ4xyC`, followed by `npm ci`. Each exact command listed in `.factory/claims.json` was run; all 12 passed. `npm test` then passed 5 unit tests and 16 Playwright tests, and `npm run build` passed and emitted `dist/`.

| Claim ID | Result | Review note |
| --- | --- | --- |
| `offline-reload` | PASS | Demo reloads offline after first visit. |
| `browser-private` | PASS | Demo lesson text and fragment share text were absent from observed request URLs/referrers. |
| `demo-isolation` | PASS, insufficient | It covers only the real lesson-draft key; F-1-2 shows licence storage is missed. |
| `free-exports` | PASS | SVG text and PNG signature/size verified. |
| `local-draft-storage` | PASS | Real draft persists locally over reload. |
| `license-free-card-exports` | PASS | Both single-card downloads work without a licence. |
| `no-account-no-tracking` | PASS | Demo flow made same-origin requests only. |
| `share-link` | PASS | Fragment link restores exact syntax. |
| `syntax-validation` | PASS | Named errors block SVG export. |
| `worksheet-pack` | PASS | Demo worksheet contains four card transforms. |
| `paid-license-flow` | PASS | Intercepted valid response activates the pack. |
| `paid-checkout` | PASS | Live billing endpoint responds 303 to Dodo checkout. |

The live ordinary demo was also request-logged while editing and resetting: only the document and same-origin assets loaded; no console/page error occurred. The special demo licence URL in F-1-2 is the untested sandbox escape.

## Copy audit

Word counts use whitespace-delimited, hyphenated terms as one word. The inventory includes every prose sentence on the landing and in `README.md`; headings and controls are audited immediately after it. No prose sentence exceeds 22 words.

### Landing prose

| Sentence | Words | Flag |
| --- | ---: | --- |
| Make a clear guitar lesson card | 6 | — |
| For teachers and players who need a readable handout before the lesson moves on. | 14 | F-1-8 terminology |
| Loads a G to C warm-up below. | 7 | — |
| Works offline after the first visit | 6 | declared |
| Your card stays in this browser | 6 | declared |
| SVG and PNG exports stay free | 6 | declared |
| Your card will appear here. | 5 | — |
| Type a title, chord, and six fret values to make it. | 11 | — |
| No lesson yet. | 3 | — |
| Start with a title: line. | 5 | — |
| Count four quiet beats. | 4 | — |
| Use x for a muted string and 0 for an open string. | 12 | — |
| Fret values run from 0 to 12. | 7 | F-1-11 unlisted range claim |
| Ctrl + Enter exports SVG. | 4 | — |
| Alt + 1 returns to the editor. | 6 | — |
| Fill the seven short lines. | 5 | — |
| The preview changes as you type. | 6 | F-1-4 unlisted claim |
| Fix any named line before you hand the card over. | 10 | declared validation behaviour |
| Export an image or copy a link for the student. | 10 | declared export/share behaviour |
| A card-sized space keeps the lesson focused. | 7 | F-1-13 generic copy |
| Original image made for this product. | 6 | F-1-10 unlisted provenance claim |
| There is no song library, playback, account, or tracking. | 9 | declared |
| Lesson Tab Card stores one draft in your browser. | 9 | declared |
| New share links keep lesson text after the # sign. | 9 | declared |
| The free editor and single-card exports do not change. | 9 | Rewrite: “Single-card SVG and PNG exports stay free.” |
| The worksheet pack adds a four-card SVG page for lesson folders. | 11 | declared |
| One-time purchase. | 2 | — |
| Sociobot and Dodo handle checkout and refunds. | 7 | F-1-6 unlisted refund claim |
| See terms. | 2 | — |
| Make a clear guitar handout. | 5 | F-1-8 terminology |
| Original generated imagery. | 3 | F-1-10 unlisted provenance claim |

### README prose

| Sentence | Words | Flag |
| --- | ---: | --- |
| Make a clear guitar lesson card from a short text format. | 11 | — |
| It is for guitar teachers and players who need a handout during a lesson. | 14 | F-1-8 terminology |
| The editor draws a six-string chord grid, fingering, capo, short tab, and teacher note. | 14 | F-1-5 unlisted claim |
| It checks the syntax before export. | 6 | declared validation behaviour |
| SVG and PNG exports stay free. | 6 | declared |
| A copied link restores the same lesson text. | 8 | declared |
| Try the isolated sample at lesson-tab-card.sociobot.in/demo. | 9 | — |
| Demo changes are not saved to the real draft. | 9 | declared, but F-1-2 shows incomplete isolation |
| Fret values use x, 0, or a number from 1 to 12. | 12 | F-1-11 unlisted range claim |
| Finger values use x or a number from 0 to 4. | 11 | F-1-11 unlisted range claim |
| The real editor stores one draft in browser local storage. | 10 | declared |
| During ordinary editing, lesson text and exports do not leave the browser in HTTP requests. | 15 | declared |
| New share links keep lesson text after the # sign, so browsers do not send it to the site or as a referrer. | 22 | declared; split for scanability |
| Older ?c= links should be opened only to copy a new link. | 12 | F-1-11 unlisted migration/privacy claim |
| The app works offline after the first visit. | 8 | declared |
| License verification is the only optional cross-origin request. | 8 | F-1-3 false/unlisted privacy claim |
| It sends the license token to the Sociobot billing API. | 10 | F-1-12 unlisted privacy claim |
| It does not send lesson text. | 6 | F-1-12 unlisted privacy claim |
| The free editor remains complete. | 5 | F-1-13 generic copy |
| A $9 one-time license adds a four-card worksheet SVG. | 9 | declared |
| Checkout and license verification use the Sociobot billing API. | 9 | F-1-12 unlisted privacy claim |
| The product slug is used at runtime, so no provider product ID is embedded. | 14 | F-1-12 internal/unlisted claim |
| Requires Node.js 20 or newer. | 6 | — |
| npm test runs unit parsing tests and Playwright claim checks. | 10 | — |
| The exact production command is npm run build. | 8 | — |
| It writes the deployable site to dist/, with dist/index.html at its root. | 14 | — |
| Deploy dist/ as an Azure Static Web App. | 8 | — |
| public/staticwebapp.config.json provides SPA fallback, security headers, asset caching, and the styled 404 response. | 16 | Internal detail; keep only if deployment audience needs it |
| The repository does not manage DNS, billing registration, or deployment infrastructure. | 11 | — |
| MIT licensed. | 2 | — |
| Built by Param Factory. | 4 | — |

`README.md`’s syntax code block also contains the instructional sentence “Count four quiet beats.” (4 words); it is concise and useful.

### Headings and actions

| Text | Check | Result |
| --- | --- | --- |
| LESSON-SPEED NOTATION / 01 | Heading/kicker | F-1-7; delete |
| Type the lesson | Heading | Clear |
| Check the card | Heading | Clear |
| THE SHORT ROUTE | Heading | F-1-7; use “How it works” |
| How to make a card | Heading | Clear |
| KEEPS OUT OF THE WAY | Heading | F-1-7; use “Limits and privacy” |
| A handout, not a score editor | Heading | F-1-8; use “A lesson card, not a score editor” |
| Print four cards on one sheet | Heading | Clear |
| Try it with sample data | Action | Result-naming and clear |
| Export SVG / Export PNG / Copy share link / Clear card / Reset demo | Actions | Result-naming and clear |
| Start for real | Action | F-1-9; rename |
| Buy worksheet pack — $9 / Verify license / Export 4-card worksheet / Return to the editor | Actions | Result-naming and clear |

## Structure, routing, accessibility, and visual identity

These checks pass apart from the findings above:

- `/`, `/demo`, `/privacy`, `/terms`, robots, sitemap, manifest, favicon, apple icon, and the external Param Factory link returned 200. An unknown route returned a styled 404 with HTTP 404.
- Route titles follow the required pattern; each tested route has one `h1`, one `main`, a description, canonical URL, OG/Twitter metadata, and the page has `lang="en"`.
- SPA navigation moved focus to the new `h1`; browser Back restored `/demo` and focused its `h1`. No console error resulted. Header/footer, skip link, Privacy, and Terms were present.
- Live Axe on `/demo` at 390 px reported no serious or critical violations. The supplied suite also checks keyboard skip-link behaviour and 44 px touch controls.
- The marked-sheet, hard-border, warm-paper visual system is visibly product-specific rather than a generic SaaS template. The original image provenance is documented in `.factory/design.md`; that record does not make the visitor-copy claims in F-1-10 necessary.
- The brief does not imply an AI step, import/export beyond the implemented SVG/PNG/share export, or sync. No missing AI feature was identified.

## History check

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. I read the existing `.factory/handoff.md` and three `.factory/verification*.md` records. They assert a previous PASS but contain no numbered findings to re-verify. F-1-1 and F-1-2 were reproduced on the current live deployment and in the current source, so the previous PASS does not establish that the demo contract is fixed.

## What would make this perfect

Put the real G-to-C card in the initial demo viewport, make demo mode a strict storage and network sandbox for every product key and URL variant, repair the README checkout privacy statement, and close the small copy/claim gaps above. Then rerun every claim command from a fresh clone and repeat the cold mobile review.
