import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [react(), tailwindcss()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
    },
    server: {
            port: 5173,
            host: '0.0.0.0',
            allowedHosts: [
                'noble.tail712397.ts.net'
            ],
            proxy: {
                '/api': {
                    target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
                }
            }
        }
})
