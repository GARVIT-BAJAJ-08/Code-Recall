import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Search, Bell, Menu } from 'lucide-react'
import { useQuestions } from '@/context/QuestionsContext'
import { useAuth } from '@/context/AuthContext'

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate()
  const { questions } = useQuestions()
  const { user } = useAuth()
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(query.trim() ? `/questions?q=${encodeURIComponent(query.trim())}` : '/questions')
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line/80 bg-ink/80 px-4 py-3.5 backdrop-blur-xl sm:px-6">
      <button
        onClick={onMenuClick}
        className="text-muted hover:text-text lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <form onSubmit={handleSubmit} className="relative flex-1 max-w-xl">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Search problems, topics, or LeetCode #..."
          className="h-10 w-full rounded-xl border border-line bg-panel-2/70 pl-10 pr-14 text-sm text-text placeholder:text-faint outline-none transition-colors focus:border-ember-500/50"
        />
        <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-line bg-panel-3 px-1.5 py-0.5 font-mono text-[10px] text-faint sm:block">
          Ctrl K
        </kbd>
      </form>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-white/5 hover:text-text"
          aria-label="Notifications"
        >
          <Bell size={19} />
          {questions.length > 0 && (
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-ember-400" />
          )}
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2.5 rounded-xl border border-line bg-panel-2/60 py-1.5 pl-1.5 pr-3 transition-colors hover:border-ember-500/40"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-ember-300 to-ember-600 text-xs font-bold text-[#1a0f00]">
            {user?.name?.slice(0, 2).toUpperCase() || 'CR'}
          </div>
          <div className="hidden text-left leading-tight sm:block">
            <p className="text-sm font-medium text-text">{user?.name || 'CodeRecall user'}</p>
            <p className="text-[11px] text-faint">Level 7</p>
          </div>
        </button>
      </div>
    </header>
  )
}
