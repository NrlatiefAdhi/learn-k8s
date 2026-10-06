export default function Hero({
  name,
  title,
  tagline,
}: {
  name: string
  title: string
  tagline: string
}) {
  return (
    <section className="space-y-4">
      <p className="text-sm font-medium text-neutral-500">{title}</p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{name}</h1>
      <p className="max-w-xl text-lg text-neutral-400">{tagline}</p>
    </section>
  )
}
