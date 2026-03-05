import { useState, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Hero from './components/Hero'
import About from './components/About'
import Events from './components/Events'
import Timeline from './components/Timeline'
import Registration from './components/Registration'
import Footer from './components/Footer'

function App() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <div className="relative min-h-screen bg-kali-darker">
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-kali-blue z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Main content */}
      <div>
        {/* Navigation */}
        <Navigation />

        {/* Main content */}
        <main>
          <Hero />
          <About />
          <Events />
          <Timeline />
          <Registration />
        </main>

        <Footer />
      </div>

      {/* Flicker effect overlay */}
      <FlickerOverlay />
    </div>
  )
}

function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Events', href: '#events' },
    { name: 'Timeline', href: '#timeline' },
    { name: 'Register', href: '#register', primary: true }
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-kali-darker/90 backdrop-blur-md border-b border-gray-800' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <span className="font-display text-xl font-bold">
              <span className="text-kali-blue">CYBER</span>
              <span className="text-white">VERSE</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`font-medium transition-colors ${
                  item.primary
                    ? 'text-kali-blue hover:text-white px-4 py-2 border border-kali-blue rounded hover:bg-kali-blue/20'
                    : 'text-gray-300 hover:text-kali-blue'
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-800 py-4"
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2 font-medium transition-colors ${
                  item.primary
                    ? 'text-kali-blue'
                    : 'text-gray-300'
                }`}
              >
                {item.name}
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

function FlickerOverlay() {
  const [showFlicker, setShowFlicker] = useState(false)

  useEffect(() => {
    // Random flicker effect
    const interval = setInterval(() => {
      if (Math.random() > 0.98) {
        setShowFlicker(true)
        setTimeout(() => setShowFlicker(false), 50)
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: showFlicker ? 0.1 : 0 }}
      transition={{ duration: 0.05 }}
      className="fixed inset-0 bg-kali-blue pointer-events-none z-30 mix-blend-overlay"
    />
  )
}

export default App
