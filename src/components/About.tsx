type Stat = { label: string; value: string }

export default function About({ bio, stats }: { bio: string; stats: Stat[] }) {
  return (
    <section id="about" className="scroll-mt-20 border-t border-neutral-900 py-20">
      <div className="space-y-8">
        <div className="space-y-3">
          <h2 className="font-mono text-xs uppercase tracking-widest text-neutral-500">
            About
          </h2>
          <p className="max-w-2xl leading-relaxed text-neutral-300">{bio}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-neutral-800 p-4 transition hover:border-neutral-700"
            >
              <p className="font-mono text-2xl text-neutral-100">{s.value}</p>
              <p className="mt-1 text-xs text-neutral-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
