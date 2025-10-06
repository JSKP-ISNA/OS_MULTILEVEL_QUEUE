import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

export default defineConfig(async () => {
  // dynamically import the ESM-only plugin to avoid require() loading issues
  const reactPlugin = (await import('@vitejs/plugin-react')).default

  // ESM-safe __dirname equivalent (works correctly on Windows)
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  return {
    plugins: [reactPlugin()],
    resolve: { alias: { '@': path.resolve(__dirname, 'src') } }
  }
})
