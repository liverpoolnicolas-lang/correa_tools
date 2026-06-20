import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import WaFloat from '../components/WaFloat.jsx'
import Footer from '../components/Footer.jsx'
import { useProductos } from '../hooks/useProductos.js'

const BASE = import.meta.env.BASE_URL

// ── MARCAS (agrega aquí las nuevas cuando quieras) ──
const MARCAS = [
  { id: 'Ravaglioli', desc: 'Equipos de alineación, elevadores y desmontadoras', logo: 'ravaglioli.png' },
  { id: 'KND',        desc: 'Herramientas de diagnóstico y kits de distribución', logo: 'knd.png' },
  { id: 'TK',         desc: 'Todo lo que tu taller necesita desmontadoras, compresores y equipos de alto desempeño', logo: 'tk.png' },
  { id: 'Snap-on',    desc: 'Ver catálogo completo en PDF', logo: 'snapon.png', pdfDirecto: BASE + 'catalogo-snapon.pdf' },
]

// ── ICONOS POR SUBCATEGORÍA ──
const ICONS = {
  'Alineadores de ruedas':       '🎯',
  'Elevadores':                  '⬆️',
  'Desmontadoras de neumáticos': '🔄',
  'Herramientas de diagnóstico': '🔬',
  'Kits de distribución':        '⚙️',
}

// Subcategorías de KND que muestran la tarjeta "Ver más productos" (catálogo PDF)
const SUBCATS_CON_CATALOGO = ['Herramientas de diagnóstico', 'Kits de distribución']
const CATALOGO_PDF_URL = BASE + 'catalogo-knd.pdf'
const WA_NUM_1 = '573197163830'
const WA_NUM_2 = '573028578631'

// ── TARJETA DE PRODUCTO ──
function ProductCard({ producto, index }) {
  return (
    <Link to={'/producto/' + producto.slug} className="product-card">
      <span className="product-num">{String(index + 1).padStart(2, '0')}</span>
      <div className="product-img-wrap">
        <img src={BASE + 'img/' + producto.imagen} alt={producto.nombre}
          onError={e => { e.target.style.display = 'none'; e.target.nextSibling && (e.target.nextSibling.style.display = 'flex') }}
        />
        <div className="product-img-placeholder" style={{ display: 'none' }}>🔧</div>
      </div>
      <div className="product-body">
        <span className="product-cat">{producto.subcategoria}</span>
        <h3 className="product-name">{producto.nombre}</h3>
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

// ── SKELETON ──
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-line" style={{ width: '60%' }} />
        <div className="skeleton skeleton-line" style={{ width: '100%', marginTop: 12 }} />
        <div className="skeleton skeleton-line" style={{ width: '80%' }} />
      </div>
    </div>
  )
}

// ── TARJETA "VER MÁS PRODUCTOS" (catálogo PDF de KND) ──
function CatalogoCard() {
  const msg = encodeURIComponent('Hola, vi el catálogo de KND y quiero consultar precios de algunos productos 🔧')
  return (
    <div className="catalogo-card">
      <div className="catalogo-card-icon">📄</div>
      <h3 className="catalogo-card-title">¿No encuentras lo que buscas?</h3>
      <p className="catalogo-card-desc">
        Mira nuestro catálogo completo de KND con muchos más productos disponibles.
      </p>
      <a
        href={CATALOGO_PDF_URL}
        target="_blank"
        rel="noreferrer"
        className="catalogo-card-link"
      >
        Mira más productos aquí
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
      <div className="catalogo-card-wa-row">
        <a
          className="catalogo-card-wa-btn"
          href={`https://wa.me/${WA_NUM_1}/?text=${msg}`}
          target="_blank"
          rel="noreferrer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374A9.86 9.86 0 0 1 2.166 11.9c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
          </svg>
          319 716 3830
        </a>
        <a
          className="catalogo-card-wa-btn"
          href={`https://wa.me/${WA_NUM_2}/?text=${msg}`}
          target="_blank"
          rel="noreferrer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374A9.86 9.86 0 0 1 2.166 11.9c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
          </svg>
          302 857 8631
        </a>
      </div>
    </div>
  )
}

