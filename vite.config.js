import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        // three.js isolado em chunk próprio: cache longo e não bloqueia o carregamento inicial
        manualChunks: { three: ['three'] },
      },
    },
  },
});
