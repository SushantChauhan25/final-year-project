const steps = [
  { label: 'Applied', value: 'applied' },
  { label: 'HR Approved', value: 'hr_passed' },
  { label: 'Tech Submitted', value: 'tech_submitted' },
  { label: 'Tech Passed', value: 'tech_passed' },
  { label: 'Offer Sent', value: 'offer_sent' },
]

const TimelineStepper = ({ status }) => {
  const activeIndex = Math.max(0, steps.findIndex((item) => item.value === status))

  return (
    <div className="grid gap-3 md:grid-cols-5">
      {steps.map((step, index) => {
        const active = activeIndex >= index
        return (
          <div key={step.value} className={`rounded-xl border p-4 ${active ? 'border-cyan-200 bg-cyan-50' : 'border-slate-200 bg-slate-50'}`}>
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-black ${active ? 'bg-cyan-600 text-white' : 'bg-white text-slate-500'}`}>
              {index + 1}
            </div>
            <p className="mt-3 font-bold text-slate-950">{step.label}</p>
            <p className="mt-1 text-sm text-slate-500">{active ? 'Unlocked' : 'Locked'}</p>
          </div>
        )
      })}
    </div>
  )
}

export default TimelineStepper
