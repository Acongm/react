# React 18 新特性

## React 18 带来了什么

react 18 的新 API 最大的特点 就是 `Concurrent rendering` 机制。
它使得 react 可以同时准备多个版本的 UI。

## Concurrent 的特点

- startTransition: 可以让你的 UI 在一次花费高的状态转变中始终保持响应性
- useDeferredValue: 可以让你延迟屏幕上不那么重要的部分的更新
- <SuspenseList>: 可以让你控制 loading 状态指示器（比如转圈圈）的出现顺序
- Streaming SSR with selective hydration: 让你的 app 可以更快地加载并可以进行交互

## 入口模式

三种入口模式
legacy 模式： ReactDOM.render(, rootNode)。没有开启新功能，这是 react17 采用的默认模式。 (会有警告提示)
blocking 模式： ReactDOM.createBlockingRoot(rootNode).render()。作为迁移到 concurrent 模式的过渡模式。
concurrent 模式： ReactDOM.createRoot(rootNode).render()。这个模式开启了所有的新功能。

```js
// React 17
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const root = document.getElementById('root')!;
ReactDOM.render(<App />, root);

// React 18
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = document.getElementById('root')!;
ReactDOM.createRoot(root).render(<App />);

```

## 异步批处理

批处理是 react 将多个状态更新分组到一个渲染中以获得更好的性能。
react18 之前只能在 react 事件处理程序中批处理更新。默认情况下，Promise、setTimeout、本机事件处理程序或任何其他事件内部的更新不会在 React 中批处理。使用自动批处理，这些更新将自动批处理：

```js
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
```

那么，如果我不想要批处理呢？
官方提供了一个 API `flushSync` 用于退出批处理

```js
import { flushSync } from 'react-dom' // Note: react-dom, not react
function handleClick() {
  flushSync(() => {
    setCount((c) => c + 1)
  })
  // React has updated the DOM by now.
  flushSync(() => {
    setFlag((f) => !f)
  })
  // React has updated the DOM by now.
}
```

### 批处理实现

```js
function ensureRootIsScheduled(root, currentTime) {
  ......
  // Determine the next lanes to work on, and their priority.
  var nextLanes = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes);

  // This returns the priority level computed during the `getNextLanes` call.
  var newCallbackPriority = returnNextLanesPriority();

  // Check if there's an existing task. We may be able to reuse it.
  if (existingCallbackNode !== null) {
    var existingCallbackPriority = root.callbackPriority;

    if (existingCallbackPriority === newCallbackPriority) {  // The priority hasn't changed. We can reuse the existing task. Exit.   return ; }
    // The priority changed. Cancel the existing callback. We'll schedule a new
    // one below.
    cancelCallback(existingCallbackNode);
  }

  // Schedule a new callback.
  var newCallbackNode;
  ......
  root.callbackPriority = newCallbackPriority;
  root.callbackNode = newCallbackNode;
} // This is the entry point for every concurrent task, i.e. anything that
// goes through Scheduler.
```

其实是将内部更新的优先级强制指定为 SyncLane，即指定为同步优先级，具体效果就是每一次更新时都会同步的执行渲染。

### FlushSync 的实现

```js
export function flushSync(fn) {
  try {
    // DiscreteEventPriority === SyncLane
    setCurrentUpdatePriority(DiscreteEventPriority)
    fn && fn()
  } finally {
    setCurrentUpdatePriority(previousPriority)
  }
}
```

## startTransition

### 概述

React 18 加入了一个全新的 API startTransition，这个 API 相当牛，可以让我们的页面在大屏更新里保持响应。这个 API 通过标记某些更新为"transitions"，来提高用户交互。可以说 React 可以让你在一次状态改变的过程中始终提供视觉上的回馈并且在这个过程中让浏览器能保持响应。

### 解决了什么问题

使项目始终感觉流畅和响应的并不容易。
比如有时用户点击了一个按钮或者在输入框中输入，同时这些操作将会导致页面大量的更新，此时将会导致页面冻结或者挂起不动一会直到之前的更新任务完成为止。

在 React 18 之前，所有的更新没有优先级之分，都是紧急的，这意味着上面的两种状态更新会被同时 render，并且仍然会 block 住用户从他们的交互中获得反馈直到所有的东西都 render 好。

```js
// 紧急的更新：展示用户的输入
setInputValue(e.target.value);

// 将非紧急的更新标记为"transitions"
startTransition(() => {
    setContent(e.target.value);
});
`
```

### 伪代码

```js
const ReactCurrentBatchConfig = {
  transition: (0: number),
}
export function startTransition(scope: () => void) {
  const prevTransition = ReactCurrentBatchConfig.transition
  ReactCurrentBatchConfig.transition = 1
  try {
    scope() // setContent(e.target.value);
  } finally {
    ReactCurrentBatchConfig.transition = prevTransition
  }
}
```

总的来说就是在执行更新前将 ReactCurrentBatchConfig 里的 transition 属性赋值为 1，标记这次 Update 为"transition"，更新结束后再将 transition 属性赋为初始值 0

这里通过修改 `ReactCurrentBatchConfig.transition` 的值来做标记，
后面在 `setState` 中， 通过 `dispatchAction` 来判断代码执行顺序的优先级。

### demo

```js
import React, { useState, startTransition } from 'react'
function App() {
  const [ctn, updateCtn] = useState('')
  const [num, updateNum] = useState(0)
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
```

### useTransition

一般情况下，我们可能需要通知用户后台正在工作。为此提供了一个带有 isPending 转换标志的 useTransition，React 将在状态转换期间提供视觉反馈，并在转换发生时保持浏览器响应。

```js
import { useTransition } from 'react'
const [isPending, startTransition] = useTransition()
return isPending && <Spin />
```

### useDeferredValue

```js
import { useDeferredValue } from 'react'
const deferredValue = useDeferredValue(value)
```

### 同 `debounce` 的区别：

`debounce` 即 `setTimeout` 总是会有一个固定的延迟，而 useDeferredValue 的值只会在渲染耗费的时间下滞后，在性能好的机器上，延迟会变少，反之则变长。

## Suspense

更方便的组织并行请求和 loading 状态的代码

16 就已经支持？
18 补充了 SuspenseList

## useId
