import { describe, expect, it } from 'vitest';
import { decodeSyntax, encodeSyntax, parseSyntax, sampleSyntax } from './model';

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
});
