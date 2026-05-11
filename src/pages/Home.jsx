import { Link } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'
import Navbar from '../components/Navbar.jsx'
import WaFloat from '../components/WaFloat.jsx'
import Footer from '../components/Footer.jsx'

const BASE = import.meta.env.BASE_URL

const WA_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
)

/* ── HOOK: carga top.json + productos.json y los cruza ── */
function useTopProductos() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(BASE + 'top.json').then(r => r.json()),
      fetch(BASE + 'productos.json').then(r => r.json()),
    ])
      .then(([ids, productos]) => {
        const mapa = Object.fromEntries(productos.map(p => [p.id, p]))
        const lista = ids.map(entry => {
          // Entrada especial tipo banner
          if (typeof entry === 'object' && entry.tipo === 'banner') {
            return { tipo: 'banner', imagen: entry.imagen }
          }
          // Entrada normal por ID
          const p = mapa[entry]
          if (!p) return null
          return {
            ...p,
            tipo: 'producto',
            slug: p.slug || p.nombre.toLowerCase()
              .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-'),
          }
        }).filter(Boolean)
        setItems(lista)
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  return { items, loading }
}

/* ── CARRUSEL ── */
function Carrusel({ items }) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef(null)
  const total = items.length

  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total])
  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total])

  // Autoplay
  useEffect(() => {
    if (paused || total < 2) return
    const t = setInterval(next, 4000)
    return () => clearInterval(t)
  }, [paused, next, total])

  // Touch / swipe
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
    touchStartX.current = null
  }

  if (!items.length) return null

  const item = items[current]

  return (
    <div
      className="carrusel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      <div className="carrusel-track">
        {items.map((p, i) => (
          <div
            key={p.tipo === 'banner' ? 'banner' : p.id}
            className={'carrusel-slide' + (i === current ? ' active' : '')}
            aria-hidden={i !== current}
          >
            <img
              src={p.tipo === 'banner' ? BASE + p.imagen : BASE + 'img/' + p.imagen}
              alt={p.tipo === 'banner' ? 'Correa Tools' : p.nombre}
              className="carrusel-img"
              onError={e => { e.target.src = ''; e.target.style.display = 'none' }}
            />
            {/* Solo muestra overlay e info si es un producto */}
            {p.tipo === 'producto' && (
              <>
                <div className="carrusel-overlay" />
                <Link to={'/producto/' + p.slug} className="carrusel-info">
                  <span className="carrusel-cat">{p.categoria}</span>
                  <span className="carrusel-nombre">{p.nombre}</span>
                  <span className="carrusel-cta">
                    Ver producto
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </Link>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Flechas */}
      {total > 1 && (
        <>
          <button className="carrusel-arrow carrusel-arrow-prev" onClick={prev} aria-label="Anterior">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button className="carrusel-arrow carrusel-arrow-next" onClick={next} aria-label="Siguiente">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      <div className="carrusel-dots">
        {items.map((_, i) => (
          <button
            key={i}
            className={'carrusel-dot' + (i === current ? ' active' : '')}
            onClick={() => setCurrent(i)}
            aria-label={'Slide ' + (i + 1)}
          />
        ))}
      </div>
    </div>
  )
}

/* ── HOME ── */
export default function Home() {
  const { items, loading } = useTopProductos()

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section id="home">
        <div className="hero-bg" />
        <div className="hero-grid" />

        {/* En desktop: carrusel a la derecha del contenido */}
        {/* En mobile: carrusel aparece ANTES del hero-content (via CSS order) */}
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
            <Link className="btn-primary" to="/productos">
              Ver productos
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <a className="btn-secondary"
              href="https://wa.me/+573204946978/?text=Hola%2C%20quiero%20asesor%C3%ADa%20%F0%9F%94%A7"
              target="_blank" rel="noreferrer">
              {WA_ICON} Consultar por WhatsApp
            </a>
          </div>
        </div>

        {/* Carrusel — en desktop lado derecho, en mobile order-1 (antes del contenido) */}
        <div className="hero-carrusel-wrap">
          {loading
            ? <div className="carrusel-skeleton" />
            : <Carrusel items={items} />
          }
        </div>
      </section>

      <Footer />
      <WaFloat />
    </>
  )
}
