const styles = {
  Easy: 'text-easy bg-easy/10 border-easy/25',
  Medium: 'text-medium bg-medium/10 border-medium/25',
  Hard: 'text-hard bg-hard/10 border-hard/25',
}

export default function DifficultyBadge({ difficulty, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${styles[difficulty] || styles.Medium} ${className}`}
    >
      {difficulty}
    </span>
  )
}
