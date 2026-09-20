import { useMemo, useState } from 'react'
import { CheckCircle2, Meh, XCircle, BookOpen, History as HistoryIcon } from 'lucide-react'
import { useQuestions } from '@/context/QuestionsContext'
import DifficultyBadge from '@/components/ui/DifficultyBadge'
import EmptyState from '@/components/ui/EmptyState'
import { OUTCOME_META } from '@/utils/spacedRepetition'
import { formatDate, formatRelative } from '@/utils/date'

const ICONS = { easy: CheckCircle2, difficult: Meh, failed: XCircle, saw_solution: BookOpen }
const TONES = {
  easy: 'text-easy bg-easy/10',
  difficult: 'text-medium bg-medium/10',
  failed: 'text-hard bg-hard/10',
  saw_solution: 'text-muted bg-white/5',
}

const FILTERS = ['All', ...Object.keys(OUTCOME_META)]

export default function HistoryPage() {
  const { questions } = useQuestions()
  const [filter, setFilter] = useState('All')

  const events = useMemo(() => {
    const all = []
    questions.forEach((q) => {
      ;(q.history || []).forEach((h) => {
        all.push({
          id: `${q.id}-${h.date}`,
          title: q.title,
          topic: q.topic,
          difficulty: q.difficulty,
          outcome: h.outcome,
          date: h.date,
        })
      })
    })
    return all
      .filter((e) => (filter === 'All' ? true : e.outcome === filter))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [questions, filter])

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-text">History</h1>
        <p className="mt-1 text-sm text-muted">Every revision you've logged, most recent first.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f
                ? 'border-ember-500/50 bg-ember-500/10 text-ember-300'
                : 'border-line text-muted hover:text-text'
            }`}
          >
            {f === 'All' ? 'All' : OUTCOME_META[f].label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-line bg-panel-2/80 backdrop-blur-sm">
        {events.length === 0 ? (
          <EmptyState
            icon={HistoryIcon}
            title="No revisions logged yet"
            description="Once you start revising problems, they'll show up here."
          />
        ) : (
          <div className="divide-y divide-line/70">
            {events.map((e) => {
              const Icon = ICONS[e.outcome]
              return (
                <div key={e.id} className="flex items-center gap-3.5 p-4">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${TONES[e.outcome]}`}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text">{e.title}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                      <span>{e.topic}</span>
                      <DifficultyBadge difficulty={e.difficulty} />
                      <span>· {OUTCOME_META[e.outcome].label}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-muted">{formatRelative(e.date)}</p>
                    <p className="text-[11px] text-faint">{formatDate(e.date)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
