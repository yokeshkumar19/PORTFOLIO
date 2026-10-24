import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './',
  publicDir: 'public',
  server: {
    port: 3000,
    open: false,
    host: '0.0.0.0'
  },
  preview: {
    port: 4173,
    open: false,
    host: '0.0.0.0'
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ritBustrack: resolve(__dirname, 'rit-bustrack.html'),
        plantcareAi: resolve(__dirname, 'plantcare-ai.html'),
        contact: resolve(__dirname, 'contact.html'),
        about: resolve(__dirname, 'about.html'),
        notFound: resolve(__dirname, '404.html')
      }
    }
  }
});
