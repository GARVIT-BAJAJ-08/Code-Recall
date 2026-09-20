import { apiClient } from './client'

export function fetchQuestions() {
  return apiClient.get('/questions')
}

export function createQuestion(payload) {
  return apiClient.post('/questions', payload)
}

export function updateQuestion(id, patch) {
  return apiClient.patch(`/questions/${id}`, patch)
}

export function deleteQuestion(id) {
  return apiClient.delete(`/questions/${id}`)
}

export function reviewQuestion(id, outcome) {
  return apiClient.post(`/questions/${id}/review`, { outcome })
}
