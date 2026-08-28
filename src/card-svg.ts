import type { Card } from './model';

const escapeXml = (value: string) => value.replace(/[<>&"']/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char] ?? char);

export function chordGrid(card: Card): string {
  const numeric = card.frets.filter((value) => /^\d+$/.test(value)).map(Number).filter(Boolean);
  const base = Math.max(...numeric, 0) > 5 ? Math.min(...numeric) : 1;
  const strings = card.frets.map((fret, index) => {
    const x = 28 + index * 28;
    if (fret === 'x' || fret === '0') {
      return `<text x="${x}" y="22" text-anchor="middle" class="open">${fret === 'x' ? '×' : '○'}</text>`;
    }
    // A partially edited card can reach the preview before validation has
    // finished. Never turn untrusted fret text into an SVG coordinate: an
    // invalid value such as "bad" would otherwise produce cy="NaN" and a
    // browser console error. Invalid values remain visible in the editor's
    // named validation message, while the diagram simply omits that dot.
    if (!/^(?:[1-9]|1[0-2])$/.test(fret)) return '';
    const relative = Number(fret) - base + 1;
    if (relative < 1 || relative > 5) return '';
    const y = 42 + (relative - 0.5) * 26;
    const finger = card.fingers[index];
    return `<circle cx="${x}" cy="${y}" r="10" class="dot"/><text x="${x}" y="${y + 4}" text-anchor="middle" class="finger">${escapeXml(finger)}</text>`;
  }).join('');
  const horizontal = Array.from({ length: 6 }, (_, i) => `<line x1="28" y1="${42 + i * 26}" x2="168" y2="${42 + i * 26}" class="fret"/>`).join('');
  const vertical = Array.from({ length: 6 }, (_, i) => `<line x1="${28 + i * 28}" y1="42" x2="${28 + i * 28}" y2="172" class="string"/>`).join('');
  return `<svg viewBox="0 0 196 190" class="chord-grid" role="img" aria-label="${escapeXml(card.chord)} chord diagram, frets ${escapeXml(card.frets.join(' '))}">
    <style>.fret,.string{stroke:#171713;stroke-width:2}.fret:first-of-type{stroke-width:5}.dot{fill:#155eef;stroke:#171713;stroke-width:2}.finger{fill:#fffdf6;font:bold 11px Arial,sans-serif}.open{fill:#171713;font:bold 18px Arial,sans-serif}.base{fill:#171713;font:bold 11px Arial,sans-serif}</style>
    ${base > 1 ? `<text x="5" y="61" class="base">${base}fr</text>` : ''}${horizontal}${vertical}${strings}
  </svg>`;
}

export function cardSvg(card: Card): string {
  const tabLines = card.tab.length ? card.tab : ['e|----------------|','B|----------------|','G|----------------|','D|----------------|','A|----------------|','E|----------------|'];
  const tab = tabLines.map((line, index) => `<text x="330" y="245" dy="${index * 24}" class="tab">${escapeXml(line)}</text>`).join('');
  const grid = chordGrid(card).replace('<svg ', '<svg x="70" y="155" width="196" height="190" ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="540" viewBox="0 0 900 540" role="img" aria-label="Lesson card for ${escapeXml(card.title)}">
    <rect width="900" height="540" fill="#171713"/>
    <path d="M20 12H868L888 32V528H20Z" fill="#fffdf6" stroke="#171713" stroke-width="4"/>
    <rect x="20" y="12" width="14" height="516" fill="#ffd84a"/>
    <style>.eyebrow{font:700 18px Arial,sans-serif;letter-spacing:2px}.title{font:900 ${card.title.length > 18 ? 28 : 42}px Arial,sans-serif}.chord{font:900 ${card.chord.length > 4 ? 44 : 68}px Arial,sans-serif}.meta{font:700 17px Arial,sans-serif}.tab{font:600 20px Consolas,monospace}.note{font:600 19px Consolas,monospace}.rule{stroke:#171713;stroke-width:3}</style>
    <text x="70" y="72" class="eyebrow">LESSON TAB CARD</text>
    <text x="70" y="125" class="title">${escapeXml(card.title)}</text>
    <line x1="70" y1="145" x2="840" y2="145" class="rule"/>
    <text x="330" y="213" class="chord">${escapeXml(card.chord)}</text>
    <text x="700" y="205" class="meta">CAPO ${card.capo || '—'}</text>
    ${grid}${tab}
    <line x1="70" y1="400" x2="840" y2="400" class="rule"/>
    <text x="70" y="446" class="eyebrow">TEACHER NOTE</text>
    <text x="70" y="483" class="note">${escapeXml(card.note || 'Add one clear practice note.')}</text>
  </svg>`;
}

export function worksheetSvg(card: Card): string {
  const single = cardSvg(card).replace(/<svg[^>]+>/, '').replace(/<\/svg>$/, '');
  const placed = [[20,20],[470,20],[20,300],[470,300]].map(([x,y]) => `<g transform="translate(${x} ${y}) scale(.48)">${single}</g>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="920" height="580" viewBox="0 0 920 580" aria-label="Four-card worksheet for ${escapeXml(card.title)}"><rect width="920" height="580" fill="#f6f0de"/>${placed}</svg>`;
}
