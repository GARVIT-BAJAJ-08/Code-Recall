import { Link } from 'react-router-dom'
import DifficultyBadge from '@/components/ui/DifficultyBadge'
import { formatRelative, formatDateShort } from '@/utils/date'

export default function UpcomingRevisions({ questions }) {
  return (
    <div className="rounded-2xl border border-line bg-panel-2/80 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Upcoming revisions</h3>
        <Link to="/questions" className="text-xs font-medium text-ember-400 hover:text-ember-300">
          View all
        </Link>
      </div>
      <div className="mt-3 divide-y divide-line/70">
        {questions.length === 0 && (
          <p className="py-6 text-center text-sm text-muted">Nothing scheduled yet.</p>
        )}
        {questions.map((q) => (
          <div key={q.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-panel-3 font-mono-num text-[11px] font-semibold text-faint">
              {q.problemNumber ?? '—'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text">{q.title}</p>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                <span>{q.topic}</span>
                <span className="text-faint">·</span>
                <DifficultyBadge difficulty={q.difficulty} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-ember-300">{formatRelative(q.nextRevision)}</p>
              <p className="text-[11px] text-faint">{formatDateShort(q.nextRevision)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
