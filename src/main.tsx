import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import YogaComponent from './YogaComponent'
import ColorToggle from './ColorToggle'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
    <YogaComponent />
    <ColorToggle />
  </React.StrictMode>,
)
