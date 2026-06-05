import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Aurora = () => (
  <div aria-hidden="true" className="aurora-root">
    <div className="orb orb-1" />
    <div className="orb orb-2" />
    <div className="orb orb-3" />
    <div className="grid-overlay" />
  </div>
)

const Stat = ({ value, label }) => (
  <div className="stat-pill">
    <span className="stat-value">{value}</span>
    <span className="stat-label">{label}</span>
  </div>
)

const RolePreview = ({ selectedRole }) => (
  <div className="role-preview glass-card">
    <p className="preview-eyebrow">Selected workspace</p>
    <div className="preview-row">
      <div className="preview-icon">{selectedRole.title.slice(0, 2)}</div>
      <div>
        <p className="preview-title">{selectedRole.title}</p>
        <p className="preview-copy">{selectedRole.text}</p>
      </div>
    </div>
    <div className="preview-track">
      <div className="preview-fill" />
    </div>
  </div>
)

const WorkflowCard = () => (
  <div className="workflow-card glass-card">
    <div className="workflow-header">
      <span className="workflow-title">Onboarding flow</span>
      <span className="badge-active">Ready</span>
    </div>
    {['Create workspace', 'Choose role', 'Start hiring flow'].map((item, index) => (
      <div key={item} className="workflow-step">
        <span className="workflow-number">{index + 1}</span>
        <span>{item}</span>
      </div>
    ))}
  </div>
)

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('candidate')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { user } = await register({ name, email, password, role })
      navigate(user.role === 'candidate' ? '/profile' : '/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = password.length >= 10 ? 'Strong' : password.length >= 6 ? 'Good' : password.length > 0 ? 'Short' : 'Empty'
  const strengthWidth = password.length >= 10 ? '100%' : password.length >= 6 ? '66%' : password.length > 0 ? '33%' : '0%'
  const selectedRole = roles.find((item) => item.value === role) || roles[0]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        .rf-scene {
          min-height: 100vh;
          background: #04050f;
          color: #e8edf8;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .aurora-root { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          animation: drift 18s ease-in-out infinite alternate;
        }
        .orb-1 { width: 640px; height: 640px; background: radial-gradient(circle, #0e3a6e 0%, transparent 70%); top: -160px; left: -100px; animation-delay: 0s; }
        .orb-2 { width: 500px; height: 500px; background: radial-gradient(circle, #0a4a4a 0%, transparent 70%); bottom: -80px; right: 5%; animation-delay: -6s; }
        .orb-3 { width: 380px; height: 380px; background: radial-gradient(circle, #1a1040 0%, transparent 70%); top: 40%; left: 35%; animation-delay: -12s; }
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(100,180,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(100,180,255,.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        @keyframes drift { from { transform: translate(0,0) scale(1); } to { transform: translate(40px, 30px) scale(1.08); } }

        .rf-body {
          position: relative;
          z-index: 1;
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 520px;
          gap: 48px;
          max-width: 1320px;
          margin: 0 auto;
          padding: 40px 48px 60px;
          width: 100%;
          align-items: center;
        }
        @media (max-width: 980px) {
          .rf-body { grid-template-columns: 1fr; padding: 32px 20px 48px; }
          .rf-hero { display: none !important; }
        }

        .rf-hero { position: relative; height: 100%; min-height: 620px; }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(100,200,255,.2);
          background: rgba(100,200,255,.07);
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: #7dd3e8;
          backdrop-filter: blur(12px);
        }
        .hero-dot { width: 6px; height: 6px; border-radius: 50%; background: #3ef; animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        .hero-headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.4rem, 4vw, 3.8rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -.03em;
          margin-top: 20px;
          color: #f0f4ff;
        }
        .hero-headline span { color: #5bcde8; }
        .hero-sub {
          margin-top: 16px;
          max-width: 470px;
          font-size: 15px;
          line-height: 1.75;
          color: #8ca0b8;
          font-weight: 300;
        }
        .hero-stats { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; }
        .stat-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid rgba(255,255,255,.1);
          background: rgba(255,255,255,.05);
          backdrop-filter: blur(16px);
          padding: 14px 22px;
          border-radius: 14px;
          transition: transform .25s, background .25s;
        }
        .stat-pill:hover { transform: translateY(-3px); background: rgba(255,255,255,.09); }
        .stat-value { font-family: 'Syne',sans-serif; font-size: 20px; font-weight: 800; color: #e8f4ff; }
        .stat-label { font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: #5a8aaa; margin-top: 4px; }

        .glass-card {
          border: 1px solid rgba(255,255,255,.1);
          background: rgba(255,255,255,.05);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 20px;
          padding: 20px;
        }
        .workflow-card { position: absolute; bottom: 54px; left: 0; width: 380px; }
        .workflow-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .workflow-title { font-family: 'Syne',sans-serif; font-weight: 700; font-size: 14px; color: #d0e8f8; }
        .badge-active {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          background: rgba(52,211,153,.15);
          color: #6ee7b7;
          border: 1px solid rgba(52,211,153,.3);
          padding: 3px 10px;
          border-radius: 999px;
        }
        .workflow-step {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 12px;
          color: #9db8cc;
          font-size: 13px;
        }
        .workflow-number {
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: rgba(91,205,232,.12);
          border: 1px solid rgba(91,205,232,.2);
          color: #7dd3e8;
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 800;
        }
        .role-preview { position: absolute; bottom: 70px; right: -18px; width: 300px; }
        .preview-eyebrow {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: #5bcde8;
          margin-bottom: 14px;
        }
        .preview-row { display: flex; gap: 12px; align-items: center; }
        .preview-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #1e5f8a, #0a3a5e);
          border: 1px solid rgba(100,200,255,.25);
          display: grid;
          place-items: center;
          font-family: 'Syne',sans-serif;
          font-weight: 800;
          color: #7dd3e8;
          font-size: 13px;
          text-transform: uppercase;
        }
        .preview-title { font-family: 'Syne',sans-serif; font-weight: 700; font-size: 15px; color: #e0eaf8; }
        .preview-copy { font-size: 12px; line-height: 1.5; color: #8ca0b8; margin-top: 2px; }
        .preview-track { height: 4px; background: rgba(255,255,255,.1); border-radius: 999px; overflow: hidden; margin-top: 18px; }
        .preview-fill { height: 100%; width: 76%; background: linear-gradient(90deg, #4ade80, #22d3ee); border-radius: 999px; }

        .hero-deco {
          position: absolute;
          top: 34px;
          right: 36px;
          width: 170px;
          height: 170px;
          border: 1px solid rgba(91,205,232,.12);
          border-radius: 28px;
          transform: rotate(15deg);
          background: linear-gradient(135deg, rgba(30,127,192,.12), rgba(10,58,94,.08));
          backdrop-filter: blur(10px);
        }
        .hero-deco::after {
          content: '';
          position: absolute;
          inset: 12px;
          border: 1px solid rgba(91,205,232,.08);
          border-radius: 20px;
        }
        .hero-deco-sm {
          position: absolute;
          top: 110px;
          right: 174px;
          width: 60px;
          height: 60px;
          border: 1px solid rgba(91,205,232,.15);
          border-radius: 14px;
          transform: rotate(-8deg);
          background: rgba(91,205,232,.05);
        }

        .rf-panel {
          background: rgba(8,14,30,.72);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 28px;
          padding: 40px;
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          box-shadow: 0 32px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.08);
          animation: panel-in .55s ease both;
        }
        @keyframes panel-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 560px) { .rf-panel { padding: 30px 22px; } }
        .panel-eyebrow {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: #5bcde8;
          text-align: center;
        }
        .panel-title {
          font-family: 'Syne',sans-serif;
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -.03em;
          color: #f0f4ff;
          text-align: center;
          margin: 10px 0 6px;
        }
        .panel-sub { font-size: 14px; color: #6a86a0; text-align: center; font-weight: 300; }
        .rf-form { margin-top: 28px; display: flex; flex-direction: column; gap: 18px; }
        .field-label {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #5a8aaa;
          display: block;
          margin-bottom: 8px;
        }
        .rf-input {
          width: 100%;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 12px;
          padding: 13px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: #e0eaf8;
          outline: none;
          transition: border-color .2s, background .2s;
        }
        .rf-input::placeholder { color: #3a5468; }
        .rf-input:focus { border-color: rgba(91,205,232,.5); background: rgba(91,205,232,.04); }
        .rf-input:disabled { opacity: .5; cursor: not-allowed; }
        .pw-wrap { position: relative; }
        .pw-wrap .rf-input { padding-right: 72px; }
        .pw-toggle {
          position: absolute;
          right: 4px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans',sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #5bcde8;
          padding: 6px 12px;
          border-radius: 8px;
          transition: background .2s;
        }
        .pw-toggle:hover { background: rgba(91,205,232,.1); }
        .strength-row { display: flex; align-items: center; gap: 12px; margin-top: 10px; }
        .strength-track { flex: 1; height: 4px; border-radius: 999px; overflow: hidden; background: rgba(255,255,255,.1); }
        .strength-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #1e7fc0, #5bcde8); transition: width .35s ease; }
        .strength-label { min-width: 44px; font-size: 11px; font-weight: 700; color: #5bcde8; text-align: right; }
        .role-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
        @media (max-width: 560px) { .role-grid { grid-template-columns: 1fr; } }
        .role-card {
          border: 1px solid rgba(255,255,255,.1);
          background: rgba(255,255,255,.04);
          border-radius: 14px;
          padding: 14px;
          text-align: left;
          cursor: pointer;
          transition: transform .2s, border-color .2s, background .2s;
        }
        .role-card:hover { transform: translateY(-2px); border-color: rgba(91,205,232,.32); background: rgba(91,205,232,.06); }
        .role-card--active { border-color: rgba(91,205,232,.55); background: rgba(91,205,232,.1); box-shadow: 0 10px 28px rgba(14,90,143,.22); }
        .role-title { font-family: 'Syne',sans-serif; font-size: 13px; font-weight: 800; color: #e8f4ff; }
        .role-text { margin-top: 5px; font-size: 11px; line-height: 1.45; color: #6a86a0; }
        .error-box {
          background: rgba(239,68,68,.1);
          border: 1px solid rgba(239,68,68,.25);
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 13px;
          color: #fca5a5;
        }
        .rf-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #1e7fc0 0%, #0e5a8f 50%, #0d4a7a 100%);
          border: 1px solid rgba(100,200,255,.2);
          border-radius: 14px;
          cursor: pointer;
          font-family: 'Syne',sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: .06em;
          color: #e8f4ff;
          transition: transform .2s, box-shadow .2s, opacity .2s;
          box-shadow: 0 6px 24px rgba(14,90,143,.5);
          position: relative;
          overflow: hidden;
        }
        .rf-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,.12) 0%, transparent 60%);
          pointer-events: none;
        }
        .rf-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(14,90,143,.7); }
        .rf-btn:disabled { opacity: .6; cursor: not-allowed; }
        .panel-divider { border: none; border-top: 1px solid rgba(255,255,255,.08); margin: 24px 0 20px; }
        .panel-register { text-align: center; font-size: 13px; color: #4a6a82; }
        .rf-link { font-size: 13px; font-weight: 600; color: #5bcde8; text-decoration: none; transition: color .2s; }
        .rf-link:hover { color: #a5e8f5; }
      `}</style>

      <div className="rf-scene">
        <Aurora />
        <div className="rf-body">
          <section className="rf-hero" aria-hidden="true">
            <div className="hero-eyebrow">
              <span className="hero-dot" />
              RecruitFlow Onboarding
            </div>
            <h1 className="hero-headline">
              Create your role,
              <br />
              <span>enter the flow,</span>
              <br />
              and start moving.
            </h1>
            <p className="hero-sub">
              Candidate, HR, tech, and admin workspaces each open into a focused hiring experience.
            </p>
            <div className="hero-stats">
              <Stat value="4" label="Roles" />
              <Stat value="1" label="Workspace" />
              <Stat value="Fast" label="Setup" />
            </div>
            <WorkflowCard />
            <RolePreview selectedRole={selectedRole} />
            <div className="hero-deco" />
            <div className="hero-deco-sm" />
          </section>

          <section>
            <div className="rf-panel">
              <p className="panel-eyebrow">Start here</p>
              <h2 className="panel-title">Create account</h2>
              <p className="panel-sub">Choose your workspace role and continue.</p>

              <form className="rf-form" onSubmit={handleSubmit}>
                <div>
                  <label className="field-label" htmlFor="rf-name">Full name</label>
                  <input
                    id="rf-name"
                    className="rf-input"
                    required
                    disabled={loading}
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label className="field-label" htmlFor="rf-email">Email</label>
                  <input
                    id="rf-email"
                    className="rf-input"
                    type="email"
                    required
                    disabled={loading}
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="field-label" htmlFor="rf-password">Password</label>
                  <div className="pw-wrap">
                    <input
                      id="rf-password"
                      className="rf-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      disabled={loading}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="pw-toggle"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <div className="strength-row">
                    <div className="strength-track">
                      <div className="strength-fill" style={{ width: strengthWidth }} />
                    </div>
                    <span className="strength-label">{passwordStrength}</span>
                  </div>
                </div>

                <div>
                  <span className="field-label">Role</span>
                  <div className="role-grid">
                    {roles.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        disabled={loading}
                        onClick={() => setRole(item.value)}
                        className={`role-card ${role === item.value ? 'role-card--active' : ''}`}
                      >
                        <p className="role-title">{item.title}</p>
                        <p className="role-text">{item.text}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {error && <div className="error-box" role="alert">{error}</div>}

                <button type="submit" className="rf-btn" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create account ->'}
                </button>
              </form>

              <hr className="panel-divider" />
              <p className="panel-register">
                Already have an account?{' '}
                <Link to="/login" className="rf-link">Sign in</Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

const roles = [
  { value: 'candidate', title: 'Candidate', text: 'Build profile and complete coding rounds.' },
  { value: 'hr', title: 'HR Manager', text: 'Screen applications and move candidates forward.' },
  { value: 'tech', title: 'Tech Lead', text: 'Review code and give technical decisions.' },
  { value: 'admin', title: 'Admin', text: 'Oversee operations and offer flow.' },
]

export default Register
