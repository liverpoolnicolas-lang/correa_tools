import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

export default function NotFound({ mensaje }) {
  return (
    <>
      <Navbar />
      <div className="not-found">
        <div className="not-found-code">404</div>
        <h1>Página no encontrada</h1>
        <p>{mensaje || 'La página que buscas no existe o fue movida.'}</p>
        <Link to="/" className="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver al inicio
        </Link>
      </div>
    </>
  )
}
