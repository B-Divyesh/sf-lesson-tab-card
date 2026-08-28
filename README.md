# Lesson Tab Card

Make a clear guitar lesson card from a short text format. It is for guitar teachers and players who need a handout during a lesson.

The editor draws a six-string chord grid, fingering, capo, short tab, and teacher note. It checks the syntax before export. SVG and PNG exports stay free. A copied link restores the same lesson text.

Try the isolated sample at [lesson-tab-card.sociobot.in/demo](https://lesson-tab-card.sociobot.in/demo). Demo changes are not saved to the real draft.

## Syntax

```text
title: G to C change
chord: G
frets: 3 2 0 0 0 3
fingers: 2 1 0 0 0 3
capo: 0
tab:
e|--3---0--|
B|--0---1--|
G|--0---0--|
D|--0---2--|
A|--2---3--|
E|--3------|
note: Count four quiet beats.
```

Fret values use `x`, `0`, or a number from 1 to 12. Finger values use `x` or a number from 0 to 4.

## Privacy and offline use

The real editor stores one draft in browser local storage. Lesson text and exports do not leave the browser. A share link contains the lesson text in its address. The app works offline after the first visit.

License verification is the only optional cross-origin request. It sends the license token to the Sociobot billing API. It does not send lesson text.

## Optional worksheet pack

The free editor remains complete. A $9 one-time license adds a four-card worksheet SVG. Checkout and license verification use the Sociobot billing API. The product slug is used at runtime, so no provider product ID is embedded.

## Develop and verify

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
npm test
npm run build
```

`npm test` runs unit parsing tests and Playwright claim checks. The exact production command is `npm run build`. It writes the deployable site to `dist/`, with `dist/index.html` at its root.

## Deploy

Deploy `dist/` as an Azure Static Web App. `public/staticwebapp.config.json` provides SPA fallback, security headers, asset caching, and the styled 404 response. The repository does not manage DNS, billing registration, or deployment infrastructure.

## Project records

- `.factory/brief.json` — product scope
- `.factory/design.md` — visual system and image provenance
- `.factory/claims.json` — visitor claims and their tests
- `.factory/demo.md` — demo sandbox details
- `.factory/copy-audit.md` — plain-language review
- `.factory/handoff.md` — verification and known gaps

MIT licensed. Built by Param Factory.
