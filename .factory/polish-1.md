# Polish round 1 — finding closure

Candidate `81c4cf96ffdcb4eef182dda6b843f3ea310ac729` was repaired from review base `2081a0b6f6e470b4a3db1b477d4903a6520f2500`. Implementation commit: `f8e5665ce36e538e75893cb18b6ceb6a3be1a62b`.

All local evidence below passed again from the clean clone `/tmp/lesson-tab-card-polish-clean-v6K0Mo`. Live evidence is summarized in [`live-evidence/summary.md`](live-evidence/summary.md).

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Removed the full marketing hero from demo mode, added a compact task heading, and placed the populated preview first on mobile. `/demo` and `/?demo=1` both use the same sample route. | `@claim:demo-first-screen`; [`polish-artifacts/demo-mobile.png`](polish-artifacts/demo-mobile.png); [`live-evidence/live-query-demo-mobile.png`](live-evidence/live-query-demo-mobile.png). Live sample title y = 624.35 px at 390×844 and 579.38 px at 1440×1000. |
| F-1-2 | Demo mode is detected before license capture or cached-license reads. Demo license parameters are stripped without storage, license controls are absent, and edit/reset/exit never change the draft, license, or verdict keys. | `@claim:demo-isolation` seeds and compares every product key, opens `/demo?license=…`, edits, resets, exits, and records requests. Live `/demo?license=must-not-save` preserved all seeded values byte-for-byte with zero cross-origin requests. Direct live `/?demo=1&license=discard-me` left storage `{}`. |
| F-1-3 | Replaced the false README sentence with the exact Sociobot → Dodo flow and stated that lesson text is omitted. | `@claim:billing-request-privacy` inspects checkout and verification URLs/bodies; `@claim:paid-checkout` proves the 303 Dodo redirect. Live checkout returned 303 to `checkout.dodopayments.com`. |
| F-1-4 | Kept “The preview changes as you type” and registered it as an observable claim. | `@claim:preview-updates` changes both title and chord and checks the SVG text plus accessible name. Live check changed the preview to “Live D change” / “D”. |
| F-1-5 | Registered the rendered-field claim and fixed capo zero to render as `CAPO 0` instead of a dash. | `@claim:lesson-card-fields` checks six grid strings, fingering, capo, six tab strings, and the teacher note. Live counts: six grid strings and six tab lines. |
| F-1-6 | Replaced the checkout/refund attribution with “Checkout opens through Sociobot and Dodo.” | `@claim:paid-checkout`; live copy audit found the old sentence absent and the replacement present. |
| F-1-7 | Removed the unexplained hero label and renamed the section labels to “How it works” and “Limits and privacy.” Policy and 404 labels were also made literal. | `uses real route titles and renders legal pages`; [`.factory/copy-audit.md`](copy-audit.md); live copy audit found all three reported labels absent. |
| F-1-8 | Standardized the output term to “card” in the hero, limits heading, footer, README, and 404 page. | Terminology table in [`.factory/copy-audit.md`](copy-audit.md); live copy audit confirmed “A lesson card, not a score editor.” |
| F-1-9 | Renamed the demo exit to “Open my saved card” and states the blank-card fallback beside it. | `@claim:demo-isolation` proves the saved-card result; `@claim:demo-first-screen` covers a clean demo entry; the control is visible in both demo screenshots. |
| F-1-10 | Removed both visitor-facing generated-image provenance claims and the generic image caption. Provenance remains in the design record. | Live copy audit found both reported sentences absent; provenance remains in [`.factory/design.md`](design.md). |
| F-1-11 | Kept the useful numeric bounds and legacy-link guidance, registered both claims, and tested accepted lower/upper values plus rejected neighbours. | `@claim:syntax-boundaries`; `@claim:legacy-link-migration`. The clean-clone suite also retained the malformed-fret and printable-length regressions. |
| F-1-12 | Removed the internal product-ID sentence. Rewrote license privacy text around the user-visible billing flow and tests. Added a separate pasted-license test. | `@claim:billing-request-privacy`, `@claim:paid-license-flow`, and `@claim:license-restore`. |
| F-1-13 | Deleted “A card-sized space keeps the lesson focused.” Replaced “The free editor remains complete” with the exact free SVG/PNG result. | `@claim:license-free-card-exports`; live copy audit found both old sentences absent and the new sentence present. |

## Cumulative regression evidence

Earlier verification reports had already identified checkout availability, overlong printable text, blank-state contrast, query-string share privacy, touch targets, true 404 responses, malformed SVG recovery, and missing paid/privacy claims. These remain covered by:

- `@claim:paid-checkout`, `@regression:printable-lengths`, `@claim:browser-private`, `@claim:syntax-validation`, and the route/accessibility suite.
- Live HTTP 404 for `/definitely-not-a-real-route`; zero serious/critical Axe findings; zero undersized visible controls at 390×844; zero horizontal overflow.
- Live production JS SHA-256 matches the deployed build: `29f7925c9805ff00f9c098e9b64514a8a0155ab95f8149ba495e49342a903408`.

No review or verification finding remains open.
