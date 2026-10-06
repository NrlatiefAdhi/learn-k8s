type Category = { category: string; skills: string[] }

export default function Expertise({ items }: { items: Category[] }) {
  return (
    <section id="expertise" className="scroll-mt-20 border-t border-neutral-900 py-20">
      <div className="space-y-8">
        <h2 className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          Expertise
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {items.map((c) => (
            <div key={c.category} className="space-y-3">
              <h3 className="text-sm font-medium text-neutral-200">{c.category}</h3>
              <ul className="flex flex-wrap gap-2">
                {c.skills.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-neutral-800 px-2.5 py-1 font-mono text-xs text-neutral-400"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
