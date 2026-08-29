# Adversarial first-read review 3 — Lesson Tab Card

**Verdict: PASS.** No blocking or minor finding remained after a cold live review, a clean-checkout claim run, and source confirmation. Reviewed 2026-08-29 UTC against `https://lesson-tab-card.sociobot.in` at 390 × 844 and 1440 × 1000. Product code was not modified.

## Cold first read

Before scrolling, both fresh contexts answered the required questions.

- **What it does:** “Make a clear guitar lesson card.”
- **For whom:** “For teachers and players who need a readable card before the lesson moves on.”
- **What to click first:** “Try it with sample data.” Its adjacent explanation says, “Loads a G to C warm-up below.”

At 390 px the primary action was visible at y=527–575. At desktop it was visible at y=606–655. There were no load-time JavaScript/page errors, horizontal overflow, or third-party requests on the landing page. This gate passes.

## Copy audit

Word counts use whitespace-delimited words; hyphenated words, URLs, and keyboard labels count as one word. The landing inventory includes its empty, validation, licensed, and demo states because those are reachable from the landing UI. Every sentence is at or below 22 words. No sentence used a banned marketing adjective, an unexplained metaphor, or an inconsistent term. Every product-facing claim below has a matching entry in `.factory/claims.json`.

### Landing, editor, paid state, and demo

| Sentence | Words | Check |
| --- | ---: | --- |
| Make a clear guitar lesson card. | 6 | Clear job statement |
| For teachers and players who need a readable card before the lesson moves on. | 14 | Clear audience and situation |
| Loads a G to C warm-up below. | 7 | `demo-first-screen` |
| Works offline after the first visit. | 6 | `offline-reload` |
| Your card stays in this browser. | 6 | `local-draft-storage` |
| SVG and PNG exports stay free. | 6 | `license-free-card-exports` |
| Your card will appear here. | 5 | Useful empty state |
| Type a title, chord, and six fret values to make it. | 11 | Useful empty-state action |
| No lesson yet. | 3 | Useful empty state |
| Start with a title line. | 5 | Useful empty-state action |
| Shorten the lesson before previewing. | 5 | `source-length-boundary` |
| The export stays blocked until the lesson fits. | 8 | `source-length-boundary` |
| The card is over 4,000 characters. | 7 | `source-length-boundary` |
| Shorten it and try again. | 6 | Useful error recovery |
| Ready to export and share. | 5 | Useful valid state |
| Shorten the named line before previewing. | 6 | Useful error recovery |
| The export stays blocked until every line fits the card. | 10 | `syntax-validation` |
| Use x for a muted string and 0 for an open string. | 12 | `syntax-boundaries` |
| Fret values run from 0 to 12. | 7 | `syntax-boundaries` |
| Ctrl plus Enter exports SVG. | 5 | `keyboard-shortcuts` |
| Alt plus 1 returns to the editor. | 7 | `keyboard-shortcuts` |
| Fill the short lesson fields. | 5 | Useful instruction |
| The preview changes as you type. | 6 | `preview-updates` |
| Fix any named line before you hand the card over. | 10 | `syntax-validation` |
| Export an image or copy a link for the student. | 10 | `free-exports`, `share-link` |
| There is no song library, playback, account, or tracking. | 9 | `no-account-no-tracking` |
| Lesson Tab Card stores one draft in your browser. | 9 | `local-draft-storage` |
| New share links keep lesson text after the # sign. | 10 | `browser-private` |
| The free editor exports one lesson card as SVG or PNG. | 11 | `license-free-card-exports` |
| The worksheet pack adds a four-card SVG page for lesson folders. | 11 | `worksheet-pack` |
| Sample worksheet preview is open in this demo. | 8 | Accurate demo state |
| Leave the demo before buying or verifying a license. | 9 | Accurate demo boundary |
| Worksheet pack active on this browser. | 6 | `paid-license-flow`, `license-restore` |
| The saved license is no longer active. | 7 | `rejected-returned-license` |
| You can check the token or buy the pack again. | 10 | Useful recovery |
| License check finished. | 3 | Useful status |
| The saved license is not active. | 7 | `rejected-returned-license` |
| One-time purchase for $9. | 4 | `paid-checkout` |
| After one successful check, the pack stays active offline until billing confirms the license is inactive. | 15 | `paid-license-offline-recovery` |
| Sociobot uses Dodo as the merchant of record. | 8 | `merchant-refund-policy` |
| Dodo handles refunds. | 3 | `merchant-refund-policy` |
| A refund revokes the license automatically. | 7 | `merchant-refund-policy` |
| See terms. | 2 | Clear legal link |
| Edit the sample lesson card. | 5 | Clear demo job |
| Change the G to C exercise below. | 7 | Clear demo action |
| This sandbox never reads or changes your saved card. | 9 | `demo-isolation` |
| Demo — sample data, nothing is saved. | 7 | `demo-isolation` |
| Open your saved card next, or a blank card if none exists. | 11 | Clear demo-exit result |
| Make a clear guitar lesson card. | 6 | Clear footer one-liner |

