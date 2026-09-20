import { useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Search, Trash2, ExternalLink, Play, SlidersHorizontal, X } from 'lucide-react'
import { useQuestions } from '@/context/QuestionsContext'
import DifficultyBadge from '@/components/ui/DifficultyBadge'
import PriorityPill from '@/components/ui/PriorityPill'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { TOPICS, DIFFICULTIES } from '@/data/sampleQuestions'
import { formatRelative, isDueOrOverdue } from '@/utils/date'

export default function MyQuestions() {
  const { questions, removeQuestion } = useQuestions()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [topic, setTopic] = useState('All')
  const [difficulty, setDifficulty] = useState('All')
  const [dueOnly, setDueOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return questions
      .filter((q) => {
        if (!query) return true
        const needle = query.toLowerCase()
        return q.title.toLowerCase().includes(needle) || q.topic.toLowerCase().includes(needle) || String(q.problemNumber ?? '').includes(needle)
      })
      .filter((q) => (topic === 'All' ? true : q.topic === topic))
      .filter((q) => (difficulty === 'All' ? true : q.difficulty === difficulty))
      .filter((q) => (dueOnly ? isDueOrOverdue(q.nextRevision) : true))
      .sort((a, b) => new Date(a.nextRevision) - new Date(b.nextRevision))
  }, [questions, query, topic, difficulty, dueOnly])

  const handleDelete = (id, title) => {
    if (window.confirm(`Remove "${title}" from your saved questions?`)) {
      removeQuestion(id)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text">My Questions</h1>
          <p className="mt-0.5 text-sm text-muted">
            {questions.length} saved · {filtered.length} shown
          </p>
        </div>
        <Button to="/add" size="md">
          Add Question
        </Button>
      </div>

      <div className="rounded-2xl border border-line bg-panel-2/80 p-4 backdrop-blur-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setParams(e.target.value ? { q: e.target.value } : {})
              }}
              placeholder="Search by title..."
              className="h-10 w-full rounded-xl border border-line bg-panel-3/70 pl-10 pr-9 text-sm text-text placeholder:text-faint outline-none focus:border-ember-500/50"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('')
                  setParams({})
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-text"
              >
                <X size={15} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters((s) => !s)}
            className={`flex h-10 shrink-0 items-center gap-1.5 rounded-xl border px-3.5 text-sm font-medium transition-colors ${
              showFilters ? 'border-ember-500/50 text-ember-300' : 'border-line text-muted hover:text-text'
            }`}
          >
            <SlidersHorizontal size={15} />
            Filters
          </button>
          <label className="flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-line px-3.5 text-sm text-muted hover:text-text">
            <input
              type="checkbox"
              checked={dueOnly}
              onChange={(e) => setDueOnly(e.target.checked)}
              className="accent-ember-500"
            />
            Due only
          </label>
        </div>

        {showFilters && (
          <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
            {['All', ...TOPICS].map((t) => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                  topic === t
                    ? 'border-ember-500/50 bg-ember-500/10 text-ember-300'
                    : 'border-line text-muted hover:text-text'
                }`}
              >
                {t}
              </button>
            ))}
            <span className="mx-1 h-5 w-px bg-line" />
            {['All', ...DIFFICULTIES].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                  difficulty === d
                    ? 'border-ember-500/50 bg-ember-500/10 text-ember-300'
                    : 'border-line text-muted hover:text-text'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-line bg-panel-2/80 backdrop-blur-sm">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No problems match"
            description="Try a different search term or clear your filters."
          />
        ) : (
          <div className="divide-y divide-line/70">
            {filtered.map((q) => (
              <div key={q.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-panel-3 font-mono-num text-xs font-semibold text-faint">
                  {q.problemNumber ?? '—'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-text">{q.title}</p>
                    {q.link && (
                      <a href={q.link} target="_blank" rel="noreferrer" className="shrink-0 text-faint hover:text-ember-400">
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span>{q.topic}</span>
                    <DifficultyBadge difficulty={q.difficulty} />
                    <PriorityPill priority={q.priority} />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:gap-1">
                  <span className="text-xs text-faint">{formatRelative(q.nextRevision)}</span>
                  <span className="text-[11px] text-faint">{q.reviewCount} reviews</span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => navigate(`/review/${q.id}`)}
                    className="flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-b from-ember-400 to-ember-600 px-3 text-sm font-semibold text-[#1a0f00] transition-all hover:brightness-110"
                  >
                    <Play size={12} fill="currentColor" />
                    Start
                  </button>
                  <button
                    onClick={() => handleDelete(q.id, q.title)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-faint transition-colors hover:bg-hard/10 hover:text-hard"
                    aria-label="Delete question"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
