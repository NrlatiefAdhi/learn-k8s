export default function Navbar({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <a href="#" className="font-mono text-sm tracking-tight text-neutral-100">
          {name}
        </a>
        <ul className="hidden gap-6 font-mono text-xs text-neutral-400 sm:flex">
          <li><a href="#about"      className="hover:text-neutral-100 transition">about</a></li>
          <li><a href="#expertise"  className="hover:text-neutral-100 transition">expertise</a></li>
          <li><a href="#experience" className="hover:text-neutral-100 transition">experience</a></li>
          <li><a href="#projects"   className="hover:text-neutral-100 transition">projects</a></li>
          <li><a href="#contact"    className="hover:text-neutral-100 transition">contact</a></li>
        </ul>
      </nav>
    </header>
  )
}
