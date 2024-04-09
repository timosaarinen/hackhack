import { defineConfig } from 'vite';
//import legacy from '@vitejs/plugin-legacy';
import glsl from 'vite-plugin-glsl';
//import path from 'path';

export default defineConfig({
  plugins: [
    glsl(),
  ],
  // resolve: {
  //   alias: {
  //     '@asset': path.resolve(__dirname, 'asset')
  //   }
  //}
})
