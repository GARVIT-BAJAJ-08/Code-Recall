import { Router } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { User } from '../models/User.js'
import { SignupVerification } from '../models/SignupVerification.js'
import { PasswordReset } from '../models/PasswordReset.js'
import { Question } from '../models/Question.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { validateGoogleIdentity } from '../utils/googleAuth.js'

const router = Router()

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl || '' }
}

function createToken(user) {
  return jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
}

function createMailer() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) return null
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  })
}

router.post('/signup/request-otp', async (req, res, next) => {
  try {
    const name = req.body.name?.trim()
    const email = req.body.email?.trim().toLowerCase()
    const password = req.body.password
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required.' })
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' })
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    if (await User.exists({ email })) return res.status(409).json({ message: 'An account with this email already exists.' })
    const mailer = createMailer()
    if (!mailer) return res.status(503).json({ message: 'Email verification is not configured on the server yet.' })

    const otp = String(crypto.randomInt(100000, 1000000))
    const passwordHash = await bcrypt.hash(password, 12)
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex')
    await SignupVerification.findOneAndUpdate(
      { email },
      { name, email, passwordHash, otpHash, attempts: 0, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
      { upsert: true, setDefaultsOnInsert: true }
    )
    await mailer.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Your CodeRecall verification code',
      text: `Your CodeRecall verification code is ${otp}. It expires in 10 minutes.`,
    })
    return res.json({ message: 'A verification code was sent to your email.' })
  } catch (error) {
    next(error)
  }
})

router.post('/signup/verify-otp', async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase()
    const otp = req.body.otp?.trim()
    if (!email || !/^\d{6}$/.test(otp || '')) return res.status(400).json({ message: 'Enter the 6-digit verification code.' })
    const pending = await SignupVerification.findOne({ email }).select('+passwordHash +otpHash')
    if (!pending) return res.status(400).json({ message: 'This verification code has expired. Request a new one.' })
    if (pending.attempts >= 5) return res.status(429).json({ message: 'Too many incorrect attempts. Request a new code.' })

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex')
    if (otpHash !== pending.otpHash) {
      pending.attempts += 1
      await pending.save()
      return res.status(400).json({ message: 'That verification code is incorrect.' })
    }

    const user = await User.create({ name: pending.name, email: pending.email, passwordHash: pending.passwordHash })
    await SignupVerification.deleteOne({ _id: pending._id })
    return res.status(201).json({ user: publicUser(user), token: createToken(user) })
  } catch (error) {
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase()
    const password = req.body.password
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' })

    const user = await User.findOne({ email }).select('+passwordHash')
    if (!user?.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }
    return res.json({ user: publicUser(user), token: createToken(user) })
  } catch (error) {
    next(error)
  }
})

router.post('/password-reset/request-otp', async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase()
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' })
    const mailer = createMailer()
    if (!mailer) return res.status(503).json({ message: 'Email verification is not configured on the server yet.' })
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'No account was found with this email.' })

    const otp = String(crypto.randomInt(100000, 1000000))
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex')
    await PasswordReset.findOneAndUpdate(
      { email },
      { email, otpHash, attempts: 0, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
      { upsert: true, setDefaultsOnInsert: true }
    )
    await mailer.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Your CodeRecall password reset code',
      text: `Your CodeRecall password reset code is ${otp}. It expires in 10 minutes.`,
    })
    return res.json({ message: 'A password reset code was sent to your email.' })
  } catch (error) {
    next(error)
  }
})

router.post('/password-reset/verify-otp', async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase()
    const otp = req.body.otp?.trim()
    const newPassword = req.body.newPassword
    if (!email || !/^\d{6}$/.test(otp || '') || !newPassword) return res.status(400).json({ message: 'Email, 6-digit code, and new password are required.' })
    if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters.' })

    const reset = await PasswordReset.findOne({ email }).select('+otpHash')
    if (!reset) return res.status(400).json({ message: 'This reset code has expired. Request a new one.' })
    if (reset.attempts >= 5) return res.status(429).json({ message: 'Too many incorrect attempts. Request a new code.' })
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex')
    if (otpHash !== reset.otpHash) {
      reset.attempts += 1
      await reset.save()
      return res.status(400).json({ message: 'That reset code is incorrect.' })
    }

    const user = await User.findOne({ email }).select('+passwordHash')
    if (!user) return res.status(404).json({ message: 'No account was found with this email.' })
    user.passwordHash = await bcrypt.hash(newPassword, 12)
    await user.save()
    await PasswordReset.deleteOne({ _id: reset._id })
    return res.json({ message: 'Password reset successfully. You can now log in.' })
  } catch (error) {
    next(error)
  }
})

router.patch('/password', requireAuth, async (req, res, next) => {
  try {
    const currentPassword = req.body.currentPassword
    const newPassword = req.body.newPassword
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Current and new passwords are required.' })
    if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters.' })

    const user = await User.findById(req.user.id).select('+passwordHash')
    if (!user?.passwordHash) return res.status(400).json({ message: 'This account does not have a password. Sign in with Google instead.' })
    if (!(await bcrypt.compare(currentPassword, user.passwordHash))) return res.status(401).json({ message: 'Current password is incorrect.' })

    user.passwordHash = await bcrypt.hash(newPassword, 12)
    await user.save()
    return res.json({ message: 'Password changed successfully.' })
  } catch (error) {
    next(error)
  }
})

router.delete('/account', requireAuth, async (req, res, next) => {
  try {
    await Question.deleteMany({ user: req.user.id })
    await SignupVerification.deleteMany({ email: req.user.email })
    await User.deleteOne({ _id: req.user.id })
    return res.status(204).end()
  } catch (error) {
    next(error)
  }
})

router.post('/google', async (req, res, next) => {
  try {
    const credential = req.body.credential
    if (!credential || typeof credential !== 'string') return res.status(400).json({ message: 'Google credential is required.' })
    if (!process.env.GOOGLE_CLIENT_ID) return res.status(503).json({ message: 'Google sign-in has not been configured yet.' })

    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`)
    if (!response.ok) return res.status(401).json({ message: 'Google sign-in could not be verified.' })
    const google = await response.json()
    if (!validateGoogleIdentity(google, process.env.GOOGLE_CLIENT_ID)) {
      return res.status(401).json({ message: 'Google sign-in could not be verified.' })
    }

    const email = google.email.toLowerCase()
    let user = await User.findOne({ $or: [{ googleId: google.sub }, { email }] }).select('+googleId')
    if (user) {
      if (!user.googleId) { user.googleId = google.sub; if (google.picture) user.avatarUrl = google.picture; await user.save() }
    } else {
      user = await User.create({ name: google.name?.trim() || email.split('@')[0], email, googleId: google.sub, avatarUrl: google.picture || '' })
    }
    return res.json({ user: publicUser(user), token: createToken(user) })
  } catch (error) {
    next(error)
  }
})

router.get('/me', requireAuth, (req, res) => res.json({ user: publicUser(req.user) }))

export default router
