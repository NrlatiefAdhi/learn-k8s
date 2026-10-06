export default function Navbar({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <a href="#" className="font-semibold tracking-tight">{name}</a>
        <ul className="flex gap-6 text-sm text-neutral-400">
          <li><a href="#about" className="hover:text-neutral-100 transition">About</a></li>
          <li><a href="#projects" className="hover:text-neutral-100 transition">Projects</a></li>
          <li><a href="#contact" className="hover:text-neutral-100 transition">Contact</a></li>
        </ul>
      </nav>
    </header>
  )
}
