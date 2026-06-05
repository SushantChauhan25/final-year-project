import { useEffect, useState } from 'react'
import api from '../api/axios'
import HRReviewPanel from '../components/HRReviewPanel'
import TechReviewPanel from '../components/TechReviewPanel'
import OfferLetterModal from '../components/OfferLetterModal'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('hr')
  const [candidates, setCandidates] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [error, setError] = useState('')
  const [loadingCandidates, setLoadingCandidates] = useState(true)
  const [loadingSubmissions, setLoadingSubmissions] = useState(true)

  const loadCandidates = () => {
    setLoadingCandidates(true)
    return api
      .get('/hr/applications')
      .then((res) => setCandidates(res.data))
      .catch(() => setError('Unable to load HR applications.'))
      .finally(() => setLoadingCandidates(false))
  }

  const loadSubmissions = () => {
    setLoadingSubmissions(true)
    return api
      .get('/tech/submissions')
      .then((res) => setSubmissions(res.data))
      .catch(() => setError('Unable to load tech submissions.'))
      .finally(() => setLoadingSubmissions(false))
  }

  useEffect(() => {
    loadCandidates()
    loadSubmissions()
  }, [])

  const offerReady = submissions.filter(
    (s) => s.status === 'approved' && s.candidateId?.applicationStatus === 'tech_passed',
  )

  return (
    <div className="space-y-6">
      <section className="surface overflow-hidden">
        <div className="hero-band px-6 py-7 text-white sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-100">Operations console</p>
              <h1 className="mt-2 text-3xl font-black">Admin Panel</h1>
              <p className="mt-2 text-sm text-cyan-50">Manage applications, technical reviews, and offer generation.</p>
            </div>
            <div className="flex gap-2 rounded-xl bg-white/10 p-1 backdrop-blur">
              <button
                onClick={() => setActiveTab('hr')}
                className={activeTab === 'hr' ? 'rounded-lg bg-white px-5 py-2 text-sm font-bold text-slate-950' : 'rounded-lg px-5 py-2 text-sm font-bold text-white hover:bg-white/10'}
              >HR Review</button>
              <button
                onClick={() => setActiveTab('tech')}
                className={activeTab === 'tech' ? 'rounded-lg bg-white px-5 py-2 text-sm font-bold text-slate-950' : 'rounded-lg px-5 py-2 text-sm font-bold text-white hover:bg-white/10'}
              >Tech Review</button>
            </div>
          </div>
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
          <AdminMetric label="HR queue" value={loadingCandidates ? '…' : candidates.length} />
          <AdminMetric label="Tech submissions" value={loadingSubmissions ? '…' : submissions.length} />
          <AdminMetric label="Offer ready" value={loadingSubmissions ? '…' : offerReady.length} />
        </div>
      </section>

      {error && <div className="surface border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">{error}</div>}

      {activeTab === 'hr' && <HRReviewPanel candidates={candidates} onUpdate={loadCandidates} />}
      {activeTab === 'tech' && <TechReviewPanel submissions={submissions} onUpdate={loadSubmissions} />}

      <section className="surface p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-950">Offer Generation</h2>
          <p className="mt-1 text-sm text-slate-600">Select an approved candidate to send a formal offer letter.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offerReady.map((submission) => (
            <button
              key={submission._id}
              onClick={() => setSelectedCandidate(submission.candidateId)}
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-left transition hover:border-emerald-300 hover:bg-emerald-100"
            >
              <p className="text-lg font-bold text-emerald-950">{submission.candidateId?.name}</p>
              <p className="mt-1 text-sm text-emerald-700">{submission.candidateId?.email}</p>
              <span className="mt-4 inline-block rounded-full bg-emerald-200 px-3 py-1 text-xs font-bold text-emerald-950">Ready to send</span>
            </button>
          ))}
          {!loadingSubmissions && offerReady.length === 0 && (
            <div className="col-span-full rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
              No candidates ready for offers yet. Complete technical review first.
            </div>
          )}
        </div>
        {selectedCandidate && (
          <div className="mt-6">
            <OfferLetterModal
              candidate={selectedCandidate}
              onComplete={() => { setSelectedCandidate(null); loadSubmissions() }}
            />
          </div>
        )}
      </section>
    </div>
  )
}

const AdminMetric = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
    <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
  </div>
)

export default AdminPanel
