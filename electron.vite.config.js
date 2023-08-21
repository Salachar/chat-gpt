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
        '@ipc': resolve('src/renderer/src/ipc'),
        '@renderer': resolve('src/renderer/src'),
        '@utils': resolve('src/renderer/src/utils'),
        '@store': resolve('src/renderer/src/store'),
        '@components': resolve('src/renderer/src/components'),
        '@inputs': resolve('src/renderer/src/components/inputs'),
      }
    },
    plugins: [solid()]
  }
})
