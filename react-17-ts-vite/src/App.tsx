import React, { useState } from 'react'
import { flushSync } from "react-dom"; // Note: react-dom, not react
import logo from './logo.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [flag, setFlag] = useState(false)
  function handleClick() {
    setTimeout(() => {
      // React 17 and later versions does batch these.
      setCount((c) => c + 1)
      setFlag((f) => !f)

      // React will rerender once at the end (that's batching!)
    })
  }

  
  console.log('react')
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React 17 + Typescript</p>
        <p>
          <button type="button" onClick={() => handleClick()}>
            count is: {count}
          </button>
        </p>
       
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  )
}

export default App
