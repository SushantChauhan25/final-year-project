import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const { user, setUser } = useAuth()
  const [profile, setProfile] = useState({ headline: '', bio: '', skills: '', experience: '', linkedinUrl: '', githubUrl: '' })
  const [resumeUrl, setResumeUrl] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'candidate') return
    api
      .get('/candidate/profile')
      .then((res) => {
        const candidate = res.data.candidate
        setResumeUrl(candidate.resumeUrl || '')
        setProfile({
          headline: candidate.profile?.headline || '',
          bio: candidate.profile?.bio || '',
          skills: (candidate.profile?.skills || []).join(', '),
          experience: candidate.profile?.experience || '',
          linkedinUrl: candidate.profile?.linkedinUrl || '',
          githubUrl: candidate.profile?.githubUrl || '',
        })
      })
      .catch(() => setError('Unable to load profile details.'))
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setSaving(true)
    try {
      const payload = {
        resumeUrl,
        profile: {
          ...profile,
          skills: profile.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
        },
      }
      const response = await api.put('/candidate/profile', payload)
      setMessage('Profile updated successfully')
      setUser(response.data.candidate)
    } catch {
      setError('Unable to save your profile.')
    } finally {
      setSaving(false)
    }
  }

  if (user?.role !== 'candidate') {
    return <div className="surface mx-auto max-w-2xl p-8 text-center text-slate-700">Profiles are available for candidate accounts.</div>
  }

  const skillList = profile.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
  const completionItems = [
    Boolean(profile.headline.trim()),
    Boolean(profile.bio.trim()),
    skillList.length > 0,
    Boolean(profile.experience.trim()),
    Boolean(resumeUrl.trim()),
  ]
  const completion = Math.round((completionItems.filter(Boolean).length / completionItems.length) * 100)

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="surface overflow-hidden">
        <div className="hero-band px-7 py-8 text-white sm:px-8">
          <div className="grid gap-5 md:grid-cols-[1fr_220px] md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-100">Candidate profile</p>
              <h1 className="mt-2 text-3xl font-black">Complete your profile</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-cyan-50">Give reviewers the context they need before HR and technical screening.</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <div className="flex items-center justify-between text-sm font-bold">
                <span>Profile strength</span>
                <span>{completion}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${completion}%` }} />
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6 p-7 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <Field label="Headline" value={profile.headline} onChange={(value) => setProfile((prev) => ({ ...prev, headline: value }))} placeholder="Full Stack Developer | MERN Expert" />
            <Field label="Experience" value={profile.experience} onChange={(value) => setProfile((prev) => ({ ...prev, experience: value }))} placeholder="3 years in software development" />
          </div>

          <label className="block">
            <span className="text-sm font-bold text-slate-700">Bio</span>
            <textarea value={profile.bio} onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))} rows="5" className="input-field mt-2" placeholder="Tell reviewers about your work, goals, and strengths." />
          </label>

          <div className="grid gap-6 lg:grid-cols-2">
            <Field label="Skills" value={profile.skills} onChange={(value) => setProfile((prev) => ({ ...prev, skills: value }))} placeholder="JavaScript, React, Node.js, MongoDB" helper="Separate multiple skills with commas" />
            <Field label="Resume URL" value={resumeUrl} onChange={setResumeUrl} placeholder="https://example.com/resume.pdf" />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-slate-950">Skill preview</p>
                <p className="text-sm text-slate-600">These tags are what reviewers will scan first.</p>
              </div>
              <span className="chip">{skillList.length} skills</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {skillList.length > 0 ? skillList.map((skill) => <span key={skill} className="chip border-cyan-200 bg-cyan-50 text-cyan-800">{skill}</span>) : <span className="text-sm text-slate-500">Add comma-separated skills to preview them here.</span>}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Field label="LinkedIn URL" value={profile.linkedinUrl} onChange={(value) => setProfile((prev) => ({ ...prev, linkedinUrl: value }))} placeholder="https://linkedin.com/in/yourprofile" />
            <Field label="GitHub URL" value={profile.githubUrl} onChange={(value) => setProfile((prev) => ({ ...prev, githubUrl: value }))} placeholder="https://github.com/yourprofile" />
          </div>

          {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">{message}</div>}
          {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">{error}</div>}

          <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? 'Saving...' : 'Save Profile'}</button>
        </form>
      </div>
    </div>
  )
}

const Field = ({ label, value, onChange, placeholder, helper }) => (
  <label className="block">
    <span className="text-sm font-bold text-slate-700">{label}</span>
    <input value={value} onChange={(e) => onChange(e.target.value)} className="input-field mt-2" placeholder={placeholder} />
    {helper && <p className="mt-1 text-xs text-slate-500">{helper}</p>}
  </label>
)

export default Profile
