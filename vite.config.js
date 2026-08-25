import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Tailwind v4 플러그인 유지
  ],
  base: '/vtoltech-drone/', // GitHub 저장소 이름과 정확히 일치하는 서브 경로
})