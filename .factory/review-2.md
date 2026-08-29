# Adversarial first-read review 2 — Lesson Tab Card

**Verdict: FAIL.** The product flow, demo, claims, and copy pass this review, but the delivered 404 route is missing required sharing metadata and carries an out-of-date footer build identifier. The acceptance rule requires zero findings.

Reviewed 2026-08-29 UTC against <https://lesson-tab-card.sociobot.in> in fresh Chromium contexts at 390 × 844 and 1440 × 1000. Product code was inspected but not changed.

## Cold first read

Before scrolling, both viewports answer the three required questions:

- **What it does:** “Make a clear guitar lesson card.”
- **For whom:** “For teachers and players who need a readable card before the lesson moves on.”
- **What to click first:** “Try it with sample data.” The adjacent result says, “Loads a G to C warm-up below.”

The primary action is visible without scrolling on both viewports. This first-read gate passes. No blocking first-screen finding was raised.

## Findings

### MINOR — F-2-1: The real 404 route omits canonical and social metadata

- **Location / exact evidence:** Live `/404.html` and `/definitely-not-a-real-route` return `<title>Page not found — Lesson Tab Card</title>` and a description, but `link[rel="canonical"]`, `meta[property="og:title"]`, and `meta[name="twitter:card"]` are absent. The static source is `public/404.html`.
- **Why this fails:** A visitor who reaches or shares a broken link gets a route without the site’s required canonical/OG/Twitter metadata. This breaks the stated metadata contract even though the visual 404 is otherwise designed and the HTTP status is correctly 404 for an unknown route.
- **Concrete fix:** Add a canonical URL for the 404 page plus matching Open Graph and Twitter-card title, description, URL, and product social image to `public/404.html`. Add a route test that asserts those tags on both `/404.html` and an unknown URL.

### MINOR — F-2-2: The 404 footer reports a different product build from every app route

- **Location / exact quote:** Live `/`, `/demo`, `/privacy`, and `/terms` footer: “v1.2 / build 2026.08.29”. Live `/404.html` and an unknown route footer: “v1.1 / build 2026.08.29”.
- **Why this fails:** The standard skeleton requires a consistent header/footer and version/build identifier. A person arriving through a stale or broken bookmark sees a conflicting version, which makes it unclear whether the fallback page belongs to the current product.
- **Concrete fix:** Generate or share the footer version/build value with the app shell so the static 404 says “v1.2 / build 2026.08.29”. Add an assertion that the 404 footer matches the current app footer.

## Demo and sandbox

**PASS.** One click from the landing action opened `/demo` and immediately showed the populated G-to-C card at both 390 px and desktop. At 390 px the card preview begins in the first demo viewport. The persistent banner reads “Demo — sample data, nothing is saved” and includes **Reset demo** and **Open my saved card**.

I opened `/demo?license=discard-me` in fresh contexts. The application stripped the parameter to `/demo`, loaded the sample, kept `localStorage` empty, and made only same-origin document/asset requests. After changing the sample and pressing Reset demo, the exact bundled G-to-C lesson returned. Source inspection confirms demo mode is detected before license capture, uses in-memory syntax, and does not write the real draft/license/verdict keys. The demo meets the isolated-sandbox requirement.

## Claims and quality gates

`.factory/claims.json` has 24 entries. I ran each exact listed command individually after `npm ci` in a fresh clone at `/tmp/lesson-tab-card-review-ncrXnF`; all passed. The full local suite also passed: 7 Vitest tests and 28 Playwright tests. `npm run build` created `dist/`, and `git diff --check` passed.

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
| `paid-license-offline-recovery` | PASS |
| `rejected-returned-license` | PASS |
| `source-length-boundary` | PASS |
| `license-restore` | PASS |
| `billing-request-privacy` | PASS |
| `paid-checkout` | PASS |

The independent live request log for a demo edit/reset contained only the site document, JavaScript, CSS, and locally hosted image. The source and tests cover demo storage isolation, offline reload, share fragments, and the absence of lesson text from billing requests. I found no unlisted visitor-facing product claim on the landing or in `README.md`.

## Copy audit

