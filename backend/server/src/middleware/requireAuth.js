import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

export async function requireAuth(req, res, next) {
  const [scheme, token] = (req.get('authorization') || '').split(' ')
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ message: 'Authentication is required.' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.sub)
    if (!user) return res.status(401).json({ message: 'User no longer exists.' })
    req.user = user
    next()
  } catch {
    return res.status(401).json({ message: 'Your session is invalid or has expired.' })
  }
}
