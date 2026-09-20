export const startOfDay = (d) => {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  return copy
}

export const daysBetween = (a, b) => {
  const MS = 1000 * 60 * 60 * 24
  return Math.round((startOfDay(b) - startOfDay(a)) / MS)
}

export const addDays = (date, n) => {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + n)
  return copy.toISOString()
}

export const isToday = (isoDate) => daysBetween(new Date(isoDate), new Date()) === 0

export const isOverdue = (isoDate) => daysBetween(new Date(isoDate), new Date()) > 0

export const isDueOrOverdue = (isoDate) => daysBetween(new Date(isoDate), new Date()) >= 0

export const formatRelative = (isoDate) => {
  const diff = daysBetween(new Date(), new Date(isoDate))
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  if (diff > 1) return `In ${diff} days`
  return `${Math.abs(diff)} days ago`
}

export const formatDate = (isoDate) => {
  if (!isoDate) return 'Never'
  return new Date(isoDate).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const formatDateShort = (isoDate) =>
  new Date(isoDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
