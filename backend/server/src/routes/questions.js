import { Router } from 'express'
import { Question } from '../models/Question.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()
router.use(requireAuth)

const allowedFields = ['title', 'problemNumber', 'link', 'topic', 'difficulty', 'notes']
const outcomes = new Set(['easy', 'difficult', 'failed', 'saw_solution'])

function cleanPayload(body, isCreate = false) {
  const data = {}
  for (const field of allowedFields) if (field in body) data[field] = body[field]
  if (typeof data.title === 'string') data.title = data.title.trim()
  if (typeof data.topic === 'string') data.topic = data.topic.trim()
  if (typeof data.link === 'string') data.link = data.link.trim()
  if (typeof data.notes === 'string') data.notes = data.notes.trim()
  if (data.problemNumber === '' || data.problemNumber === null) data.problemNumber = null
  if (data.problemNumber !== undefined && data.problemNumber !== null) data.problemNumber = Number(data.problemNumber)
  if (isCreate && (!data.title || !data.topic)) throw new Error('A title and topic are required.')
  if ('title' in data && !data.title) throw new Error('A title is required.')
  if ('topic' in data && !data.topic) throw new Error('A topic is required.')
  if (data.link && !/^https?:\/\//i.test(data.link)) throw new Error('Link must start with http:// or https://.')
  if (data.difficulty && !['Easy', 'Medium', 'Hard'].includes(data.difficulty)) throw new Error('Invalid difficulty.')
  if (data.problemNumber !== undefined && data.problemNumber !== null && (!Number.isInteger(data.problemNumber) || data.problemNumber < 0)) throw new Error('Problem number must be a positive whole number.')
  return data
}

function schedule(question, outcome) {
  const previousInterval = question.interval || 0
  let ease = question.easeFactor || 2.5
  let interval
  if (outcome === 'easy') { interval = previousInterval === 0 ? 4 : Math.round(previousInterval * ease); ease = Math.min(2.8, ease + 0.1) }
  else if (outcome === 'difficult') { interval = previousInterval === 0 ? 2 : Math.max(2, Math.round(previousInterval * (ease - 1))); ease = Math.max(1.3, ease - 0.15) }
  else { interval = 1; ease = Math.max(1.3, ease - (outcome === 'saw_solution' ? 0.2 : 0.3)) }
  const now = new Date()
  const nextRevision = new Date(now)
  nextRevision.setDate(nextRevision.getDate() + interval)
  return { interval, easeFactor: Number(ease.toFixed(2)), priority: interval <= 2 ? 'high' : interval <= 6 ? 'medium' : 'low', lastRevised: now, nextRevision }
}

router.get('/', async (req, res, next) => {
  try { res.json(await Question.find({ user: req.user.id }).sort({ nextRevision: 1 })) } catch (error) { next(error) }
})

router.post('/', async (req, res, next) => {
  try { res.status(201).json(await Question.create({ ...cleanPayload(req.body, true), user: req.user.id })) }
  catch (error) { if (error.message) return res.status(400).json({ message: error.message }); next(error) }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const question = await Question.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, cleanPayload(req.body), { new: true, runValidators: true })
    if (!question) return res.status(404).json({ message: 'Question not found.' })
    res.json(question)
  } catch (error) { if (error.message) return res.status(400).json({ message: error.message }); next(error) }
})

router.delete('/:id', async (req, res, next) => {
  try { const result = await Question.deleteOne({ _id: req.params.id, user: req.user.id }); if (!result.deletedCount) return res.status(404).json({ message: 'Question not found.' }); res.status(204).end() } catch (error) { next(error) }
})

router.post('/:id/review', async (req, res, next) => {
  try {
    if (!outcomes.has(req.body.outcome)) return res.status(400).json({ message: 'Invalid review outcome.' })
    const question = await Question.findOne({ _id: req.params.id, user: req.user.id })
    if (!question) return res.status(404).json({ message: 'Question not found.' })
    const patch = schedule(question, req.body.outcome)
    question.set(patch)
    question.reviewCount += 1
    question.history.push({ date: patch.lastRevised, outcome: req.body.outcome })
    await question.save()
    res.json(question)
  } catch (error) { next(error) }
})

export default router
