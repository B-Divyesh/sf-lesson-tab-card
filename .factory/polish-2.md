# Polish round 2 — finding closure

Candidate `2b20c2ae30f3634a26c7c5237e4e96f0c2598ebf` was checked against every recorded review and verification finding. Repair commits are `3666e8f142de604da664bfdfa727cb6010a84e4f` and `740b1bca80f9a2f7869d079c990b07aba895824a`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Demo uses a compact task heading and puts the populated G-to-C card in the initial viewport. | `@claim:demo-first-screen`; `.factory/qa-evidence/polish-2-live-demo.png`; live `https://lesson-tab-card.sociobot.in/demo` (preview y=563.59 at 390×844). |
| F-1-2 | Demo detection happens before license handling. Demo parameters are removed without changing real draft or license storage. Reset and exit keep the same separation. | `@claim:demo-isolation`; live `https://lesson-tab-card.sociobot.in/demo?license=polish-demo-token` kept seeded draft, license, and verdict values. |
| F-1-3 | README and privacy copy now describe the Sociobot-to-Dodo purchase path and state that lesson text is omitted. | `@claim:billing-request-privacy`; `@claim:paid-checkout`; live `/privacy`. |
| F-1-4 | The preview-update statement has a declared claim and a rendered SVG assertion. | `@claim:preview-updates`; live `/demo`. |
| F-1-5 | The six-string grid, fingering, capo, tab, and teacher note are declared and checked from the bundled sample. | `@claim:lesson-card-fields`; live `/demo`. |
| F-1-6 | Purchase copy says checkout opens through Sociobot and Dodo; it does not make a refund statement. | `@claim:paid-checkout`; live `/terms`. |
| F-1-7 | Section headings use literal names: “How it works” and “Limits and privacy.” | `.factory/copy-audit.md`; live `/`. |
| F-1-8 | The generated teaching item is consistently called a card. | `.factory/copy-audit.md`; live `/`, `/terms`, and `/404.html`. |
| F-1-9 | The demo exit control is “Open my saved card” and states its blank-card fallback. | `@claim:demo-isolation`; live `/demo`. |
| F-1-10 | Visitor-facing generated-image provenance wording was removed; provenance remains in the design record. | `.factory/design.md`; live `/`. |
| F-1-11 | Numeric bounds and older-link handling are declared and checked. | `@claim:syntax-boundaries`; `@claim:legacy-link-migration`; live `/demo`. |
| F-1-12 | Billing privacy text is limited to the user-visible flow and covered by request checks. | `@claim:billing-request-privacy`; live `/privacy`. |
| F-1-13 | Generic free-tier wording was replaced by the specific free SVG/PNG export result. | `@claim:license-free-card-exports`; live `/`. |
| F-2-1 | The static 404 document now has canonical, Open Graph, and Twitter metadata, including social image and canonical URL. Route updates keep the same metadata on unknown app paths. | `serves complete metadata and the current release on every not-found route`; `.factory/qa-evidence/polish-2-live-404.png`; live `/404.html` and `/definitely-not-a-real-route` both resolve the 404 canonical metadata. |
| F-2-2 | Static and app footers use one release label from `src/site-config.ts`: `v1.2 / build 2026.08.29`. | `serves complete metadata and the current release on every not-found route`; `.factory/qa-evidence/polish-2-live-404.png`; live `/404.html` and `/` both report the same label. |

## Verification summary

- Fresh clone: `/tmp/lesson-tab-card-polish-clean.myX2QM` at `740b1bc`; `npm ci`, all 24 individual claim commands, `CI=1 npm test`, `npm run build`, and `npm audit --audit-level=low` passed.
- Aggregate suite: 7 Vitest tests and 29 Playwright tests passed. The browser suite covers blank and demo states, routes, focus, mobile targets, reduced motion, offline reload, private share links, demo storage separation, exports, billing request content, and Axe serious/critical checks.
- Build: `dist/` contains the static 404 document with its resolved canonical, social metadata, and shared footer label. Main JavaScript is 27.80 kB raw / 10.04 kB gzip; CSS is 11.93 kB raw / 3.39 kB gzip.
- Live confirmation: deployment `bf102dcc-9713-4d03-ab65-d24df6b80bc3`; cold 390 px checks passed for landing, demo, demo storage, legal routes, static 404, and unknown-route HTTP status. Axe serious/critical counts were zero for demo and 404.
