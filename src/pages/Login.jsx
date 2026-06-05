import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/* ─── Floating orb / aurora background ─── */
const Aurora = () => (
  <div aria-hidden="true" className="aurora-root">
    <div className="orb orb-1" />
    <div className="orb orb-2" />
    <div className="orb orb-3" />
    <div className="grid-overlay" />
  </div>
)

/* ─── Animated pipeline card ─── */
const PipelineCard = () => {
  const steps = [
    { label: 'Profile review', pct: 100, done: true },
    { label: 'Coding round',   pct: 100, done: true },
    { label: 'Offer decision', pct: 38,  done: false },
  ]
  return (
    <div className="pipeline-card glass-card">
      <div className="pipeline-header">
        <span className="pipeline-title">Pipeline health</span>
        <span className="badge-active">Active</span>
      </div>
      <div className="pipeline-steps">
        {steps.map(({ label, pct, done }) => (
          <div key={label} className="pipe-step">
            <div className={`pipe-dot ${done ? 'pipe-dot--done' : ''}`} />
            <div className="pipe-info">
              <span className="pipe-label">{label}</span>
              <div className="pipe-track">
                <div className="pipe-fill" style={{ width: `${pct}%`, opacity: done ? 1 : 0.55 }} />
              </div>
            </div>
            <span className="pipe-pct">{pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Candidate card ─── */
const CandidateCard = () => (
  <div className="candidate-card glass-card">
    <p className="cand-eyebrow">Top candidate</p>
    <div className="cand-row">
      <div className="cand-avatar">AM</div>
      <div>
        <p className="cand-name">Aarav Mehta</p>
        <p className="cand-role">Full-Stack Engineer</p>
      </div>
      <div className="cand-score">
        <svg viewBox="0 0 36 36" width="44" height="44">
          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="3"/>
          <circle cx="18" cy="18" r="15" fill="none" stroke="#6ee7f7" strokeWidth="3"
            strokeDasharray="75.4" strokeDashoffset="15.1"
            strokeLinecap="round" transform="rotate(-90 18 18)"/>
        </svg>
        <span className="cand-pct">80%</span>
      </div>
    </div>
    <div className="cand-tags">
      <span className="tag">React</span>
      <span className="tag">Node.js</span>
      <span className="tag">PostgreSQL</span>
    </div>
  </div>
)

/* ─── Stat pill ─── */
const Stat = ({ value, label }) => (
  <div className="stat-pill">
    <span className="stat-value">{value}</span>
    <span className="stat-label">{label}</span>
  </div>
)

/* ─── Main Login ─── */
const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { user } = await login({ email, password })
      navigate(user.role === 'candidate' ? '/candidate' : '/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

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

        /* ── Aurora ── */
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
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(100,180,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(100,180,255,.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        @keyframes drift { from { transform: translate(0,0) scale(1); } to { transform: translate(40px, 30px) scale(1.08); } }

        /* ── Layout ── */
        .rf-body {
          position: relative; z-index: 1;
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 460px;
          gap: 0;
          max-width: 1260px;
          margin: 0 auto;
          padding: 40px 48px 60px;
          width: 100%;
          align-items: center;
        }
        @media (max-width: 900px) {
          .rf-body { grid-template-columns: 1fr; padding: 32px 20px 48px; }
          .rf-hero { display: none !important; }
        }

        /* ── Hero side ── */
        .rf-hero { position: relative; height: 100%; min-height: 580px; }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid rgba(100,200,255,.2);
          background: rgba(100,200,255,.07);
          padding: 6px 14px; border-radius: 999px;
          font-size: 10px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase;
          color: #7dd3e8; backdrop-filter: blur(12px);
        }
        .hero-dot { width: 6px; height: 6px; border-radius: 50%; background: #3ef; animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        .hero-headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.4rem, 4vw, 3.6rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -.03em;
          margin-top: 20px;
          color: #f0f4ff;
        }
        .hero-headline span { color: #5bcde8; }
        .hero-sub {
          margin-top: 16px; max-width: 440px;
          font-size: 15px; line-height: 1.75; color: #8ca0b8; font-weight: 300;
        }

        .hero-stats {
          display: flex; gap: 12px; margin-top: 32px;
        }
        .stat-pill {
          display: flex; flex-direction: column; align-items: center;
          border: 1px solid rgba(255,255,255,.1);
          background: rgba(255,255,255,.05);
          backdrop-filter: blur(16px);
          padding: 14px 22px; border-radius: 14px;
          transition: transform .25s, background .25s;
        }
        .stat-pill:hover { transform: translateY(-3px); background: rgba(255,255,255,.09); }
        .stat-value { font-family: 'Syne',sans-serif; font-size: 20px; font-weight: 800; color: #e8f4ff; }
        .stat-label { font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: #5a8aaa; margin-top: 4px; }

        /* ── Glass card ── */
        .glass-card {
          border: 1px solid rgba(255,255,255,.1);
          background: rgba(255,255,255,.05);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 20px;
          padding: 20px;
        }

        .pipeline-card { position: absolute; bottom: 50px; left: 0; width: 360px; }
        .pipeline-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .pipeline-title { font-family: 'Syne',sans-serif; font-weight: 700; font-size: 14px; color: #d0e8f8; }
        .badge-active {
          font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
          background: rgba(52,211,153,.15); color: #6ee7b7;
          border: 1px solid rgba(52,211,153,.3);
          padding: 3px 10px; border-radius: 999px;
        }
        .pipeline-steps { display: flex; flex-direction: column; gap: 12px; }
        .pipe-step { display: flex; align-items: center; gap: 12px; }
        .pipe-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; background: rgba(255,255,255,.2); }
        .pipe-dot--done { background: #4ade80; box-shadow: 0 0 8px rgba(74,222,128,.6); }
        .pipe-info { flex: 1; }
        .pipe-label { font-size: 12px; color: #9db8cc; display: block; margin-bottom: 5px; }
        .pipe-track { height: 4px; background: rgba(255,255,255,.1); border-radius: 999px; overflow: hidden; }
        .pipe-fill { height: 100%; background: linear-gradient(90deg, #4ade80, #22d3ee); border-radius: 999px; transition: width 1s ease; }
        .pipe-pct { font-size: 11px; font-family: 'Syne',sans-serif; font-weight: 700; color: #5bcde8; min-width: 30px; text-align: right; }

        .candidate-card { position: absolute; bottom: 60px; right: -20px; width: 280px; }
        .cand-eyebrow { font-size: 9px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: #5bcde8; margin-bottom: 12px; }
        .cand-row { display: flex; align-items: center; gap: 10px; }
        .cand-avatar {
          width: 42px; height: 42px; border-radius: 12px;
          background: linear-gradient(135deg, #1e5f8a, #0a3a5e);
          border: 1px solid rgba(100,200,255,.25);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne',sans-serif; font-weight: 800; font-size: 14px; color: #7dd3e8;
          flex-shrink: 0;
        }
        .cand-name { font-family: 'Syne',sans-serif; font-weight: 700; font-size: 14px; color: #e0eaf8; }
        .cand-role { font-size: 11px; color: #8ca0b8; margin-top: 2px; }
        .cand-score { position: relative; margin-left: auto; flex-shrink: 0; }
        .cand-pct { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Syne',sans-serif; font-size: 10px; font-weight: 800; color: #6ee7f7; }
        .cand-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 12px; }
        .tag {
          font-size: 10px; font-weight: 500; letter-spacing: .04em;
          background: rgba(91,205,232,.1); color: #7dd3e8;
          border: 1px solid rgba(91,205,232,.2);
          padding: 3px 9px; border-radius: 6px;
        }

        /* ── Auth panel ── */
        .rf-panel {
          background: rgba(8,14,30,.7);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 28px;
          padding: 44px 40px 40px;
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          box-shadow: 0 32px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.08);
          animation: panel-in .55s ease both;
        }
        @keyframes panel-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .panel-eyebrow {
          font-size: 10px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase;
          color: #5bcde8; text-align: center;
        }
        .panel-title {
          font-family: 'Syne',sans-serif; font-size: 2.2rem; font-weight: 800;
          letter-spacing: -.03em; color: #f0f4ff; text-align: center;
          margin: 10px 0 6px;
        }
        .panel-sub { font-size: 14px; color: #6a86a0; text-align: center; font-weight: 300; }

        /* Mini metrics bar */
        .metrics-bar {
          display: grid; grid-template-columns: repeat(3,1fr);
          gap: 8px; margin-top: 28px;
          border: 1px solid rgba(255,255,255,.08);
          background: rgba(255,255,255,.03);
          border-radius: 14px; padding: 12px;
        }
        .mini-metric { text-align: center; padding: 6px 0; }
        .mini-metric-val { font-family: 'Syne',sans-serif; font-size: 13px; font-weight: 800; color: #d0eaf8; }
        .mini-metric-lbl { font-size: 9px; letter-spacing: .1em; text-transform: uppercase; color: #4a6a82; margin-top: 3px; }

        /* Form */
        .rf-form { margin-top: 28px; display: flex; flex-direction: column; gap: 18px; }
        .field-label { font-size: 12px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: #5a8aaa; display: block; margin-bottom: 8px; }
        .rf-input {
          width: 100%; background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 12px; padding: 13px 16px;
          font-family: 'DM Sans', sans-serif; font-size: 15px; color: #e0eaf8;
          outline: none; transition: border-color .2s, background .2s;
          -webkit-autofill-style: none;
        }
        .rf-input::placeholder { color: #3a5468; }
        .rf-input:focus { border-color: rgba(91,205,232,.5); background: rgba(91,205,232,.04); }
        .rf-input:disabled { opacity: .5; cursor: not-allowed; }
        .pw-wrap { position: relative; }
        .pw-wrap .rf-input { padding-right: 72px; }
        .pw-toggle {
          position: absolute; right: 4px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          font-family: 'DM Sans',sans-serif; font-size: 11px; font-weight: 600;
          letter-spacing: .08em; text-transform: uppercase; color: #5bcde8;
          padding: 6px 12px; border-radius: 8px; transition: background .2s;
        }
        .pw-toggle:hover { background: rgba(91,205,232,.1); }

        .form-footer { display: flex; align-items: center; justify-content: space-between; }
        .remember { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #6a86a0; cursor: pointer; }
        .remember input { accent-color: #5bcde8; }
        .rf-link { font-size: 13px; font-weight: 600; color: #5bcde8; text-decoration: none; transition: color .2s; }
        .rf-link:hover { color: #a5e8f5; }

        .error-box {
          background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.25);
          border-radius: 12px; padding: 12px 16px; font-size: 13px;
          color: #fca5a5; display: flex; align-items: center; gap: 8px;
        }

        .rf-btn {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #1e7fc0 0%, #0e5a8f 50%, #0d4a7a 100%);
          border: 1px solid rgba(100,200,255,.2);
          border-radius: 14px; cursor: pointer;
          font-family: 'Syne',sans-serif; font-size: 15px; font-weight: 700;
          letter-spacing: .06em; color: #e8f4ff;
          transition: transform .2s, box-shadow .2s, opacity .2s;
          box-shadow: 0 6px 24px rgba(14,90,143,.5);
          position: relative; overflow: hidden;
        }
        .rf-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,.12) 0%, transparent 60%);
          pointer-events: none;
        }
        .rf-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(14,90,143,.7); }
        .rf-btn:active:not(:disabled) { transform: translateY(0); }
        .rf-btn:disabled { opacity: .6; cursor: not-allowed; }

        .panel-divider { border: none; border-top: 1px solid rgba(255,255,255,.08); margin: 24px 0 20px; }
        .panel-register { text-align: center; font-size: 13px; color: #4a6a82; }

        /* ── Decorative floating shapes in hero ── */
        .hero-deco {
          position: absolute; top: 30px; right: 30px;
          width: 160px; height: 160px;
          border: 1px solid rgba(91,205,232,.12);
          border-radius: 28px;
          transform: rotate(15deg);
          background: linear-gradient(135deg, rgba(30,127,192,.12), rgba(10,58,94,.08));
          backdrop-filter: blur(10px);
        }
        .hero-deco::after {
          content: ''; position: absolute; inset: 12px;
          border: 1px solid rgba(91,205,232,.08);
          border-radius: 20px;
        }
        .hero-deco-sm {
          position: absolute; top: 100px; right: 160px;
          width: 60px; height: 60px;
          border: 1px solid rgba(91,205,232,.15);
          border-radius: 14px;
          transform: rotate(-8deg);
          background: rgba(91,205,232,.05);
        }
      `}</style>

      <div className="rf-scene">
        <Aurora />
        <div className="rf-body">

          {/* ── Hero ── */}
          <section className="rf-hero" aria-hidden="true">
            <div className="hero-eyebrow">
              <span className="hero-dot" />
              RecruitFlow Command Center
            </div>
            <h1 className="hero-headline">
              Hiring that feels<br />
              <span>precise, calm,</span><br />
              and alive.
            </h1>
            <p className="hero-sub">
              One polished workspace for candidate profiles, coding reviews, hiring decisions, and offer flow.
            </p>
            <div className="hero-stats">
              <Stat value="3" label="Stages" />
              <Stat value="Live" label="Code review" />
              <Stat value="12" label="Candidates" />
            </div>
            <PipelineCard />
            <CandidateCard />
            <div className="hero-deco" />
            <div className="hero-deco-sm" />
          </section>

          {/* ── Auth panel ── */}
          <section>
            <div className="rf-panel">
              <p className="panel-eyebrow">Welcome back</p>
              <h2 className="panel-title">Sign in</h2>
              <p className="panel-sub">Enter your workspace credentials to continue.</p>

              <div className="metrics-bar" aria-hidden="true">
                <div className="mini-metric">
                  <p className="mini-metric-val">HR</p>
                  <p className="mini-metric-lbl">Review</p>
                </div>
                <div className="mini-metric">
                  <p className="mini-metric-val">Tech</p>
                  <p className="mini-metric-lbl">Screen</p>
                </div>
                <div className="mini-metric">
                  <p className="mini-metric-val">Offer</p>
                  <p className="mini-metric-lbl">Close</p>
                </div>
              </div>

              <form className="rf-form" onSubmit={handleSubmit} noValidate>
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
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="pw-toggle"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="form-footer">
                  <label className="remember">
                    <input type="checkbox" />
                    Remember me
                  </label>
                  <Link to="/register" className="rf-link">Need access?</Link>
                </div>

                {error && (
                  <div className="error-box" role="alert">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <circle cx="7" cy="7" r="6.5" stroke="#f87171" strokeWidth="1"/>
                      <path d="M7 4v4M7 9.5v.5" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    {error}
                  </div>
                )}

                <button type="submit" className="rf-btn" disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign in →'}
                </button>
              </form>

              <hr className="panel-divider" />
              <p className="panel-register">
                New to RecruitFlow?{' '}
                <Link to="/register" className="rf-link">Create an account</Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default Login
