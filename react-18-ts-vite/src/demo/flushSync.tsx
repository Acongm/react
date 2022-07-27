import React, { useState, startTransition } from 'react'
import { flushSync } from 'react-dom' // Note: react-dom, not react

// const f = (v, v1) => {
//   // console.log(v)
//   return v + v1
// }
// function App() {
//   const [ctn, updateCtn] = useState('')
//   const upData = () => {
//     updateCtn((v) => f(v, 'a'))
//     startTransition(() => {
//       // flushSync(() => {
//       updateCtn((v) => f(v, 'b'))
//       updateCtn((v) => f(v, 'c'))
//       // })
//     })
//     //
//     updateCtn((v) => f(v, 'd'))
//     flushSync(() => {
//       updateCtn((v) => f(v, 'e'))
//     })
//   }
//   console.log('render', ctn)
//   // render abc
//   // render abcde
//   return (
//     <div>
//       <button onClick={upData}>upData</button>
//       <p>{ctn}</p>
//     </div>
//   )
// }

// export default App

export default function App() {
  const [content, setContent] = useState('123')
  const [value, setInputValue] = useState('')
  setTimeout(()=>{
    startTransition(() => {
      setContent('e.target.value')
    })
  })
  return (
    <div>
      <div>
        <input
          value={value}
          onChange={(e) => {
            setInputValue(e.target.value);
            startTransition(() => {
              setContent(e.target.value)
            })
          }}
        />
      </div>
      {Array.from(new Array(30000)).map((_, index) => (
        <div key={index}>{content}</div>
      ))}
    </div>
  )
}
