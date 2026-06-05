const Submission = require('../models/Submission')
const User = require('../models/User')

const getTechSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ status: { $in: ['pending', 'approved'] } })
      .populate('candidateId', 'name email applicationStatus currentRound')
      .populate('testId', 'title')
      .sort({ createdAt: -1 })
    res.json(submissions)
  } catch (err) {
    next(err)
  }
}

const getSubmission = async (req, res, next) => {
  try {
    const { id } = req.params
    const submission = await Submission.findById(id)
      .populate('candidateId', 'name email applicationStatus currentRound profile resumeUrl')
      .populate('testId', 'title problemStatement sampleInput expectedOutput languageId')

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' })
    }

    res.json(submission)
  } catch (err) {
    next(err)
  }
}

const reviewSubmission = async (req, res, next) => {
  try {
    const { id } = req.params
    const { action, comments } = req.body
    const submission = await Submission.findById(id)
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' })
    }

    const candidate = await User.findById(submission.candidateId)
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' })
    }

    if (action === 'approve') {
      submission.status = 'approved'
      candidate.applicationStatus = 'tech_passed'
      candidate.currentRound = 3
      submission.techTeamReview = true
      submission.comments = comments || 'Approved by tech team'
    } else {
      submission.status = 'rejected'
      submission.techTeamReview = false
      submission.comments = comments || 'Rejected by tech team'
      candidate.techReviewReason = comments || 'Needs improvement'
    }

    submission.reviewedBy = req.user._id
    submission.reviewedAt = new Date()
    await submission.save()
    await candidate.save()

    res.json({ message: 'Review saved', submission })
  } catch (err) {
    next(err)
  }
}

module.exports = { getTechSubmissions, getSubmission, reviewSubmission }
