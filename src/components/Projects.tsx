type Project = {
  name: string
  description: string
  problem?: string
  solution?: string
  stack?: string[]
  result?: string
  url?: string
}

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="scroll-mt-20 border-t border-neutral-900 py-20">
      <div className="space-y-8">
        <h2 className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          Selected Projects
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <article
              key={p.name}
              className="group flex flex-col gap-3 rounded-lg border border-neutral-800 p-5 transition hover:border-neutral-600"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium text-neutral-100">{p.name}</h3>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs text-neutral-500 hover:text-neutral-200 transition"
                    aria-label={`Open ${p.name}`}
                  >
                    ↗
                  </a>
                )}
              </div>

              <p className="text-sm leading-relaxed text-neutral-400">{p.description}</p>

              {(p.problem || p.solution) && (
                <dl className="space-y-2 border-t border-neutral-900 pt-3 text-xs">
                  {p.problem && (
                    <div>
                      <dt className="font-mono uppercase tracking-wider text-neutral-600">Problem</dt>
                      <dd className="text-neutral-400">{p.problem}</dd>
                    </div>
                  )}
                  {p.solution && (
                    <div>
                      <dt className="font-mono uppercase tracking-wider text-neutral-600">Solution</dt>
                      <dd className="text-neutral-400">{p.solution}</dd>
                    </div>
                  )}
                  {p.result && (
                    <div>
                      <dt className="font-mono uppercase tracking-wider text-neutral-600">Result</dt>
                      <dd className="text-neutral-400">{p.result}</dd>
                    </div>
                  )}
                </dl>
              )}

              {p.stack && p.stack.length > 0 && (
                <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
                  {p.stack.map((s) => (
                    <li
                      key={s}
                      className="rounded border border-neutral-800 px-1.5 py-0.5 font-mono text-[11px] text-neutral-500"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
