import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  // Change this to whatever port you want
    proxy: {
      '/api': 'http://localhost:3000',  // Proxy API requests to your backend
    },
  },
});