### README

| Sentence | Words | Check |
| --- | ---: | --- |
| Make a clear guitar lesson card from a short text format. | 11 | Clear job statement |
| It is for guitar teachers and players who need a card during a lesson. | 14 | Clear audience |
| The editor draws a six-string chord grid, fingering, capo, short tab, and teacher note. | 14 | `lesson-card-fields` |
| It checks the syntax before export. | 6 | `syntax-validation` |
| SVG and PNG exports stay free. | 6 | `license-free-card-exports` |
| A copied link restores the same lesson text. | 8 | `share-link` |
| Try the isolated sample at lesson-tab-card.sociobot.in/?demo=1. | 6 | `demo-first-screen` |
| Demo changes and returned license tokens do not touch real product storage. | 11 | `demo-isolation` |
| Fret values use x, 0, or a number from 1 to 12. | 12 | `syntax-boundaries` |
| Finger values use x or a number from 0 to 4. | 11 | `syntax-boundaries` |
| The real editor stores one draft in browser local storage. | 9 | `local-draft-storage` |
| During ordinary editing, lesson text and exports do not leave the browser in HTTP requests. | 14 | `browser-private` |
| New share links keep lesson text after the # sign, so browsers do not send it to the site or as a referrer. | 22 | `browser-private` |
| Older ?c= links should be opened only to copy a new link. | 11 | `legacy-link-migration` |
| The app works offline after the first visit. | 8 | `offline-reload` |
| Buying or verifying a worksheet license contacts the Sociobot billing API. | 10 | `billing-request-privacy` |
| Checkout then moves to Dodo. | 5 | `paid-checkout` |
| Neither request includes lesson text. | 5 | `billing-request-privacy` |
| Sociobot uses Dodo as the merchant of record. | 8 | `merchant-refund-policy` |
| Dodo handles refunds. | 3 | `merchant-refund-policy` |
| A refund revokes the license automatically. | 7 | `merchant-refund-policy` |
| The free editor exports one lesson card as SVG or PNG. | 11 | `license-free-card-exports` |
| A $9 one-time license adds a four-card worksheet SVG. | 9 | `worksheet-pack`, `paid-checkout` |
| A returned or pasted valid license activates the worksheet pack in this browser. | 12 | `paid-license-flow`, `license-restore` |
| A previously verified license stays active offline while its next check waits for a connection. | 14 | `paid-license-offline-recovery` |
| Requires Node.js 20 or newer. | 5 | Development prerequisite |
| npm test runs unit parsing tests and Playwright claim checks. | 9 | Development instruction |
| The exact production command is npm run build. | 8 | Build instruction |
| It writes the deployable site to dist, with dist/index.html at its root. | 12 | Build instruction |
| Deploy dist as an Azure Static Web App. | 8 | Deployment instruction |
| The static web app configuration provides routing, security headers, asset caching, and the styled 404 response. | 15 | Deployment instruction |
| The repository does not manage DNS, billing registration, or deployment infrastructure. | 11 | Scope boundary |
| MIT licensed. | 2 | License notice |
| Built by Param Factory. | 4 | Attribution |

Literal headings describe their sections: “Type the lesson,” “Check the card,” “Make a card in three steps,” “Limits and privacy,” “A lesson card, not a score editor,” and “Print four cards on one sheet.” Result-naming controls include “Try it with sample data,” “Export SVG,” “Export PNG,” “Copy share link,” “Clear card,” “Reset demo,” “Open my saved card,” and “Export sample 4-card worksheet.” “Show the lesson format” and “Have a license? Paste it” are native disclosures rather than buttons; each names the content it reveals.

## Demo and privacy sandbox

**Pass.** The landing action opened `/demo` in one click. The complete G-to-C card was already visible in the first viewport: preview y=564–814 at 390 × 844 and y=507–944 at 1440 × 1000. The persistent banner contained the exact isolation statement, **Reset demo**, and **Open my saved card**.

