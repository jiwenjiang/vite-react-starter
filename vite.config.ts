import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // 如何 __dirname 找不到 需要 yarn add @types/node --save-dev
      '@': path.resolve(__dirname, 'src'), // 别名
    },
  },
  plugins: [reactRefresh()],
});
