import { NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
      <nav className="sticky bottom-0 border-t bg-white">
        <div className="mx-auto grid max-w-lg grid-cols-3 py-2 text-sm">
          <NavLink to="/" end className={({ isActive }) => `px-4 py-2 text-center ${isActive ? 'text-brand font-medium' : 'text-gray-600'}`}>Home</NavLink>
          <NavLink to="/scan" className={({ isActive }) => `px-4 py-2 text-center ${isActive ? 'text-brand font-medium' : 'text-gray-600'}`}>Scan</NavLink>
          <NavLink to="/profile" className={({ isActive }) => `px-4 py-2 text-center ${isActive ? 'text-brand font-medium' : 'text-gray-600'}`}>Profile</NavLink>
        </div>
      </nav>
    </div>
  )
}
