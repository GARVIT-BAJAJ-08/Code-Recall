import { useMemo, useState } from 'react'
import { Target } from 'lucide-react'
import { useQuestions } from '@/context/QuestionsContext'
import { priorityScore } from '@/utils/spacedRepetition'
import ReviewSession from '@/components/questions/ReviewSession'
import DifficultyBadge from '@/components/ui/DifficultyBadge'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'

export default function SmartRevision() {
  const { questions } = useQuestions()
  const [cursor, setCursor] = useState(0)

  const queue = useMemo(
    () =>
      [...questions]
        .map((q) => ({ ...q, score: priorityScore(q) }))
        .sort((a, b) => b.score - a.score),
    [questions]
  )

  const current = queue[cursor] || null

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-lg pt-10">
        <EmptyState
          icon={Target}
          title="Nothing to prioritize yet"
          description="Add problems and CodeRecall will rank them by how overdue and difficult they are."
          action={<Button to="/add">Add a question</Button>}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-text">Smart revision</h1>
        <p className="mt-1 text-sm text-muted">
          Ranked by how overdue each problem is, weighted by difficulty and priority.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <ReviewSession
          key={`${current?.id}-${cursor}`}
          question={current}
          onNext={() => setCursor((c) => (c + 1 < queue.length ? c + 1 : 0))}
          nextLabel="Next in queue"
        />

        <div className="rounded-2xl border border-line bg-panel-2/80 p-4 backdrop-blur-sm">
          <h3 className="mb-3 px-1 text-sm font-semibold text-text">Up next</h3>
          <div className="max-h-[520px] space-y-1.5 overflow-y-auto">
            {queue.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCursor(i)}
                className={`flex w-full items-center gap-2.5 rounded-xl border p-2.5 text-left transition-colors ${
                  i === cursor
                    ? 'border-ember-500/40 bg-ember-500/10'
                    : 'border-transparent hover:bg-white/5'
                }`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-panel-3 font-mono-num text-[11px] font-semibold text-faint">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <p className="truncate text-sm text-text">{q.title}</p>
                  <span className="flex items-center gap-1.5 text-xs text-muted">
                    {q.topic}
                    <DifficultyBadge difficulty={q.difficulty} className="!py-0" />
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
