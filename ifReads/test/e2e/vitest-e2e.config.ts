import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TEST_DB_URL =
  'postgresql://beatriz:beatriz123@localhost:5433/if-reads-test';

export default defineConfig({
  test: {
    root: path.resolve(__dirname, '../..'),
    include: ['test/e2e/**/*.e2e.spec.ts'],
    globalSetup: ['./test/global-setup.ts'],
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 60_000,
    env: {
      DATABASE_URL: TEST_DB_URL,
      JWT_SECRET: 'test-secret-key',
      JWT_EXPIRATION: '24h',
    },
  },
});
