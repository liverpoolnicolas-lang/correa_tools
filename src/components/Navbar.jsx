import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useProductos } from '../hooks/useProductos.js'

const BASE = import.meta.env.BASE_URL

const WA_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
)

export default function Navbar({ onSearch, searchValue = '' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [localSearch, setLocalSearch] = useState(searchValue)
  const { productos } = useProductos()
  const [suggestions, setSuggestions] = useState([])
  const inputRef = useRef(null)
  const wrapRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => { setLocalSearch(searchValue) }, [searchValue])

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setSuggestions([])
        if (!localSearch) setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [localSearch])

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus()
  }, [searchOpen])

  const handleSearchChange = (val) => {
    setLocalSearch(val)
    if (onSearch) onSearch(val)
    if (val.trim().length > 1) {
      const matches = productos
        .filter(p =>
          p.nombre.toLowerCase().includes(val.toLowerCase()) ||
          p.categoria.toLowerCase().includes(val.toLowerCase())
        )
        .slice(0, 5)
      setSuggestions(matches)
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (producto) => {
    setSuggestions([])
    setLocalSearch('')
    if (onSearch) onSearch('')
    setSearchOpen(false)
    navigate('/producto/' + producto.slug)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSuggestions([])
    if (!isHome) navigate('/')
    else document.querySelector('#productos')?.scrollIntoView({ behavior: 'smooth' })
  }

  const clearSearch = () => {
    setLocalSearch('')
    if (onSearch) onSearch('')
    setSuggestions([])
    setSearchOpen(false)
  }

  const handleNav = (hash) => {
    setMenuOpen(false)
    if (isHome) document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
    else navigate('/' + hash)
  }

  return (
    <>
      <nav>
        <Link to="/" className="nav-logo">
          <img src={BASE + 'logo.jpeg'} alt="Correa Tools" className="nav-logo-img" />
        </Link>

        <ul className="nav-links">
          <li><a href="#home" onClick={e => { e.preventDefault(); handleNav('#home') }}>Principal</a></li>
          <li><a href="#productos" onClick={e => { e.preventDefault(); handleNav('#productos') }}>Productos</a></li>
          <li><a href="#contactenos" onClick={e => { e.preventDefault(); handleNav('#contactenos') }}>Contáctenos</a></li>
        </ul>

        {/* Barra de búsqueda */}
        <div className={'nav-search-wrap' + (searchOpen ? ' open' : '')} ref={wrapRef}>
          {!searchOpen ? (
            <button className="nav-search-toggle" onClick={() => setSearchOpen(true)} aria-label="Buscar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>
          ) : (
            <form className="nav-search-form" onSubmit={handleSubmit}>
              <svg className="nav-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                ref={inputRef}
                className="nav-search-input"
                type="text"
                placeholder="Buscar producto..."
                value={localSearch}
                onChange={e => handleSearchChange(e.target.value)}
              />
              <button type="button" className="nav-search-clear" onClick={localSearch ? clearSearch : () => setSearchOpen(false)} aria-label="Cerrar">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>

              {suggestions.length > 0 && (
                <div className="nav-search-suggestions">
                  {suggestions.map(p => (
                    <button key={p.id} type="button" className="nav-suggestion-item" onClick={() => handleSuggestionClick(p)}>
                      <img src={BASE + 'img/' + p.imagen} alt={p.nombre} className="nav-suggestion-img" onError={e => { e.target.style.display = 'none' }} />
                      <div className="nav-suggestion-info">
                        <span className="nav-suggestion-name">{p.nombre}</span>
                        <span className="nav-suggestion-cat">{p.categoria}</span>
                      </div>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  ))}
                </div>
              )}
            </form>
          )}
        </div>

        <a className="nav-cta" href="https://wa.me/+573204946978/?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20%F0%9F%94%A7" target="_blank" rel="noreferrer">
          {WA_ICON}&nbsp; Escríbenos
        </a>

        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menú">
          <span /><span /><span />
        </button>
      </nav>

      <div className={'mobile-menu' + (menuOpen ? ' open' : '')} id="mobileMenu">
        <form className="mobile-search-form" onSubmit={handleSubmit}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={localSearch}
            onChange={e => handleSearchChange(e.target.value)}
            className="mobile-search-input"
          />
          {localSearch && (
            <button type="button" onClick={clearSearch} className="nav-search-clear">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
        </form>
        <a href="#home" onClick={e => { e.preventDefault(); handleNav('#home') }}>Principal</a>
        <a href="#productos" onClick={e => { e.preventDefault(); handleNav('#productos') }}>Productos</a>
        <a href="#contactenos" onClick={e => { e.preventDefault(); handleNav('#contactenos') }}>Contáctenos</a>
        <a href="https://wa.me/+573204946978/?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20%F0%9F%94%A7" target="_blank" rel="noreferrer" style={{ color: 'var(--orange-light)' }}>
          Escríbenos por WhatsApp →
        </a>
      </div>
    </>
  )
}
