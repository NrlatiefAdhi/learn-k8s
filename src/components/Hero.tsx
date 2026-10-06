type Social = { label: string; url: string }

export default function Hero({
  name,
  title,
  tagline,
  description,
  availability,
  socials,
}: {
  name: string
  title: string
  tagline: string
  description: string
  availability?: string
  socials: Social[]
}) {
  return (
    <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28">
      {/* Subtle network pattern */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-12 hidden h-64 w-64 text-neutral-800 sm:block"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="40" cy="50" r="2.5" fill="currentColor" />
        <circle cx="160" cy="40" r="2.5" fill="currentColor" />
        <circle cx="100" cy="100" r="2.5" fill="currentColor" />
        <circle cx="50" cy="150" r="2.5" fill="currentColor" />
        <circle cx="170" cy="140" r="2.5" fill="currentColor" />
        <line x1="40" y1="50" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" />
        <line x1="160" y1="40" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" />
        <line x1="100" y1="100" x2="50" y2="150" stroke="currentColor" strokeWidth="0.5" />
        <line x1="100" y1="100" x2="170" y2="140" stroke="currentColor" strokeWidth="0.5" />
      </svg>

      <div className="relative space-y-6">
        {availability && (
          <p className="inline-flex items-center gap-2 rounded-full border border-neutral-800 px-3 py-1 font-mono text-xs text-neutral-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {availability}
          </p>
        )}

        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
            {title}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {name}
          </h1>
          <p className="text-xl text-neutral-300 sm:text-2xl">{tagline}</p>
          <p className="max-w-2xl text-neutral-400">{description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="#projects"
            className="rounded-md bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-950 transition hover:bg-white"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 transition hover:border-neutral-500"
          >
            Contact Me
          </a>
        </div>

        <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-2 font-mono text-xs text-neutral-500">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.url}
                target={s.url.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer"
                className="hover:text-neutral-200 transition"
              >
                {s.label.toLowerCase()} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
