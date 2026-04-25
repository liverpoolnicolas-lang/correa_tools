import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Maneja la redirección del 404.html de GitHub Pages
// Convierte /?/producto/slug → /producto/slug para React Router
;(function () {
  var redirect = sessionStorage.redirect
  delete sessionStorage.redirect
  if (redirect && redirect !== location.href) {
    history.replaceState(null, null, redirect)
  }
})()

// Decodifica el ?/ que inserta el 404.html
;(function () {
  var l = window.location
  if (l.search[1] === '/') {
    var decoded = l.search
      .slice(1)
      .split('&')
      .map(function (s) {
        return s.replace(/~and~/g, '&')
      })
    window.history.replaceState(
      null,
      null,
      l.pathname.slice(0, -1) +
        decoded[0] +
        (decoded[1] ? '?' + decoded[1] : '') +
        l.hash
    )
  }
})()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/correa_tools">
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
