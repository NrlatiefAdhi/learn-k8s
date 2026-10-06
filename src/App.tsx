import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Expertise from './components/Expertise'
import Experience from './components/Experience'
import Projects from './components/Projects'
import TechStack from './components/TechStack'
import Contact from './components/Contact'
import data from './data/portfolio.json'

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar name={data.name} />
      <main className="mx-auto max-w-4xl px-6">
        <Hero
          name={data.name}
          title={data.title}
          tagline={data.tagline}
          description={data.description}
          availability={data.availability}
          socials={data.socials}
        />
        <About bio={data.about.bio} stats={data.about.stats} />
        <Expertise items={data.expertise} />
        <Experience items={data.experience} />
        <Projects projects={data.projects} />
        <TechStack items={data.techStack} />
        <Contact email={data.email} socials={data.socials} />
      </main>
      <footer className="border-t border-neutral-800 py-6 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} {data.name}
      </footer>
    </div>
  )
}
