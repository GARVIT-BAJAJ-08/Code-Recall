import { useState } from 'react'
import { ExternalLink, CheckCircle2, Meh, XCircle, BookOpen, ArrowRight } from 'lucide-react'
import DifficultyBadge from '@/components/ui/DifficultyBadge'
import Button from '@/components/ui/Button'
import { useQuestions } from '@/context/QuestionsContext'
import { formatDate, formatRelative } from '@/utils/date'
import { OUTCOME_META } from '@/utils/spacedRepetition'

const OUTCOME_ICONS = {
  easy: CheckCircle2,
  difficult: Meh,
  failed: XCircle,
  saw_solution: BookOpen,
}

const OUTCOME_STYLES = {
  easy: 'border-easy/30 hover:bg-easy/10 hover:border-easy/50 text-easy',
  difficult: 'border-medium/30 hover:bg-medium/10 hover:border-medium/50 text-medium',
  failed: 'border-hard/30 hover:bg-hard/10 hover:border-hard/50 text-hard',
  saw_solution: 'border-line hover:bg-white/5 hover:border-faint text-muted',
}

export default function ReviewSession({ question, onNext, nextLabel = 'Back to dashboard' }) {
  const { reviewQuestion } = useQuestions()
  const [result, setResult] = useState(null)
  const [nextDate, setNextDate] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!question) return null

  const handleOutcome = async (outcome) => {
    setError('')
    setSubmitting(true)
    try {
      const updated = await reviewQuestion(question.id, outcome)
      setNextDate(updated.nextRevision)
      setResult(outcome)
    } catch (requestError) {
      setError(requestError.message || 'Could not save your review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    const meta = OUTCOME_META[result]
    return (
      <div className="animate-fade-up rounded-2xl border border-line bg-panel-2/80 p-6 text-center backdrop-blur-sm sm:p-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-ember-400/10 text-ember-400">
          <CheckCircle2 size={24} />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-text">Revision logged</h2>
        <p className="mt-1.5 text-sm text-muted">
          Marked as <span className="font-medium text-text">{meta.label.toLowerCase()}</span>.{' '}
          {meta.description}.
        </p>
        <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-xl border border-line bg-panel-3 px-4 py-2.5 text-sm">
          <span className="text-muted">Next revision:</span>
          <span className="font-mono-num font-semibold text-ember-300">
            {formatRelative(nextDate)}
          </span>
        </div>
        <div className="mt-6">
          <Button onClick={onNext} className="mx-auto">
            {nextLabel}
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-up space-y-5">
      <div className="rounded-2xl border border-line bg-panel-2/80 p-5 backdrop-blur-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono-num text-xs text-faint">
              {question.problemNumber ? `#${question.problemNumber}` : 'Custom'}
            </p>
            <h2 className="mt-1 text-xl font-bold text-text">{question.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
              <span>{question.topic}</span>
              <span className="text-faint">·</span>
              <DifficultyBadge difficulty={question.difficulty} />
            </div>
          </div>
          {question.link && (
            <a
              href={question.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-line bg-panel-3 px-3 py-2 text-sm font-medium text-text transition-colors hover:border-ember-500/40"
            >
              Open problem
              <ExternalLink size={14} />
            </a>
          )}
        </div>

        {question.notes && (
          <div className="mt-4 rounded-xl border border-line/70 bg-panel-3/60 p-3.5 text-sm text-muted">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-faint">
              Your notes
            </p>
            {question.notes}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-faint">
          <span>Last revised: {question.lastRevised ? formatDate(question.lastRevised) : 'Never'}</span>
          <span>Reviews so far: {question.reviewCount}</span>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-text">How did it go?</p>
        {error && <p className="mb-3 rounded-lg border border-hard/30 bg-hard/10 px-3 py-2 text-sm text-hard">{error}</p>}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {Object.entries(OUTCOME_META).map(([key, meta]) => {
            const Icon = OUTCOME_ICONS[key]
            return (
              <button
                key={key}
                disabled={submitting}
                onClick={() => handleOutcome(key)}
                className={`flex items-center gap-3 rounded-xl border bg-panel-3/40 p-4 text-left transition-colors disabled:opacity-50 ${OUTCOME_STYLES[key]}`}
              >
                <Icon size={20} strokeWidth={2} />
                <div>
                  <p className="text-sm font-semibold text-text">{meta.label}</p>
                  <p className="text-xs text-muted">{meta.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
