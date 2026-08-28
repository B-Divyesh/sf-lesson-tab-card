import { describe, expect, it } from 'vitest';
import { chordGrid } from './card-svg';
import type { Card } from './model';

describe('chord diagram recovery', () => {
  it('does not create SVG NaN coordinates for an invalid fret token', () => {
    const card: Card = {
      title: 'Broken',
      chord: 'C',
      frets: ['x', '3', 'bad', '0', '1', '0'],
      fingers: ['x', '3', '2', '0', '1', '0'],
      capo: 99,
      tab: [],
      note: '',
    };

    const svg = chordGrid(card);
    expect(svg).not.toContain('NaN');
    expect(svg).not.toMatch(/(?:cy|y)="[^"\d.-]*NaN/);
  });
});
