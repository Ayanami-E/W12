export default defineConfig({
    server: {
      port: 3000, // 设置React应用的端口
      proxy: {
        '/api': {
          target: 'http://localhost:1234',
          changeOrigin: true,
        },
      },
    },
  })
  