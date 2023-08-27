import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@utils': resolve('src/utils'),
        '@pages': resolve('src/renderer/src/pages'),
        '@rendererUtils': resolve('src/renderer/src/utils'),
        '@components': resolve('src/renderer/src/components'),
        '@inputs': resolve('src/renderer/src/components/inputs'),
      }
    },
    plugins: [solid()]
  }
})
