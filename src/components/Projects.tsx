type Project = {
  name: string
  description: string
  url?: string
  tags?: string[]
}

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="space-y-4 scroll-mt-20">
      <h2 className="text-xs font-medium uppercase tracking-widest text-neutral-500">
        Projects
      </h2>
      <ul className="divide-y divide-neutral-800">
        {projects.map((p) => (
          <li key={p.name} className="py-5 space-y-2">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-medium">{p.name}</h3>
              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-neutral-500 hover:text-neutral-200 transition"
                >
                  ↗
                </a>
              )}
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">{p.description}</p>
            {p.tags && p.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2 pt-1">
                {p.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-neutral-800 px-2.5 py-0.5 text-xs text-neutral-400"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
