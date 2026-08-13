import { resolve } from 'path'

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@forms': resolve(__dirname, 'src'),
      '@ds': resolve(__dirname, '../ds/src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [resolve(__dirname, '../ds/src/test/setup.ts')],
  },
})
