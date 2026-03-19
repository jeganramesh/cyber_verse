import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import Hero from './components/Hero'
import About from './components/About'
import Events from './components/Events'
import Timeline from './components/Timeline'
import Registration from './components/Registration'
import Footer from './components/Footer'
import { VirtualScrollContainer, useVirtualScroll, FloatingElement, ScrollReveal, StaggerContainer } from './components/VirtualScrollContainer'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function App() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
  // Global mouse position for parallax effects
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger)
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  return (
    <VirtualScrollContainer>
      <div className="relative min-h-screen bg-kali-darker overflow-x-hidden virtual-scroll-wrapper">
        {/* Animated background grid - disabled */}
        {/* <BackgroundGrid /> */}
        
        {/* Scroll progress bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 z-50 origin-left"
          style={{ 
            scaleX,
            boxShadow: '0 0 20px rgba(54, 123, 240, 0.5), 0 0 40px rgba(0, 212, 255, 0.3)'
          }}
        />

        {/* Main content */}
        <div>
          {/* Navigation */}
          <Navigation mousePosition={mousePosition} />

          {/* Main content with scroll animations */}
          <main>
            <ScrollReveal direction="up" delay={0.2}>
              <Hero />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.1}>
              <About />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.1}>
              <Events />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.1}>
              <Timeline />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.1}>
              <Registration />
            </ScrollReveal>
          </main>

          <Footer />
        </div>

        {/* Flicker effect overlay */}
        <FlickerOverlay />
        
        {/* Ambient light particles */}
        <AmbientParticles mousePosition={mousePosition} />
      </div>
    </VirtualScrollContainer>
  )
}

// Animated background grid
function BackgroundGrid() {
  const { scrollYProgress } = useScroll()
  
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 200])
  
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none opacity-5"
      style={{ y: gridY }}
    >
      <div 
        className="w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(54, 123, 240, 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(54, 123, 240, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: 'perspective(1000px) rotateX(70deg) translateY(-100px) scale(2)',
        }}
      />
    </motion.div>
  )
}

// Enhanced Navigation with glassmorphism and animations
function Navigation({ mousePosition }) {
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
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled 
          ? 'bg-kali-darker/85 backdrop-blur-xl border-b border-blue-900/30' 
          : 'bg-transparent'
      }`}
      style={{
        boxShadow: isScrolled ? '0 4px 30px rgba(0, 0, 0, 0.3)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with glow effect */}
          <motion.a 
            href="#" 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <motion.span 
              className="font-display text-xl font-bold"
              style={{
                textShadow: '0 0 20px rgba(54, 123, 240, 0.5)',
              }}
            >
              <span className="text-kali-blue">CYBER</span>
              <span className="text-white">VERSE</span>
            </motion.span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -2 }}
                className={`font-medium transition-all duration-300 ${
                  item.primary
                    ? 'text-kali-blue hover:text-white px-5 py-2 border border-kali-blue/50 rounded hover:bg-kali-blue/20 hover:border-kali-blue'
                    : 'text-gray-300 hover:text-kali-blue hover:drop-shadow-[0_0_8px_rgba(54,123,240,0.5)]'
                }`}
                style={item.primary ? {
                  boxShadow: '0 0 15px rgba(54, 123, 240, 0.2)',
                } : {}}
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-blue-900/30 py-4"
            >
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`block py-3 font-medium transition-colors ${
                    item.primary
                      ? 'text-kali-blue'
                      : 'text-gray-300'
                  }`}
                >
                  {item.name}
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

// Enhanced Flicker effect with more subtle design
function FlickerOverlay() {
  const [showFlicker, setShowFlicker] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.97) {
        setShowFlicker(true)
        setTimeout(() => setShowFlicker(false), 30 + Math.random() * 40)
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: showFlicker ? 0.08 : 0 }}
      transition={{ duration: 0.02 }}
      className="fixed inset-0 bg-kali-blue pointer-events-none z-30 mix-blend-overlay"
    />
  )
}

// Ambient floating particles
function AmbientParticles({ mousePosition }) {
  const particlesRef = useRef([])
  const containerRef = useRef(null)
  const [particles, setParticles] = useState([])
  
  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }))
    setParticles(newParticles)
  }, [])
  
  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-blue-400/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            boxShadow: `0 0 ${particle.size * 2}px rgba(54, 123, 240, 0.3)`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [
              0, 
              Math.sin(particle.id) * 30 + mousePosition.x * 20, 
              0
            ],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export default App
