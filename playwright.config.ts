import { defineConfig } from '@playwright/test'

// Gecko runs the app itself on a free port and passes its URL in GECKO_BASE_URL.
const external = process.env.GECKO_BASE_URL ?? process.env.REPRO_BASE_URL

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    channel: 'chrome',
    baseURL: external ?? 'http://localhost:5173',
    viewport: { width: 1280, height: 800 },
  },
  webServer: external
    ? undefined
    : { command: 'npm run dev -- --port 5173 --strictPort', url: 'http://localhost:5173', reuseExistingServer: true },
})
