import { useState } from 'react'
import { Link2, Tag, Gauge, FileText, Hash } from 'lucide-react'
import Button from '@/components/ui/Button'
import { TOPICS, DIFFICULTIES } from '@/data/sampleQuestions'

const initialState = {
  title: '',
  problemNumber: '',
  link: '',
  topic: TOPICS[0],
  difficulty: 'Medium',
  notes: '',
}

export default function AddQuestionForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState({})

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const next = {}
    if (!form.title.trim()) next.title = 'Give the problem a name.'
    if (!form.topic) next.topic = 'Pick a topic.'
    if (form.link && !/^https?:\/\//i.test(form.link.trim())) {
      next.link = 'Link should start with http:// or https://'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      title: form.title.trim(),
      link: form.link.trim(),
      notes: form.notes.trim(),
      problemNumber: form.problemNumber ? Number(form.problemNumber) : null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-text">
            Question name
          </label>
          <input
            value={form.title}
            onChange={update('title')}
            placeholder="e.g. Longest Increasing Subsequence"
            className="h-11 w-full rounded-xl border border-line bg-panel-3/70 px-3.5 text-sm text-text placeholder:text-faint outline-none focus:border-ember-500/50"
          />
          {errors.title && <p className="mt-1.5 text-xs text-hard">{errors.title}</p>}
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-text">
            <Hash size={14} className="text-faint" /> Problem # (optional)
          </label>
          <input
            value={form.problemNumber}
            onChange={update('problemNumber')}
            type="number"
            placeholder="e.g. 300"
            className="h-11 w-full rounded-xl border border-line bg-panel-3/70 px-3.5 text-sm text-text placeholder:text-faint outline-none focus:border-ember-500/50"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-text">
          <Link2 size={14} className="text-faint" /> LeetCode / problem link
        </label>
        <input
          value={form.link}
          onChange={update('link')}
          placeholder="https://leetcode.com/problems/..."
          className="h-11 w-full rounded-xl border border-line bg-panel-3/70 px-3.5 text-sm text-text placeholder:text-faint outline-none focus:border-ember-500/50"
        />
        {errors.link && <p className="mt-1.5 text-xs text-hard">{errors.link}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-text">
            <Tag size={14} className="text-faint" /> Topic
          </label>
          <select
            value={form.topic}
            onChange={update('topic')}
            className="h-11 w-full rounded-xl border border-line bg-panel-3/70 px-3.5 text-sm text-text outline-none focus:border-ember-500/50"
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-text">
            <Gauge size={14} className="text-faint" /> Difficulty
          </label>
          <div className="grid grid-cols-3 gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                type="button"
                key={d}
                onClick={() => setForm((f) => ({ ...f, difficulty: d }))}
                className={`h-11 rounded-xl border text-sm font-medium transition-colors ${
                  form.difficulty === d
                    ? d === 'Easy'
                      ? 'border-easy/50 bg-easy/10 text-easy'
                      : d === 'Medium'
                      ? 'border-medium/50 bg-medium/10 text-medium'
                      : 'border-hard/50 bg-hard/10 text-hard'
                    : 'border-line text-muted hover:text-text'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-text">
          <FileText size={14} className="text-faint" /> Notes (optional)
        </label>
        <textarea
          value={form.notes}
          onChange={update('notes')}
          rows={4}
          placeholder="Approach, edge cases, gotchas to remember..."
          className="w-full resize-none rounded-xl border border-line bg-panel-3/70 px-3.5 py-3 text-sm text-text placeholder:text-faint outline-none focus:border-ember-500/50"
        />
      </div>

      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save question'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => setForm(initialState)}>
          Clear
        </Button>
      </div>
    </form>
  )
}
