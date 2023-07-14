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
        '@components': resolve('src/renderer/src/components'),
        '@inputs': resolve('src/renderer/src/components/inputs'),
        '@icons': resolve('src/renderer/src/components/icons'),
        '@utils': resolve('src/renderer/src/utils'),
        '@store': resolve('src/renderer/src/store')
      }
    },
    plugins: [solid()]
  }
})
