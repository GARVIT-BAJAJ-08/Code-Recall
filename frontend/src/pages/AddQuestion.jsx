import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import AddQuestionForm from '@/components/forms/AddQuestionForm'
import { useQuestions } from '@/context/QuestionsContext'

export default function AddQuestion() {
  const { addQuestion } = useQuestions()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async (payload) => {
    setError('')
    setSubmitting(true)
    try {
      const created = await addQuestion(payload)
      setSaved(created)
    } catch (requestError) {
      setError(requestError.message || 'Could not save this question. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-bold text-text">Add a question</h1>
      <p className="mt-1 text-sm text-muted">
        Save a problem now and CodeRecall will schedule it for revision automatically.
      </p>

      {saved && (
        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-easy/25 bg-easy/10 px-4 py-3 text-sm text-easy">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            "{saved.title}" saved and ready for revision.
          </span>
          <button
            onClick={() => navigate('/questions')}
            className="font-semibold underline decoration-easy/40 underline-offset-2 hover:decoration-easy"
          >
            View
          </button>
        </div>
      )}

      {error && <div className="mt-5 rounded-xl border border-hard/25 bg-hard/10 px-4 py-3 text-sm text-hard">{error}</div>}

      <div className="mt-6 rounded-2xl border border-line bg-panel-2/80 p-5 backdrop-blur-sm sm:p-6">
        <AddQuestionForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  )
}
