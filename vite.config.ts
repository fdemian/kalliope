import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import typescript from '@rollup/plugin-typescript';

const resolvePath = (str: string) => resolve(__dirname, str)


// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const buildMode = command === "build" ? "production" : "development";
    return {
        plugins: [
            react(),
            cssInjectedByJsPlugin(),
            typescript(
                {
                    'target': 'es2020',
                    'rootDir': resolvePath('./src/Kalliope'),
                    'declaration': true,
                    'declarationDir': resolvePath('./dist'),
                    exclude: resolvePath('../node_modules/**'),
                    allowSyntheticDefaultImports: true
                  }
            )
        ],
        build: {
            lib: {
                entry: resolve(__dirname, 'src/Kalliope/kalliope.ts'),
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
            },
        },
        define: {
            'process.env.NODE_ENV': JSON.stringify(buildMode),
            'process.env.IS_PREACT': 'false'
        },
    }
});