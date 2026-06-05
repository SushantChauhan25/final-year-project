import { useState } from 'react'
import api from '../api/axios'

const TechReviewPanel = ({ submissions, onUpdate }) => {
  const [feedback, setFeedback] = useState({})

  const handleReview = async (id, action) => {
    await api.post(`/tech/review/${id}`, { action, comments: feedback[id] || '' })
    onUpdate()
  }

  return (
    <div className="surface space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">Tech Review Panel</h2>
        <p className="mt-1 text-sm text-slate-600">Review code submissions and provide technical feedback.</p>
      </div>

      {submissions.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
          No pending submissions.
        </div>
      ) : (
        <div className="space-y-5">
          {submissions.map((submission) => (
            <div key={submission._id} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="grid gap-4 border-b border-slate-200 pb-4 md:grid-cols-[1fr_auto]">
                <div className="flex items-start gap-4">
                  <div className="avatar h-12 w-12">{submission.candidateId?.name?.charAt(0).toUpperCase() || '?'}</div>
                  <div>
                    <p className="text-lg font-bold text-slate-950">{submission.candidateId?.name || 'Unknown candidate'}</p>
                    <p className="text-sm text-slate-500">{submission.candidateId?.email}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">Submitted</span>
                      <span className="text-sm text-slate-600">Compiler: {submission.compilerStatus || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <button onClick={() => handleReview(submission._id, 'approve')} className="btn-success">Approve</button>
                  <button onClick={() => handleReview(submission._id, 'reject')} className="btn-danger">Reject</button>
                </div>
              </div>
              <textarea
                value={feedback[submission._id] || ''}
                onChange={(e) => setFeedback((prev) => ({ ...prev, [submission._id]: e.target.value }))}
                className="input-field mt-4 min-h-24"
                placeholder="Leave review comments and feedback"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TechReviewPanel
