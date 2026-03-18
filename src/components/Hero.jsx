import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import GalaxyScene from './GalaxyScene'

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

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── 3D Cinematic Galaxy Background ── */}
      <GalaxyScene />

      {/* Dark vignette overlay so text remains legible */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: `radial-gradient(ellipse at 50% 50%,
            transparent 0%,
            rgba(0,3,8,0.25) 45%,
            rgba(0,3,8,0.75) 100%)`,
        }}
      />

      {/* ── Hero Content ── */}
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 text-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Main title */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-wider"
          initial={{ opacity: 0, y: 50, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            transform: `translateX(${mousePosition.x * 10}px) translateY(${mousePosition.y * 10}px)`,
          }}
        >
          <span
            className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(80,160,255,0.55))',
            }}
          >
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
          className="flex flex-wrap justify-center gap-8 mt-16 text-blue-300/60"
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
