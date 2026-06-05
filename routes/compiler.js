const express = require('express')
const { runCode, submitCode } = require('../controllers/compilerController')
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()

router.use(authMiddleware)
router.post('/run', runCode)
router.post('/submit', submitCode)

module.exports = router
