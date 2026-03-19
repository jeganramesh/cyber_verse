import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Virtual Scroll Hook - Ultra-smooth scroll with inertia
 * Provides normalized scroll (0-1) with lerp interpolation
 */
export function useVirtualScroll() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const currentScroll = useRef(0)
  const targetScroll = useRef(0)
  const velocity = useRef(0)
  const animationFrameId = useRef(null)
  
  const SMOOTH_FACTOR = 0.08
  const INERTIA_FACTOR = 0.95

  useEffect(() => {
    const handleScroll = () => {
      // Calculate normalized scroll (0-1)
      const maxScroll = document.body.scrollHeight - window.innerHeight
      targetScroll.current = maxScroll > 0 ? window.scrollY / maxScroll : 0
    }

    // Animation loop for smooth interpolation
    const animate = () => {
      // Calculate velocity for inertia
      const diff = targetScroll.current - currentScroll.current
      velocity.current = diff * SMOOTH_FACTOR
      currentScroll.current += velocity.current
      
      // Apply inertia decay
      velocity.current *= INERTIA_FACTOR
      
      // Clamp to 0-1
      currentScroll.current = Math.max(0, Math.min(1, currentScroll.current))
      
      setScrollProgress(currentScroll.current)
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
    }
  }, [])

  return scrollProgress
}

/**
 * Parallax Layer Hook - Creates depth-based movement
 */
export function useParallaxLayer(scrollProgress, speed = 1, depth = 'medium') {
  const elementRef = useRef(null)
  const currentOffset = useRef(0)
  
  const depthMultipliers = {
    far: 0.2,
    medium: 0.5,
    near: 1.0
  }

  useEffect(() => {
    const multiplier = depthMultipliers[depth] || 0.5
    const targetOffset = scrollProgress * speed * multiplier * 100
    
    // Smooth interpolation
    const animate = () => {
      currentOffset.current += (targetOffset - currentOffset.current) * 0.08
      
      if (elementRef.current) {
        elementRef.current.style.transform = `translateY(${currentOffset.current}px)`
      }
      
      requestAnimationFrame(animate)
    }
    
    animate()
  }, [scrollProgress, speed, depth])

  return elementRef
}

/**
 * Micro Interaction Hook
 */
export function useMicroInteraction() {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return {
    isHovered,
    isPressed,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onMouseDown: () => setIsPressed(true),
    onMouseUp: () => setIsPressed(false)
  }
}

/**
 * Stagger Animation Hook
 */
export function useStaggeredAnimation(items, delay = 0.1) {
  const [isVisible, setIsVisible] = useState(false)
  const [visibleItems, setVisibleItems] = useState([])

  useEffect(() => {
    if (!isVisible) return

    items.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems(prev => [...prev, index])
      }, index * delay * 1000)
    })
  }, [isVisible, items.length, delay])

  useEffect(() => {
    const handleScroll = () => {
      const rect = document.body.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.8) {
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return visibleItems
}
