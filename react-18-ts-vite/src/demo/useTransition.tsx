import React, { useState, useTransition } from 'react'

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
      <div style={{ color: isPending ? 'red' : '#000' }}>
        <BusyChild num={num} />
      </div>
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

export default App
