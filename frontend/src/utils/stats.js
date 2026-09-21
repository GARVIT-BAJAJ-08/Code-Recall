import { isDueOrOverdue, daysBetween } from './date'

export function getDifficultyBreakdown(questions) {
  const counts = { Easy: 0, Medium: 0, Hard: 0 }
  questions.forEach((q) => {
    counts[q.difficulty] = (counts[q.difficulty] || 0) + 1
  })
  const total = questions.length || 1
  return ['Easy', 'Medium', 'Hard'].map((difficulty) => ({
    difficulty,
    count: counts[difficulty],
    percent: Math.round((counts[difficulty] / total) * 100),
  }))
}

// Mastery is derived straight from each question's ease factor, the same
// number the spaced-repetition scheduler already tracks (1.3 = struggling,
// 2.8 = mastered). No separate "AI confidence score" -- just a readout of
// the scheduling data that already exists.
const EASE_MIN = 1.3
const EASE_MAX = 2.8

export function getTopicStats(questions) {
  const byTopic = new Map()
  questions.forEach((q) => {
    if (!byTopic.has(q.topic)) byTopic.set(q.topic, [])
    byTopic.get(q.topic).push(q)
  })

  return Array.from(byTopic.entries())
    .map(([topic, items]) => {
      const reviewed = items.filter((q) => q.reviewCount > 0)
      const mastery =
        reviewed.length === 0
          ? 0
          : Math.round(
              (reviewed.reduce(
                (sum, q) => sum + (q.easeFactor - EASE_MIN) / (EASE_MAX - EASE_MIN),
                0
              ) /
                reviewed.length) *
                100
            )
      return {
        topic,
        count: items.length,
        mastery: Math.max(0, Math.min(100, mastery)),
      }
    })
    .sort((a, b) => b.count - a.count)
}

export function getWeakestTopics(questions, limit = 3) {
  return getTopicStats(questions)
    .filter((t) => t.count > 0)
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, limit)
}

export function getRevisionActivity(questions, days = 7) {
  const buckets = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    buckets.push({ date: d, label: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }), count: 0 })
  }
  questions.forEach((q) => {
    ;(q.history || []).forEach((h) => {
      const bucket = buckets.find((b) => daysBetween(new Date(h.date), b.date) === 0)
      if (bucket) bucket.count += 1
    })
  })
  return buckets
}

export function getDueCount(questions) {
  return questions.filter((q) => isDueOrOverdue(q.nextRevision)).length
}

export function getCurrentStreak(questions) {
  const dayKeys = new Set(
    questions
      .flatMap((q) => (q.history || []).map((h) => h.date).filter(Boolean))
      .map((date) => {
        const d = new Date(date)
        if (Number.isNaN(d.getTime())) return null
        d.setHours(0, 0, 0, 0)
        return d.toISOString().slice(0, 10)
      })
      .filter(Boolean)
  )

  if (dayKeys.size === 0) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let streak = 0
  let cursor = new Date(today)

  while (dayKeys.has(cursor.toISOString().slice(0, 10))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  if (streak > 0) return streak

  const latestDate = [...dayKeys]
    .map((key) => new Date(`${key}T00:00:00`))
    .sort((a, b) => b - a)[0]

  if (!latestDate) return 0

  cursor = new Date(latestDate)
  while (dayKeys.has(cursor.toISOString().slice(0, 10))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

export function getUpcoming(questions, limit = 5) {
  return questions
    .filter((q) => !isDueOrOverdue(q.nextRevision))
    .sort((a, b) => new Date(a.nextRevision) - new Date(b.nextRevision))
    .slice(0, limit)
}

export function getRecentActivity(questions, limit = 6) {
  const events = []
  questions.forEach((q) => {
    ;(q.history || []).forEach((h) => {
      events.push({ id: `${q.id}-${h.date}`, title: q.title, difficulty: q.difficulty, outcome: h.outcome, date: h.date })
    })
  })
  return events.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit)
}