Counts treat URLs, keyboard labels, and hyphenated terms as one word. The landing inventory includes the blank, validation, paid, and demo-entry states reachable from the landing editor. No sentence exceeds 22 words. No banned marketing term, unexplained metaphor/mood heading, inconsistent product term, or non-result-naming button was found.

### Landing and reachable editor states

| Sentence | Words | Flag |
| --- | ---: | --- |
| Make a clear guitar lesson card. | 6 | — |
| For teachers and players who need a readable card before the lesson moves on. | 14 | — |
| Loads a G to C warm-up below. | 7 | — |
| Works offline after the first visit. | 6 | — |
| Your card stays in this browser. | 6 | — |
| SVG and PNG exports stay free. | 6 | — |
| Your card will appear here. | 5 | — |
| Type a title, chord, and six fret values to make it. | 11 | — |
| No lesson yet. | 3 | — |
| Start with a title line. | 5 | — |
| Shorten the lesson before previewing. | 5 | — |
| The export stays blocked until the lesson fits. | 8 | — |
| The card is over 4,000 characters. | 7 | — |
| Shorten it and try again. | 6 | — |
| Ready to export and share. | 5 | — |
| Shorten the named line before previewing. | 6 | — |
| The export stays blocked until every line fits the card. | 10 | — |
| Use x for a muted string and 0 for an open string. | 12 | — |
| Fret values run from 0 to 12. | 7 | — |
| Ctrl plus Enter exports SVG. | 5 | — |
| Alt plus 1 returns to the editor. | 7 | — |
| Fill the short lesson fields. | 5 | — |
| The preview changes as you type. | 6 | — |
| Fix any named line before you hand the card over. | 10 | — |
| Export an image or copy a link for the student. | 10 | — |
| There is no song library, playback, account, or tracking. | 9 | — |
| Lesson Tab Card stores one draft in your browser. | 9 | — |
| New share links keep lesson text after the # sign. | 10 | — |
| The free editor exports one lesson card as SVG or PNG. | 11 | — |
| The worksheet pack adds a four-card SVG page for lesson folders. | 11 | — |
| Sample worksheet preview is open in this demo. | 8 | — |
| Leave the demo before buying or verifying a license. | 9 | — |
| Worksheet pack active on this browser. | 6 | — |
| The saved license is no longer active. | 7 | — |
| You can check the token or buy the pack again. | 10 | — |
| License check finished. | 3 | — |
| The saved license is not active. | 7 | — |
| One-time purchase. | 2 | — |
| After one successful check, the pack stays active offline until billing confirms the license is inactive. | 15 | — |
| Checkout opens through Sociobot and Dodo. | 6 | — |
| See terms. | 2 | — |
| Edit the sample lesson card. | 5 | — |
| Change the G to C exercise below. | 7 | — |
| This sandbox never reads or changes your saved card. | 9 | — |
| Demo — sample data, nothing is saved. | 7 | — |
| Open your saved card next, or a blank card if none exists. | 11 | — |
| Make a clear guitar lesson card. | 6 | — |

### README

| Sentence | Words | Flag |
| --- | ---: | --- |
| Make a clear guitar lesson card from a short text format. | 11 | — |
| It is for guitar teachers and players who need a card during a lesson. | 14 | — |
| The editor draws a six-string chord grid, fingering, capo, short tab, and teacher note. | 14 | — |
| It checks the syntax before export. | 6 | — |
| SVG and PNG exports stay free. | 6 | — |
| A copied link restores the same lesson text. | 8 | — |
| Try the isolated sample at lesson-tab-card.sociobot.in/?demo=1. | 6 | — |
| Demo changes and returned license tokens do not touch real product storage. | 11 | — |
| Count four quiet beats. | 4 | — |
| Fret values use x, 0, or a number from 1 to 12. | 12 | — |
| Finger values use x or a number from 0 to 4. | 11 | — |
| The real editor stores one draft in browser local storage. | 9 | — |
| During ordinary editing, lesson text and exports do not leave the browser in HTTP requests. | 14 | — |
| New share links keep lesson text after the # sign, so browsers do not send it to the site or as a referrer. | 22 | — |
| Older ?c= links should be opened only to copy a new link. | 11 | — |
| The app works offline after the first visit. | 8 | — |
| Buying or verifying a worksheet license contacts the Sociobot billing API. | 10 | — |
| Checkout then moves to Dodo. | 5 | — |
| Neither request includes lesson text. | 5 | — |
| The free editor exports one lesson card as SVG or PNG. | 11 | — |
| A $9 one-time license adds a four-card worksheet SVG. | 9 | — |
| A returned or pasted valid license activates the worksheet pack in this browser. | 12 | — |
| A previously verified license stays active offline while its next check waits for a connection. | 14 | — |
| Requires Node.js 20 or newer. | 5 | — |
| npm test runs unit parsing tests and Playwright claim checks. | 9 | — |
| The exact production command is npm run build. | 8 | — |
| It writes the deployable site to dist, with dist/index.html at its root. | 12 | — |
| Deploy dist as an Azure Static Web App. | 8 | — |
| The static web app configuration provides routing, security headers, asset caching, and the styled 404 response. | 15 | — |
| The repository does not manage DNS, billing registration, or deployment infrastructure. | 11 | — |
| MIT licensed. | 2 | — |
| Built by Param Factory. | 4 | — |

