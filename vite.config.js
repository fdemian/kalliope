import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        define: {
          // If you want to exposes all env variables, which is not recommended
          'process.env': env
        },
    };
});