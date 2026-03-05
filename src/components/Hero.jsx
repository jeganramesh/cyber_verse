import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import KaliLogo from '../assets/kalilinux-logo.svg'

function Hero() {
  const [scrollY, setScrollY] = useState(0)
  const containerRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const rotate = useTransform(scrollYProgress, [0, 0.5], [0, 15])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Logo with glow effect */}
      <motion.div 
        style={{ y, opacity, scale, rotate }}
        className="relative mb-8"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="relative">
          {/* Glow layers */}
          <div className="absolute inset-0 animate-pulse-glow opacity-60">
            <img 
              src={KaliLogo} 
              alt="Kali Linux" 
              className="w-64 md:w-80 lg:w-96 h-auto"
              style={{ filter: 'blur(20px)' }}
            />
          </div>
          <div className="absolute inset-0 animate-pulse-glow opacity-80" style={{ animationDelay: '0.5s' }}>
            <img 
              src={KaliLogo} 
              alt="Kali Linux" 
              className="w-64 md:w-80 lg:w-96 h-auto"
              style={{ filter: 'blur(10px)' }}
            />
          </div>
          {/* Main logo */}
          <img 
            src={KaliLogo} 
            alt="Kali Linux" 
            className="w-64 md:w-80 lg:w-96 h-auto relative z-10"
            style={{
              filter: 'drop-shadow(0 0 30px #367BF0) drop-shadow(0 0 60px #367BF0)',
            }}
          />
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
