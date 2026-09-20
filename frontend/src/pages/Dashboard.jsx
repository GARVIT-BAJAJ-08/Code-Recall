import { useNavigate } from 'react-router-dom'
import { ListChecks, CheckCircle2, Clock, Flame } from 'lucide-react'
import { useQuestions } from '@/context/QuestionsContext'
import HeroBanner from '@/components/dashboard/HeroBanner'
import StatCard from '@/components/ui/StatCard'
import TodaysRevision from '@/components/dashboard/TodaysRevision'
import DifficultyDonut from '@/components/dashboard/DifficultyDonut'
import TopicsProgress from '@/components/dashboard/TopicsProgress'
import RevisionActivityChart from '@/components/dashboard/RevisionActivityChart'
import UpcomingRevisions from '@/components/dashboard/UpcomingRevisions'
import WeakestTopics from '@/components/dashboard/WeakestTopics'
import RecentActivity from '@/components/dashboard/RecentActivity'
import { useAuth } from '@/context/AuthContext'
import {
  getDifficultyBreakdown,
  getTopicStats,
  getWeakestTopics,
  getRevisionActivity,
  getUpcoming,
  getRecentActivity,
} from '@/utils/stats'

export default function Dashboard() {
  const navigate = useNavigate()
  const { questions, dueToday, loading } = useQuestions()
  const { user } = useAuth()

  if (loading) {
    return <div className="py-24 text-center text-sm text-muted">Loading your dashboard...</div>
  }

  const revisedCount = questions.filter((q) => q.reviewCount > 0).length
  const difficultyData = getDifficultyBreakdown(questions)
  const topicStats = getTopicStats(questions)
  const weakest = getWeakestTopics(questions)
  const activity = getRevisionActivity(questions)
  const upcoming = getUpcoming(questions)
  const recent = getRecentActivity(questions)

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <HeroBanner dueCount={dueToday.length} name={user?.name?.split(' ')[0]} onStartRevision={() => navigate('/smart')} />

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <StatCard icon={ListChecks} value={questions.length} label="Total problems" />
        <StatCard icon={CheckCircle2} value={revisedCount} label="Problems revised" tone="easy" />
        <StatCard icon={Clock} value={dueToday.length} label="Due today" tone="hard" />
        <StatCard icon={Flame} value="7" label="Day streak" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <TodaysRevision questions={dueToday} />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <UpcomingRevisions questions={upcoming} />
            <WeakestTopics topics={weakest} />
          </div>
        </div>

        <div className="space-y-6">
          <DifficultyDonut data={difficultyData} total={questions.length} />
          <TopicsProgress topics={topicStats} />
          <RevisionActivityChart data={activity} />
        </div>
      </div>

      <RecentActivity events={recent} />
    </div>
  )
}
