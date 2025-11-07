import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { config } from './config/config'

// Ajouter la classe showcase au body si le mode showcase est activé
if (config.showcase) {
  document.body.classList.add('showcase');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
