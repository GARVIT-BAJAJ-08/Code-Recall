import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function WeakestTopics({ topics }) {
  return (
    <div className="rounded-2xl border border-line bg-panel-2/80 p-5 backdrop-blur-sm">
      <h3 className="text-sm font-semibold text-text">Weakest topics</h3>
      <p className="mt-0.5 text-xs text-muted">Lowest mastery based on recent outcomes</p>

      <div className="mt-4 space-y-4">
        {topics.map((t) => (
          <div key={t.topic}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-text">{t.topic}</span>
              <span className="font-mono-num text-xs text-hard">{t.mastery}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-panel-3">
              <div
                className="h-full rounded-full bg-hard/70"
                style={{ width: `${Math.max(4, t.mastery)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/smart"
        className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-line bg-panel-3 py-2.5 text-sm font-medium text-text transition-colors hover:border-ember-500/40"
      >
        <Compass size={15} />
        Focus these topics
      </Link>
    </div>
  )
}
