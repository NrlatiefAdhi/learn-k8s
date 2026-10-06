import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import data from './data/portfolio.json'

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar name={data.name} />
      <main className="mx-auto max-w-3xl px-6 py-24 space-y-24">
        <Hero name={data.name} title={data.title} tagline={data.tagline} />
        <About bio={data.bio} />
        <Projects projects={data.projects} />
        <Contact email={data.email} socials={data.socials} />
      </main>
      <footer className="border-t border-neutral-800 py-6 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} {data.name}
      </footer>
    </div>
  )
}
