import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// vite.config.js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://www.hs-api.devfunval.cloud',
        changeOrigin: true,
        secure: false,
        // Al usar 'rewrite', aseguras que el /api no se duplique si el backend no lo espera
        rewrite: (path) => path.replace(/^\/api/, '/api') 
      }
    }
  }
})