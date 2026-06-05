const express = require('express')
const { getProfile, updateProfile } = require('../controllers/candidateController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')
const router = express.Router()

router.use(authMiddleware, roleMiddleware(['candidate']))
router.get('/profile', getProfile)
router.put('/profile', updateProfile)

module.exports = router
