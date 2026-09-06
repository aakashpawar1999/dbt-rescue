import { cloudflare } from '@cloudflare/vite-plugin'
import { sites } from '@openai/sites-vite-plugin'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    sites(),
    ...cloudflare({ inspectorPort: false, config: { main: './worker/index.ts', assets: { binding: 'ASSETS' } } }),
  ],
})
