import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'
import fs from 'fs'

// 1. Leemos el archivo JSON
const productosData = JSON.parse(fs.readFileSync('./public/productos.json', 'utf-8'))

// 2. Extraemos los slugs dinámicamente
const rutasProductos = productosData.map(p => `/producto/${p.slug}`)

export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://correatools.com.co/',
      dynamicRoutes: [
        '/', 
        '/contactenos', 
        '/productos',
        ...rutasProductos // Inyecta todos los slugs del JSON automáticamente
      ],
      outDir: 'dist',
    })
  ],
  base: '/',
})
