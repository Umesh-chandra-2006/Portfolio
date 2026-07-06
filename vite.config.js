import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'three', 'gsap'],
          threeHelpers: ['@react-three/fiber', '@react-three/drei']
        }
      }
    }
  },
  server: {
    open: true
  }
});
