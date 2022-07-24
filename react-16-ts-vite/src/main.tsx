import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// )

const rootEl = document.getElementById('root')
if (rootEl) {
  ReactDOM.render(<App />, rootEl)
} else {
  throw 'Root element not found. Unable to render the App.'
}
