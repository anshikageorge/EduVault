
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Explicitly inject process.env.API_KEY for Vercel and build tools
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
});
