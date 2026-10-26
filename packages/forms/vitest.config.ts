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
    /* Cinco pacotes rodam juntos sob `turbo test`; sem teto cada um abria um
     * worker por núcleo e os 16 da máquina viravam ~75 processos. */
    maxWorkers: 3,
    environment: 'jsdom',
    globals: true,
    setupFiles: [resolve(__dirname, '../ds/src/test/setup.ts')],
  },
})
