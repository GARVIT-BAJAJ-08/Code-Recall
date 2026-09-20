const styles = {
  high: 'text-hard bg-hard/10 border-hard/25',
  medium: 'text-medium bg-medium/10 border-medium/25',
  low: 'text-muted bg-white/5 border-line',
}

const labels = {
  high: 'High priority',
  medium: 'Medium priority',
  low: 'Low priority',
}

export default function PriorityPill({ priority = 'medium', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${styles[priority]} ${className}`}
    >
      {labels[priority]}
    </span>
  )
}
