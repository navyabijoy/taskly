import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 20_000,
  use: { channel: 'chrome', baseURL: 'http://localhost:5173', viewport: { width: 1280, height: 800 } },
  webServer: { command: 'npm run dev -- --port 5173 --strictPort', url: 'http://localhost:5173', reuseExistingServer: true },
})
