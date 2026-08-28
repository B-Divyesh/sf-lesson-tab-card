# Lesson Tab Card independent verification handoff

## Verdict: FAIL — do not release

Independent verification completed 2026-08-28 for candidate `548cbe0cb779115d576fe5fc0bc26d1153a55bd0` at `https://lesson-tab-card.sociobot.in`.

The deployment is the candidate build and the free demo works, but release blockers remain:

1. The advertised $9 checkout returns HTTP 404 with `{"error":"enabled factory product","status":404}`.
2. Title, chord, and note overflow is silently truncated, still labeled `VALID`, and exported outside the 900px card.
3. The blank editor has a serious axe contrast violation: 4.19:1 where 4.5:1 is required.
4. Opened share links send encoded lesson text to the host in the request query and asset `Referer` headers despite the browser-only privacy statement.
5. Paid activation and share privacy are not adequately represented by `.factory/claims.json` tests.

Medium defects: mobile navigation/footer links miss the 44px touch-target requirement, and unknown routes render a not-found page with HTTP 200.

Full evidence and remediation steps are in [verification.md](verification.md). Screenshots are in `verification-artifacts/`.

## What passed

- Mandatory cold first-read and one-click sample demo.
- All seven declared claim commands after `npm ci`.
- `npm test`: 3 unit and 9 Playwright tests.
- `npm run build`: exact production build, including TypeScript check.
- `npm audit`: 0 vulnerabilities.
- Candidate/live byte identity across deployable files.
- SVG/PNG/share/demo worksheet happy paths, invalid fret/finger/capo recovery, local draft isolation, XSS smoke test, keyboard shortcuts, and 390px reflow.
- PWA update check and offline reload of `/demo` and `/privacy`.
- Security headers, CSP without console violations, immutable hashed-asset caching, and same-origin-only demo traffic.
- API rate limiting: a 100-request burst yielded 30 HTTP 200 and 70 HTTP 429 responses; all 429s included `Retry-After: 4`.
- Lighthouse 13.4.1 report: Performance 99, Accessibility 96, Best Practices 100, SEO 100; LCP 0.8s, TBT 110ms, CLS 0.

## Reproduce

```sh
npm ci
npm test
npm run build
bash /opt/fleet/lib/verify-url.sh https://lesson-tab-card.sociobot.in /tmp/lesson-tab-card-verify
```

Run every exact command in `.factory/claims.json` separately after install. Then test the live checkout and scan `/` (not only `/demo`) with axe.

## Next steps

Enable the production Sociobot billing product; fix and validate output field lengths; repair blank-state contrast and touch targets; redesign or qualify share-link privacy; add missing claim coverage; and configure real 404 responses. Re-run the full verification contract after redeployment.

No product source was changed by the verifier. The pre-existing untracked `graphify-out/` directory was left untouched.
