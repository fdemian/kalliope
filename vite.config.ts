import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
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
        },
        define: {
            // If you want to exposes all env variables, which is not recommended
            'process.env': env,
            module: {}
        },
    }
    
});