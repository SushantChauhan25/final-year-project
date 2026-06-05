require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth')
const candidateRoutes = require('./routes/candidate')
const hrRoutes = require('./routes/hr')
const compilerRoutes = require('./routes/compiler')
const techRoutes = require('./routes/tech')
const offerRoutes = require('./routes/offer')
const postRoutes = require('./routes/posts')

const app = express()
connectDB()

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || '*',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(morgan('dev'))

// ── Routes ──────────────────────────────────────────────────────────────────
app.get('/api/status', (req, res) =>
  res.json({ status: 'RecruitFlow backend running', timestamp: new Date().toISOString() }),
)

app.use('/api/auth', authRoutes)
app.use('/api/candidate', candidateRoutes)
app.use('/api/hr', hrRoutes)
app.use('/api/code', compilerRoutes)
app.use('/api/tech', techRoutes)
app.use('/api', offerRoutes)
app.use('/api/posts', postRoutes)

// ── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' })
})

// ── Global error handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[Error]', err)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅  RecruitFlow backend running on port ${PORT}`)
})
