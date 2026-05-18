// @ts-nocheck
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// função para resolver os assets exportados do figma
function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
      return null;
    },
  }
}

export default defineConfig({
  // base configurada para repositório do github pages
  base: '/VemCAR-APP-de-viagens/', 
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // atalho @ para a pasta src, padrão em projetos TADS
      '@': path.resolve(__dirname, './src'),
    },
  },

  // tipos de arquivos suportados para importação bruta
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})