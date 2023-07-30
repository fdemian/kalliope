import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        cssInjectedByJsPlugin()
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/Kalliope/index.ts'),
            name: 'kalliope',
            fileName: 'kalliope'
        },
        rollupOptions: {
            external: ['react'],
            output: {
                globals: {
                    react: 'React'
                },
                exports: "named"
            }
        }
    }
});