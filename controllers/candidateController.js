const User = require('../models/User')
const Test = require('../models/Test')

const createDefaultTest = async () => {
  const existing = await Test.findOne({ title: 'Array Sum Challenge' })
  if (existing) return existing
  return Test.create({
    title: 'Array Sum Challenge',
    problemStatement:
      'Write a program that reads an array of integers and returns the sum of all even numbers.\n\nInput format:\n- First line: integer N (array size)\n- Second line: N space-separated integers\n\nOutput: A single integer — the sum of all even numbers.',
    sampleInput: '5\n1 2 3 4 5',
    expectedOutput: '6',
    languageId: 63,
  })
}

const getProfile = async (req, res, next) => {
  try {
    const candidate = await User.findById(req.user._id).select('-password')
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' })

    // Unlock coding round when HR approved (currentRound >= 2)
    const activeTest = candidate.currentRound >= 2 ? await createDefaultTest() : null
    res.json({ candidate, activeTest })
  } catch (err) {
    next(err)
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const { profile, resumeUrl } = req.body
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'Candidate not found' })
    }

    if (profile) {
      user.profile = { ...user.profile.toObject(), ...profile }
    }
    if (resumeUrl !== undefined) {
      user.resumeUrl = resumeUrl
    }

    await user.save()
    res.json({ message: 'Profile updated', candidate: user })
  } catch (err) {
    next(err)
  }
}

module.exports = { getProfile, updateProfile }
