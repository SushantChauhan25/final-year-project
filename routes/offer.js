const express = require('express')
const { createOffer } = require('../controllers/offerController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')
const router = express.Router()

router.use(authMiddleware, roleMiddleware(['hr', 'admin']))
router.post('/final/offer/:id', createOffer)

module.exports = router
