import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import TimelineStepper from '../components/TimelineStepper'

const statusStyles = {
  applied: 'border-blue-200 bg-blue-50 text-blue-700',
  hr_passed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  tech_submitted: 'border-amber-200 bg-amber-50 text-amber-700',
  tech_passed: 'border-violet-200 bg-violet-50 text-violet-700',
  selected: 'border-green-200 bg-green-50 text-green-700',
  offer_sent: 'border-indigo-200 bg-indigo-50 text-indigo-700',
}

const CandidateDashboard = () => {
  const [candidate, setCandidate] = useState(null)
  const [activeTest, setActiveTest] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/candidate/profile')
      .then((res) => {
        setCandidate(res.data.candidate)
        setActiveTest(res.data.activeTest)
      })
      .catch(() => setError('Unable to load your dashboard. Please sign in again.'))
  }, [])

  if (error) {
    return <div className="surface p-8 text-center text-rose-700">{error}</div>
  }

  if (!candidate) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loading-spinner" />
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const profileComplete = Boolean(candidate.profile?.headline && candidate.profile?.skills?.length)
  const statusLabel = candidate.applicationStatus.replace(/_/g, ' ').toUpperCase()

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <section className="surface overflow-hidden">
          <div className="hero-band px-6 py-7 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="avatar h-16 w-16 text-2xl">{candidate.name.charAt(0).toUpperCase()}</div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100">Candidate workspace</p>
                  <h1 className="mt-1 text-3xl font-bold text-white">{candidate.name}</h1>
                </div>
              </div>
              <span className={`rounded-full border px-4 py-2 text-xs font-bold ${statusStyles[candidate.applicationStatus] || statusStyles.applied}`}>
                {statusLabel}
              </span>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
            <Metric label="Current round" value={`${candidate.currentRound}/3`} detail="Hiring pipeline" tone="blue" />
            <Metric label="Resume" value={candidate.resumeUrl ? 'Uploaded' : 'Pending'} detail="Required for review" tone="emerald" />
            <Metric label="Profile" value={profileComplete ? 'Complete' : 'Incomplete'} detail="Recruiter visibility" tone="amber" />
          </div>

          {(candidate.hrReviewReason || candidate.techReviewReason) && (
            <div className="space-y-3 px-6 pb-6 sm:px-8">
              {candidate.hrReviewReason && <Feedback title="HR feedback" text={candidate.hrReviewReason} tone="rose" />}
              {candidate.techReviewReason && <Feedback title="Tech feedback" text={candidate.techReviewReason} tone="amber" />}
            </div>
          )}
        </section>

        <section className="surface p-6 sm:p-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Application Progress</h2>
              <p className="text-sm text-slate-600">Track each hiring stage from application to offer.</p>
            </div>
          </div>
          <TimelineStepper status={candidate.applicationStatus} />
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/profile" className="btn-primary">Update Profile</Link>
            <Link to={activeTest ? '/coding' : '#'} className={activeTest ? 'btn-dark' : 'btn-muted'} aria-disabled={!activeTest}>
              {activeTest ? 'Open Coding Arena' : 'Coding Locked'}
            </Link>
          </div>
        </section>
      </div>

      <aside className="space-y-6">
        <section className="surface p-6">
          <h2 className="text-lg font-bold text-slate-950">Quick Summary</h2>
          <div className="mt-5 space-y-4 text-sm">
            <Summary label="Headline" value={candidate.profile?.headline || 'Not added yet'} />
            <Summary label="Skills" value={candidate.profile?.skills?.join(', ') || 'Not added yet'} />
            <Summary label="Experience" value={candidate.profile?.experience || 'Not added yet'} />
          </div>
        </section>

        <section className="surface border-cyan-200 bg-cyan-50 p-6">
          <h2 className="text-lg font-bold text-cyan-950">Next Milestone</h2>
          <p className="mt-3 text-sm leading-6 text-cyan-900">
            {candidate.applicationStatus === 'applied' && 'Waiting for HR review. Complete your profile so reviewers have the full picture.'}
            {candidate.applicationStatus === 'hr_passed' && 'Your coding round is available. Open the arena when you are ready.'}
            {candidate.applicationStatus === 'tech_submitted' && 'Your code submission is being reviewed by the technical team.'}
            {candidate.applicationStatus === 'tech_passed' && 'You passed the technical round. The final decision is up next.'}
            {candidate.applicationStatus === 'offer_sent' && 'Your offer has been sent. Check your email for the details.'}
          </p>
        </section>
      </aside>
    </div>
  )
}

const Metric = ({ label, value, detail, tone }) => {
  const colors = {
    blue: 'border-blue-200 bg-blue-50 text-blue-900',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    amber: 'border-amber-200 bg-amber-50 text-amber-900',
  }

  return (
    <div className={`rounded-xl border p-5 ${colors[tone]}`}>
      <p className="text-xs font-bold uppercase tracking-[0.14em] opacity-75">{label}</p>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs opacity-75">{detail}</p>
    </div>
  )
}

const Feedback = ({ title, text, tone }) => (
  <div className={`rounded-xl border p-4 text-sm ${tone === 'rose' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
    <p className="mb-1 font-bold">{title}</p>
    {text}
  </div>
)

const Summary = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
    <p className="mt-1 font-medium text-slate-900">{value}</p>
  </div>
)

export default CandidateDashboard
