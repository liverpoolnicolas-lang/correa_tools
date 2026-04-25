import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ProductoPage from './pages/ProductoPage.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/producto/:slug" element={<ProductoPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
