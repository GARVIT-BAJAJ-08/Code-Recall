import { useState } from 'react'
import { Shuffle, RotateCcw, Layers } from 'lucide-react'
import { useQuestions } from '@/context/QuestionsContext'
import { TOPICS, DIFFICULTIES } from '@/data/sampleQuestions'
import RevisionSetCard from '@/components/questions/RevisionSetCard'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'

const COUNT_PRESETS = [5, 10, 15, 20]
const MAX_CUSTOM = 100

function shuffleArray(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function CustomRevision() {
  const { questions } = useQuestions()
  const [count, setCount] = useState(10)
  const [customCount, setCustomCount] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [topic, setTopic] = useState('Any')
  const [difficulty, setDifficulty] = useState('Any')
  const [generated, setGenerated] = useState(null)

  const effectiveCount = isCustom
    ? Math.max(1, Math.min(MAX_CUSTOM, Number(customCount) || 0))
    : count

  const matchingCount = questions
    .filter((q) => (topic === 'Any' ? true : q.topic === topic))
    .filter((q) => (difficulty === 'Any' ? true : q.difficulty === difficulty)).length

  const handleGenerate = () => {
    const pool = questions
      .filter((q) => (topic === 'Any' ? true : q.topic === topic))
      .filter((q) => (difficulty === 'Any' ? true : q.difficulty === difficulty))
    setGenerated(shuffleArray(pool).slice(0, effectiveCount))
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-text">Custom revision</h1>
        <p className="mt-1 text-sm text-muted">
          Build a one-off revision set filtered by topic and difficulty.
        </p>
      </div>

      <div className="space-y-5 rounded-2xl border border-line bg-panel-2/80 p-5 backdrop-blur-sm sm:p-6">
        <div>
          <p className="mb-2 text-sm font-medium text-text">Number of questions</p>
          <div className="flex flex-wrap items-center gap-2">
            {COUNT_PRESETS.map((n) => (
              <button
                key={n}
                onClick={() => {
                  setCount(n)
                  setIsCustom(false)
                }}
                className={`h-9 min-w-[44px] rounded-lg border px-3 text-sm font-medium transition-colors ${
                  !isCustom && count === n
                    ? 'border-ember-500/50 bg-ember-500/10 text-ember-300'
                    : 'border-line text-muted hover:text-text'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setIsCustom(true)}
              className={`h-9 rounded-lg border px-3.5 text-sm font-medium transition-colors ${
                isCustom
                  ? 'border-ember-500/50 bg-ember-500/10 text-ember-300'
                  : 'border-line text-muted hover:text-text'
              }`}
            >
              Custom
            </button>
            {isCustom && (
              <input
                type="number"
                min={1}
                max={MAX_CUSTOM}
                value={customCount}
                onChange={(e) => setCustomCount(e.target.value)}
                placeholder="e.g. 12"
                className="h-9 w-24 rounded-lg border border-line bg-panel-3/70 px-3 text-sm text-text placeholder:text-faint outline-none focus:border-ember-500/50"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium text-text">Topic</p>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="h-10 w-full rounded-xl border border-line bg-panel-3/70 px-3.5 text-sm text-text outline-none focus:border-ember-500/50"
            >
              <option value="Any">Any topic</option>
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-text">Difficulty</p>
            <div className="grid grid-cols-4 gap-2">
              {['Any', ...DIFFICULTIES].map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`h-10 rounded-xl border text-sm font-medium transition-colors ${
                    difficulty === d
                      ? 'border-ember-500/50 bg-ember-500/10 text-ember-300'
                      : 'border-line text-muted hover:text-text'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <Button onClick={handleGenerate}>
            <Shuffle size={15} />
            Generate Revision
          </Button>
          {generated && (
            <Button variant="secondary" onClick={() => setGenerated(null)}>
              <RotateCcw size={15} />
              Reset
            </Button>
          )}
          <span className="text-xs text-faint">
            {matchingCount} problem{matchingCount !== 1 ? 's' : ''} match this filter
          </span>
        </div>
      </div>

      {generated &&
        (generated.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No matching problems"
            description="Try a different topic or difficulty, or add more problems to your library."
            action={<Button to="/add">Add a question</Button>}
          />
        ) : (
          <div>
            <p className="mb-3 text-sm text-muted">
              {generated.length} question{generated.length !== 1 ? 's' : ''} in this revision set
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {generated.map((q) => (
                <RevisionSetCard key={q.id} question={q} />
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}
