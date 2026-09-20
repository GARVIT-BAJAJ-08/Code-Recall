import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import AmbientBackground from './AmbientBackground'

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-ink text-text">
      <AmbientBackground />

      <div className="relative z-10 flex">
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Topbar onMenuClick={() => setMenuOpen(true)} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
