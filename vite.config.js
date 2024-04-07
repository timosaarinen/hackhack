import { defineConfig } from 'vite';
//import legacy from '@vitejs/plugin-legacy';
import glsl from 'vite-plugin-glsl';
import path from 'path';

export default defineConfig({
  plugins: [
    glsl(),
  ],
  resolve: {
    alias: {
      //'islefire-xr': path.resolve(__dirname, './ext/islefire-xr/dist/islefire-xr.js'),
      'islefire-xr': path.resolve(__dirname, './ext/islefire-xr'),
      '@asset': path.resolve(__dirname, 'asset')
    }
  }
})
