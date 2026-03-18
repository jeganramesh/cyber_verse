import { Canvas, useThree } from "@react-three/fiber"
import { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import * as THREE from "three"
import KaliLogo from "../assets/kalilinux-logo.svg"
import GlowingRings from "./GlowingRings"
import Saturn from "./Saturn"

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

// Cinematic Scroll-Driven Camera with GSAP Timeline
function CinematicCamera({ scrollProgress }) {
  const { camera } = useThree()
  const time = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const isInitialized = useRef(false)
  const timelineRef = useRef(null)

  // Camera rig object - the single source of truth
  const cameraRig = useRef({
    x: -4,
    y: 2,
    z: 6,
    lookX: 0,
    lookY: 0,
    lookZ: 0
  })

  // Mouse parallax handler
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Setup GSAP Timeline with ScrollTrigger
  useEffect(() => {
    const progress = scrollProgress.get ? scrollProgress.get() : scrollProgress
    
    // Create timeline with scrub for smooth scroll sync
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5, // Smoothness - higher = buttery
      }
    })

    // Stage 1: Intro - 45° angle from left corner
    tl.to(cameraRig.current, {
      x: -2,
      y: 1,
      z: 4,
      duration: 1,
      ease: 'power2.out'
    })

    // Stage 2: Close-up - Zoom toward planet
    tl.to(cameraRig.current, {
      x: 0,
      y: 0.5,
      z: 2,
      duration: 1,
      ease: 'power2.inOut'
    })

    // Stage 3: Center Align - Move to center
    tl.to(cameraRig.current, {
      x: 0,
      y: 0,
      z: 3,
      duration: 1,
      ease: 'power1.inOut'
    })

    // Stage 4: Core Focus - Deep zoom (INTENSE moment)
    tl.to(cameraRig.current, {
      z: 1,
      duration: 1.5,
      ease: 'power3.in'
    })

    // Stage 5: Exit Wide - Zoom out
    tl.to(cameraRig.current, {
      x: 0,
      y: 0,
      z: 6,
      duration: 1.2,
      ease: 'power2.out'
    })

    // Add subtle lookAt drift throughout the timeline
    tl.to(cameraRig.current, {
      lookX: 0.2,
      lookY: -0.1,
      duration: 2
    }, 0)

    timelineRef.current = tl

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [scrollProgress])

  useFrame((_, delta) => {
    time.current += delta

    // Initialize camera position once
    if (!isInitialized.current) {
      camera.position.set(-4, 2, 6)
      camera.lookAt(0, 0, 0)
      isInitialized.current = true
    }

    // Add gentle ambient drift
    const driftX = Math.sin(time.current * 0.14) * 0.35
    const driftY = Math.cos(time.current * 0.09) * 0.2

    // Add mouse parallax
    const mx = mouseRef.current.x * 0.6
    const my = mouseRef.current.y * 0.4

    // Apply camera rig position with drift and parallax
    camera.position.x = cameraRig.current.x + driftX + mx
    camera.position.y = cameraRig.current.y + driftY + my
    camera.position.z = cameraRig.current.z

    // Apply lookAt with rig values
    camera.lookAt(
      cameraRig.current.lookX,
      cameraRig.current.lookY,
      cameraRig.current.lookZ
    )
  })

  return null
}

// Procedural Spiral Galaxy Component
function GalaxyBackground({ count = 6000 }) {
  const points = useRef()
  
  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)
    const szs = new Float32Array(count)
    
    // Blue/cyan color palette
    const colorInside = new THREE.Color("#64b5f6")
    const colorOutside = new THREE.Color("#1a237e")
    const colorAccent = new THREE.Color("#00e5ff")
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Spiral galaxy formula with multiple arms
      const radius = Math.random() * 18
      const spinAngle = radius * 0.4
      const branchAngle = (i % 4) * ((Math.PI * 2) / 4)
      
      // Add randomness for natural look
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.8
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.8
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.8
      
      // Spiral arm positioning
      pos[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
      pos[i3 + 1] = randomY * 2.5
      pos[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ - 5
      
      // Color gradient from center to edge with accent colors
      const mixedColor = colorInside.clone().lerp(colorOutside, radius / 18)
      // Add some accent stars
      if (Math.random() > 0.85) {
        mixedColor.lerp(colorAccent, 0.5)
      }
      cols[i3] = mixedColor.r
      cols[i3 + 1] = mixedColor.g
      cols[i3 + 2] = mixedColor.b
      
      szs[i] = Math.random() * 0.12 + 0.03
    }
    
    return { positions: pos, colors: cols, sizes: szs }
  }, [count])
  
  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.03
    }
  })
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

