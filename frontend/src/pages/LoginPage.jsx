import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import AuthField from '@/components/forms/AuthField'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import GoogleSignIn from '@/components/auth/GoogleSignIn'
import { requestPasswordResetOtp, resetPassword } from '@/api/auth'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [forgotPassword, setForgotPassword] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetForm, setResetForm] = useState({ otp: '', newPassword: '', confirmPassword: '' })

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const updateReset = (field) => (e) => setResetForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const next = {}
    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Enter a valid email address.'
    if (!form.password) next.password = 'Password is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!forgotPassword && !validate()) return
    if (forgotPassword && !form.email.trim()) {
      setFormError('Enter your email address.')
      return
    }
    if (forgotPassword && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setFormError('Enter a valid email address.')
      return
    }
    if (forgotPassword && resetSent && resetForm.newPassword !== resetForm.confirmPassword) {
      setFormError('New passwords do not match.')
      return
    }
    setSubmitting(true)
    try {
      if (!forgotPassword) {
        await login({ email: form.email.trim(), password: form.password })
        navigate(location.state?.from ?? '/dashboard', { replace: true })
      } else if (!resetSent) {
        await requestPasswordResetOtp(form.email.trim())
        setResetSent(true)
      } else {
        const response = await resetPassword({ email: form.email.trim(), otp: resetForm.otp.trim(), newPassword: resetForm.newPassword })
        setFormError(response.message)
        setForgotPassword(false)
        setResetSent(false)
        setResetForm({ otp: '', newPassword: '', confirmPassword: '' })
      }
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="mb-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-ember-400/10 text-ember-400">
          <LogIn size={22} />
        </div>
        <h1 className="mt-4 text-xl font-bold text-text">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">Log in to pick up your revision streak.</p>
      </div>

      <div className="rounded-2xl border border-line bg-panel-2/80 p-6 backdrop-blur-sm">
        {formError && (
          <div className="mb-4 rounded-lg border border-hard/30 bg-hard/10 px-3.5 py-2.5 text-sm text-hard">
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <AuthField
            label="Email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update('email')}
            error={errors.email}
            placeholder="you@example.com"
          />
          {!forgotPassword ? (
            <>
              <AuthField
                label="Password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={update('password')}
                error={errors.password}
                placeholder="••••••••"
              />
              <button type="button" className="text-xs font-medium text-ember-400 hover:text-ember-300" onClick={() => { setForgotPassword(true); setFormError(''); setErrors({}) }}>
                Forgot password?
              </button>
            </>
          ) : (
            <>
              {resetSent && <AuthField label="Verification code" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={resetForm.otp} onChange={updateReset('otp')} placeholder="6-digit code" />}
              {resetSent && <AuthField label="New password" type="password" autoComplete="new-password" value={resetForm.newPassword} onChange={updateReset('newPassword')} placeholder="At least 6 characters" />}
              {resetSent && <AuthField label="Confirm new password" type="password" autoComplete="new-password" value={resetForm.confirmPassword} onChange={updateReset('confirmPassword')} placeholder="Re-enter your password" />}
            </>
          )}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (forgotPassword ? (resetSent ? 'Resetting...' : 'Sending code...') : 'Logging in...') : forgotPassword ? (resetSent ? 'Reset password' : 'Send reset code') : 'Login'}
          </Button>
        </form>
        {forgotPassword ? (
          <button type="button" className="mt-4 w-full text-center text-sm text-muted hover:text-text" onClick={() => { setForgotPassword(false); setResetSent(false); setFormError('') }}>
            Back to login
          </button>
        ) : (
          <>
            <div className="my-5 flex items-center gap-3 text-xs text-faint"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
            <GoogleSignIn onSuccess={() => navigate(location.state?.from ?? '/dashboard', { replace: true })} onError={setFormError} />
          </>
        )}
      </div>

      <p className="mt-5 text-center text-sm text-muted">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-ember-400 hover:text-ember-300">
          Sign up
        </Link>
      </p>
    </div>
  )
}
