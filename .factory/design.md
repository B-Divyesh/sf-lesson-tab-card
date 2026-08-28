# Lesson Tab Card visual thesis

## Direction

**Neo-brutalist utility, built from a marked-up lesson sheet.** The interface should feel like a music teacher placed a thick black marker, a yellow sticky note, and a blue chord stamp on warm paper. Hard borders, offset shadows, clipped corners, and dense labels make speed visible. The card preview stays calm and printable while the surrounding editor keeps the workshop character.

This fits the product because guitar lessons are physical and immediate. The visual system borrows from fretboard grids, ruled paper, pencil marks, and tab staff lines. It avoids a polished notation-suite look and avoids a generic centred gradient hero.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#F6F0DE` | warm page background |
| `--ink` | `#171713` | primary text and hard rules |
| `--surface` | `#FFFDF6` | editor and preview sheets |
| `--yellow` | `#FFD84A` | primary action and teaching marks |
| `--blue` | `#155EEF` | links, focus, active states |
| `--blue-dark` | `#083A9B` | accessible blue text |
| `--red` | `#B42318` | validation errors |
| `--green` | `#216E39` | valid state |
| `--muted` | `#575349` | supporting text; meets 4.5:1 on the preview paper |

The product uses a single light treatment. Printing and instant visual recognition matter more than theme switching. The background is painted explicitly.

## Type

- Display and controls: `Arial Black`, `Arial Narrow`, system sans-serif. Compressed, loud labels resemble amp-panel lettering.
- Body and input: `ui-monospace`, `SFMono-Regular`, `Consolas`, monospace. The syntax and fret numbers need stable columns.
- No font files or external font requests. System families keep the editor fast and available offline.

Scale: 14, 16, 18, 24, 40, and responsive 64px. Body text is at least 16px. Measures stay below 70 characters.

## Spacing and shape

- Base unit: 8px. Section spacing: 48–96px. Control height: at least 44px.
- 3px black borders; 6px offset shadows; clipped top-right corners on major sheets.
- Tab lines repeat as a subtle horizontal structural motif.
- The real editor spans the page asymmetrically: compact instructions beside a large working surface.

## Interaction grammar

- Buttons depress by translating into their offset shadow.
- The selected export format or editor state uses solid blue plus text, never color alone.
- Validation responds as the user types. The first error names the line and the fix.
- Keyboard shortcut labels look like physical keycaps.
- Route changes move focus to the page heading and announce it.

## Motion policy

One signature motion: the preview sheet slides a few pixels out from behind its black registration shadow when content changes (180ms, transform and opacity only). Buttons use a 100ms press. Nothing loops. With `prefers-reduced-motion: reduce`, transforms and transitions are removed and state changes are instant.

## Original asset plan

1. A generated still life of a compact guitar lesson desk: abstract fretboard offcuts, yellow paper, blue marker, black strings, and a blank cream chord card. It supports the product world without showing fake UI or required text.
2. Hand-authored SVG icons and the live SVG chord diagram use the product’s own grid geometry.
3. A social card is composed locally from the generated still life and product palette.

## Image prompt sheet and provenance

Subject: overhead editorial still life for a guitar lesson; a blank cream lesson card, six taut black guitar strings, cropped maple fretboard, cobalt blue marker, yellow sticky paper, metal capo.

World and materials: tactile paper fibres, screen-printed ink, scratched rehearsal-room desk, precise geometry, modest physical wear.

Light and lens: hard noon side light, crisp offset shadows, overhead 50mm editorial composition.

Palette words: warm cream, carbon black, safety yellow, cobalt blue, tiny muted red accent.

Negative list: no words, no letters, no notation, no logo, no watermark, no people, no hands, no branded guitar, no impossible strings, no gradients, no glossy 3D render.

Generation command: `/opt/fleet/lib/gen-image.sh` with the prompt above, `1536x1024`, high quality. Model deployment: factory-image through Azure AI Foundry. Generated on 2026-08-28. The selected image is original to this product. Source candidates and prompt sidecars live in `assets/src/`; optimized WebP derivatives live in `public/assets/`.
