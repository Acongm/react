import React, { useDeferredValue, useState } from 'react'

const MySlowList = React.memo(({ text }: { text: String }) => {
  return <div>{text}</div>
})

function App() {
  const [text, setText] = useState('hello')
  const deferredText = useDeferredValue(text)

  const handleChange = (e: any) => {
    setText(e.target.value)
  }

  return (
    <div>
      <h3>UseDeferredValuePage</h3>
      {/* 保持将当前文本传递给 input */}
      <input value={text} onChange={handleChange} />
      {/* 但在必要时可以将列表“延后” */}
      <p>{deferredText}</p>

      <MySlowList text={deferredText} />
    </div>
  )
}

// 由于程序相对简单，需要做render的时间延迟，这样我们就更好的看到效果

export default App
