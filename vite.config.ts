import vitePluginString from 'vite-plugin-string'
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vitePluginString.default({
    include: [
      '**/*.md',
    ],
    exclude: 'node_modules/**',
  })],
  build: {
    manifest: true,
    rollupOptions: {
      input: ['/client-entry.tsx'],
    },
  },
});
