import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // FIX: __dirname is not available in ES modules.
      // The `import.meta.url` approach is the modern standard for resolving file paths.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'pages': fileURLToPath(new URL('./pages', import.meta.url)),
    }
  }
})
