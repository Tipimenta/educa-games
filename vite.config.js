import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: parseInt(env.VITE_DEV_SERVER_PORT) || 5172,
      proxy: {
        '/api': env.VITE_API_PROXY_TARGET || 'http://localhost:8080',
      },
    },
  };
});
