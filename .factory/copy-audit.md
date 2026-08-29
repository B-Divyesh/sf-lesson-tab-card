# Copy audit

Audited 2026-08-29. Counts treat contractions, URLs, keyboard labels, and hyphenated terms as one word. Every prose sentence is at most 22 words and uses none of the banned marketing words.

## Landing, editor, and demo

| Sentence | Words | Claim or purpose |
| --- | ---: | --- |
| Make a clear guitar lesson card. | 6 | Job statement |
| For teachers and players who need a readable card before the lesson moves on. | 14 | Audience and situation |
| Loads a G to C warm-up below. | 7 | `demo-first-screen` |
| Works offline after the first visit. | 6 | `offline-reload` |
| Your card stays in this browser. | 6 | `local-draft-storage` |
| SVG and PNG exports stay free. | 6 | `license-free-card-exports` |
| Your card will appear here. | 5 | Empty state |
| Type a title, chord, and six fret values to make it. | 11 | Empty-state action |
| No lesson yet. | 3 | Empty state |
| Start with a title line. | 5 | Empty-state action |
| Ready to export and share. | 5 | Valid state |
| Shorten the named line before previewing. | 6 | Error action |
| The export stays blocked until every line fits the card. | 10 | `syntax-validation` |
| Use x for a muted string and 0 for an open string. | 12 | `syntax-boundaries` |
| Fret values run from 0 to 12. | 7 | `syntax-boundaries` |
| Ctrl plus Enter exports SVG. | 5 | `keyboard-shortcuts` |
| Alt plus 1 returns to the editor. | 7 | `keyboard-shortcuts` |
| Fill the short lesson fields. | 5 | Instruction |
| The preview changes as you type. | 6 | `preview-updates` |
| Fix any named line before you hand the card over. | 10 | `syntax-validation` |
| Export an image or copy a link for the student. | 10 | `free-exports`, `share-link` |
| There is no song library, playback, account, or tracking. | 9 | `no-account-no-tracking` |
| Lesson Tab Card stores one draft in your browser. | 9 | `local-draft-storage` |
| New share links keep lesson text after the # sign. | 10 | `browser-private` |
| The free editor exports one lesson card as SVG or PNG. | 11 | `license-free-card-exports` |
| The worksheet pack adds a four-card SVG page for lesson folders. | 11 | `worksheet-pack` |
| Sample worksheet preview is open in this demo. | 8 | Demo state |
| Leave the demo before buying or verifying a license. | 9 | Demo boundary |
| Worksheet pack active on this browser. | 6 | `paid-license-flow`, `license-restore` |
| One-time purchase. | 2 | Purchase term |
| Checkout opens through Sociobot and Dodo. | 6 | `paid-checkout` |
| See terms. | 2 | Legal link |
| Edit the sample lesson card. | 5 | Demo job |
| Change the G to C exercise below. | 7 | Demo action |
| This sandbox never reads or changes your saved card. | 9 | `demo-isolation` |
| Demo — sample data, nothing is saved. | 7 | `demo-isolation` |
| Open your saved card next, or a blank card if none exists. | 11 | Demo exit result |
| Make a clear guitar lesson card. | 6 | Footer one-liner |

## Privacy and terms routes

| Sentence | Words | Claim or purpose |
| --- | ---: | --- |
| Lesson Tab Card has no account system and no analytics. | 9 | `no-account-no-tracking` |
| The editor stores your current lesson text in local storage. | 9 | `local-draft-storage` |
| New share links keep the same text after the # sign. | 10 | `browser-private` |
| Demo mode keeps its sample in memory and does not read or write your saved lesson. | 15 | `demo-isolation` |
| New share-link lesson text and exports do not leave your browser in HTTP requests. | 13 | `browser-private` |
| Buying or verifying a worksheet license contacts the Sociobot billing API. | 10 | `billing-request-privacy` |
| Checkout then moves to Dodo. | 5 | `paid-checkout` |
| Neither request includes lesson text. | 5 | `billing-request-privacy` |
| Older links that use ?c= put lesson text in the request address. | 12 | `legacy-link-migration` |
| Open one only to copy a new link, then remove the old link. | 12 | `legacy-link-migration` |
| Use “Clear card” to remove the saved lesson. | 8 | `clear-saved-card` |
| Clear this site’s browser storage to remove a license token and its last verification result. | 14 | Browser instruction |
| Use the editor for your own lesson material and original exercises. | 10 | Usage term |
| You may create, export, print, and share lesson cards. | 8 | Usage permission |
| Do not use the product to distribute material you do not have permission to share. | 14 | Usage limit |
| The worksheet pack costs $9 as a one-time purchase. | 9 | `paid-checkout` |
| A valid returned or pasted license activates the worksheet pack in this browser. | 12 | `paid-license-flow`, `license-restore` |
| SVG and PNG card exports remain free. | 7 | `license-free-card-exports` |
| Checkout opens through Sociobot and Dodo. | 6 | `paid-checkout` |
| Email support for purchase questions. | 5 | Support action |
| The software is provided under the MIT License without warranty. | 10 | Legal term |
| Check fret numbers and teaching notes before sharing a card. | 10 | Safety instruction |

## README sentences

| Sentence | Words | Claim or purpose |
| --- | ---: | --- |
| Make a clear guitar lesson card from a short text format. | 11 | Job statement |
| It is for guitar teachers and players who need a card during a lesson. | 14 | Audience and situation |
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
| The free editor exports one lesson card as SVG or PNG. | 11 | `license-free-card-exports` |
| A $9 one-time license adds a four-card worksheet SVG. | 9 | `worksheet-pack`, `paid-checkout` |
| A returned or pasted valid license activates the worksheet pack in this browser. | 12 | `paid-license-flow`, `license-restore` |
| Requires Node.js 20 or newer. | 5 | Development prerequisite |
| npm test runs unit parsing tests and Playwright claim checks. | 9 | Development instruction |
| The exact production command is npm run build. | 8 | Build instruction |
| It writes the deployable site to dist, with dist/index.html at its root. | 12 | Build instruction |
| Deploy dist as an Azure Static Web App. | 8 | Deployment instruction |
| The static web app configuration provides routing, security headers, asset caching, and the styled 404 response. | 15 | Deployment instruction |
| The repository does not manage DNS, billing registration, or deployment infrastructure. | 11 | Scope boundary |
| MIT licensed. | 2 | License |
| Built by Param Factory. | 4 | Attribution |

## Error and feedback templates

All generated validation, export, share-link, image-drawing, and license messages are at most 22 words per sentence. Each failure names what happened and gives the next action. The validation suite covers malformed input, printable lengths, and every documented numeric boundary.

## Terminology

| Concept | One term |
| --- | --- |
| Exported teaching item | card |
| Typed source | lesson syntax |
| Six-line guitar notation | tab |
| Browser-only sample | demo |
| Real local work | draft |
| Optional paid output | worksheet pack |
| Purchase credential | license |

Catalog description: “Make a clear guitar lesson card during the lesson.” It starts with a verb, uses nine words, and is 50 characters.
