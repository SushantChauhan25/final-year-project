const Post = require('../models/Post')

const createPost = async (req, res, next) => {
  try {
    const { content } = req.body
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Post content cannot be empty' })
    }

    const post = await Post.create({ author: req.user._id, content: content.trim() })
    const populated = await post.populate('author', 'name role')
    res.status(201).json(populated)
  } catch (err) {
    next(err)
  }
}

const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name role profile.resumeUrl')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 })
    res.json(posts)
  } catch (err) {
    next(err)
  }
}

const likePost = async (req, res, next) => {
  try {
    const { id } = req.params
    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const index = post.likes.findIndex((likeId) => likeId.equals(req.user._id))
    if (index >= 0) {
      post.likes.splice(index, 1)
    } else {
      post.likes.push(req.user._id)
    }

    await post.save()
    const populated = await post.populate([
      { path: 'author', select: 'name role' },
      { path: 'comments.user', select: 'name' },
    ])
    res.json(populated)
  } catch (err) {
    next(err)
  }
}

const commentOnPost = async (req, res, next) => {
  try {
    const { id } = req.params
    const { text } = req.body
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment cannot be empty' })
    }

    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    post.comments.push({ user: req.user._id, text: text.trim() })
    await post.save()
    const populated = await post.populate('comments.user', 'name')
    res.json(populated)
  } catch (err) {
    next(err)
  }
}

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params
    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    if (!post.author.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the author can delete this post' })
    }

    await post.deleteOne()
    res.json({ message: 'Post removed' })
  } catch (err) {
    next(err)
  }
}

module.exports = { createPost, getPosts, likePost, commentOnPost, deletePost }
