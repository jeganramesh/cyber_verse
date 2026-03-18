import { useState, useEffect, useRef, createContext, useContext } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

// Create context for virtual scroll
export const VirtualScrollContext = createContext({
  progress: 0,
  velocity: 0,
  isScrolling: false
})

/**
 * VirtualScrollContainer - Ultra-smooth scroll experience
 * Provides inertia, parallax, and synchronized animations
 */
export function VirtualScrollContainer({ children }) {
  const containerRef = useRef(null)
  const [scrollState, setScrollState] = useState({
    progress: 0,
    velocity: 0,
    isScrolling: false
  })
  
  const currentScroll = useRef(0)
  const targetScroll = useRef(0)
  const velocity = useRef(0)
  const animationFrameId = useRef(null)
  const isScrollingTimeout = useRef(null)
  
  const SMOOTH_FACTOR = 0.08
  const INERTIA_FACTOR = 0.92

  useEffect(() => {
    const handleScroll = () => {
      // Calculate normalized scroll (0-1)
      const maxScroll = document.body.scrollHeight - window.innerHeight
      targetScroll.current = maxScroll > 0 ? window.scrollY / maxScroll : 0
      
      // Mark as scrolling
      setScrollState(prev => ({ ...prev, isScrolling: true }))
      
      // Clear existing timeout
      if (isScrollingTimeout.current) {
        clearTimeout(isScrollingTimeout.current)
      }
      
      // Set timeout to mark scrolling as stopped
      isScrollingTimeout.current = setTimeout(() => {
        setScrollState(prev => ({ ...prev, isScrolling: false }))
      }, 150)
    }

    // Animation loop for smooth interpolation with inertia
    const animate = () => {
      // Calculate velocity for inertia effect
      const diff = targetScroll.current - currentScroll.current
      velocity.current = diff * SMOOTH_FACTOR
      currentScroll.current += velocity.current
      
      // Apply inertia decay
      velocity.current *= INERTIA_FACTOR
      
      // Clamp to 0-1
      currentScroll.current = Math.max(0, Math.min(1, currentScroll.current))
      
      setScrollState({
        progress: currentScroll.current,
        velocity: velocity.current,
        isScrolling: scrollState.isScrolling
      })
      
      animationFrameId.current = requestAnimationFrame(animate)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    animationFrameId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
      if (isScrollingTimeout.current) {
        clearTimeout(isScrollingTimeout.current)
      }
    }
  }, [])

  return (
    <VirtualScrollContext.Provider value={scrollState}>
      <div ref={containerRef} className="virtual-scroll-container">
        {children}
      </div>
    </VirtualScrollContext.Provider>
  )
}

/**
 * Hook to access virtual scroll state
 */
export function useVirtualScroll() {
  return useContext(VirtualScrollContext)
}

/**
 * ParallaxLayer - Creates depth-based movement
 */
export function ParallaxLayer({ children, speed = 1, depth = 'medium', className = '' }) {
  const layerRef = useRef(null)
  const { progress } = useVirtualScroll()
  
  const depthMultipliers = {
    far: 0.2,
    medium: 0.5,
    near: 1.0,
    focus: 1.5
  }

  useEffect(() => {
    const multiplier = depthMultipliers[depth] || 0.5
    const targetY = progress * speed * multiplier * -100
    
    gsap.to(layerRef.current, {
      y: targetY,
      duration: 0.8,
      ease: 'power2.out',
      overwrite: 'auto'
    })
  }, [progress, speed, depth])

  return (
    <div ref={layerRef} className={`parallax-layer parallax-${depth} ${className}`}>
      {children}
    </div>
  )
}

/**
 * ScrollReveal - Fade/slide in on scroll
 */
