import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import CodeEditor from './CodeEditor'

const defaultCode = `function solve(input) {
  const data = input.trim().split(/\\s+/).map(Number)
  const count = data[0]
  const numbers = data.slice(1, count + 1)
  const sum = numbers.filter((n) => n % 2 === 0).reduce((a, v) => a + v, 0)
  return sum
}

// Sample usage — modify solve() above, then run
const stdin = '5\\n1 2 3 4 5'
console.log(solve(stdin))`

const CodingArena = () => {
  const [test, setTest] = useState(null)
  const [code, setCode] = useState(defaultCode)
  const [output, setOutput] = useState('')
  const [languageId] = useState(63) // JavaScript (Node.js)
  const [tabSwitches, setTabSwitches] = useState(0)
  const [running, setRunning] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [activePanel, setActivePanel] = useState('problem')
  const [submitDone, setSubmitDone] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    api
      .get('/candidate/profile')
      .then((res) => {
        if (!res.data.activeTest) {
          navigate('/candidate')
          return
        }
        setTest(res.data.activeTest)
      })
      .catch(() => navigate('/login'))
  }, [navigate])

  useEffect(() => {
    const onBlur = () => setTabSwitches((prev) => prev + 1)
    window.addEventListener('blur', onBlur)
    return () => window.removeEventListener('blur', onBlur)
  }, [])

  const runCode = async () => {
    setRunning(true)
    setOutput('⏳ Running against sample test...')
    try {
      const res = await api.post('/code/run', {
        source_code: code,
        language_id: languageId,
        stdin: test.sampleInput,
      })
      const out = res.data.stdout || res.data.stderr || res.data.compile_output || 'No output returned.'
      setOutput(`Status: ${res.data.status}\n\n${out}`)
    } catch (err) {
      setOutput(err.response?.data?.stderr || 'Unable to run code. Check server connection.')
    } finally {
      setRunning(false)
    }
  }

  const submitCode = async () => {
    if (!window.confirm('Submit this as your final solution? You cannot undo this.')) return
    setSubmitting(true)
    setOutput('📤 Submitting final solution...')
    try {
      const res = await api.post('/code/submit', {
        source_code: code,
        language_id: languageId,
        stdin: test.sampleInput,
        testId: test._id,
      })
      const status = res.data.judgeResult?.status || 'Submitted'
      setOutput(`✅ Submitted successfully.\nStatus: ${status}`)
      setSubmitDone(true)
    } catch (err) {
      setOutput(err.response?.data?.message || 'Unable to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!test) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loading-spinner" />
          <p className="text-slate-600">Loading coding arena...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
      {/* Problem panel */}
      <div className="surface overflow-hidden">
        <div className="hero-band px-6 py-7 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-100">Coding Arena</p>
          <h2 className="mt-2 text-3xl font-black">{test.title}</h2>
          <p className="mt-2 text-sm text-cyan-50">
            Run against the sample, then submit your final solution when ready.
          </p>
        </div>
        <div className="p-6">
          <div className="mb-5 flex rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button
              onClick={() => setActivePanel('problem')}
              className={activePanel === 'problem' ? 'flex-1 rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-950 shadow-sm' : 'flex-1 px-4 py-2 text-sm font-bold text-slate-500'}
            >Problem</button>
            <button
              onClick={() => setActivePanel('samples')}
              className={activePanel === 'samples' ? 'flex-1 rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-950 shadow-sm' : 'flex-1 px-4 py-2 text-sm font-bold text-slate-500'}
            >Samples</button>
          </div>

          {activePanel === 'problem' ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-lg font-bold text-slate-900">Prompt</h3>
              <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-700">{test.problemStatement}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <SampleBlock title="Sample Input" value={test.sampleInput} />
              <SampleBlock title="Expected Output" value={test.expectedOutput} />
            </div>
          )}

          <div className={`mt-5 rounded-xl border p-5 ${tabSwitches > 2 ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-bold">Focus monitor</p>
              <span className="chip bg-white">{tabSwitches} tab switch{tabSwitches !== 1 ? 'es' : ''}</span>
            </div>
            <p className="mt-2 text-sm opacity-80">Tab switches are tracked during this round.</p>
          </div>
        </div>
      </div>

      {/* Editor panel */}
      <div className="space-y-6">
        <div className="surface p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Editor</h3>
              <p className="text-sm text-slate-500">Language: JavaScript (Node.js)</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={runCode} disabled={running || submitting || submitDone} className="btn-primary">
                {running ? 'Running…' : 'Run Code'}
              </button>
              <button onClick={submitCode} disabled={running || submitting || submitDone} className="btn-outline">
                {submitDone ? 'Submitted ✓' : submitting ? 'Submitting…' : 'Submit Final'}
              </button>
            </div>
          </div>
          <CodeEditor language="javascript" value={code} onChange={(v) => setCode(v || '')} />
        </div>
        <div className="surface p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-900">Execution Console</h3>
            {output && <button onClick={() => setOutput('')} className="btn-outline py-2">Clear</button>}
          </div>
          <pre className="mt-4 min-h-[150px] overflow-auto rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">
            {output || 'Run code to see output here.'}
          </pre>
        </div>
      </div>
    </div>
  )
}

const SampleBlock = ({ title, value }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
    <h4 className="font-bold text-slate-900">{title}</h4>
    <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-3 text-sm text-slate-700">{value}</pre>
  </div>
)

export default CodingArena
