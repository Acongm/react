import React, { useState, startTransition, useTransition } from 'react'
import { flushSync } from 'react-dom' // Note: react-dom, not react
import logo from './logo.svg'
import './App.css'

function App() {
  const [ctn, updateCtn] = useState('')
  const [num, updateNum] = useState(0)
  const [isPending, startTransition] = useTransition()

  return (
    <div>
      <input
        value={ctn}
        onChange={(e) => {
          updateCtn(e.target.value)
          // 标记非紧急更新来处理，差不多后端并发一样变异步了，主线程不执行。但这里概念会变成等待更新
          startTransition(() => updateNum(num + 1))
          // updateNum(num + 1)
        }}
      />

      <BusyChild num={num} />
    </div>
  )
}

// 由于程序相对简单，需要做render的时间延迟，这样我们就更好的看到效果

const BusyChild = React.memo(({ num }: { num: number }) => {
  console.log('BusyChild view')

  const cur = performance.now()
  // 增加render的耗时 时间越大，卡顿效果越明显
  while (performance.now() - cur < 100) {}

  return <div>{num}</div>
})

// function App() {
//   const [inputValue, setInputValue] = useState()
//   const [content, setContent] = useState(0)
//   const onChangeInput = (e: any) => {
//     console.log(e)
//     setInputValue(e.target.value)
//   }
//   const onChangeCount = (e: any) => {
//     // 将非紧急的更新标记为"transitions"
//     setContent(999)
//     startTransition(() => {
//       console.log(e)
//       setContent(e.target.value)
//     })
//   }
//   return (
//     <div>
//       <p>inputValue: {inputValue}</p>
//       <input value={inputValue} onChange={(e) => onChangeInput(e)} />
//       <p>content: {content}</p>
//       <input value={content} onChange={(e) => onChangeCount(e)} />
//     </div>
//   )
// }

export default App