export function ScrollReveal({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.8,
  threshold = 0.2,
  className = '' 
}) {
  const elementRef = useRef(null)
  const { progress } = useVirtualScroll()

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Get element position relative to viewport
    const rect = element.getBoundingClientRect()
    const elementProgress = 1 - (rect.top / (window.innerHeight * (1 - threshold)))
    
    if (elementProgress > 0 && elementProgress < 1) {
      gsap.to(element, {
        opacity: Math.min(1, Math.max(0, elementProgress)),
        y: direction === 'up' ? (1 - elementProgress) * 50 : 0,
        x: direction === 'left' ? (1 - elementProgress) * 50 : 0,
        x: direction === 'right' ? (elementProgress) * 50 : 0,
        duration: duration,
        delay: delay,
        ease: 'power2.out',
        overwrite: 'auto'
      })
    }
  }, [progress, direction, delay, duration, threshold])

  return (
    <div ref={elementRef} className={`scroll-reveal scroll-reveal-${direction} ${className}`}>
      {children}
    </div>
  )
}

/**
 * ScaleOnScroll - Depth zoom effect
 */
export function ScaleOnScroll({ 
  children, 
  scaleRange = [1, 0.8], 
  threshold = 0.3,
  className = '' 
}) {
  const elementRef = useRef(null)
  const { progress } = useVirtualScroll()

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const [minScale, maxScale] = scaleRange
    const scale = maxScale - (progress * (maxScale - minScale))
    
    gsap.to(element, {
      scale: scale,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto'
    })
  }, [progress, scaleRange, threshold])

  return (
    <div ref={elementRef} className={`scale-on-scroll ${className}`}>
      {children}
    </div>
  )
}

/**
 * ButtonWithGlow - Micro-interaction button
 */
export function ButtonWithGlow({ children, onClick, className = '', variant = 'primary' }) {
  const buttonRef = useRef(null)
  const glowRef = useRef(null)

  const handleMouseEnter = () => {
    gsap.to(glowRef.current, {
      opacity: 1,
      scale: 1.2,
      duration: 0.3,
      ease: 'power2.out'
    })
    gsap.to(buttonRef.current, {
      scale: 1.05,
      duration: 0.2,
      ease: 'power2.out'
    })
  }

  const handleMouseLeave = () => {
    gsap.to(glowRef.current, {
      opacity: 0.5,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
    gsap.to(buttonRef.current, {
      scale: 1,
      duration: 0.2,
      ease: 'power2.out'
    })
  }

  const handleMouseDown = () => {
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
      ease: 'power2.out'
    })
  }

  const handleMouseUp = () => {
    gsap.to(buttonRef.current, {
      scale: 1.05,
      duration: 0.1,
      ease: 'power2.out'
    })
  }

  const baseStyles = `relative px-8 py-4 rounded-lg font-semibold tracking-wider uppercase transition-all ${className}`
  const variantStyles = variant === 'primary' 
    ? 'bg-blue-600/20 border border-blue-400/50 text-blue-300'
    : 'bg-transparent border border-cyan-400/50 text-cyan-300'

  return (
    <button
      ref={buttonRef}
      className={`${baseStyles} ${variantStyles}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <span className="relative z-10">{children}</span>
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/30 via-cyan-500/20 to-blue-600/30 opacity-50"
        style={{
          boxShadow: '0 0 20px rgba(54,123,240,0.3), 0 0 40px rgba(0,212,255,0.2)'
        }}
      />
    </button>
  )
}

/**
 * FloatingElement - Subtle floating animation
 */
export function FloatingElement({ children, amplitude = 10, duration = 3, className = '' }) {
  const elementRef = useRef(null)

  useEffect(() => {
    gsap.to(elementRef.current, {
      y: -amplitude,
      duration: duration,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    })
  }, [amplitude, duration])

  return (
    <div ref={elementRef} className={`floating-element ${className}`}>
      {children}
    </div>
  )
}

/**
 * StaggerContainer - Staggered children animation
 */
export function StaggerContainer({ children, staggerDelay = 0.1, className = '' }) {
  const containerRef = useRef(null)
  const { progress } = useVirtualScroll()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const children = container.querySelectorAll(':scope > *')
    const rect = container.getBoundingClientRect()
    const containerProgress = 1 - (rect.top / (window.innerHeight * 0.8))

    if (containerProgress > 0 && containerProgress < 1) {
      gsap.fromTo(children, 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: staggerDelay,
          ease: 'power2.out',
          overwrite: 'auto'
        }
      )
    }
  }, [progress, staggerDelay])

  return (
    <div ref={containerRef} className={`stagger-container ${className}`}>
      {children}
    </div>
  )
}
