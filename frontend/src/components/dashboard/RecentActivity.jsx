import { Link } from 'react-router-dom'
import { CheckCircle2, Meh, XCircle, BookOpen } from 'lucide-react'
import { OUTCOME_META } from '@/utils/spacedRepetition'
import { formatRelative } from '@/utils/date'

const ICONS = { easy: CheckCircle2, difficult: Meh, failed: XCircle, saw_solution: BookOpen }
const TONES = {
  easy: 'text-easy bg-easy/10',
  difficult: 'text-medium bg-medium/10',
  failed: 'text-hard bg-hard/10',
  saw_solution: 'text-muted bg-white/5',
}

export default function RecentActivity({ events }) {
  return (
    <div className="rounded-2xl border border-line bg-panel-2/80 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Recent activity</h3>
        <Link to="/history" className="text-xs font-medium text-ember-400 hover:text-ember-300">
          View all
        </Link>
      </div>
      <div className="mt-3 space-y-1">
        {events.length === 0 && (
          <p className="py-6 text-center text-sm text-muted">No revisions logged yet.</p>
        )}
        {events.map((e) => {
          const Icon = ICONS[e.outcome]
          return (
            <div key={e.id} className="flex items-center gap-3 rounded-lg px-1.5 py-2 transition-colors hover:bg-white/5">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${TONES[e.outcome]}`}>
                <Icon size={15} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-text">{e.title}</p>
                <p className="text-xs text-faint">{OUTCOME_META[e.outcome].label}</p>
              </div>
              <span className="shrink-0 text-xs text-faint">{formatRelative(e.date)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
