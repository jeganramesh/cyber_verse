import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import GalaxyScene from './GalaxyScene'
import KaliLogo from '../assets/kalilinux-logo.svg'

function Hero() {
  const containerRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Cinematic Galaxy Background */}
      <GalaxyScene />
      
      {/* Hero Content Overlay */}
      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 text-center px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      >
        {/* Optional: Add a subtle logo hint or title */}
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-wider"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
            CYBERVERSE
          </span>
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-blue-200/80 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          Explore the Galaxy of Cybersecurity
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <button className="px-8 py-3 bg-blue-600/20 border border-blue-400/50 text-blue-300 rounded-lg backdrop-blur-sm hover:bg-blue-600/30 hover:border-blue-400/70 transition-all duration-300">
            Enter the Cosmos
          </button>
        </motion.div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="flex flex-col items-center gap-2 text-blue-300/60">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <motion.div 
            className="w-6 h-10 border-2 border-blue-400/40 rounded-full p-1"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <motion.div 
              className="w-1.5 h-1.5 bg-blue-400 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
