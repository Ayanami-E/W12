import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:1234', // This should match your Express server port
        changeOrigin: true,
      },
    },
    port: 3000,  // React app should run on port 3000
  },
});
