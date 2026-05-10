import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import WaFloat from '../components/WaFloat.jsx'
import Footer from '../components/Footer.jsx'
import { useProductos } from '../hooks/useProductos.js'

const BASE = import.meta.env.BASE_URL

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-line" style={{ width: '60%' }} />
        <div className="skeleton skeleton-line" style={{ width: '40%', height: '10px' }} />
        <div className="skeleton skeleton-line" style={{ width: '100%', marginTop: '16px' }} />
        <div className="skeleton skeleton-line" style={{ width: '100%' }} />
        <div className="skeleton skeleton-line" style={{ width: '80%' }} />
      </div>
    </div>
  )
}

function ProductCard({ producto, index, searchTerm }) {
  const imgSrc = BASE + 'img/' + producto.imagen

  const highlight = (text) => {
    if (!searchTerm.trim()) return text
    const regex = new RegExp('(' + searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi')
    const parts = text.split(regex)
    return parts.map((part, i) =>
      regex.test(part)
        ? <mark key={i} style={{ background: 'var(--orange)', color: '#fff', borderRadius: '2px', padding: '0 2px' }}>{part}</mark>
        : part
    )
  }

  return (
    <Link to={'/producto/' + producto.slug} className="product-card">
      <span className="product-num">{String(index + 1).padStart(2, '0')}</span>
      <div className="product-img-wrap">
        <img src={imgSrc} alt={producto.nombre}
          onError={e => { e.target.style.display = 'none'; e.target.nextSibling && (e.target.nextSibling.style.display = 'flex') }}
        />
        <div className="product-img-placeholder" style={{ display: 'none' }}>🔧</div>
      </div>
      <div className="product-body">
        <span className="product-cat">{producto.categoria}</span>
        <h3 className="product-name">{highlight(producto.nombre)}</h3>
        <p className="product-desc">{producto.descripcion}</p>
        <span className="product-link">
          Ver producto
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </span>
      </div>
    </Link>
  )
}

export default function Productos() {
  const { productos, loading, error } = useProductos()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const categorias = useMemo(() => {
    const cats = [...new Set(productos.map(p => p.categoria))]
    return ['Todos', ...cats]
  }, [productos])

  const productosFiltrados = useMemo(() => {
    return productos.filter(p => {
      const matchCat = categoriaActiva === 'Todos' || p.categoria === categoriaActiva
      const q = searchTerm.toLowerCase().trim()
      const matchSearch = !q ||
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [productos, categoriaActiva, searchTerm])

  const hayFiltros = searchTerm || categoriaActiva !== 'Todos'

  return (
    <>
      <Navbar onSearch={setSearchTerm} searchValue={searchTerm} />

      <div className="subpage-wrap">
        {/* Header de sección */}
        <div className="subpage-hero">
          <div className="hero-bg" />
          <div className="hero-grid" />
          <div className="subpage-hero-content">
            <span className="section-label">Catálogo completo</span>
            <h1 className="subpage-title">EQUIPOS Y <em>HERRAMIENTAS</em></h1>
            <p className="subpage-sub">Soluciones profesionales para servitecas y talleres automotrices.</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="subpage-content">
          {!loading && !error && (
            <div className="filtros-wrap">
              <div className="filtros-search-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  type="text" className="filtros-search"
                  placeholder="Buscar en productos..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className="filtros-search-clear" onClick={() => setSearchTerm('')} aria-label="Limpiar">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                )}
              </div>

              <div className="filtros-categorias">
                {categorias.map(cat => (
                  <button key={cat}
                    className={'filtro-btn' + (categoriaActiva === cat ? ' active' : '')}
                    onClick={() => setCategoriaActiva(cat)}
                  >
                    {cat}
                    {cat !== 'Todos' && (
                      <span className="filtro-count">{productos.filter(p => p.categoria === cat).length}</span>
                    )}
                  </button>
                ))}
              </div>

              {hayFiltros && (
                <div className="filtros-resultado">
                  {productosFiltrados.length === 0 ? 'Sin resultados'
                    : productosFiltrados.length + ' producto' + (productosFiltrados.length !== 1 ? 's' : '')}
                  <button className="filtros-limpiar" onClick={() => { setSearchTerm(''); setCategoriaActiva('Todos') }}>
                    Limpiar filtros ×
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="productos-grid">
            {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            {error && (
              <div style={{ color: 'var(--gray)', gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
                ⚠️ {error}
              </div>
            )}
            {!loading && !error && productosFiltrados.length === 0 && (
              <div className="no-resultados">
                <span style={{ fontSize: 48 }}>🔍</span>
                <p>No encontramos productos para <strong>"{searchTerm || categoriaActiva}"</strong></p>
                <button className="btn-primary" onClick={() => { setSearchTerm(''); setCategoriaActiva('Todos') }}>
                  Ver todos los productos
                </button>
              </div>
            )}
            {!loading && !error && productosFiltrados.map((p, i) => (
              <ProductCard key={p.id} producto={p} index={i} searchTerm={searchTerm} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
      <WaFloat />
    </>
  )
}
