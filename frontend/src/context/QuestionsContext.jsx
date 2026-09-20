import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  fetchQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion as deleteQuestionApi,
  reviewQuestion as reviewQuestionApi,
} from '@/api/questions'
import { isDueOrOverdue } from '@/utils/date'
import { useAuth } from '@/context/AuthContext'

const QuestionsContext = createContext(null)

export function QuestionsProvider({ children }) {
  const { isAuthenticated, initializing } = useAuth()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (initializing) return undefined
    if (!isAuthenticated) {
      setQuestions([])
      setLoading(false)
      return undefined
    }
    setLoading(true)
    fetchQuestions()
      .then(setQuestions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [isAuthenticated, initializing])

  const addQuestion = useCallback(async (payload) => {
    const created = await createQuestion(payload)
    setQuestions((prev) => [created, ...prev])
    return created
  }, [])

  const reviewQuestion = useCallback(async (id, outcome) => {
    const updated = await reviewQuestionApi(id, outcome)
    setQuestions((prev) => prev.map((q) => (q.id === id ? updated : q)))
    return updated
  }, [])

  const removeQuestion = useCallback(async (id) => {
    await deleteQuestionApi(id)
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }, [])

  const editQuestion = useCallback(async (id, patch) => {
    const updated = await updateQuestion(id, patch)
    setQuestions((prev) => prev.map((q) => (q.id === id ? updated : q)))
  }, [])

  const dueToday = useMemo(
    () => questions.filter((q) => isDueOrOverdue(q.nextRevision)),
    [questions]
  )

  const value = {
    questions,
    loading,
    error,
    dueToday,
    addQuestion,
    reviewQuestion,
    removeQuestion,
    editQuestion,
  }

  return <QuestionsContext.Provider value={value}>{children}</QuestionsContext.Provider>
}

export function useQuestions() {
  const ctx = useContext(QuestionsContext)
  if (!ctx) throw new Error('useQuestions must be used within QuestionsProvider')
  return ctx
}
