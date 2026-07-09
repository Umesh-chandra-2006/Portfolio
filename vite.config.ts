import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/three') || id.includes('node_modules/gsap')) {
            return 'vendor';
          }
          if (id.includes('node_modules/@react-three')) {
            return 'three-helpers';
          }
        }
      }
    }
  },
  server: {
    open: true
  }
});