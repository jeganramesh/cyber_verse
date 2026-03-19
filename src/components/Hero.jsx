import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import GalaxyScene from './GalaxyScene'
import KaliLogo from '../assets/kalilinux-logo.svg'

// Logo configuration - easy to change values
const LOGO_CONFIG = {
  position: { top: '200', left: '200' },  // Change these values to move logo
  size: { mobile: 'w-40 h-40', desktop: 'w-80 md:h-80' },
  fadeStart: 0.15,  // Scroll % when fade starts (0-1)
  fadeEnd: 0.15,    // Scroll % when fully faded (0-1)
  scaleStart: 1,
  scaleEnd: 0.8,
  zIndex: 30,
  // Smooth zoom animation settings
  zoomEnabled: false,
  zoomMin: 1,
  zoomMax: 1.15,
  zoomDuration: 3,
}

function Hero() {
  const containerRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -80])
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])

  // Mouse tracking for text parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      setMousePosition({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const scrollSpring = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  
  // Logo opacity based on scroll - fades out smoothly on scroll
  const logoOpacity = useTransform(scrollYProgress, [0, LOGO_CONFIG.fadeStart], [LOGO_CONFIG.scaleStart, 0])
  const logoScale = useTransform(scrollYProgress, [0, LOGO_CONFIG.fadeStart], [LOGO_CONFIG.scaleStart, LOGO_CONFIG.scaleEnd])

  // Logo zoom and fade animation
  const logoRef = useRef(null)
  useEffect(() => {
    if (!logoRef.current) return
    
    let animationId
    const animate = () => {
      if (LOGO_CONFIG.zoomEnabled) {
        // Smooth zoom animation (sine wave)
        const time = Date.now() / 1000
        const zoomScale = LOGO_CONFIG.zoomMin + (Math.sin(time * (2 * Math.PI / LOGO_CONFIG.zoomDuration)) + 1) / 2 * (LOGO_CONFIG.zoomMax - LOGO_CONFIG.zoomMin)
        logoRef.current.style.transform = `scale(${zoomScale})`
      }
      animationId = requestAnimationFrame(animate)
    }
    animate()
    
    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center"
      style={{ padding: '0 5vw' }}
    >
      {/* ── Top Left: Kali Logo (in front of galaxy) ── */}
      <motion.div
        ref={logoRef}
        className="absolute z-30"
        style={{ 
          opacity: logoOpacity,
          top: `${LOGO_CONFIG.position.top}px`,
          left: `${LOGO_CONFIG.position.left}px`,
        }}
      >
        <img 
          src={KaliLogo} 
          alt="Kali Linux" 
          className={`${LOGO_CONFIG.size.mobile} ${LOGO_CONFIG.size.desktop} drop-shadow-xl`}
        />
      </motion.div>
      {/* ── Left: Galaxy Scene ── */}
      <div className="left w-1/2 relative" style={{ marginLeft: '-10%' }}>
        <GalaxyScene />
      </div>

      {/* ── Right: Content ── */}
      <div className="right w-1/2 flex flex-col justify-center gap-5 z-10" style={{ paddingLeft: '5%' }}>
        {/* Dark overlay for text readability */}
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: 'linear-gradient(to right, rgba(0, 3, 8, 0) 0%, transparent 100%)',
          }}
        />
        
        {/* ── Hero Content ── */}
        <motion.div
          style={{ y, opacity, scale, zIndex: 10 }}
          className="flex flex-col gap-5 items-center text-center"
        >
        {/* Main title */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-wider"
          initial={{ opacity: 0,x : 2,y: 50, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            transform: `translateX(${mousePosition.x * 10}px) translateY(${mousePosition.y * 10}px)`,
            textShadow: '0 0 40px rgba(54, 123, 240, 0.6), 0 0 80px rgba(0, 212, 255, 0.4)',
          }}
        >
          <span className="text-white">
            CYBERVERSE
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl text-blue-200/80 mb-8 font-light tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{ transform: `translateX(${mousePosition.x * 5}px)` }}
        >
          <TypewriterText text="Explore the Galaxy of Cybersecurity" />
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          style={{ transform: `translateX(${mousePosition.x * 3}px)` }}
        >
          <motion.button
            className="relative px-10 py-4 bg-blue-600/20 border border-blue-400/50 text-blue-300 rounded-lg backdrop-blur-sm overflow-hidden group"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(54,123,240,0.45)' }}
            whileTap={{ scale: 0.98 }}
            style={{ boxShadow: '0 0 20px rgba(54,123,240,0.25)' }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-cyan-500/20 to-blue-600/30"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <span className="relative z-10 text-lg font-semibold tracking-wider uppercase">
              Enter the Cosmos
            </span>
            <motion.div
              className="absolute inset-0 rounded-lg"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(54,123,240,0.3)',
                  '0 0 40px rgba(54,123,240,0.5)',
                  '0 0 20px rgba(54,123,240,0.3)',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="flex flex-wrap gap-10 text-blue-300/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          {[
            { value: '2026', label: 'Year' },
            { value: '∞', label: 'Possibilities' },
            { value: '1', label: 'Universe' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 + index * 0.1 }}
            >
              <div className="text-2xl md:text-3xl font-bold text-blue-400">{item.value}</div>
              <div className="text-xs uppercase tracking-widest mt-1">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Typewriter effect component
function TypewriterText({ text, delay = 0 }) {
  const [displayText, setDisplayText] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timeout)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let index = 0
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [started, text])

  return <span>{displayText}</span>
}

export default Hero
