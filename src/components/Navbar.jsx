import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const WA_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
)

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  // Si estamos en home, scroll a sección; si no, ir a home primero
  const handleNav = (hash) => {
    setMenuOpen(false)
    if (isHome) {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/' + hash)
    }
  }

  return (
    <>
      <nav>
        <Link to="/" className="nav-logo">
          <span className="nav-logo-text">🔧 CORREA <span>TOOLS</span></span>
        </Link>

        <ul className="nav-links">
          <li><a href="#nosotros" onClick={e => { e.preventDefault(); handleNav('#nosotros') }}>Nosotros</a></li>
          <li><a href="#productos" onClick={e => { e.preventDefault(); handleNav('#productos') }}>Productos</a></li>
          <li><a href="#porque" onClick={e => { e.preventDefault(); handleNav('#porque') }}>¿Por qué elegirnos?</a></li>
          <li><a href="#contacto" onClick={e => { e.preventDefault(); handleNav('#contacto') }}>Contacto</a></li>
        </ul>

        <a
          className="nav-cta"
          href="https://wa.me/+573204946978/?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20%F0%9F%94%A7"
          target="_blank"
          rel="noreferrer"
        >
          {WA_ICON}&nbsp; Escríbenos
        </a>

        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menú">
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`} id="mobileMenu">
        <a href="#nosotros" onClick={e => { e.preventDefault(); handleNav('#nosotros') }}>Nosotros</a>
        <a href="#productos" onClick={e => { e.preventDefault(); handleNav('#productos') }}>Productos</a>
        <a href="#porque" onClick={e => { e.preventDefault(); handleNav('#porque') }}>¿Por qué elegirnos?</a>
        <a href="#contacto" onClick={e => { e.preventDefault(); handleNav('#contacto') }}>Contacto</a>
        <a
          href="https://wa.me/+573204946978/?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20%F0%9F%94%A7"
          target="_blank" rel="noreferrer"
          style={{ color: 'var(--orange-light)' }}
        >
          Escríbenos por WhatsApp →
        </a>
      </div>
    </>
  )
}
