import dns from 'node:dns'
import mongoose from 'mongoose'

export async function connectDatabase() {
  const { MONGODB_URI } = process.env
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not configured.')
  dns.setServers(['1.1.1.1', '8.8.8.8'])
  await mongoose.connect(MONGODB_URI)
  console.log('Connected to MongoDB')
}
