import React, { useState, startTransition } from 'react'
import { flushSync } from 'react-dom' // Note: react-dom, not react

function App() {
  const [ctn, updateCtn] = useState('')
  const upData = () => {
    updateCtn((v) => v + 'a')
    startTransition(() => {
      updateCtn((v) => v + 'b')
    })
    updateCtn((v) => v + 'c')
    startTransition(() => {
      updateCtn((v) => v + 'd')
    })
  }
  console.log('render', ctn)
  // render ac
  // render abcd
  return (
    <div>
      <button onClick={upData}>upData</button>
      <p>{ctn}</p>
    </div>
  )
}

export default App
