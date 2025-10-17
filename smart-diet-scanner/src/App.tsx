import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Scan from './pages/Scan'
import Profile from './pages/Profile'
import Results from './pages/Results'
import Layout from './components/Layout'
import './App.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'scan', element: <Scan /> },
      { path: 'profile', element: <Profile /> },
      { path: 'results', element: <Results /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
