// Deterministic spaced-repetition scheduler (SM-2 style), not a black box.
// Every question tracks an `interval` (days until next review) and an
// `easeFactor` (how quickly the interval grows). Each outcome nudges both
// in a fixed, explainable way -- there is no ML/AI involved here, just the
// same kind of rule-based scheduling Anki/SuperMemo use.

export const OUTCOME_META = {
  easy: {
    label: 'Solved easily',
    description: 'Push this further out',
    tone: 'easy',
  },
  difficult: {
    label: 'Solved with difficulty',
    description: 'Keep it in rotation',
    tone: 'medium',
  },
  failed: {
    label: "Couldn't solve",
    description: 'Bring it back tomorrow',
    tone: 'hard',
  },
  saw_solution: {
    label: 'Saw solution',
    description: 'Revisit very soon',
    tone: 'hard',
  },
}

const MIN_EASE = 1.3
const MAX_EASE = 2.8

export function scheduleNextReview(question, outcome) {
  const prevInterval = question.interval || 0
  let ease = question.easeFactor || 2.5
  let interval

  switch (outcome) {
    case 'easy':
      interval = prevInterval === 0 ? 4 : Math.round(prevInterval * ease)
      ease = Math.min(MAX_EASE, ease + 0.1)
      break
    case 'difficult':
      interval = prevInterval === 0 ? 2 : Math.max(2, Math.round(prevInterval * (ease - 1)))
      ease = Math.max(MIN_EASE, ease - 0.15)
      break
    case 'saw_solution':
      interval = 1
      ease = Math.max(MIN_EASE, ease - 0.2)
      break
    case 'failed':
    default:
      interval = 1
      ease = Math.max(MIN_EASE, ease - 0.3)
      break
  }

  const priority = interval <= 2 ? 'high' : interval <= 6 ? 'medium' : 'low'
  const next = new Date()
  next.setDate(next.getDate() + interval)

  return {
    interval,
    easeFactor: Number(ease.toFixed(2)),
    priority,
    nextRevision: next.toISOString(),
    lastRevised: new Date().toISOString(),
    reviewCount: (question.reviewCount || 0) + 1,
    history: [...(question.history || []), { date: new Date().toISOString(), outcome }],
  }
}

// Priority score used by Smart Revision to rank what to show next:
// weight overdue problems, harder difficulty, and questions already
// flagged high-priority from a recent bad outcome.
export function priorityScore(question, today = new Date()) {
  const due = new Date(question.nextRevision)
  const daysOverdue = Math.round((today - due) / (1000 * 60 * 60 * 24))
  const difficultyWeight = { Easy: 1, Medium: 1.5, Hard: 2 }[question.difficulty] || 1
  const priorityWeight = { high: 3, medium: 1.5, low: 1 }[question.priority] || 1
  const neverRevisedBoost = question.lastRevised ? 0 : 2
  return Math.max(0, daysOverdue) * difficultyWeight * priorityWeight + neverRevisedBoost
}
