import { resolve } from 'path'
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@ds': resolve(__dirname, 'src'),
    },
  },
  test: {
    /* Cinco pacotes rodam juntos sob `turbo test`; sem teto cada um abria um
     * worker por núcleo e os 16 da máquina viravam ~75 processos. */
    maxWorkers: 3,
    environment: "jsdom",
    /* Sob `turbo test` cinco pacotes disputam a CPU e as interações com
     * teclado levam bem mais que os 5s do padrão. */
    testTimeout: 15000,
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
    },
  },
});
