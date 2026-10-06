export default function About({ bio }: { bio: string }) {
  return (
    <section id="about" className="space-y-3 scroll-mt-20">
      <h2 className="text-xs font-medium uppercase tracking-widest text-neutral-500">
        About
      </h2>
      <p className="text-neutral-300 leading-relaxed">{bio}</p>
    </section>
  )
}
