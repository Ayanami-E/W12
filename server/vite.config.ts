import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:1234', // Backend port
        changeOrigin: true,
      },
    },
    port: 3000,  // React app running on port 3000
  },
});
