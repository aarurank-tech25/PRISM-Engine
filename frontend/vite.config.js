import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api/market': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true
      },
      '/demo': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/analyze': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/student': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/parent': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/assessment': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/roadmap': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      }
    }
  }
})
