import { useState } from 'react'
import api from '../api/axios'

const OfferLetterModal = ({ candidate, onComplete }) => {
  const [position, setPosition] = useState('Software Engineer')
  const [salary, setSalary] = useState('120000')
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().slice(0, 10))
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const submitOffer = async () => {
    if (!candidate) return
    if (!position || !salary || !joiningDate) {
      setError('All fields are required')
      return
    }
    setSending(true)
    setError('')
    try {
      await api.post(`/final/offer/${candidate._id}`, { position, salary, joiningDate })
      setSuccess(true)
      setTimeout(() => onComplete(), 1800)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send offer. Please try again.')
    } finally {
      setSending(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-2xl">🎉</p>
        <p className="mt-2 font-bold text-emerald-900">Offer sent to {candidate?.name}!</p>
        <p className="mt-1 text-sm text-emerald-700">The candidate will receive their offer details via email.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900">Generate Offer Letter</h2>
        <p className="mt-1 text-sm text-slate-600">
          Sending offer to <span className="font-semibold text-slate-800">{candidate?.name}</span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-sm font-bold text-slate-700">Position</span>
          <input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="input-field mt-2"
            placeholder="Software Engineer"
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-slate-700">Annual Salary (₹ / $)</span>
          <input
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="input-field mt-2"
            placeholder="120000"
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-slate-700">Joining Date</span>
          <input
            type="date"
            value={joiningDate}
            onChange={(e) => setJoiningDate(e.target.value)}
            className="input-field mt-2"
          />
        </label>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      )}

      <div className="mt-5 flex gap-3">
        <button onClick={submitOffer} disabled={sending} className="btn-primary">
          {sending ? 'Sending…' : 'Send Offer Letter'}
        </button>
        <button onClick={onComplete} disabled={sending} className="btn-outline">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default OfferLetterModal
