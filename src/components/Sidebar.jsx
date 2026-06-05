const Sidebar = () => {
  return (
    <aside className="hidden xl:block xl:w-80">
      <div className="surface sticky top-28 space-y-6 p-6">
        <section>
          <h2 className="text-lg font-bold text-slate-900">Trending Jobs</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <Job title="Frontend Developer" detail="Remote" accent="from-brand-50 to-brand-100" />
            <Job title="Technical Recruiter" detail="Hybrid" accent="from-slate-50 to-slate-100" />
            <Job title="Full Stack Engineer" detail="SaaS" accent="from-emerald-50 to-emerald-100" />
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-slate-900">Suggested Connections</h3>
          <div className="mt-4 space-y-3">
            <Connection name="Mia Chen" role="Engineering Lead" />
            <Connection name="Aaron Patel" role="Recruitment Manager" />
          </div>
        </section>

        <section className="rounded-2xl bg-gradient-to-br from-slate-950 to-teal-900 p-5 text-white shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">Recruiter tip</p>
          <p className="mt-3 text-sm leading-6 text-slate-200">Clear profiles with strong skill breakdowns are reviewed faster by HR and tech teams.</p>
        </section>
      </div>
    </aside>
  )
}

const Job = ({ title, detail, accent }) => (
  <li className={`rounded-2xl border border-slate-200 p-4 bg-gradient-to-r ${accent} shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md`}>
    <p className="font-semibold text-slate-900">{title}</p>
    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{detail}</p>
  </li>
)

const Connection = ({ name, role }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-white">
    <div className="h-10 w-10 rounded-full bg-brand-500 text-white grid place-items-center font-semibold shadow-md">{name.charAt(0).toUpperCase()}</div>
    <div>
      <p className="font-semibold text-slate-900">{name}</p>
      <p className="text-sm text-slate-500">{role}</p>
    </div>
  </div>
)

export default Sidebar
