# Independent product verification — FAIL

Verified on 2026-08-28 for work order `lesson-tab-card-verify-1`.

- Candidate: `548cbe0cb779115d576fe5fc0bc26d1153a55bd0`
- Live URL: `https://lesson-tab-card.sociobot.in`
- Artifact class: static web / installable offline web app
- Verdict: **FAIL — do not release**

The free sample flow and repository gates work, but the live paid checkout is dead, the blank editor has a serious axe contrast failure, and accepted content can be silently truncated into an illegible export. The privacy wording is also stronger than the actual share-link behavior.

## Release-blocking findings

### High — the advertised $9 purchase cannot start

The home page advertises “Buy worksheet pack — $9”. The link resolves to:

```text
GET https://api.sociobot.in/api/v1/products/lesson-tab-card/checkout
HTTP 404
{"error":"enabled factory product","status":404}
```

The full link crawl found this as the only broken hyperlink. This is fresh live evidence, not an assumed deployment problem. License verification itself is reachable and returns a structured invalid result for a fake token, but no customer can reach checkout. The builder handoff’s note that the billing product still needed registration is therefore an active production defect.

The `worksheet-pack` claim test does not cover this path. It enables a sample-only worksheet directly in `/demo`, so it proves SVG layout but not purchase, return-token capture, verification, or paid activation.

### High — valid status can produce clipped, silently changed exports

The parser silently slices title, chord, and note values at 60, 16, and 140 characters (`src/model.ts:59-70`) without a validation error. A boundary card with 61 title characters, 17 chord characters, and 141 note characters showed `VALID`, then:

- rendered only 60/16/140 characters;
- dropped the final character from every field without telling the user;
- placed the title to x=1608.9, chord to x=1115.6, and note to x=1671.1 in a 900-wide SVG;
- exported that clipped result.

This breaks the central requirement to create a legible handout and contradicts the “validation names the invalid lesson field” promise for these accepted boundary values. Evidence: [live-long-content-overflow.png](verification-artifacts/live-long-content-overflow.png).

### High — live home route has a serious accessibility violation

An independent axe 4.10.2 scan of `/` found one serious WCAG 1.4.3 violation:

```text
.empty-preview > span
foreground #625f54 on background #d8d1bd
contrast 4.19:1; required 4.5:1 at 16px normal weight
```

The repository test scans `/demo`, where the empty preview is absent, so its green axe result does not cover the blank first-run state. `/demo`, `/privacy`, `/terms`, and the in-app not-found view had no serious or critical axe findings.

### High — the browser-only privacy statement is not true for opened share links

The page, privacy policy, README, and `browser-private` claim say lesson text does not leave the browser. Share links use `/?c=<base64 lesson>`. Opening a representative link caused the browser to send the entire encoded lesson to the site in the document URL. The same full URL was then sent as the `Referer` for the script, stylesheet, and lesson image requests. Decoding the query restored the private sample text exactly, including “Student name Casey”.

The current claim test only edits and resets `/demo`, and only rejects cross-origin traffic. It does not exercise an opened share link or assert that lesson text is absent from same-origin request URLs and headers. Use a URL fragment for client-only transport, or narrow the privacy promise and its test.

## Other findings

### Medium — mobile touch targets are below the 44px contract

At 390px, the header’s Editor, Demo, and Privacy links measure 21.7px high. Footer links measure 20.1px high, and the inline terms link measures 39×15px. They are keyboard reachable and visibly underlined, but they do not meet the required 44×44 CSS-pixel target.

### Medium — unknown routes return HTTP 200

`/definitely-not-a-real-route` renders the designed in-app not-found screen and correct title, but both browser navigation and `curl` receive HTTP 200. `/404.html` also returns 200. This is a soft 404 despite the documented “real 404” requirement and the `responseOverrides` entry.

### Medium — visitor-facing paid and privacy claims are under-listed or under-tested

`.factory/claims.json` has no observable test for the $9 checkout, returned license, restore-license flow, or paid activation. The browser-private test does not cover share navigation. Under the supplied claims contract, these gaps are release blocking even though the seven declared commands pass.

## Mandatory first-read and demo gate

**PASS.** A cold load answers all three required questions on desktop and 390px mobile:

- What it does: “Make a clear guitar lesson card.”
- For whom: teachers and players needing a readable handout during a lesson.
- First click: “Try it with sample data,” with “Loads a G to C warm-up below” beside it.

That one click opens `/demo`, immediately shows a complete G-to-C exercise, and keeps the persistent “Demo — sample data, nothing is saved” banner with Reset demo and Start for real. Screenshots: [desktop](verification-artifacts/live-first-read-desktop.png) and [390px mobile](verification-artifacts/live-first-read-mobile.png).

## Claims gate

`.factory/claims.json` exists and contains seven entries. As required, every exact command was invoked before broader QA. In the dependency-free clone, the commands first stopped before test discovery because `@playwright/test` was not installed. After the documented prerequisite `npm ci`, every exact command passed from `/demo`:

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `offline-reload` | PASS | Service worker controlled the page; offline reload restored the demo heading and bundled G-to-C sample. |
| `browser-private` | PASS as written, coverage defect above | Demo edit/reset issued no cross-origin request. |
| `demo-isolation` | PASS | Seeded real draft stayed unchanged through demo edit and reset. |
| `free-exports` | PASS | SVG contained the lesson title; PNG had the PNG signature and exceeded 10 KB. |
| `share-link` | PASS | Copied link restored byte-for-byte lesson syntax. |
| `syntax-validation` | PASS for tested fields | Invalid capo and fret were named and export produced no download. |
| `worksheet-pack` | PASS for demo SVG only | Download contained four placed cards; it does not prove paid unlock. |

