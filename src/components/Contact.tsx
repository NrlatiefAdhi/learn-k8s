type Social = { label: string; url: string }

export default function Contact({
  email,
  socials,
}: {
  email: string
  socials: Social[]
}) {
  return (
    <section id="contact" className="space-y-4 scroll-mt-20">
      <h2 className="text-xs font-medium uppercase tracking-widest text-neutral-500">
        Contact
      </h2>
      <p className="text-neutral-300">
        Reach me at{' '}
        <a
          href={`mailto:${email}`}
          className="underline decoration-neutral-600 underline-offset-4 hover:decoration-neutral-200 transition"
        >
          {email}
        </a>
      </p>
      <ul className="flex gap-4 text-sm text-neutral-400">
        {socials.map((s) => (
          <li key={s.label}>
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-100 transition"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
