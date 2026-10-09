import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const tunnelHost = env.DEV_TUNNEL_HOST

  return {
    plugins: [react()],
    server: {
      ...(tunnelHost ? { allowedHosts: [tunnelHost] } : {}),
      proxy: {
        '/api': {
          target: env.API_PROXY_TARGET || 'http://127.0.0.1:4000',
          changeOrigin: true,
        },
      },
    },
  }
})
