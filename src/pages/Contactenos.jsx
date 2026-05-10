import { useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import WaFloat from '../components/WaFloat.jsx'
import Footer from '../components/Footer.jsx'

export default function Contactenos() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <Navbar />

      <div className="subpage-wrap">
        {/* Header de sección */}
        <div className="subpage-hero">
          <div className="hero-bg" />
          <div className="hero-grid" />
          <div className="subpage-hero-content">
            <span className="section-label">Estamos para ayudarte</span>
            <h1 className="subpage-title">VISÍTANOS O<br /><em>ESCRÍBENOS</em></h1>
            <p className="subpage-sub">Atención personalizada para servitecas y talleres automotrices en todo el país.</p>
          </div>
        </div>

        {/* Contenido */}
        <div className="subpage-content">
          <div className="contacto-inner">
            <div className="contacto-left">
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

                {/* Horario */}
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

            <div>
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.7968!2d-74.08600!3d4.61500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCra+22+%2317-60%2C+Bogot%C3%A1!5e0!3m2!1ses!2sco!4v1"
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación Correa Tools"
                />
              </div>
              <div style={{ marginTop: '20px' }}>
                <a className="btn-primary" href="https://www.google.com/maps/search/Cra+22+%2317-60+Bogot%C3%A1" target="_blank" rel="noreferrer" style={{ width: '100%', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  Ver en Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WaFloat />
    </>
  )
}
