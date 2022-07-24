import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App2'

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw 'Root element not found. Unable to render the App.'
}
const root = createRoot(rootEl)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
