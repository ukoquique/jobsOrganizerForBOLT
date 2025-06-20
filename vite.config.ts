import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const portFile = path.resolve(__dirname, 'server', '.tmp', '.port');
let backendPort = 3001; // Default port

if (fs.existsSync(portFile)) {
  backendPort = parseInt(fs.readFileSync(portFile, 'utf8'), 10);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
