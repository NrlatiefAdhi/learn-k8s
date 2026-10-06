type Group = { category: string; items: string[] }

export default function TechStack({ items }: { items: Group[] }) {
  return (
    <section className="border-t border-neutral-900 py-20">
      <div className="space-y-8">
        <h2 className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          Technology Stack
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g) => (
            <div key={g.category} className="space-y-2">
              <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-500">
                {g.category}
              </h3>
              <ul className="flex flex-wrap gap-1.5">
                {g.items.map((it) => (
                  <li
                    key={it}
                    className="rounded-md border border-neutral-800 bg-neutral-900/40 px-2 py-1 font-mono text-xs text-neutral-300"
                  >
                    {it}
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
