import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Intercepta todas las peticiones que comiencen con /api
      '/api': {
        target: 'https://www.hs-api.devfunval.cloud',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})