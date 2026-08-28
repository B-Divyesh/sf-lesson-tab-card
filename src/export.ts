import type { Card } from './model';
import { cardSvg, worksheetSvg } from './card-svg';

export function downloadSvg(card: Card, worksheet = false) {
  const svg = worksheet ? worksheetSvg(card) : cardSvg(card);
  download(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), `${slug(card.title)}${worksheet ? '-worksheet' : ''}.svg`);
}

export async function downloadPng(card: Card) {
  const svg = cardSvg(card);
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('The PNG could not be drawn. Export SVG instead.'));
      image.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = 1800;
    canvas.height = 1080;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('The PNG could not be drawn. Export SVG instead.');
    context.scale(2, 2);
    context.drawImage(image, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('The PNG could not be saved. Export SVG instead.');
    download(blob, `${slug(card.title)}.png`);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function download(blob: Blob, filename: string) {
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(anchor.href), 1000);
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'lesson-card';
}
