import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages는 /<repo>/ 하위 경로로 서빙되므로 상대 경로(base: './')로 빌드한다.
export default defineConfig({
  base: './',
  plugins: [react()],
})
