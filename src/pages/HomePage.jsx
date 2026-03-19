import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import KaliLogo3D from "../components/KaliLogo3D"

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      setScrollProgress(progress)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative min-h-screen">
      {/* 3D Background */}
      <div className="fixed inset-0 -z-10 bg-black">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <KaliLogo3D scrollProgress={scrollProgress} position={[2, 0, 0]} />
          <EffectComposer>
            <Bloom intensity={0.8} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50">
        <h1 className="text-2xl font-bold glow-text">CYBERVERSE</h1>
        <div className="flex gap-6">
          <a href="#about" className="text-gray-300 hover:text-white transition">About</a>
          <a href="#events" className="text-gray-300 hover:text-white transition">Events</a>
          <a href="#timeline" className="text-gray-300 hover:text-white transition">Timeline</a>
          <button className="cyber-button px-6 py-2 border border-[#367BF0] text-[#367BF0] rounded hover:bg-[#367BF0]/10">
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section - Content on LEFT, Logo on RIGHT */}
      <section className="h-screen flex items-center">
        <div className="content-left">
          <h2 className="text-6xl font-bold mb-4 glow-pulse">
            Welcome to <span className="gradient-text">Cyberverse</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">Explore the future of cybersecurity</p>
          <button className="cyber-button px-8 py-3 bg-[#367BF0] text-white rounded-lg font-bold">
            Get Started
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="h-screen flex items-center">
        <div className="content-center">
          <h2 className="text-5xl font-bold mb-6 glow-text">About Cyberverse</h2>
          <p className="text-lg text-gray-300 max-w-2xl text-center">
            Cyberverse is a cutting-edge cybersecurity conference that brings together experts,
            enthusiasts, and professionals from around the world to explore the latest in
            cybersecurity technologies and practices.
          </p>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="h-screen flex items-center">
        <div className="content-right">
          <h2 className="text-5xl font-bold mb-6 glow-pulse">Upcoming Events</h2>
          <div className="space-y-4">
            <div className="cyber-border p-4 scanlines">
              <h3 className="text-xl font-bold gradient-text">Workshop: Advanced Penetration Testing</h3>
              <p className="text-gray-300">Learn advanced techniques from industry experts</p>
            </div>
            <div className="cyber-border p-4 scanlines">
              <h3 className="text-xl font-bold gradient-text">Keynote: Future of Cybersecurity</h3>
              <p className="text-gray-300">Insights from leading cybersecurity professionals</p>
            </div>
            <div className="cyber-border p-4 scanlines">
              <h3 className="text-xl font-bold gradient-text">CTF Competition</h3>
              <p className="text-gray-300">Challenge your skills in our Capture The Flag event</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="h-screen flex items-center">
        <div className="content-center">
          <h2 className="text-5xl font-bold mb-8 glow-text">Event Timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="cyber-border p-6 scanlines text-center">
              <div className="text-3xl font-bold gradient-text mb-2">Day 1</div>
              <p className="text-gray-300">Opening Ceremony & Keynotes</p>
            </div>
            <div className="cyber-border p-6 scanlines text-center">
              <div className="text-3xl font-bold gradient-text mb-2">Day 2</div>
              <p className="text-gray-300">Workshops & Training</p>
            </div>
            <div className="cyber-border p-6 scanlines text-center">
              <div className="text-3xl font-bold gradient-text mb-2">Day 3</div>
              <p className="text-gray-300">CTF & Closing</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}