Headings are literal section names: “Type the lesson”, “Check the card”, “Make a card in three steps”, “Limits and privacy”, “A lesson card, not a score editor”, and “Print four cards on one sheet”. Buttons name their result, including “Try it with sample data”, “Export SVG”, “Copy share link”, “Reset demo”, and “Open my saved card”.

## Structure, accessibility, routes, and identity

**Passes except F-2-1 and F-2-2.** `/`, `/demo`, `/privacy`, `/terms`, `/404.html`, robots, sitemap, favicon, and the apple-touch icon returned 200; an unknown route returned the designed page with HTTP 404. The four application routes have `lang="en"`, one h1, one main landmark, route-specific titles, descriptions, canonical URLs, Open Graph/Twitter metadata, favicon, shared navigation/footer, and no load console errors.

Live navigation from demo to Privacy moved focus to the Privacy h1 and announced the route. Browser Back returned to demo, moved focus to “Edit the sample lesson card”, and announced the demo title. A live Axe scan found zero serious or critical issues on `/`, `/demo`, `/privacy`, and `/404.html`. Mobile controls are visible and usable at 390 px. The marked lesson-sheet visual system is distinct from a generic SaaS template and matches `.factory/design.md`.

No missing AI feature was identified: the brief’s core job is local syntax, validation, preview, export, and sharing; an AI step would be decorative. The expected exports and isolated demo are present.

## History check

I read `.factory/review-1.md`, `.factory/polish-1.md`, and the earlier `.factory/handoff.md`. Each numbered first-review finding was rechecked on the current live site and in source; all are actually fixed:

| Earlier finding | Current verification |
| --- | --- |
| F-1-1 | `/demo` shows the populated G-to-C card in the initial mobile and desktop viewport. |
| F-1-2 | Demo detects before license handling; returned demo token is stripped and storage remains unchanged. |
| F-1-3 | README accurately describes Sociobot then Dodo; billing privacy claim test passes. |
| F-1-4 | Preview-update promise has `preview-updates` test coverage. |
| F-1-5 | Rendered field promise has `lesson-card-fields` coverage. |
| F-1-6 | Checkout copy no longer claims refunds and `paid-checkout` passes. |
| F-1-7 | Mood/jargon headings were replaced with literal section headings. |
| F-1-8 | The output is consistently called a “card”. |
| F-1-9 | Demo exit is “Open my saved card” with its blank fallback stated. |
| F-1-10 | Visitor-facing generated-image provenance copy is absent. |
| F-1-11 | Numeric bounds and legacy-link migration are declared and tested. |
| F-1-12 | License privacy flow is claimed/tested; internal provider-ID copy is absent. |
| F-1-13 | Generic free-tier copy was replaced by the concrete SVG/PNG statement. |

The prior handoff’s release claim is therefore mostly corroborated, but it did not catch the 404 metadata and footer-version gaps above.

## What would make this perfect

Bring the static 404 page’s canonical/social metadata and footer build id into the same shared release contract as the app shell, then add automated coverage for both. Re-run the 24 claim commands and the live 404 route check. With those two findings closed, this review would be PASS.
