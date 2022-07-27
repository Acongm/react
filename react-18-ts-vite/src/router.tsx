import React, { Suspense, lazy } from 'react'
import {
  BrowserRouter,
  Routes as Routes_,
  Route,
  Navigate,
} from 'react-router-dom'

const genRoute = (route: Route) => {
  if (route.children.length === 0) {
    return <Route key={route.path} path={route.path} element={route.element} />
  } else {
    return (
      <Route key={route.path} path={route.path} element={route.element}>
        {route.children.map((route) => genRoute(route))}
      </Route>
    )
  }
}

const Home = lazy(() => import('./demo/app'))
const StartTransition = lazy(() => import('./demo/startTransition'))
const FlushSync = lazy(() => import('./demo/flushSync'))
const UseTransition = lazy(() => import('./demo/useTransition'))
const SuspenseView = lazy(() => import('./demo/suspense'))
const SuspenseListView = lazy(() => import('./demo/suspenseList'))

const routes: Route[] = [
  {
    path: '/',
    element: <Navigate replace to={'/home'} />,
    children: [],
  },
  {
    path: '/home',
    element: (
      <Suspense fallback={<>loading Home</>}>
        <Home />
      </Suspense>
    ),
    children: [],
  },
  {
    path: '/StartTransition',
    element: (
      <Suspense fallback={<>loading StartTransition</>}>
        <StartTransition />
      </Suspense>
    ),
    children: [],
  },
  {
    path: '/FlushSync',
    element: (
      <Suspense fallback={<>loading FlushSync</>}>
        <FlushSync />
      </Suspense>
    ),
    children: [],
  },
  {
    path: '/UseTransition',
    element: (
      <Suspense fallback={<>loading UseTransition</>}>
        <UseTransition />
      </Suspense>
    ),
    children: [],
  },
  {
    path: '/Suspense',
    element: (
      <Suspense fallback={<>loading SuspenseView</>}>
        <SuspenseView />
      </Suspense>
    ),
    children: [],
  },
  {
    path: '/SuspenseList',
    element: (
      <Suspense fallback={<>loading SuspenseListView</>}>
        <SuspenseListView />
      </Suspense>
    ),
    children: [],
  },
  {
    path: '/*',
    element: <div>Not Found</div>,
    children: [],
  },
]

export const Routes = () => (
  <BrowserRouter>
    <Routes_>{routes.map((route) => genRoute(route))}</Routes_>
  </BrowserRouter>
)
