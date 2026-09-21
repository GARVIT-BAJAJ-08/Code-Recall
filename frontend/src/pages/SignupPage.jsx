import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import AuthField from '@/components/forms/AuthField'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import GoogleSignIn from '@/components/auth/GoogleSignIn'

const initialForm = { name: '', email: '', password: '', confirmPassword: '' }

export default function SignupPage() {
  const { requestSignupOtp, verifySignupOtp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Enter your name.'
    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Enter a valid email address.'
    if (!form.password) next.password = 'Password is required.'
    else if (form.password.length < 6) next.password = 'Use at least 6 characters.'
    if (!form.confirmPassword) next.confirmPassword = 'Confirm your password.'
    else if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!validate()) return
    setSubmitting(true)
    try {
      if (!otpSent) {
        await requestSignupOtp({ name: form.name.trim(), email: form.email.trim(), password: form.password })
        setOtpSent(true)
        return
      }
      await verifySignupOtp({ email: form.email.trim(), otp: otp.trim() })
      navigate('/dashboard', { replace: true })
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
          <UserPlus size={22} />
        </div>
        <h1 className="mt-4 text-xl font-bold text-text">Create your account</h1>
        <p className="mt-1 text-sm text-muted">Start building a revision habit that sticks.</p>
      </div>

      <div className="rounded-2xl border border-line bg-panel-2/80 p-6 backdrop-blur-sm">
        {formError && (
          <div className="mb-4 rounded-lg border border-hard/30 bg-hard/10 px-3.5 py-2.5 text-sm text-hard">
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <AuthField
            label="Name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={update('name')}
            error={errors.name}
            placeholder="User Name"
          />
          <AuthField
            label="Email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update('email')}
            error={errors.email}
            placeholder="you@example.com"
          />
          <AuthField
            label="Password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={update('password')}
            error={errors.password}
            placeholder="At least 6 characters"
          />
          <AuthField
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={update('confirmPassword')}
            error={errors.confirmPassword}
            placeholder="Re-enter your password"
          />
          {otpSent && (
            <AuthField
              label="Email verification code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit code"
            />
          )}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (otpSent ? 'Verifying...' : 'Sending code...') : otpSent ? 'Verify email' : 'Send verification code'}
          </Button>
        </form>
        {otpSent && <p className="mt-3 text-center text-xs text-muted">Check your email for a code. It expires in 10 minutes.</p>}
        <div className="my-5 flex items-center gap-3 text-xs text-faint"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
        <GoogleSignIn onSuccess={() => navigate('/dashboard', { replace: true })} onError={setFormError} />
      </div>

      <p className="mt-5 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-ember-400 hover:text-ember-300">
          Login
        </Link>
      </p>
    </div>
  )
}
