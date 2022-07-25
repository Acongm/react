import React, { useState, startTransition } from 'react'
import { flushSync } from 'react-dom' // Note: react-dom, not react
import logo from './logo.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [flag, setFlag] = useState(false)
  function handleClick() {
    setTimeout(() => {
      // React 18 and later versions does batch these.
      setCount((c) => c + 1)
      setFlag((f) => !f)
      // React will rerender once at the end (that's batching!)
    })
  }
  function handleClick2() {
    flushSync(() => {
      setCount((c) => c + 1)
    })
    // React has updated the DOM by now.
    flushSync(() => {
      setFlag((f) => !f)
    })
    // React has updated the DOM by now.
  }

  console.log('react')
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React 18 + Typescript</p>
        <p>
          <button type="button" onClick={() => handleClick()}>
            count is: {count}
          </button>
        </p>
        <p>
          <button type="button" onClick={() => handleClick2()}>
            渲染两次count is: {count}
          </button>
        </p>
      </header>
    </div>
  )
}

export default App
