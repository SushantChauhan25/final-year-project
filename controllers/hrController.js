const User = require('../models/User')

const getAppliedCandidates = async (req, res, next) => {
  try {
    const candidates = await User.find({ role: 'candidate', applicationStatus: 'applied' }).select('-password')
    res.json(candidates)
  } catch (err) {
    next(err)
  }
}

const evaluateCandidate = async (req, res, next) => {
  try {
    const { id } = req.params
    const { action, reason } = req.body
    const candidate = await User.findById(id)
    if (!candidate || candidate.role !== 'candidate') {
      return res.status(404).json({ message: 'Candidate not found' })
    }

    if (action === 'approve') {
      candidate.applicationStatus = 'hr_passed'
      candidate.currentRound = 2
      candidate.hrReviewReason = ''
    } else {
      candidate.applicationStatus = 'applied'
      candidate.hrReviewReason = reason || 'Not selected at this stage'
    }

    await candidate.save()
    res.json({ message: 'Evaluation complete', candidate })
  } catch (err) {
    next(err)
  }
}

module.exports = { getAppliedCandidates, evaluateCandidate }
