import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANTE: cambia 'correa_tools' por el nombre exacto de tu repositorio en GitHub
// Por ejemplo, si tu repo es github.com/juan/correa_tools, el base es '/correa_tools/'
export default defineConfig({
  plugins: [react()],
  base: '/correa_tools/',
})
