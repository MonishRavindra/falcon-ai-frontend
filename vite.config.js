import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/falcon-ai-frontend/', // ← Your repo name
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})