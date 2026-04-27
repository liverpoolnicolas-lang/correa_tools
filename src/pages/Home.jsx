import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import WaFloat from '../components/WaFloat.jsx'
import { useProductos } from '../hooks/useProductos.js'

const BASE = import.meta.env.BASE_URL

const WA_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
)

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

  // Resalta el término de búsqueda en el nombre
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
        <img
          src={imgSrc}
          alt={producto.nombre}
          onError={e => {
            e.target.style.display = 'none'
            e.target.nextSibling && (e.target.nextSibling.style.display = 'flex')
          }}
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

export default function Home() {
  const { productos, loading, error } = useProductos()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')

  // Categorías únicas derivadas de los productos
  const categorias = useMemo(() => {
    const cats = [...new Set(productos.map(p => p.categoria))]
    return ['Todos', ...cats]
  }, [productos])

  // Filtrado combinado: categoría + búsqueda
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

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    }, 100)
    return () => { clearTimeout(timer); observer.disconnect() }
  }, [productosFiltrados])

  const hayFiltros = searchTerm || categoriaActiva !== 'Todos'

  return (
    <>
      <Navbar onSearch={setSearchTerm} searchValue={searchTerm} />

      {/* ── HERO ── */}
      <section id="home">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="hero-badge">
            <span>Distribuidores autorizados en Colombia</span>
          </div>
          <h1 className="hero-title">
            EQUIPA<br />TU <em>TALLER</em><br />PROFESIONAL
          </h1>
          <p className="hero-sub">
            Equipos y herramientas automotrices de alta calidad para servitecas y talleres. Asesoría personalizada y envío a todo el país.
          </p>
          <div className="hero-actions">
            <a className="btn-primary" href="#productos" onClick={e => { e.preventDefault(); document.querySelector('#productos')?.scrollIntoView({ behavior: 'smooth' }) }}>
              Ver productos
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a className="btn-secondary" href="https://wa.me/+573204946978/?text=Hola%2C%20quiero%20asesor%C3%ADa%20%F0%9F%94%A7" target="_blank" rel="noreferrer">
              {WA_ICON} Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── PRODUCTOS ── */}
      <section id="productos">
        <div className="productos-header reveal">
          <span className="section-label">Nuestros productos</span>
          <h2 className="section-title">EQUIPOS Y <em>HERRAMIENTAS</em></h2>
          <p>Soluciones profesionales para servitecas y talleres automotrices. Haz clic en cualquier producto para ver más detalles.</p>
        </div>

        {/* ── FILTROS ── */}
        {!loading && !error && (
          <div className="filtros-wrap">
            {/* Búsqueda inline (alternativa / refuerzo del nav) */}
            <div className="filtros-search-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                className="filtros-search"
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

            {/* Botones de categoría */}
            <div className="filtros-categorias">
              {categorias.map(cat => (
                <button
                  key={cat}
                  className={'filtro-btn' + (categoriaActiva === cat ? ' active' : '')}
                  onClick={() => setCategoriaActiva(cat)}
                >
                  {cat}
                  {cat !== 'Todos' && (
                    <span className="filtro-count">
                      {productos.filter(p => p.categoria === cat).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Info resultados */}
            {hayFiltros && (
              <div className="filtros-resultado">
                {productosFiltrados.length === 0
                  ? 'Sin resultados'
                  : productosFiltrados.length + ' producto' + (productosFiltrados.length !== 1 ? 's' : '')}
                {hayFiltros && (
                  <button className="filtros-limpiar" onClick={() => { setSearchTerm(''); setCategoriaActiva('Todos') }}>
                    Limpiar filtros ×
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <div className="productos-grid">
          {loading && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
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
      </section>

      {/* ── CONTACTO ── */}
      <section id="contactenos">
        <div className="contacto-inner">
          <div className="contacto-left reveal">
            <span className="section-label">Contáctanos</span>
            <h2 className="section-title">VISÍTANOS O<br /><em>ESCRÍBENOS</em></h2>
            <div className="contacto-info">
              {[
                { icon: '📍', label: 'Dirección', value: 'Locales 22-23, Cra 22 #17-60\nBogotá, Colombia' },
                { icon: '📱', label: 'Celular / WhatsApp', value: '+57 320 494 6978', href: 'tel:+573204946978' },
                { icon: '💬', label: 'WhatsApp directo', value: 'Enviar mensaje →', href: 'https://wa.me/+573204946978/?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20%F0%9F%94%A7', external: true, highlight: true },
              ].map(item => (
                <div className="info-item" key={item.label}>
                  <div className="info-icon">{item.icon}</div>
                  <div>
                    <div className="info-label">{item.label}</div>
                    <div className="info-value">
                      {item.href
                        ? <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined} style={item.highlight ? { color: 'var(--orange)', fontWeight: 700 } : {}}>{item.value}</a>
                        : item.value.split('\n').map((line, i) => <span key={i}>{line}{i === 0 ? <br /> : ''}</span>)
                      }
                    </div>
                  </div>
                </div>
              ))}
              {/* Horario detallado */}
              <div className="info-item">
                <div className="info-icon">🕐</div>
                <div>
                  <div className="info-label">Horario de atención</div>
                  <div className="info-value">
                    <table className="horario-table">
                      <tbody>
                        {[
                          ['Lunes',     '7:30 a. m. – 5:30 p. m.'],
                          ['Martes',    '7:30 a. m. – 5:30 p. m.'],
                          ['Miércoles', '7:30 a. m. – 5:30 p. m.'],
                          ['Jueves',    '7:30 a. m. – 5:30 p. m.'],
                          ['Viernes',   '7:30 a. m. – 5:30 p. m.'],
                          ['Sábado',    '8:00 a. m. – 12:00 p. m.'],
                          ['Domingo',   'Cerrado'],
                        ].map(([dia, hora]) => (
                          <tr key={dia} className={hora === 'Cerrado' ? 'horario-cerrado' : ''}>
                            <td className="horario-dia">{dia}</td>
                            <td className="horario-hora">{hora}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="reveal">
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.7968!2d-74.08600!3d4.61500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCra+22+%2317-60%2C+Bogot%C3%A1!5e0!3m2!1ses!2sco!4v1"
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Correa Tools"
              />
            </div>
            <div style={{ marginTop: '20px' }}>
              <a className="btn-primary" href="https://www.google.com/maps/search/Cra+22+%2317-60+Bogot%C3%A1" target="_blank" rel="noreferrer" style={{ width: '100%', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Ver en Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-inner">
          <img src={`${BASE}logo.jpeg`} alt="Correa Tools" style={{ height: '48px', width: 'auto', objectFit: 'contain', mixBlendMode: 'lighten' }} />
          <ul className="footer-nav">
            <li><a href="#home" onClick={e => { e.preventDefault(); document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' }) }}>Principal</a></li>
            <li><a href="#productos" onClick={e => { e.preventDefault(); document.querySelector('#productos')?.scrollIntoView({ behavior: 'smooth' }) }}>Productos</a></li>
            <li><a href="#contactenos" onClick={e => { e.preventDefault(); document.querySelector('#contactenos')?.scrollIntoView({ behavior: 'smooth' }) }}>Contáctenos</a></li>
          </ul>
          <a className="btn-primary" href="https://wa.me/+573204946978/?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20%F0%9F%94%A7" target="_blank" rel="noreferrer">Escríbenos</a>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© 2025 <span>Correa Tools</span>. Bogotá, Colombia. Todos los derechos reservados.</p>
          <p className="footer-copy">Equipos y herramientas para mecánica automotriz</p>
        </div>
      </footer>

      <WaFloat />
    </>
  )
}