// Nebula Clouds Component
function NebulaClouds() {
  const meshRef = useRef()
  const mesh2Ref = useRef()
  
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext("2d")
    
    // Create multiple radial gradients for nebula clouds
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
    gradient.addColorStop(0, "rgba(100, 181, 246, 0.5)")
    gradient.addColorStop(0.3, "rgba(41, 121, 255, 0.3)")
    gradient.addColorStop(0.6, "rgba(21, 101, 192, 0.15)")
    gradient.addColorStop(1, "rgba(26, 35, 126, 0)")
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 512)
    
    // Add some noise/clouds
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 512
      const y = Math.random() * 512
      const r = Math.random() * 100 + 30
      const gradient2 = ctx.createRadialGradient(x, y, 0, x, y, r)
      gradient2.addColorStop(0, "rgba(100, 181, 246, 0.2)")
      gradient2.addColorStop(1, "rgba(26, 35, 126, 0)")
      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, 512, 512)
    }
    
    return new THREE.CanvasTexture(canvas)
  }, [])
  
  const texture2 = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext("2d")
    
    // Purple/cyan nebula
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
    gradient.addColorStop(0, "rgba(0, 229, 255, 0.4)")
    gradient.addColorStop(0.5, "rgba(156, 39, 176, 0.2)")
    gradient.addColorStop(1, "rgba(26, 35, 126, 0)")
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 512)
    
    return new THREE.CanvasTexture(canvas)
  }, [])
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.015
    }
    if (mesh2Ref.current) {
      mesh2Ref.current.rotation.z = -state.clock.elapsedTime * 0.01
    }
  })
  
  return (
    <>
      <mesh ref={meshRef} position={[3, 2, -8]}>
        <planeGeometry args={[25, 25]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={mesh2Ref} position={[-4, -2, -10]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial
          map={texture2}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}

// Galactic Core - Bright center glow
function GalacticCore() {
  const coreRef = useRef()
  
  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.z = state.clock.elapsedTime * 0.02
    }
  })
  
  return (
    <group ref={coreRef} position={[0, 0, -6]}>
      {/* Bright core */}
      <mesh>
        <circleGeometry args={[2, 64]} />
        <meshBasicMaterial
          color="#90caf9"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Middle glow */}
      <mesh>
        <circleGeometry args={[3.5, 64]} />
        <meshBasicMaterial
          color="#42a5f5"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh>
        <circleGeometry args={[5, 64]} />
        <meshBasicMaterial
          color="#1e88e5"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Radial rays */}
      <mesh rotation={[0, 0, 0]}>
        <ringGeometry args={[5, 8, 64]} />
        <meshBasicMaterial
          color="#64b5f6"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

// Enhanced Kali Logo with Glow
function KaliLogoEnhanced({ scrollProgress = 0 }) {
  const logoRef = useRef()
  
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    return loader.load(KaliLogo)
  }, [])
  
  useFrame((state) => {
    if (!logoRef.current) return
    
    const t = state.clock.elapsedTime
    
    // Floating animation with parallax
    logoRef.current.position.y = Math.sin(t * 0.8) * 0.15
    logoRef.current.rotation.y = Math.sin(t * 0.3) * 0.08
    logoRef.current.rotation.x = Math.sin(t * 0.2) * 0.03
    // Parallax based on scroll
    logoRef.current.position.z = -scrollProgress * 2
  })
  
  return (
    <group ref={logoRef} position={[0, 0, 0]}>
      {/* Outer glow - largest */}
      <mesh>
        <circleGeometry args={[3.2, 64]} />
        <meshBasicMaterial
          color="#1565c0"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Middle glow */}
      <mesh>
        <circleGeometry args={[2.4, 64]} />
        <meshBasicMaterial
          color="#1a237e"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Inner glow - blue */}
      <mesh>
        <circleGeometry args={[1.8, 64]} />
        <meshBasicMaterial
          color="#367bf0"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Core bright glow */}
      <mesh>
        <circleGeometry args={[1.3, 64]} />
        <meshBasicMaterial
          color="#64b5f6"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Bright center */}
      <mesh>
        <circleGeometry args={[0.8, 64]} />
        <meshBasicMaterial
          color="#90caf9"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Radial burst effect */}
      <mesh rotation={[0, 0, 0]}>
        <ringGeometry args={[1.5, 2.2, 32]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Actual Kali logo - black silhouette */}
      <mesh position={[0, 0, 0.3]}>
        <planeGeometry args={[1.2, 1.2]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={1}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

// Distant Stars Layer
function DistantStars({ count = 2000 }) {
  const points = useRef()
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3] = (Math.random() - 0.5) * 60
      pos[i3 + 1] = (Math.random() - 0.5) * 60
      pos[i3 + 2] = -15 - Math.random() * 10
    }
    return pos
  }, [count])
  
  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.005
    }
  })
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// Main Space Scene Component
function SpaceScene({ scrollProgress = 0 }) {
  const mouseRef = useRef({ x: 0, y: 0 })
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  
  // Reduce particles on mobile for performance
  const galaxyCount = isMobile ? 3000 : 5000
  const starsCount = isMobile ? 800 : 1500
  
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        dpr={isMobile ? 1 : [1, 2]}
      >
        <color attach="background" args={['#030308']} />
        <fog attach="fog" args={['#030308', 10, 30]} />
        
        {/* Cinematic scroll-driven camera */}
        <CinematicCamera scrollProgress={scrollProgress} />
        
        {/* Distant background stars */}
        <DistantStars count={starsCount} />
        
        {/* Main galaxy */}
        <GalaxyBackground count={galaxyCount} />
        
        {/* Nebula clouds */}
        <NebulaClouds />
        
        {/* Galactic core */}
        <GalacticCore />
        
        {/* Glowing rings with custom shaders */}
        <GlowingRings scrollProgress={scrollProgress} mouseRef={mouseRef} />
        
        {/* Main Kali logo */}
        <KaliLogoEnhanced scrollProgress={scrollProgress} />
        
        {/* Saturn-like planet with rings */}
        <Saturn scrollProgress={scrollProgress} mouseRef={mouseRef} />
        
        {/* Lighting */}
        <ambientLight intensity={0.15} />
        <pointLight position={[-6, -2, 5]} intensity={1.5} color="#fff5e6" />
        <pointLight position={[5, 3, 3]} intensity={0.5} color="#b8d4ff" />
      </Canvas>
    </div>
  )
}

export default SpaceScene
