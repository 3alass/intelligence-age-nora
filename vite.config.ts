import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    // 1. THIS IS THE CRITICAL FIX: Ensure slashes are exactly like this
    base: '/intelligence-age-nora/', 

    plugins: [
      react(),
      tailwindcss(),
    ],
    define: {
      // 2. Ensuring the API key maps correctly from GitHub Secrets
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        // 3. Ensuring path resolution works for your folder structure
        '@': path.resolve(__dirname, './'),
      },
    },
    build: {
      // 4. Force assets to stay relative to the base path
      outDir: 'dist',
      assetsDir: 'assets',
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
