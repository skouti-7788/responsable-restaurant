import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
    // restaurantCache.test.js uses Node's built-in test runner (node:test),
    // run it separately with `node --test src/utils/restaurantCache.test.js`.
    exclude: ['node_modules/**', 'src/utils/restaurantCache.test.js'],
  },
})
