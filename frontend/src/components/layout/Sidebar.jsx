import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  Shuffle,
  Target,
  Layers,
  LineChart,
  History as HistoryIcon,
  User,
  Settings as SettingsIcon,
  Info,
  Flame,
  LogOut,
  X,
} from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useQuestions } from '@/context/QuestionsContext'
import { useAuth } from '@/context/AuthContext'
import { getCurrentStreak } from '@/utils/stats'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/questions', label: 'My Questions', icon: ListChecks },
  { to: '/add', label: 'Add Question', icon: PlusCircle },
  { to: '/random', label: 'Random Revision', icon: Shuffle },
  { to: '/smart', label: 'Smart Revision', icon: Target },
  { to: '/custom-revision', label: 'Custom Revision', icon: Layers },
  { to: '/progress', label: 'Progress', icon: LineChart },
  { to: '/history', label: 'History', icon: HistoryIcon },
]

const SECONDARY = [
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
  { to: '/about', label: 'About', icon: Info },
]

function NavItem({ item, onNavigate }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-ember-500/12 text-ember-300'
            : 'text-muted hover:bg-white/5 hover:text-text'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            strokeWidth={2}
            className={isActive ? 'text-ember-400' : 'text-faint group-hover:text-muted'}
          />
          {item.label}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar({ open, onClose }) {
  const { questions } = useQuestions()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const streak = getCurrentStreak(questions)

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-line bg-[#0a0b10]/95 backdrop-blur-xl transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-6 pb-5">
          <Logo />
          <button
            onClick={onClose}
            className="text-faint hover:text-text lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {NAV.map((item) => (
            <NavItem key={item.to} item={item} onNavigate={onClose} />
          ))}
          <div className="!mt-4 border-t border-line pt-4">
            {SECONDARY.map((item) => (
              <NavItem key={item.to} item={item} onNavigate={onClose} />
            ))}
          </div>
        </nav>

        <div className="p-3">
          <div className="rounded-2xl border border-ember-500/20 bg-gradient-to-br from-ember-500/10 to-transparent p-4">
            <div className="flex items-center gap-2 text-ember-300">
              <Flame size={16} className="fill-ember-400 text-ember-400" />
              <p className="text-sm font-semibold">{streak}-day streak</p>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              {questions.length > 0
                ? `${questions.length} problems tracked. Keep the streak alive today.`
                : 'Add your first problem to start building a streak.'}
            </p>
          </div>
          <button
            onClick={() => { logout(); onClose(); navigate('/', { replace: true }) }}
            className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-text"
          >
            <LogOut size={18} className="text-faint" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
