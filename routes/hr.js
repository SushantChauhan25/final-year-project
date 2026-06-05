const express = require('express')
const { getAppliedCandidates, evaluateCandidate } = require('../controllers/hrController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')
const router = express.Router()

router.use(authMiddleware, roleMiddleware(['hr', 'admin']))
router.get('/applications', getAppliedCandidates)
router.post('/evaluate/:id', evaluateCandidate)

module.exports = router
