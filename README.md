# Lesson Tab Card

Make a clear guitar lesson card from a short text format. It is for guitar teachers and players who need a card during a lesson.

The editor draws a six-string chord grid, fingering, capo, short tab, and teacher note. It checks the syntax before export. SVG and PNG exports stay free. A copied link restores the same lesson text.

Try the isolated sample at [lesson-tab-card.sociobot.in/?demo=1](https://lesson-tab-card.sociobot.in/?demo=1). Demo changes and returned license tokens do not touch real product storage.

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

The real editor stores one draft in browser local storage. During ordinary editing, lesson text and exports do not leave the browser in HTTP requests. New share links keep lesson text after the `#` sign, so browsers do not send it to the site or as a referrer. Older `?c=` links should be opened only to copy a new link. The app works offline after the first visit.

Buying or verifying a worksheet license contacts the Sociobot billing API. Checkout then moves to Dodo. Neither request includes lesson text.

## Optional worksheet pack

The free editor exports one lesson card as SVG or PNG. A $9 one-time license adds a four-card worksheet SVG. A returned or pasted valid license activates the worksheet pack in this browser. A previously verified license stays active offline while its next check waits for a connection.

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

Deploy `dist/` as an Azure Static Web App. `public/staticwebapp.config.json` provides routing, security headers, asset caching, and the styled 404 response. The repository does not manage DNS, billing registration, or deployment infrastructure.

## Project records

- `.factory/brief.json` — product scope
- `.factory/design.md` — visual system and image provenance
- `.factory/claims.json` — visitor claims and their tests
- `.factory/demo.md` — demo sandbox details
- `.factory/copy-audit.md` — plain-language review
- `.factory/handoff.md` — verification and known gaps

MIT licensed. Built by Param Factory.
