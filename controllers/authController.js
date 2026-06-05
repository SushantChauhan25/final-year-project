const User = require('../models/User')
const { signToken } = require('../utils/jwt')

const serializeUser = (user) => ({
  _id: user._id,
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  profile: user.profile,
  resumeUrl: user.resumeUrl,
  applicationStatus: user.applicationStatus,
  currentRound: user.currentRound,
})

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' })
    }

    const user = await User.create({ name, email, password, role: role || 'candidate' })
    const token = signToken(user._id, user.role)
    res.status(201).json({ token, user: serializeUser(user) })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const valid = await user.comparePassword(password)
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = signToken(user._id, user.role)
    res.json({ token, user: serializeUser(user) })
  } catch (err) {
    next(err)
  }
}

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login, getProfile }
