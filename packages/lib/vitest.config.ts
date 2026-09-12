import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    /* Cinco pacotes rodam juntos sob `turbo test`; sem teto cada um abria um
     * worker por núcleo e os 16 da máquina viravam ~75 processos. */
    maxWorkers: 3,
    environment: 'jsdom',
    globals: true,
  },
})
