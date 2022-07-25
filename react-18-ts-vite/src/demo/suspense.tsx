// SuspenseList
import React, { useState, Suspense } from 'react'
import { fetchData } from './utils'

const initialResource = fetchData()

export default function SuspenseListPage(props: any) {
  const [resource, setResource] = useState(initialResource)

  return (
    <div>
      <h3>SuspenseListPage</h3>
      <Suspense fallback={<h1>loading... - user</h1>}>
        <User resource={resource} />
      </Suspense>
      <Suspense fallback={<h1>loading... - Num</h1>}>
        <Num resource={resource} />
      </Suspense>

      <button onClick={() => setResource(fetchData())}>refresh</button>
    </div>
  )
}

function User({ resource }: any) {
  const user = resource.user.read()
  console.log('user render', user) //sy-log
  return (
    <div className="border">
      <h3>User - 网络请求</h3>
      <p>{user.name.first}</p>
    </div>
  )
}
function Num({ resource }: any) {
  const num = resource.num.read()
  console.log('Num render', num) //sy-log
  return (
    <div className="border">
      <h3>Num - setTimeout模拟</h3>
      <p>{num}</p>
    </div>
  )
}
