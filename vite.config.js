import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages 项目名根路径
  base: '/gray-scott-simulation/',
  plugins: [react()],
});
