import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_URL || '/', // Usar la variable de entorno para base
  plugins: [react(), tailwindcss()],
  server: {
    host: true, 
    port: 80,
    watch:{
      usePolling: true,
    },
  },
});
