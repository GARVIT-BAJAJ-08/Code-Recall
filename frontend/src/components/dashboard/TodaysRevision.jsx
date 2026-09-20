import { Link } from 'react-router-dom'
import { CalendarCheck } from 'lucide-react'
import QuestionRow from '@/components/questions/QuestionRow'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'

export default function TodaysRevision({ questions }) {
  return (
    <div className="rounded-2xl border border-line bg-panel-2/80 p-5 backdrop-blur-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-text">Today's revision</h3>
          {questions.length > 0 && (
            <span className="rounded-full bg-ember-400/15 px-2 py-0.5 font-mono-num text-xs font-semibold text-ember-300">
              {questions.length}
            </span>
          )}
        </div>
        <Link to="/questions" className="text-xs font-medium text-ember-400 hover:text-ember-300">
          View all
        </Link>
      </div>

      <div className="mt-4 space-y-2.5">
        {questions.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="You're all caught up"
            description="No problems are due for revision right now."
            action={
              <Button to="/random" variant="secondary" size="sm">
                Try a random problem instead
              </Button>
            }
          />
        ) : (
          questions.slice(0, 5).map((q) => <QuestionRow key={q.id} question={q} />)
        )}
      </div>
    </div>
  )
}
