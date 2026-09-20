import { Mail, Calendar, Flame, Trophy, ListChecks } from 'lucide-react'
import { useQuestions } from '@/context/QuestionsContext'
import StatCard from '@/components/ui/StatCard'
import { getTopicStats } from '@/utils/stats'
import { useAuth } from '@/context/AuthContext'

export default function ProfilePage() {
  const { questions } = useQuestions()
  const { user } = useAuth()
  const topicStats = getTopicStats(questions)
  const strongestTopic = [...topicStats].sort((a, b) => b.mastery - a.mastery)[0]
  const revisedCount = questions.filter((q) => q.reviewCount > 0).length

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl border border-line bg-panel-2/80 p-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-ember-300 to-ember-600 text-xl font-bold text-[#1a0f00]">
            {user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'CR'}
          </div>
          <div>
            <h1 className="text-lg font-bold text-text">{user?.name || 'CodeRecall user'}</h1>
            <p className="flex items-center gap-1.5 text-sm text-muted">
              <Mail size={13} /> {user?.email}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-faint">
              <Calendar size={12} /> Member since Jan 2025
            </p>
          </div>
          <span className="ml-auto rounded-full border border-ember-500/30 bg-ember-500/10 px-3 py-1 text-sm font-semibold text-ember-300">
            Level 7
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <StatCard icon={ListChecks} value={questions.length} label="Saved problems" />
        <StatCard icon={Trophy} value={revisedCount} label="Problems revised" tone="easy" />
        <StatCard icon={Flame} value="7" label="Day streak" />
        <StatCard icon={Trophy} value={strongestTopic ? strongestTopic.topic : '—'} label="Strongest topic" tone="muted" />
      </div>

      <div className="rounded-2xl border border-line bg-panel-2/80 p-5 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-text">About your level</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Levels track consistency, not difficulty — they go up as you keep your revision streak
          alive and clear your due queue, not from solving harder problems. Level 7 means you've
          kept a steady rhythm over the last few weeks.
        </p>
      </div>
    </div>
  )
}
