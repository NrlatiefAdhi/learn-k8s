type ExperienceItem = {
  company: string
  position: string
  period: string
  description: string
  responsibilities: string[]
  technologies: string[]
}

export default function Experience({ items }: { items: ExperienceItem[] }) {
  return (
    <section id="experience" className="scroll-mt-20 border-t border-neutral-900 py-20">
      <div className="space-y-10">
        <h2 className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          Experience
        </h2>

        <ol className="relative space-y-10 border-l border-neutral-800 pl-6">
          {items.map((e, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[31px] top-1.5 h-2 w-2 rounded-full bg-neutral-700 ring-4 ring-neutral-950" />

              <div className="space-y-2">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-medium text-neutral-100">{e.position}</h3>
                  <span className="text-sm text-neutral-500">· {e.company}</span>
                </div>
                <p className="font-mono text-xs text-neutral-500">{e.period}</p>
                <p className="text-sm leading-relaxed text-neutral-400">{e.description}</p>

                {e.responsibilities.length > 0 && (
                  <ul className="space-y-1 pt-1 text-sm text-neutral-400">
                    {e.responsibilities.map((r, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="text-neutral-600">—</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {e.technologies.length > 0 && (
                  <ul className="flex flex-wrap gap-2 pt-2">
                    {e.technologies.map((t) => (
                      <li
                        key={t}
                        className="rounded border border-neutral-800 px-2 py-0.5 font-mono text-xs text-neutral-500"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