// ── PÁGINA PRINCIPAL ──
export default function Productos() {
  const { productos, loading } = useProductos()

  // nivel: 'marcas' | 'subcats' | 'productos'
  const [marcaActiva,  setMarcaActiva]  = useState(null)
  const [subcatActiva, setSubcatActiva] = useState(null)
  const [busqueda,     setBusqueda]     = useState('')

  useEffect(() => { window.scrollTo(0, 0) }, [])
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [marcaActiva, subcatActiva])

  // Subcategorías disponibles para la marca activa
  const subcats = useMemo(() => {
    if (!marcaActiva) return []
    return [...new Set(
      productos
        .filter(p => p.categoria === marcaActiva)
        .map(p => p.subcategoria || 'General')
    )]
  }, [productos, marcaActiva])

  // Productos del nivel 3
  const productosFiltrados = useMemo(() => {
    if (!marcaActiva || !subcatActiva) return []
    return productos.filter(p =>
      p.categoria === marcaActiva &&
      (p.subcategoria || 'General') === subcatActiva &&
      (!busqueda.trim() ||
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(busqueda.toLowerCase()))
    )
  }, [productos, marcaActiva, subcatActiva, busqueda])

  const nivel = !marcaActiva ? 'marcas' : !subcatActiva ? 'subcats' : 'productos'
  const conteo = (id) => productos.filter(p => p.categoria === id).length

  // ── IR ATRÁS ──
  const goBack = () => {
    if (subcatActiva) { setSubcatActiva(null); setBusqueda('') }
    else if (marcaActiva) { setMarcaActiva(null) }
  }

  return (
    <>
      <Navbar />

      <div className="subpage-wrap">

        {/* ── CABECERA ── */}
        <div className="cat-header">
          {/* Breadcrumb */}
          <div className="cat-breadcrumb">
            <button
              className={'cat-bc' + (!marcaActiva ? ' cat-bc-active' : '')}
              onClick={() => { setMarcaActiva(null); setSubcatActiva(null); setBusqueda('') }}
            >
              Marcas
            </button>
            {marcaActiva && <>
              <span className="cat-bc-sep">›</span>
              <button
                className={'cat-bc' + (!subcatActiva ? ' cat-bc-active' : '')}
                onClick={() => { setSubcatActiva(null); setBusqueda('') }}
              >
                {marcaActiva}
              </button>
            </>}
            {subcatActiva && <>
              <span className="cat-bc-sep">›</span>
              <span className="cat-bc cat-bc-active">{subcatActiva}</span>
            </>}
          </div>

          {/* Título dinámico */}
          <div className="cat-header-title">
            {nivel === 'marcas' && <><h1>Selecciona una <em>marca</em></h1><p>Elige la marca para ver sus categorías y productos.</p></>}
            {nivel === 'subcats' && <><h1>Categorías de <em>{marcaActiva}</em></h1><p>Elige una categoría para ver los productos.</p></>}
            {nivel === 'productos' && <h1><em>{subcatActiva}</em> — {marcaActiva}</h1>}
          </div>
        </div>

        {/* ── CONTENIDO ── */}
        <div className="cat-body">

          {/* NIVEL 1 — MARCAS */}
          {nivel === 'marcas' && (
            <div className="marcas-grid">
              {MARCAS.map(m => {
                const n = conteo(m.id)
                const tienePdf = !!m.pdfDirecto
                const activa = n > 0 || tienePdf
                return (
                  <button
                    key={m.id}
                    className={'marca-card' + (!activa ? ' marca-vacia' : '')}
                    onClick={() => {
                      if (tienePdf) {
                        window.open(m.pdfDirecto, '_blank', 'noopener,noreferrer')
                      } else if (n > 0) {
                        setMarcaActiva(m.id)
                      }
                    }}
                  >
                    <div className="marca-logo-wrap">
                      <img
                        src={BASE + 'marcas/' + m.logo}
                        alt={m.id}
                        className="marca-logo-img"
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    </div>
                    <div className="marca-info">
                      <span className="marca-nombre">{m.id}</span>
                      <span className="marca-desc">{activa ? m.desc : 'Próximamente'}</span>
                    </div>
                    {tienePdf
                      ? <span className="marca-badge">📄 Ver catálogo</span>
                      : n > 0
                        ? <span className="marca-badge">{n} producto{n !== 1 ? 's' : ''}</span>
                        : <span className="marca-pronto">Próximamente</span>
                    }
                    {activa && <svg className="marca-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
                  </button>
                )
              })}
            </div>
          )}

          {/* NIVEL 2 — SUBCATEGORÍAS */}
          {nivel === 'subcats' && (
            <div className="subcats-grid">
              {subcats.length === 0
                ? <p style={{ color: 'var(--text-3)', padding: '40px 0' }}>No hay productos en esta marca aún.</p>
                : subcats.map(sub => {
                  const n = productos.filter(p => p.categoria === marcaActiva && (p.subcategoria || 'General') === sub).length
                  return (
                    <button key={sub} className="subcat-card" onClick={() => setSubcatActiva(sub)}>
                      <span className="subcat-icon">{ICONS[sub] || '🔧'}</span>
                      <div className="subcat-text">
                        <span className="subcat-nombre">{sub}</span>
                        <span className="subcat-count">{n} producto{n !== 1 ? 's' : ''}</span>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ position:'absolute', top:'50%', right:16, transform:'translateY(-50%)', color:'var(--orange)', opacity:0, transition:'opacity .2s' }} className="subcat-arrow"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  )
                })
              }
            </div>
          )}

          {/* NIVEL 3 — PRODUCTOS */}
          {nivel === 'productos' && (
            <>
              {/* Buscador */}
              <div className="filtros-search-wrap" style={{ maxWidth: 360, marginBottom: 32 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input type="text" className="filtros-search"
                  placeholder="Buscar en esta categoría..."
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                />
                {busqueda && (
                  <button className="filtros-search-clear" onClick={() => setBusqueda('')}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                )}
              </div>

              <div className="productos-grid">
                {loading && Array.from({length:4}).map((_,i) => <SkeletonCard key={i}/>)}
                {!loading && productosFiltrados.length === 0 && (
                  <div className="no-resultados" style={{ gridColumn:'1/-1' }}>
                    <span style={{fontSize:48}}>🔍</span>
                    <p>Sin resultados para <strong>"{busqueda}"</strong></p>
                    <button className="btn-primary" onClick={() => setBusqueda('')}>Limpiar búsqueda</button>
                  </div>
                )}
                {!loading && productosFiltrados.map((p,i) => <ProductCard key={p.id} producto={p} index={i}/>)}
                {!loading && marcaActiva === 'KND' && SUBCATS_CON_CATALOGO.includes(subcatActiva) && (
                  <CatalogoCard />
                )}
              </div>
            </>
          )}

        </div>
      </div>

      <Footer />
      <WaFloat />
    </>
  )
}
