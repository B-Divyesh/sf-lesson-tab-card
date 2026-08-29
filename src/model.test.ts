import { describe, expect, it } from 'vitest';
import { decodeSyntax, encodeSyntax, parseSyntax, printableLimits, sampleSyntax } from './model';

describe('lesson syntax', () => {
  it('parses the complete sample', () => {
    const result = parseSyntax(sampleSyntax);
    expect(result.errors).toEqual([]);
    expect(result.card?.title).toBe('G to C change');
    expect(result.card?.frets).toEqual(['3', '2', '0', '0', '0', '3']);
    expect(result.card?.tab).toHaveLength(6);
  });

  it('names the line and fix for untrusted syntax', () => {
    const result = parseSyntax('title: Test\nchord: C\nfrets: x 3 WHAT 0 1 0\nfingers: x 3 2 0 1 0\ncapo: 99\nnoise');
    expect(result.errors.join(' ')).toContain('Line 5 has an invalid capo');
    expect(result.errors.join(' ')).toContain('Line 6 is not recognised');
    expect(result.errors.join(' ')).toContain('Frets value 3 is invalid');
  });

  it('round trips Unicode share text', () => {
    const value = `${sampleSyntax}\nnote: Café rhythm`;
    expect(decodeSyntax(encodeSyntax(value))).toBe(value);
    expect(decodeSyntax('not valid !!!')).toBeNull();
  });

  it('rejects text that cannot fit the printable card without changing it', () => {
    const title = 'T'.repeat(printableLimits.title + 1);
    const chord = 'C'.repeat(printableLimits.chord + 1);
    const note = 'N'.repeat(printableLimits.note + 1);
    const source = `title: ${title}\nchord: ${chord}\nfrets: x 3 2 0 1 0\nfingers: x 3 2 0 1 0\ncapo: 0\nnote: ${note}`;
    const result = parseSyntax(source);
    expect(result.errors.join(' ')).toContain('Line 1 title is too long');
    expect(result.errors.join(' ')).toContain('Line 2 chord is too long');
    expect(result.errors.join(' ')).toContain('Line 6 note is too long');
    expect(result.card).toMatchObject({ title, chord, note });
  });

  it('accepts 4,000 source characters and rejects 4,001 with the recovery message', () => {
    const prefix = 'title: A\n';
    const atLimit = prefix + ' '.repeat(4_000 - prefix.length);
    const overLimit = `${atLimit} `;
    expect(parseSyntax(atLimit).card).not.toBeNull();
    expect(parseSyntax(atLimit).errors).not.toContain('The card is over 4,000 characters. Shorten it and try again.');
    expect(parseSyntax(overLimit)).toEqual({
      card: null,
      errors: ['The card is over 4,000 characters. Shorten it and try again.'],
    });
  });
});
