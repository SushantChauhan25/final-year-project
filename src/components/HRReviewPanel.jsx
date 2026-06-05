import { useState } from 'react'
import api from '../api/axios'

const HRReviewPanel = ({ candidates, onUpdate }) => {
  const [reasonMap, setReasonMap] = useState({})

  const handleAction = async (id, action) => {
    await api.post(`/hr/evaluate/${id}`, { action, reason: reasonMap[id] || '' })
    onUpdate()
  }

  return (
    <div className="surface space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">HR Review Panel</h2>
        <p className="mt-1 text-sm text-slate-600">Approve candidates to unlock their coding round.</p>
      </div>

      {candidates.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
          No pending applications. All caught up.
        </div>
      ) : (
        <div className="space-y-5">
          {candidates.map((candidate) => (
            <div key={candidate._id} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex items-start gap-4">
                  <div className="avatar h-12 w-12">{candidate.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <p className="text-lg font-bold text-slate-950">{candidate.name}</p>
                    <p className="text-sm text-slate-500">{candidate.email}</p>
                    <p className="mt-2 text-sm text-slate-700">{candidate.profile?.headline || 'No headline added'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAction(candidate._id, 'approve')} className="btn-success">Approve</button>
                  <button onClick={() => handleAction(candidate._id, 'reject')} className="btn-danger">Reject</button>
                </div>
              </div>
              <textarea
                value={reasonMap[candidate._id] || ''}
                onChange={(e) => setReasonMap((prev) => ({ ...prev, [candidate._id]: e.target.value }))}
                className="input-field mt-4 min-h-24"
                placeholder="Leave feedback or a reason for the decision"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HRReviewPanel
