import reactRefresh from '@vitejs/plugin-react-refresh';
import path from 'path';
import { defineConfig } from 'vite';
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // 如何 __dirname 找不到 需要 yarn add @types/node --save-dev
      '@': path.resolve(__dirname, 'src'), // 别名
    },
  },
  plugins: [reactRefresh()],
  server: {
    port: 3000,
    open: false, //自动打开
    base: './ ', //生产环境路径
    proxy: {
      // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
      // 正则表达式写法
      '^/recovery-wx': {
        //将www.exaple.com印射为/apis
        target: 'http://platform-test.fushuhealth.com', // 接口域名
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, //是否跨域
      },
    },
  },
});
