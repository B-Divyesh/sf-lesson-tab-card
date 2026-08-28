export type Card = {
  title: string;
  chord: string;
  frets: string[];
  fingers: string[];
  capo: number;
  tab: string[];
  note: string;
};

export type ParseResult = { card: Card | null; errors: string[] };

export const sampleSyntax = `title: G to C change
chord: G
frets: 3 2 0 0 0 3
fingers: 2 1 0 0 0 3
capo: 0
tab:
e|--3---3---0---0--|
B|--0---0---1---1--|
G|--0---0---0---0--|
D|--0---0---2---2--|
A|--2---2---3---3--|
E|--3---3----------|
note: Count four beats. Keep every change quiet.`;

const emptyCard = (): Card => ({
  title: '', chord: '', frets: [], fingers: [], capo: 0, tab: [], note: '',
});

export function parseSyntax(source: string): ParseResult {
  if (!source.trim()) return { card: null, errors: [] };
  if (source.length > 4000) return { card: null, errors: ['The card is over 4,000 characters. Shorten it and try again.'] };

  const card = emptyCard();
  const errors: string[] = [];
  const lines = source.replace(/\r/g, '').split('\n');
  let readingTab = false;

  lines.forEach((raw, index) => {
    const line = raw.trimEnd();
    const number = index + 1;
    if (!line.trim()) return;

    if (readingTab && /^[eBGDAE]\|/.test(line.trim())) {
      card.tab.push(line.trim());
      return;
    }
    readingTab = false;

    const match = line.match(/^([a-z]+):\s*(.*)$/i);
    if (!match) {
      errors.push(`Line ${number} is not recognised. Start it with title:, chord:, frets:, fingers:, capo:, tab:, or note:.`);
      return;
    }
    const [, rawKey, rawValue] = match;
    const key = rawKey.toLowerCase();
    const value = rawValue.trim();
    if (key === 'title') card.title = value.slice(0, 60);
    else if (key === 'chord') card.chord = value.slice(0, 16);
    else if (key === 'frets') card.frets = value.split(/\s+/).filter(Boolean);
    else if (key === 'fingers') card.fingers = value.split(/\s+/).filter(Boolean);
    else if (key === 'capo') {
      const capo = Number(value);
      if (!Number.isInteger(capo) || capo < 0 || capo > 12) errors.push(`Line ${number} has an invalid capo. Use a whole number from 0 to 12.`);
      else card.capo = capo;
    } else if (key === 'tab') {
      if (value) errors.push(`Line ${number} starts the tab. Put each string on the next line.`);
      readingTab = true;
    } else if (key === 'note') card.note = value.slice(0, 140);
    else errors.push(`Line ${number} uses “${key}:”. Use title:, chord:, frets:, fingers:, capo:, tab:, or note:.`);
  });

  if (!card.title) errors.push('Add a title: line so the student knows what to practise.');
  if (!card.chord) errors.push('Add a chord: line, such as chord: G.');
  validateSix(card.frets, 'frets', errors, (value) => value === 'x' || /^(0|[1-9]|1[0-2])$/.test(value));
  validateSix(card.fingers, 'fingers', errors, (value) => value === 'x' || /^[0-4]$/.test(value));
  if (card.frets.length === 6 && card.fingers.length === 6) {
    card.frets.forEach((fret, index) => {
      if ((fret === 'x' || fret === '0') && !['x', '0'].includes(card.fingers[index])) {
        errors.push(`Finger ${index + 1} must be 0 or x because that string is ${fret === 'x' ? 'muted' : 'open'}.`);
      }
    });
  }
  if (card.tab.length && card.tab.length !== 6) errors.push(`The tab has ${card.tab.length} strings. Add all 6 strings from e to E.`);
  if (card.tab.length === 6) {
    const expected = ['e', 'B', 'G', 'D', 'A', 'E'];
    card.tab.forEach((line, i) => {
      if (line[0] !== expected[i]) errors.push(`Tab string ${i + 1} must start with ${expected[i]}|.`);
      if (line.length > 42) errors.push(`Tab string ${i + 1} is too long. Keep it under 40 tab characters.`);
      if (!/^[eBGDAE]\|[-0-9hpsb\/\\~x()|]+$/.test(line)) errors.push(`Tab string ${i + 1} contains a character this card cannot print.`);
    });
  }
  return { card, errors };
}

function validateSix(values: string[], label: string, errors: string[], valid: (value: string) => boolean) {
  if (values.length !== 6) {
    errors.push(`The ${label}: line needs 6 values, from low E to high e.`);
    return;
  }
  values.forEach((value, index) => {
    if (!valid(value)) errors.push(`${label[0].toUpperCase() + label.slice(1)} value ${index + 1} is invalid.`);
  });
}

export function encodeSyntax(source: string): string {
  const bytes = new TextEncoder().encode(source);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function decodeSyntax(encoded: string): string | null {
  try {
    const value = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const decoded = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    return decoded.length <= 4000 ? decoded : null;
  } catch {
    return null;
  }
}
