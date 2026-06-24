import { defineConfig } from 'vite';

export default defineConfig({
  // Root of the project
  root: '.',

  // Dev server settings
  server: {
    port: 3000,
    open: true,
  },

  // Build output folder
  build: {
    outDir: 'dist',
  },
});