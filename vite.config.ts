import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
  build: {
    target: 'es2022',
    sourcemap: true,
  },
  server: {
    host: '127.0.0.1',
  },
});
