import { useCallback, useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const LinkedInFeed = () => {
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')
  const [query, setQuery] = useState('')
  const [sortMode, setSortMode] = useState('latest')
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get('/posts')
      setPosts(response.data)
    } catch {
      setError('Unable to load the feed right now.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPosts()
  }, [loadPosts])

  const publishPost = async (event) => {
    event?.preventDefault()
    if (!content.trim()) return
    try {
      setPublishing(true)
      setError('')
      const response = await api.post('/posts', { content })
      setPosts((prev) => [response.data, ...prev])
      setContent('')
      loadPosts()
    } catch {
      setError('Could not publish your update. Please try again.')
    } finally {
      setPublishing(false)
    }
  }

  const toggleLike = async (postId) => {
    try {
      const response = await api.put(`/posts/like/${postId}`)
      setPosts((prev) => prev.map((post) => (post._id === postId ? response.data : post)))
    } catch {
      setError('Could not update the reaction.')
    }
  }

  const submitComment = async (postId, text) => {
    if (!text.trim()) return
    try {
      const response = await api.post(`/posts/comment/${postId}`, { text })
      setPosts((prev) => prev.map((post) => (post._id === postId ? response.data : post)))
    } catch {
      setError('Could not add that comment.')
    }
  }

  const deletePost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`)
      setPosts((prev) => prev.filter((post) => post._id !== postId))
    } catch {
      setError('Could not delete that post.')
    }
  }

  const userId = user?._id || user?.id
  const filteredPosts = posts
    .filter((post) => {
      const searchable = `${post.content || ''} ${post.author?.name || ''} ${post.author?.role || ''}`.toLowerCase()
      return searchable.includes(query.trim().toLowerCase())
    })
    .sort((a, b) => {
      if (sortMode === 'popular') return (b.likes?.length || 0) - (a.likes?.length || 0)
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    })
  const characterCount = content.length

  return (
    <section className="space-y-6">
      <form onSubmit={publishPost} className="surface overflow-hidden">
        <div className="hero-band px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="avatar h-11 w-11 bg-white/20 text-base">{user?.name?.charAt(0).toUpperCase() || '?'}</div>
            <div>
              <h2 className="text-xl font-bold">Share an update</h2>
              <p className="text-sm text-cyan-50">Start a useful hiring conversation.</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input-field min-h-32 resize-y"
            rows="4"
            maxLength="600"
            placeholder="What are you working on?"
            disabled={publishing}
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <span className="chip">Hiring</span>
              <span className="chip">Interview notes</span>
              <span className="chip">Career question</span>
            </div>
            <div className="flex items-center justify-end gap-3">
              <span className={`text-xs font-bold ${characterCount > 540 ? 'text-rose-600' : 'text-slate-500'}`}>{characterCount}/600</span>
              <button type="submit" disabled={publishing || !content.trim()} className="btn-primary">
                {publishing ? 'Posting...' : 'Post Update'}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="surface p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-field py-2"
            placeholder="Search posts, people, or roles"
          />
          <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button onClick={() => setSortMode('latest')} className={sortMode === 'latest' ? 'rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-950 shadow-sm' : 'px-4 py-2 text-sm font-bold text-slate-500'}>
              Latest
            </button>
            <button onClick={() => setSortMode('popular')} className={sortMode === 'popular' ? 'rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-950 shadow-sm' : 'px-4 py-2 text-sm font-bold text-slate-500'}>
              Popular
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <FeedMetric label="Posts" value={posts.length} />
        <FeedMetric label="Conversations" value={posts.reduce((total, post) => total + (post.comments?.length || 0), 0)} />
        <FeedMetric label="Reactions" value={posts.reduce((total, post) => total + (post.likes?.length || 0), 0)} />
      </div>

      <div className="hidden">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-950">Share an update</h2>
          <p className="text-sm text-slate-600">Post hiring wins, role openings, interview notes, or career questions.</p>
        </div>
      </div>

      {error && <div className="surface p-5 text-sm text-rose-700">{error}</div>}
      {loading && <div className="surface p-8 text-center text-slate-600">Loading feed...</div>}

      <div className="space-y-5">
        {!loading && filteredPosts.length === 0 && (
          <div className="surface p-8 text-center text-slate-600">{posts.length === 0 ? 'No posts yet. Start the first conversation.' : 'No posts match your search.'}</div>
        )}

        {filteredPosts.map((post) => {
          const liked = post.likes?.some((like) => String(like) === String(userId))
          const authorId = post.author?._id || post.author?.id

          return (
            <article key={post._id} className="surface animate-in p-6">
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="avatar h-12 w-12">{post.author?.name?.charAt(0).toUpperCase() || '?'}</div>
                  <div>
                    <h3 className="font-bold text-slate-950">{post.author?.name || 'Unknown'}</h3>
                    <p className="text-xs capitalize text-slate-500">{post.author?.role || 'Member'} {post.createdAt ? `| ${new Date(post.createdAt).toLocaleDateString()}` : ''}</p>
                  </div>
                </div>
                <span className="chip border-rose-200 bg-rose-50 text-rose-600">{post.likes?.length || 0} likes</span>
              </div>

              <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-700">{post.content}</p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <button onClick={() => toggleLike(post._id)} className={liked ? 'btn-soft-danger' : 'btn-outline'}>
                  {liked ? 'Liked' : 'Like'}
                </button>
                {String(authorId) === String(userId) && (
                  <button onClick={() => deletePost(post._id)} className="btn-soft-danger">Delete</button>
                )}
              </div>

              <div className="mt-5 space-y-3">
                {post.comments?.map((comment) => (
                  <div key={comment._id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-bold text-slate-950">{comment.user?.name || 'Anonymous'}</p>
                    <p className="mt-1 text-sm text-slate-700">{comment.text}</p>
                  </div>
                ))}
                <CommentForm onSubmit={(text) => submitComment(post._id, text)} />
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

const CommentForm = ({ onSubmit }) => {
  const [value, setValue] = useState('')
  const send = () => {
    if (!value.trim()) return
    onSubmit(value)
    setValue('')
  }

  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') send()
        }}
        className="input-field rounded-full py-2 text-sm"
        placeholder="Add a comment..."
      />
      <button
        onClick={send}
        className="btn-dark shrink-0 py-2"
      >
        Send
      </button>
    </div>
  )
}

const FeedMetric = ({ label, value }) => (
  <div className="metric-card">
    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
    <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
  </div>
)

export default LinkedInFeed
