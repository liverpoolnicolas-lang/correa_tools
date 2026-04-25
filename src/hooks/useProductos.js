import { useState, useEffect } from 'react'

// Ajusta el base a la ruta de tu repo de GitHub Pages
const BASE = import.meta.env.BASE_URL

export function useProductos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${BASE}productos.json`)
      .then(r => {
        if (!r.ok) throw new Error('No se pudo cargar productos.json')
        return r.json()
      })
      .then(data => {
        // Agrega slug automático si no viene en el JSON
        const con_slug = data.map(p => ({
          ...p,
          slug: p.slug || p.nombre.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim().replace(/\s+/g, '-')
        }))
        setProductos(con_slug)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { productos, loading, error }
}
