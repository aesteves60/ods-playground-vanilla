import { defineConfig } from 'vite'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: 'ods-playground-vanilla/',
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './src/app'),
    },
  },
})
