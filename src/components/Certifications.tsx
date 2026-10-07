type Cert = { name: string; issuer: string }

export default function Certifications({ items }: { items: Cert[] }) {
  return (
    <section className="border-t border-neutral-900 py-20">
      <div className="space-y-8">
        <h2 className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          Certifications
        </h2>

        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((c) => (
            <li
              key={c.name}
              className="flex items-start justify-between gap-4 rounded-lg border border-neutral-800 p-4 transition hover:border-neutral-600"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-neutral-100">{c.name}</p>
                <p className="font-mono text-xs text-neutral-500">{c.issuer}</p>
              </div>
              <span className="text-neutral-600">✓</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
