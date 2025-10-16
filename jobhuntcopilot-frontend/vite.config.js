import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Avoid CORS
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5050', // backend port
        changeOrigin: true
      }
    }
  }
})



