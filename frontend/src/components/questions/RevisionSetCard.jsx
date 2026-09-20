import { useNavigate } from 'react-router-dom'
import { ExternalLink, Play } from 'lucide-react'
import DifficultyBadge from '@/components/ui/DifficultyBadge'

export default function RevisionSetCard({ question }) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col rounded-2xl border border-line bg-panel-2/80 p-4 backdrop-blur-sm transition-colors hover:border-ember-500/30">
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-panel-3 font-mono-num text-xs font-semibold text-faint">
          {question.problemNumber ?? '—'}
        </div>
        {question.link && (
          <a
            href={question.link}
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-faint transition-colors hover:bg-white/5 hover:text-ember-400"
            aria-label="Open problem link"
          >
            <ExternalLink size={15} />
          </a>
        )}
      </div>

      <p className="mt-3 line-clamp-2 text-sm font-semibold text-text">{question.title}</p>

      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span>{question.topic}</span>
        <DifficultyBadge difficulty={question.difficulty} />
      </div>

      <button
        onClick={() => navigate(`/review/${question.id}`)}
        className="mt-4 flex h-9 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-b from-ember-400 to-ember-600 text-sm font-semibold text-[#1a0f00] transition-all hover:brightness-110"
      >
        <Play size={12} fill="currentColor" />
        Start Revision
      </button>
    </div>
  )
}
