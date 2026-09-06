import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Landing from './Landing'
import PhoneStudio from './PhoneStudio'
import './styles.css'
import './print.css'

const path = window.location.pathname.replace(/\/$/, '')
const params = new URLSearchParams(window.location.search)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {path === '/frame' ? <PhoneStudio /> : path === '/demo' ? <App initialReference={params.get('case') ?? ''} embedded={params.get('embedded') === '1'} /> : <Landing />}
  </StrictMode>,
)
