import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/analisar': 'http://127.0.0.1:5000',
      '/valid': 'http://127.0.0.1:5000',
      '/results': 'http://127.0.0.1:5000',
    },
  },
})
