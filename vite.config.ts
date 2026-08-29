import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';
import { releaseLabel, siteOrigin } from './src/site-config';

export default defineConfig({
  plugins: [{
    name: 'release-metadata',
    transformIndexHtml(html) {
      return html
        .replaceAll('%SITE_ORIGIN%', siteOrigin)
        .replaceAll('%RELEASE_LABEL%', releaseLabel);
    },
  }],
  test: {
    include: ['src/**/*.test.ts'],
  },
  build: {
    target: 'es2022',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        demo: resolve(process.cwd(), 'demo/index.html'),
        privacy: resolve(process.cwd(), 'privacy/index.html'),
        terms: resolve(process.cwd(), 'terms/index.html'),
        notFound: resolve(process.cwd(), '404.html'),
      },
    },
  },
  server: {
    host: '127.0.0.1',
  },
});
