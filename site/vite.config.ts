import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import { fileURLToPath } from 'node:url';

export default defineConfig(({ isSsrBuild }) => ({
  base: './',
  publicDir: isSsrBuild ? false : 'public',
  plugins: [react()],
  css: { postcss: { plugins: [tailwindcss()] } },
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  build: {
    outDir: '.dist',
    emptyOutDir: true,
    assetsDir: 'assets',
  },
}));
