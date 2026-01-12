import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@siemens/ix', '@siemens/ix-react']
  },
  publicDir: 'public',
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    copyPublicDir: true
  },
  server: {
    port: 5173,
    strictPort: false,
    open: true
  }
});