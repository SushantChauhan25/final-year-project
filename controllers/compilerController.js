const runJudge0 = require('../utils/judge0')
const Submission = require('../models/Submission')
const User = require('../models/User')
const Test = require('../models/Test')

const runCode = async (req, res, next) => {
  try {
    const { source_code, language_id, stdin } = req.body
    if (!source_code || !language_id) {
      return res.status(400).json({ message: 'source_code and language_id are required' })
    }

    const result = await runJudge0({ source_code, language_id, stdin })
    res.json(result)
  } catch (err) {
    // Surface a friendly error when Judge0 is unavailable (no API key set)
    if (err.response?.status === 401 || err.response?.status === 403) {
      return res.status(503).json({
        message: 'Code execution service not configured. Set JUDGE0_API_KEY in .env to enable live code running.',
        status: 'Service unavailable',
        stdout: '',
        stderr: 'Judge0 API key not configured.',
        compile_output: '',
      })
    }
    next(err)
  }
}

const submitCode = async (req, res, next) => {
  try {
    const { source_code, language_id, stdin, testId } = req.body
    if (!source_code || !language_id || !testId) {
      return res.status(400).json({ message: 'source_code, language_id, and testId are required' })
    }

    const candidate = await User.findById(req.user._id)
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' })
    }

    if (!['hr_passed', 'tech_submitted'].includes(candidate.applicationStatus)) {
      return res.status(403).json({ message: 'Candidate not eligible to submit code in the current pipeline stage' })
    }

    const test = await Test.findById(testId)
    if (!test) {
      return res.status(404).json({ message: 'Test not found' })
    }

    let judgeResult = { stdout: '', stderr: '', compile_output: '', status: 'Accepted' }
    try {
      judgeResult = await runJudge0({ source_code, language_id, stdin })
    } catch {
      // If Judge0 is not configured, store submission anyway with a placeholder status
      judgeResult.status = 'Submission stored (judge offline)'
    }

    const submission = await Submission.create({
      candidateId: candidate._id,
      testId: test._id,
      submittedCode: source_code,
      runtimeOutput: judgeResult.stdout || judgeResult.stderr || judgeResult.compile_output,
      compilerStatus: judgeResult.status,
      techTeamReview: false,
    })

    candidate.applicationStatus = 'tech_submitted'
    await candidate.save()

    res.status(201).json({ message: 'Code submitted successfully', submission, judgeResult })
  } catch (err) {
    next(err)
  }
}

module.exports = { runCode, submitCode }
