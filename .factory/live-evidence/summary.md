# Live verification summary

Verified `https://lesson-tab-card.sociobot.in` cold on 2026-08-29 after deployment `ccec5f81-0bac-46a3-8661-152904483e87`.

- `/`, `/demo`, `/?demo=1`, `/privacy`, and `/terms`: HTTP 200. `/definitely-not-a-real-route`: HTTP 404 with the designed page.
- `verify-url.sh`: 899 ms network-idle load, correct title/lang/one h1/main/alt/button names, and no console or page errors.
- Mobile `/?demo=1&license=discard-me`: token stripped to `/?demo=1`; storage `{}`; no cross-origin request or console error; sample title y = 624.35 px in an 844 px viewport.
- Mobile `/demo`: sample title y = 629.35 px; six chord strings, six tab lines, `CAPO 0`, and the teacher note rendered.
- Demo isolation: seeded draft, license, and verdict strings were byte-identical after `/demo?license=must-not-save`, edit, reset, and exit; zero cross-origin requests.
- Axe 4.10.2: zero serious or critical findings on `/`, `/demo`, `/privacy`, `/terms`, and the HTTP 404 page.
- Mobile 390×844: zero horizontal overflow and zero visible interactive targets below 44×44 px on all five routes above.
- Offline: after the first demo visit, the populated demo and `/privacy` both loaded with the network disabled.
- Link crawl: all same-origin links returned 200, the checkout returned 303 to `checkout.dodopayments.com`, Sociobot returned 200, and both mail links were valid schemes.
- Lighthouse 13.0.1 mobile `/demo`: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.2 s, TBT 40 ms, CLS 0, transfer 84 KiB.
- Production `main-BOFePCyv.js`: local and live SHA-256 `29f7925c9805ff00f9c098e9b64514a8a0155ab95f8149ba495e49342a903408`.

Screenshots: `live-demo-mobile.png` and `live-query-demo-mobile.png` in this directory.
