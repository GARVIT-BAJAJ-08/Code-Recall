import { useMemo, useState, useCallback } from 'react'
import { Shuffle } from 'lucide-react'
import { useQuestions } from '@/context/QuestionsContext'
import ReviewSession from '@/components/questions/ReviewSession'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'

function pickRandom(pool) {
  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

export default function RandomRevision() {
  const { questions, dueToday } = useQuestions()
  const pool = dueToday.length > 0 ? dueToday : questions
  const [currentId, setCurrentId] = useState(() => pickRandom(pool)?.id ?? null)
  const [round, setRound] = useState(0)

  const current = useMemo(
    () => questions.find((q) => q.id === currentId) || null,
    [questions, currentId]
  )

  const shuffle = useCallback(() => {
    const candidates = pool.filter((q) => q.id !== currentId)
    const next = pickRandom(candidates.length > 0 ? candidates : pool)
    setCurrentId(next?.id ?? null)
    setRound((r) => r + 1)
  }, [pool, currentId])

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-lg pt-10">
        <EmptyState
          icon={Shuffle}
          title="No saved problems yet"
          description="Add a few problems first, then come back for a random pick."
          action={<Button to="/add">Add a question</Button>}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text">Random revision</h1>
          <p className="mt-1 text-sm text-muted">
            {dueToday.length > 0
              ? `Picking from ${dueToday.length} problems due today.`
              : 'Nothing due today — picking from your full set.'}
          </p>
        </div>
        <Button variant="secondary" onClick={shuffle}>
          <Shuffle size={15} />
          Shuffle
        </Button>
      </div>

      <ReviewSession key={`${current?.id}-${round}`} question={current} onNext={shuffle} nextLabel="Next random problem" />
    </div>
  )
}
