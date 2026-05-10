import { Link, useNavigate } from 'react-router-dom'

const BASE = import.meta.env.BASE_URL

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer>
      <div className="footer-inner">
        <Link to="/">
          <img src={`${BASE}logo.png`} alt="Correa Tools" style={{ height: '48px', width: '48px', objectFit: 'contain', borderRadius: '50%' }} />
        </Link>
        <ul className="footer-nav">
          <li><Link to="/">Principal</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/contactenos">Contáctenos</Link></li>
        </ul>
        <a className="btn-primary" href="https://wa.me/+573204946978/?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20%F0%9F%94%A7" target="_blank" rel="noreferrer">Escríbenos</a>
      </div>
      <div className="footer-bottom">
        <p className="footer-copy">© 2025 <span>Correa Tools</span>. Bogotá, Colombia. Todos los derechos reservados.</p>
        <p className="footer-copy">Equipos y herramientas para mecánica automotriz</p>
      </div>
    </footer>
  )
}
