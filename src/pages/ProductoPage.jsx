import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import WaFloat from '../components/WaFloat.jsx'
import NotFound from './NotFound.jsx'
import { useProductos } from '../hooks/useProductos.js'

const BASE = import.meta.env.BASE_URL

// Extrae el ID de video de YouTube de cualquier formato de URL
function getYoutubeId(url) {
  if (!url) return null
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/)
  return match ? match[1] : null
}

function SkeletonProducto() {
  return (
    <div className="producto-page">
      <div className="producto-hero">
        <div className="skeleton" style={{ minHeight: 480 }} />
        <div style={{ padding: '64px 48px', background: 'var(--dark)', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="skeleton skeleton-line" style={{ width: '30%', height: 12 }} />
          <div className="skeleton skeleton-line" style={{ width: '80%', height: 56 }} />
          <div className="skeleton skeleton-line" style={{ width: '40%', height: 12 }} />
          <div className="skeleton skeleton-line" style={{ width: '100%', height: 14 }} />
          <div className="skeleton skeleton-line" style={{ width: '100%', height: 14 }} />
          <div className="skeleton skeleton-line" style={{ width: '90%', height: 14 }} />
          <div className="skeleton skeleton-line" style={{ width: '60%', height: 14 }} />
        </div>
      </div>
    </div>
  )
}

export default function ProductoPage() {
  const { slug } = useParams()
  const { productos, loading } = useProductos()

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  if (loading) return <><Navbar /><SkeletonProducto /></>

  const producto = productos.find(p => p.slug === slug)

  if (!producto) return <NotFound mensaje={`El producto "${slug}" no fue encontrado`} />

  const youtubeId = getYoutubeId(producto.video)
  const imgSrc = `${BASE}img/${producto.imagen}`
  const waMsg = encodeURIComponent(`Hola, quiero consultar el precio del ${producto.nombre}`)

  return (
    <>
      <Navbar />
      <div className="producto-page">

        {/* ── HERO PRODUCTO ── */}
        <div className="producto-hero">
          {/* Imagen */}
          <div className="producto-img-side">
            <img
              src={imgSrc}
              alt={producto.nombre}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => {
                e.target.style.display = 'none'
                e.target.nextSibling && (e.target.nextSibling.style.display = 'flex')
              }}
            />
            <div className="producto-img-placeholder-lg" style={{ display: 'none' }}>🔧</div>
          </div>

          {/* Info */}
          <div className="producto-info-side">
            <Link to="/" className="producto-back">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Volver al catálogo
            </Link>

            <h1 className="producto-title">{producto.nombre}</h1>
            <span className="producto-cat-badge">{producto.categoria}</span>
            <p className="producto-desc-full">{producto.descripcion}</p>

            {producto.puntos && producto.puntos.length > 0 && (
              <ul className="producto-puntos">
                {producto.puntos.map((punto, i) => (
                  <li key={i}>{punto}</li>
                ))}
              </ul>
            )}

            <a
              className="btn-whatsapp"
              href={`https://wa.me/+573204946978/?text=${waMsg}`}
              target="_blank"
              rel="noreferrer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              Consultar precio por WhatsApp
            </a>
          </div>
        </div>

        {/* ── VIDEO (solo si tiene video) ── */}
        {youtubeId && (
          <div className="video-section">
            <h2>VER <em>EN ACCIÓN</em></h2>
            <div className="video-embed-wrap">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={`Video de ${producto.nombre}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* ── FOOTER MINI ── */}
        <footer>
          <div className="footer-inner">
            <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
              <img src={`${BASE}logo.png`} alt="Correa Tools" style={{ height: '48px', width: '48px', objectFit: 'contain', borderRadius: '50%' }} />
            </Link>
            <ul className="footer-nav">
              <li><Link to="/" style={{ color: 'var(--gray)', textDecoration: 'none' }}>Principal</Link></li>
              <li><Link to="/#productos" style={{ color: 'var(--gray)', textDecoration: 'none' }}>Productos</Link></li>
              <li><Link to="/#contactenos" style={{ color: 'var(--gray)', textDecoration: 'none' }}>Contáctenos</Link></li>
            </ul>
            <a className="btn-primary" href={`https://wa.me/+573204946978/?text=${waMsg}`} target="_blank" rel="noreferrer">
              Escríbenos
            </a>
          </div>
          <div className="footer-bottom">
            <p className="footer-copy">© 2025 <span>Correa Tools</span>. Bogotá, Colombia.</p>
          </div>
        </footer>
      </div>

      <WaFloat mensaje={waMsg} />
    </>
  )
}
