import {fileURLToPath, URL} from "node:url";
import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import path from "path"; // Đảm bảo đã import path

export default defineConfig({
  plugins: [
    vue(), // Plugin Vue để hỗ trợ Vue.js
    vueDevTools(), // Plugin Vue DevTools để hỗ trợ debugging với Vue DevTools
  ],
  resolve: {
    alias: { // <-- Gộp tất cả alias vào đây
      '@': path.resolve(__dirname, 'src'), // Alias để import từ src dễ dàng
      'vue': 'vue/dist/vue.esm-bundler.js', // Alias cho Vue để hỗ trợ runtime compilation
      // Nếu bạn muốn dùng cách fileURLToPath cho '@':
      // '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    global: "window", // 🛠 Thêm dòng này để fix lỗi "global is not defined"
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Địa chỉ backend Spring Boot
        changeOrigin: true, // Tránh lỗi CORS
      },
      // "/api": {
      //   target: "http://localhost:8080",
      //   changeOrigin: true,
      // },
      "/ws": {
        target: "http://localhost:8080",
        ws: true, // ⚠️ Quan trọng: bật hỗ trợ WebSocket
        changeOrigin: true,
        secure: false,
      },
      // '/danh-muc-hien-thi': { // <-- Đường dẫn mà frontend gọi
      //   target: 'http://localhost:8080', // <-- Địa chỉ của backend Spring Boot API
      //   changeOrigin: true, // Quan trọng để xử lý CORS
      //   // rewrite: (path) => path.replace(/^\/danh-muc-hien-thi/, '/danh-muc-hien-thi'), // Có thể không cần dòng này nếu path trùng khớp
      // },
    },
  },
});