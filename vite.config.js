import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: true,
    sourcemap: false,
  },
  server: {
    port: 2222,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "src/styles/variables";`,
        includePaths: ["src/styles"],
      },
    },
  },
})
