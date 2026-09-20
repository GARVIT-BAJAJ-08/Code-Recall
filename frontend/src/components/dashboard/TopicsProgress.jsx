import { Link } from 'react-router-dom'

export default function TopicsProgress({ topics }) {
  return (
    <div className="rounded-2xl border border-line bg-panel-2/80 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Topic mastery</h3>
        <Link to="/progress" className="text-xs font-medium text-ember-400 hover:text-ember-300">
          View all
        </Link>
      </div>
      <div className="mt-4 space-y-3.5">
        {topics.slice(0, 6).map((t) => (
          <div key={t.topic}>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-muted">{t.topic}</span>
              <span className="font-mono-num text-faint">{t.mastery}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-panel-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-ember-500 to-ember-300 transition-all duration-500"
                style={{ width: `${Math.max(4, t.mastery)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
