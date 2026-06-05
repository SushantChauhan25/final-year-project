const express = require('express')
const { createPost, getPosts, likePost, commentOnPost, deletePost } = require('../controllers/postController')
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()

router.use(authMiddleware)
router.get('/', getPosts)
router.post('/', createPost)
router.put('/like/:id', likePost)
router.post('/comment/:id', commentOnPost)
router.delete('/:id', deletePost)

module.exports = router