From a fresh context, `/?demo=1&license=review3-token` removed the license parameter, showed the sample, retained empty `localStorage`, and kept empty storage after an edit and Reset demo. The request log contained only the document and same-origin JS, CSS, and image assets. Source confirmation shows demo detection occurs before returned-license capture and only writes the real draft outside demo mode. The demo omits the license-restore form, so its demo-only worksheet preview cannot write license state. No real data was read or written.

## Claims and local verification

I cloned `main` fresh at `e9f6d3579c8582b3e460b6eaaadb058814dcf9e4` into `/tmp/lesson-tab-card-review3-lnF3Pq`, ran `npm ci`, then ran every exact command in `.factory/claims.json`. All 25 passed:

`demo-first-screen`, `offline-reload`, `browser-private`, `demo-isolation`, `preview-updates`, `lesson-card-fields`, `free-exports`, `local-draft-storage`, `clear-saved-card`, `keyboard-shortcuts`, `license-free-card-exports`, `no-account-no-tracking`, `share-link`, `legacy-link-migration`, `syntax-validation`, `syntax-boundaries`, `worksheet-pack`, `paid-license-flow`, `paid-license-offline-recovery`, `rejected-returned-license`, `source-length-boundary`, `license-restore`, `billing-request-privacy`, `merchant-refund-policy`, and `paid-checkout`.

The aggregate `npm test` passed 7 unit tests and 29 Playwright tests. `npm run build` produced `dist/`; `git diff --check` passed. The live JS and CSS SHA-256 values matched the clean build exactly. The live first-load request logs had no cross-origin requests; the explicit billing test verifies that checkout/verification omit lesson text.

## Earlier findings

Every earlier numbered finding was checked on the current live site and in source, not accepted merely because a report called it fixed.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | Demo’s populated sample preview is inside the first mobile and desktop viewport. |
| F-1-2 | Demo mode is determined before license handling; `license` is stripped without storage writes. |
| F-1-3 | README names the Sociobot-to-Dodo purchase path and the billing privacy test passes. |
| F-1-4 | Preview updates have a declared rendered-SVG test. |
| F-1-5 | The six-string card fields are declared and tested from the sample. |
| F-1-6 | Paid copy no longer makes an unsupported checkout/refund attribution; merchant/refund wording now has a declared claim. |
| F-1-7 | Literal section headings replaced mood/jargon labels. |
| F-1-8 | The exported teaching item is consistently called a card. |
| F-1-9 | Demo exit says “Open my saved card” and states the blank fallback. |
| F-1-10 | Visitor-facing provenance slogans remain absent. |
| F-1-11 | Bounds and legacy-link migration are declared and tested. |
| F-1-12 | Billing privacy is declared/tested; internal provider-ID copy remains absent. |
| F-1-13 | The free-tier sentence names SVG/PNG exports concretely. |
| F-2-1 | Static and unknown-route 404 pages carry canonical, Open Graph, Twitter, favicon, and social-image metadata. |
| F-2-2 | App and static-404 footers both report `v1.2 / build 2026.08.29`. |

## Structure, accessibility, and routes

**Pass.** `/`, `/demo`, `/privacy`, `/terms`, `/404.html`, robots, sitemap, favicon, apple touch icon, and the Param Factory link returned 200. The checkout link returned a valid 303 to Dodo. An unknown route returned the designed page with HTTP 404.

Each application route had `lang="en"`, one main landmark, one h1, a route-specific title, description, canonical URL, OG/Twitter metadata, favicon, and consistent header/footer. The static 404 and an unknown route had complete metadata and the same release label. Demo → Privacy moved focus to the Privacy h1 and announced the title; Back returned to demo, focused its h1, and announced its title. The skip link focuses `#main`.

Fresh 390 px Axe scans of `/`, `/demo`, `/privacy`, `/terms`, and `/404.html` returned no violations. The live interface has 44 px or larger interactive targets, a visible focus treatment, and the marked lesson-sheet visual system is distinct from a generic SaaS template while matching `.factory/design.md`. No missing AI, import/export, or sync feature was identified: the brief’s complete local-first task is card authoring, validation, export, and private sharing; an AI feature would be decorative.

## What would make this perfect

Keep the current contract intact: rerun the claim suite after every billing, service-worker, routing, or demo change, and retain the first-viewport demo assertion and full static-404 metadata test. No additional product feature or copy change is required by this review.
