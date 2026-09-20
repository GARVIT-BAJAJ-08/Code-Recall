import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useQuestions } from '@/context/QuestionsContext'
import ReviewSession from '@/components/questions/ReviewSession'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'

export default function ReviewSessionPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { questions } = useQuestions()
  const question = questions.find((q) => q.id === id)

  if (!question) {
    return (
      <div className="mx-auto max-w-lg pt-10">
        <EmptyState
          title="Problem not found"
          description="It may have been removed from your saved questions."
          action={<Button to="/questions">Back to My Questions</Button>}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/questions" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
        <ArrowLeft size={15} />
        Back to My Questions
      </Link>
      <ReviewSession question={question} onNext={() => navigate('/dashboard')} nextLabel="Back to dashboard" />
    </div>
  )
}
