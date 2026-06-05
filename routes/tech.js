const express = require('express')
const { getTechSubmissions, getSubmission, reviewSubmission } = require('../controllers/techController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')
const router = express.Router()

router.use(authMiddleware, roleMiddleware(['tech', 'admin']))
router.get('/submissions', getTechSubmissions)
router.get('/submission/:id', getSubmission)
router.post('/review/:id', reviewSubmission)

module.exports = router
