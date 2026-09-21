import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { connectDatabase } from './config/db.js'
import authRoutes from './routes/auth.js'
import questionRoutes from './routes/questions.js'

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured.')

const app = express()
// app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))
app.use(express.json({ limit: '10kb' }))
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/questions', questionRoutes)

app.use((error, req, res, _next) => {
  console.error(error)
  if (error?.code === 11000) return res.status(409).json({ message: 'An account with this email already exists.' })
  return res.status(500).json({ message: 'Something went wrong on the server.' })
})

const port = Number(process.env.PORT) || 5000
connectDatabase()
  .then(() => app.listen(port, () => console.log(`CodeRecall API running on port ${port}`)))
  .catch((error) => {
    console.error('Could not start API:', error.message)
    process.exit(1)
  })
