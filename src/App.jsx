import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Productos from './pages/Productos.jsx'
import Contactenos from './pages/Contactenos.jsx'
import ProductoPage from './pages/ProductoPage.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/contactenos" element={<Contactenos />} />
      <Route path="/producto/:slug" element={<ProductoPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
