import { useState } from 'react'
import { Mail, Calendar, Flame, Trophy, ListChecks, LockKeyhole, Trash2 } from 'lucide-react'
import { useQuestions } from '@/context/QuestionsContext'
import StatCard from '@/components/ui/StatCard'
import { getCurrentStreak, getTopicStats } from '@/utils/stats'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/ui/Button'

export default function ProfilePage() {
  const { questions } = useQuestions()
  const { user, changePassword, deleteAccount } = useAuth()
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const topicStats = getTopicStats(questions)
  const strongestTopic = [...topicStats].sort((a, b) => b.mastery - a.mastery)[0]
  const revisedCount = questions.filter((q) => q.reviewCount > 0).length
  const streak = getCurrentStreak(questions)

  const updatePassword = (field) => (event) => setPasswords((current) => ({ ...current, [field]: event.target.value }))

  const handlePasswordChange = async (event) => {
    event.preventDefault()
    setPasswordMessage('')
    setPasswordError('')
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('New passwords do not match.')
      return
    }
    setSavingPassword(true)
    try {
      const response = await changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword })
      setPasswordMessage(response.message)
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setPasswordError(error.message)
    } finally {
      setSavingPassword(false)
    }
  }

  const handleDeleteAccount = async (event) => {
    event.preventDefault()
    setDeleteError('')
    if (deleteConfirmation !== 'DELETE ACCOUNT') {
      setDeleteError('Type DELETE ACCOUNT exactly to confirm.')
      return
    }
    setDeleting(true)
    try {
      await deleteAccount()
    } catch (error) {
      setDeleteError(error.message)
      setDeleting(false)
    }
  }

  const inputClass = 'mt-1 h-10 w-full rounded-xl border border-line bg-panel-3 px-3 text-sm text-text outline-none placeholder:text-faint focus:border-ember-500'

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
        <StatCard icon={Flame} value={streak} label="Day streak" />
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

      <div className="rounded-2xl border border-line bg-panel-2/80 p-5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <LockKeyhole size={17} className="text-ember-400" />
          <h3 className="text-sm font-semibold text-text">Change password</h3>
        </div>
        <form onSubmit={handlePasswordChange} className="mt-4 space-y-3">
          <label className="block text-xs font-medium text-muted">Current password<input className={inputClass} type="password" value={passwords.currentPassword} onChange={updatePassword('currentPassword')} required /></label>
          <label className="block text-xs font-medium text-muted">New password<input className={inputClass} type="password" minLength={6} value={passwords.newPassword} onChange={updatePassword('newPassword')} required /></label>
          <label className="block text-xs font-medium text-muted">Confirm new password<input className={inputClass} type="password" minLength={6} value={passwords.confirmPassword} onChange={updatePassword('confirmPassword')} required /></label>
          {passwordError && <p className="text-sm text-hard">{passwordError}</p>}
          {passwordMessage && <p className="text-sm text-easy">{passwordMessage}</p>}
          <Button type="submit" size="sm" disabled={savingPassword}>{savingPassword ? 'Changing...' : 'Change password'}</Button>
        </form>
      </div>

      <div className="rounded-2xl border border-hard/30 bg-hard/5 p-5">
        <div className="flex items-center gap-2">
          <Trash2 size={17} className="text-hard" />
          <h3 className="text-sm font-semibold text-text">Delete account</h3>
        </div>
        <p className="mt-1 text-sm text-muted">This permanently deletes your account and saved questions.</p>
        <form onSubmit={handleDeleteAccount} className="mt-4 space-y-3">
          <label className="block text-xs font-medium text-muted">Type DELETE ACCOUNT to confirm<input className={inputClass} type="text" value={deleteConfirmation} onChange={(event) => setDeleteConfirmation(event.target.value)} /></label>
          {deleteError && <p className="text-sm text-hard">{deleteError}</p>}
          <Button type="submit" variant="danger" size="sm" disabled={deleting}>{deleting ? 'Deleting...' : 'Delete account'}</Button>
        </form>
      </div>
    </div>
  )
}
