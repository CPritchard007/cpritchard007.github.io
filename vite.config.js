import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // For GitHub Pages: set this to "/<repo-name>/"
  // You can also set it via GitHub Actions by writing VITE_BASE.
  base: process.env.VITE_BASE ?? '/',
})
