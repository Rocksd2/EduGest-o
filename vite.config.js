import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // Caminhos relativos: funciona na raiz e em subdiretórios (GitHub Pages).
  base: './',
  plugins: [vue()],
})
