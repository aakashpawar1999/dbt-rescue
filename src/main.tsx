import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Landing from './Landing'
import './styles.css'
import './print.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {window.location.pathname.replace(/\/$/, '') === '/demo' ? <App initialReference={new URLSearchParams(window.location.search).get('case') ?? ''} /> : <Landing />}
  </StrictMode>,
)
