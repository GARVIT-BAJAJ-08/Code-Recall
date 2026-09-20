import { useState } from 'react'
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import Button from '@/components/ui/Button'
import AmbientBackground from './AmbientBackground'
import { useAuth } from '@/context/AuthContext'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
]

const AUTH_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/questions', label: 'My Questions' },
  { to: '/smart', label: 'Practice' },
  { to: '/about', label: 'About' },
]

export default function MarketingLayout() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative flex min-h-screen flex-col bg-ink text-text">
      <AmbientBackground />

      <header className="sticky top-0 z-30 border-b border-line/80 bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
            {(isAuthenticated ? AUTH_LINKS : LINKS).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive ? 'text-ember-300' : 'text-muted transition-colors hover:text-text'
                }
                end={link.end}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            {isAuthenticated ? (
              <>
                <button onClick={() => { logout(); navigate('/', { replace: true }) }} className="text-sm font-medium text-muted transition-colors hover:text-text">Logout</button>
              </>
            ) : (
              <>
                <Button to="/login" variant="ghost" size="sm">
                  Login
                </Button>
                <Button to="/signup" size="sm">
                  Sign Up
                </Button>
              </>
            )}
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="text-muted hover:text-text sm:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-line/80 px-4 py-4 sm:hidden">
            <nav className="flex flex-col gap-3 text-sm font-medium text-muted">
              {(isAuthenticated ? AUTH_LINKS : LINKS).map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => (isActive ? 'text-ember-300' : 'hover:text-text')}
                  end={link.end}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-2.5">
              {isAuthenticated ? (
                <>
                  <button onClick={() => { logout(); setMenuOpen(false); navigate('/', { replace: true }) }} className="h-8 rounded-xl text-sm font-medium text-muted hover:text-text">Logout</button>
                </>
              ) : (
                <>
                  <Button to="/login" variant="secondary" size="sm" onClick={() => setMenuOpen(false)}>
                    Login
                  </Button>
                  <Button to="/signup" size="sm" onClick={() => setMenuOpen(false)}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10 flex-1">
        <Outlet />
      </main>

      <footer className="relative z-10 border-t border-line/70 px-4 py-6 text-center text-xs text-faint">
        © {new Date().getFullYear()} CodeRecall. Remember. Revise. Master.
      </footer>
    </div>
  )
}
