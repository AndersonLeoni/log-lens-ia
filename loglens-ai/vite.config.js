import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // TECH LEAD NOTE: Altere 'loglens-ai' para o nome do seu repositório no GitHub
  base: '/loglens-ai/', 
})