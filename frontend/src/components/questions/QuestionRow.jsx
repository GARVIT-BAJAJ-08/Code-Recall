import { useNavigate } from 'react-router-dom'
import { Play } from 'lucide-react'
import DifficultyBadge from '@/components/ui/DifficultyBadge'
import PriorityPill from '@/components/ui/PriorityPill'
import { formatRelative } from '@/utils/date'

export default function QuestionRow({ question, showPriority = true }) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line/70 bg-panel-3/50 p-3.5 transition-colors hover:border-ember-500/30 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-panel-2 font-mono-num text-xs font-semibold text-faint">
        {question.problemNumber ?? '—'}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text">{question.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
          <span>{question.topic}</span>
          <span className="text-faint">·</span>
          <DifficultyBadge difficulty={question.difficulty} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center sm:gap-1.5">
        <span className="text-xs text-faint">
          {question.lastRevised ? `Revised ${formatRelative(question.lastRevised)}` : 'Not revised yet'}
        </span>
        {showPriority && <PriorityPill priority={question.priority} />}
      </div>

      <button
        onClick={() => navigate(`/review/${question.id}`)}
        className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-b from-ember-400 to-ember-600 px-3.5 text-sm font-semibold text-[#1a0f00] transition-all hover:brightness-110"
      >
        <Play size={13} fill="currentColor" />
        Start
      </button>
    </div>
  )
}
