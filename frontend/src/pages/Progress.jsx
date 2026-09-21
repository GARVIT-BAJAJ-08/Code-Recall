import { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import { useQuestions } from '@/context/QuestionsContext'
import DifficultyDonut from '@/components/dashboard/DifficultyDonut'
import StatCard from '@/components/ui/StatCard'
import { ListChecks, CheckCircle2, TrendingUp, Flame } from 'lucide-react'
import {
  getDifficultyBreakdown,
  getTopicStats,
  getRevisionActivity,
  getCurrentStreak,
} from '@/utils/stats'

const RANGE_OPTIONS = [7, 14, 30]

function masteryColor(mastery) {
  if (mastery >= 66) return '#34c07a'
  if (mastery >= 33) return '#ffa726'
  return '#ef5a5a'
}

export default function Progress() {
  const { questions } = useQuestions()
  const [range, setRange] = useState(7)

  const difficultyData = getDifficultyBreakdown(questions)
  const topicStats = useMemo(() => getTopicStats(questions), [questions])
  const activity = useMemo(() => getRevisionActivity(questions, range), [questions, range])

  const totalReviews = questions.reduce((sum, q) => sum + q.reviewCount, 0)
  const streak = getCurrentStreak(questions)
  const easyOutcomes = questions.reduce(
    (sum, q) => sum + (q.history || []).filter((h) => h.outcome === 'easy').length,
    0
  )
  const successRate = totalReviews > 0 ? Math.round((easyOutcomes / totalReviews) * 100) : 0
  const avgMastery =
    topicStats.length > 0
      ? Math.round(topicStats.reduce((s, t) => s + t.mastery, 0) / topicStats.length)
      : 0

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-text">Progress</h1>
        <p className="mt-1 text-sm text-muted">
          How your revision habit and topic mastery are trending.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <StatCard icon={ListChecks} value={totalReviews} label="Total revisions" />
        <StatCard icon={CheckCircle2} value={`${successRate}%`} label="Solved easily rate" tone="easy" />
        <StatCard icon={TrendingUp} value={`${avgMastery}%`} label="Average mastery" />
        <StatCard icon={Flame} value={streak} label="Day streak" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-line bg-panel-2/80 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text">Revision activity</h3>
              <div className="flex gap-1 rounded-lg border border-line bg-panel-3 p-0.5">
                {RANGE_OPTIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      range === r ? 'bg-ember-500/15 text-ember-300' : 'text-muted hover:text-text'
                    }`}
                  >
                    {r}d
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activity} margin={{ top: 6, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#23262f" strokeDasharray="3 4" />
                  <XAxis dataKey="label" tick={{ fill: '#5c5f6c', fontSize: 11 }} axisLine={false} tickLine={false} interval={range > 7 ? 2 : 0} />
                  <YAxis allowDecimals={false} tick={{ fill: '#5c5f6c', fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
                  <Tooltip
                    contentStyle={{ background: '#14161f', border: '1px solid #23262f', borderRadius: 10, fontSize: 12 }}
                    labelStyle={{ color: '#8b8d9a' }}
                    cursor={{ fill: 'rgba(255,167,38,0.08)' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#ffa726" maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <DifficultyDonut data={difficultyData} total={questions.length} />
      </div>

      <div className="rounded-2xl border border-line bg-panel-2/80 p-5 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-text">Mastery by topic</h3>
        <p className="mt-0.5 text-xs text-muted">
          Derived from ease factor across every reviewed problem in that topic.
        </p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicStats} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke="#23262f" strokeDasharray="3 4" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#5c5f6c', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="topic"
                width={130}
                tick={{ fill: '#8b8d9a', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ background: '#14161f', border: '1px solid #23262f', borderRadius: 10, fontSize: 12 }}
                labelStyle={{ color: '#8b8d9a' }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                formatter={(value) => [`${value}%`, 'Mastery']}
              />
              <Bar dataKey="mastery" radius={[0, 4, 4, 0]} maxBarSize={16}>
                {topicStats.map((t) => (
                  <Cell key={t.topic} fill={masteryColor(t.mastery)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