Aggregate `npm test`: 3 unit tests and 9 Playwright tests passed.

## Independent functional testing

- Normal sample: preview, SVG, PNG, share restore, four-card demo worksheet, reset, and Start for real worked.
- Valid boundaries: fret 12, finger 1, and capo 12 were accepted.
- Invalid boundaries: fret 13, finger 5, and capo 13 produced three named errors and blocked export.
- Damaged share query produced a plain recovery message and an empty editor.
- Script/image markup in title and note stayed inert text; no injected element or console error appeared.
- Clear card respected cancel, then removed both editor text and real local-storage draft after confirmation.
- `Ctrl+Enter` downloaded `boundary.svg`; `Alt+1` returned focus to the syntax field.
- Demo Start for real loaded a previously seeded real draft and removed the demo banner.
- No horizontal overflow occurred at 390px.

## Accessibility, keyboard, and motion

- `<html lang="en">`, route-specific titles, one h1, one main landmark, labels, image alt text, and skip link are present on rendered routes.
- Keyboard skip moves focus to the h1; SPA navigation moves focus to the new h1. Focus rings are 4px and visible after keyboard input.
- No keyboard trap was found. Native links, buttons, details, text input, confirmation, and shortcuts were operable.
- Reduced-motion emulation changed transition/animation durations to 0.01ms; nothing loops or flashes.
- Single light theme is explicitly justified in `.factory/design.md`.
- Serious axe result and undersized touch targets remain blockers as described above.

## Privacy, networking, and policies

- A fresh `/demo` context used no cookies, local storage, or session storage and made same-origin requests only.
- No analytics, third-party font, third-party script, Azure model endpoint, account, or sign-in flow was observed.
- The only optional runtime cross-origin endpoint in code is the Sociobot billing API.
- Live pages set HSTS, `nosniff`, strict-origin referrer policy, camera/microphone/geolocation restrictions, frame denial through CSP, and a source-restricted CSP. No CSP or console errors appeared.
- HTML uses `public, must-revalidate, max-age=30`; hashed JS/CSS use one-year immutable caching; the service worker uses `no-cache`.
- The share-link privacy defect remains as described above.

## API rate limiting

The product’s Sociobot verification endpoint was tested with one 100-request concurrent burst using a fake token. It allowed 30 responses with HTTP 200 and rejected 70 with HTTP 429. Every 429 carried `Retry-After: 4` and body `Too Many Requests! Wait for 4s`. Observed burst allowance: 30 requests; rate limiting passes.

## PWA/offline behavior

- Service worker scope: `/`; active script: `/service-worker.js`; state: activated and controlling.
- An explicit `registration.update()` completed.
- After going offline, `/demo` reloaded with its sample and `/privacy` reloaded with its correct title and h1.
- Manifest parsed without browser installability errors.

## Build, deployment identity, and performance

- `npm ci`: PASS, 0 vulnerabilities.
- `npm audit --audit-level=low`: PASS, 0 vulnerabilities.
- `npm test`: PASS, 3 unit + 9 browser tests.
- `npm run build`: PASS. This is the exact production build and includes `tsc --noEmit`; no separate lint script exists.
- Output: `dist/` present, JS 24.79 KB raw / 9.45 KB gzip, CSS 10.92 KB raw / 3.20 KB gzip, hero WebP 68 KB, no web fonts.
- Factory URL check: HTTP 200; 670ms network-idle load; no console errors; title/lang/h1/main/alt/button-name checks passed.
- Live deployment matches the candidate byte-for-byte for `index.html`, hashed JS, hashed CSS, service worker, manifest, robots, sitemap, icons, hero, and social image. Key SHA-256 values: index `a9ffe20c…`, JS `27b95a05…`, CSS `bb4438d7…`.
- Lighthouse 13.4.1 mobile report: Performance 99, Accessibility 96, Best Practices 100, SEO 100; FCP 0.8s, LCP 0.8s, TBT 110ms, CLS 0, 85,271 transfer bytes. Accessibility lost points for the same contrast defect. The CLI emitted a Chrome-tab crash warning after writing the complete report; a Lighthouse 12.8.2 rerun produced consistent accessibility and contrast results.
- Lab Lighthouse does not emit INP. Independent synchronous edit-to-preview processing across 30 samples measured 0.3ms median, 0.5ms p95, 0.9ms maximum; this is handler cost, not field INP.

## Scope checks

- Static product: backend concurrency and persistence tests do not apply.
- Not a library or CLI: consumer pack/install does not apply.
- No sign-in: Entra authority check does not apply.
- No AI feature is present or needed for the researched smallest useful product.

## Required remediation before re-verification

1. Register and enable the production billing product, then prove checkout redirect, return token, verification, restore, and paid activation.
2. Reject overlong title/chord/note values with named errors or lay them out without clipping; never silently truncate valid input.
3. Raise blank-state contrast to at least 4.5:1 and scan both blank and demo states.
4. Keep shared lesson text out of HTTP request URLs/referrers, preferably by decoding a URL fragment client-side, or correct the privacy promise and test.
5. Give every mobile interactive target a 44×44px hit area.
6. Return an actual 404 status for unknown paths while preserving valid SPA deep links.
7. Add claim entries and end-to-end tests for all paid and privacy promises.

No product source was modified during verification.
