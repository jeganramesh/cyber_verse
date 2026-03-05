import { useRef, useMemo, useEffect, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import KaliLogo from '../assets/kalilinux-logo.svg'
import { useScroll } from 'framer-motion'

// Custom hook for scroll progress
function useScrollProgress() {
  const scrollData = useScroll()
  return scrollData.scrollYProgress
}

// Optimized mouse tracking hook with throttling
function useMousePosition() {
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    let ticking = false
    
    const handleMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1
      
      if (!ticking) {
        requestAnimationFrame(() => {
          mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05
          mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05
          setMouse({ x: mouseRef.current.x, y: mouseRef.current.y })
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  return mouse
}

// Scroll-driven camera controller
function CameraController({ scrollProgress, mouse }) {
  const { camera } = useThree()
  const targetZ = useRef(15)
  const targetY = useRef(0)
  const targetRotation = useRef({ x: 0, y: 0 })
  
  useFrame(() => {
    const baseZ = 15 - scrollProgress.get() * 13
    const baseY = Math.sin(scrollProgress.get() * Math.PI * 2) * 0.5
    const rotX = scrollProgress.get() * 0.1
    const rotY = scrollProgress.get() * 0.15
    
    targetZ.current = baseZ
    targetY.current = baseY
    targetRotation.current = { x: rotX, y: rotY }
    
    camera.position.z += (targetZ.current - camera.position.z) * 0.03
    camera.position.y += (targetY.current - camera.position.y) * 0.03
    
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.02
    camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.02 + targetY.current * 0.1
    
    camera.rotation.x += (targetRotation.current.x - camera.rotation.x) * 0.02
    camera.rotation.y += (targetRotation.current.y - camera.rotation.y) * 0.02
  })
  
  return null
}

// Deep starfield with multiple layers
function DeepStarfield({ scrollProgress }) {
  const starsRef = useRef()
  const stars2Ref = useRef()
  const stars3Ref = useRef()
  
  const positions1 = useMemo(() => {
    const count = 3000
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3] = (Math.random() - 0.5) * 100
      pos[i3 + 1] = (Math.random() - 0.5) * 100
      pos[i3 + 2] = -50 - Math.random() * 50
    }
    return pos
  }, [])
  
  const positions2 = useMemo(() => {
    const count = 1500
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3] = (Math.random() - 0.5) * 60
      pos[i3 + 1] = (Math.random() - 0.5) * 60
      pos[i3 + 2] = -30 - Math.random() * 20
    }
    return pos
  }, [])
  
  const positions3 = useMemo(() => {
    const count = 800
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3] = (Math.random() - 0.5) * 40
      pos[i3 + 1] = (Math.random() - 0.5) * 40
      pos[i3 + 2] = -10 - Math.random() * 15
    }
    return pos
  }, [])
  
  const colors1 = useMemo(() => {
    const count = 3000
    const cols = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      cols[i3] = 0.7 + Math.random() * 0.3
      cols[i3 + 1] = 0.8 + Math.random() * 0.2
      cols[i3 + 2] = 1.0
    }
    return cols
  }, [])
  
  const colors2 = useMemo(() => {
    const count = 1500
    const cols = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      cols[i3] = 0.8 + Math.random() * 0.2
      cols[i3 + 1] = 0.9 + Math.random() * 0.1
      cols[i3 + 2] = 1.0
    }
    return cols
  }, [])
  
  const colors3 = useMemo(() => {
    const count = 800
    const cols = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const colorChoice = Math.random()
      if (colorChoice > 0.8) {
        cols[i3] = 0.5 + Math.random() * 0.3
        cols[i3 + 1] = 0.8 + Math.random() * 0.2
        cols[i3 + 2] = 1.0
      } else if (colorChoice > 0.6) {
        cols[i3] = 1.0
        cols[i3 + 1] = 0.9 + Math.random() * 0.1
        cols[i3 + 2] = 0.8
      } else {
        cols[i3] = 1.0
        cols[i3 + 1] = 1.0
        cols[i3 + 2] = 1.0
      }
    }
    return cols
  }, [])
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    const scroll = scrollProgress.get()
    
    if (starsRef.current) {
      starsRef.current.rotation.y = time * 0.005
      starsRef.current.rotation.x = time * 0.002
      starsRef.current.position.z = scroll * 5
    }
    
    if (stars2Ref.current) {
      stars2Ref.current.rotation.y = time * 0.01
      stars2Ref.current.rotation.x = time * 0.005
      stars2Ref.current.position.z = scroll * 8
    }
    
    if (stars3Ref.current) {
      stars3Ref.current.rotation.y = time * 0.02
      stars3Ref.current.rotation.x = time * 0.008
      stars3Ref.current.position.z = scroll * 12
    }
  })
  
  return (
    <>
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={3000} array={positions1} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={3000} array={colors1} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.08} vertexColors transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
      </points>
      
      <points ref={stars2Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={1500} array={positions2} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={1500} array={colors2} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.1} vertexColors transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
      </points>
      
      <points ref={stars3Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={800} array={positions3} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={800} array={colors3} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.12} vertexColors transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
      </points>
    </>
  )
}

// SATURN RING COMPONENT - The main feature
function SaturnRing({ scrollProgress, mouse }) {
  const planetRef = useRef()
  const ringRef = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()
  const groupRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    const scroll = scrollProgress.get()
    
    if (groupRef.current) {
      // Slow rotation
      groupRef.current.rotation.y = time * 0.02
      
      // Mouse interaction
      groupRef.current.rotation.x = mouse.y * 0.1
      groupRef.current.rotation.z = mouse.x * 0.05
      
      // Tilt based on scroll
      groupRef.current.rotation.x += scroll * 0.15
      
      // Move closer with scroll
      groupRef.current.position.z = -scroll * 2
    }
    
    // Planet rotation
    if (planetRef.current) {
      planetRef.current.rotation.y = time * 0.1
    }
    
    // Ring rotation - inner ring spins faster
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.05
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -time * 0.03
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = time * 0.02
    }
  })
  
  return (
    <group ref={groupRef} position={[3, -1, -2]}>
      {/* Saturn Planet Body */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshStandardMaterial 
          color="#c4a35a"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Planet glow */}
      <mesh>
        <sphereGeometry args={[1.3, 64, 64]} />
        <meshBasicMaterial 
          color="#d4b896" 
          transparent 
          opacity={0.15} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Inner ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[1.6, 2.2, 128]} />
        <meshBasicMaterial 
          color="#a08050"
          transparent 
          opacity={0.5}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Middle ring - main ring */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[2.3, 3.8, 128]} />
        <meshBasicMaterial 
          color="#c9a86c"
          transparent 
          opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Outer ring */}
      <mesh ref={ring3Ref} rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[3.9, 4.8, 128]} />
        <meshBasicMaterial 
          color="#8b7355"
          transparent 
          opacity={0.25}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Ring shine */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[2.3, 3.8, 128]} />
        <meshBasicMaterial 
          color="#ffe4b5"
          transparent 
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

// Spiral Galaxy 
function SpiralGalaxy({ scrollProgress, mouse }) {
  const points = useRef()
  const groupRef = useRef()
  
  const { positions, colors } = useMemo(() => {
    const count = 2500
    const pos = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)
    
    const colorCore = new THREE.Color('#ffffff')
    const colorInner = new THREE.Color('#42a5f5')
    const colorMid = new THREE.Color('#1976d2')
    const colorOuter = new THREE.Color('#0d47a1')
    const colorAccent = new THREE.Color('#00e5ff')
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      const radius = 1.5 + Math.random() * 8
      const spinAngle = radius * 0.35
      const branchAngle = (i % 4) * ((Math.PI * 2) / 4)
      
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.6
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.6
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.4
      
      pos[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
      pos[i3 + 1] = randomY * 1.5
      pos[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ - 1.5
      
      const t = radius / 10
      let mixedColor
      if (t < 0.2) {
        mixedColor = colorCore.clone().lerp(colorInner, t / 0.2)
      } else if (t < 0.5) {
        mixedColor = colorInner.clone().lerp(colorMid, (t - 0.2) / 0.3)
      } else {
        mixedColor = colorMid.clone().lerp(colorOuter, (t - 0.5) / 0.5)
      }
      
      if (Math.random() > 0.93) {
        mixedColor.lerp(colorAccent, 0.7)
      }
      
      cols[i3] = mixedColor.r
      cols[i3 + 1] = mixedColor.g
      cols[i3 + 2] = mixedColor.b
    }
    
    return { positions: pos, colors: cols }
  }, [])
  
  useFrame((state) => {
    if (points.current) {
      const scroll = scrollProgress.get()
      points.current.rotation.y = state.clock.elapsedTime * (0.01 + scroll * 0.02)
      points.current.rotation.x = mouse.y * 0.15
      points.current.rotation.z = mouse.x * 0.08
      points.current.position.z = -scroll * 3
    }
  })
  
  return (
    <group ref={groupRef}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={2500} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={2500} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.05} vertexColors transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
      </points>
    </group>
  )
}

// Galactic Core
function GalacticCore({ scrollProgress, mouse }) {
  const coreRef = useRef()
  const glowRef = useRef()
  
  useFrame((state) => {
    if (coreRef.current) {
      const scroll = scrollProgress.get()
      coreRef.current.rotation.z = state.clock.elapsedTime * (0.015 + scroll * 0.02)
      const baseScale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.08
      const scrollScale = 1 + scroll * 0.5
      coreRef.current.scale.setScalar(baseScale * scrollScale)
      coreRef.current.rotation.x = mouse.y * 0.1
      coreRef.current.rotation.y = mouse.x * 0.1
    }
    if (glowRef.current) {
      glowRef.current.rotation.z = -state.clock.elapsedTime * 0.008
    }
  })
  
  return (
    <group ref={coreRef} position={[0, 0, 0]}>
      <mesh>
        <circleGeometry args={[0.6, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={1} />
      </mesh>
      <mesh>
        <circleGeometry args={[1, 64]} />
        <meshBasicMaterial color="#90caf9" transparent opacity={0.7} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <circleGeometry args={[1.8, 64]} />
        <meshBasicMaterial color="#42a5f5" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <circleGeometry args={[3, 64]} />
        <meshBasicMaterial color="#1976d2" transparent opacity={0.35} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <circleGeometry args={[4.5, 64]} />
        <meshBasicMaterial color="#0d47a1" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </mesh>
      <group ref={glowRef}>
        <mesh rotation={[0, 0, 0]}>
          <ringGeometry args={[3.5, 5.5, 64]} />
          <meshBasicMaterial color="#64b5f6" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
    </group>
  )
}

// Nebula clouds
function NebulaClouds() {
  const meshRef = useRef()
  const mesh2Ref = useRef()
  
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    gradient.addColorStop(0, 'rgba(66, 165, 245, 0.6)')
    gradient.addColorStop(0.4, 'rgba(30, 136, 229, 0.3)')
    gradient.addColorStop(1, 'rgba(21, 101, 192, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 256)
    return new THREE.CanvasTexture(canvas)
  }, [])
  
  const texture2 = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    gradient.addColorStop(0, 'rgba(0, 229, 255, 0.5)')
    gradient.addColorStop(0.5, 'rgba(156, 39, 176, 0.25)')
    gradient.addColorStop(1, 'rgba(103, 58, 183, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 256)
    return new THREE.CanvasTexture(canvas)
  }, [])
  
  useFrame((state) => {
    if (meshRef.current) meshRef.current.rotation.z = state.clock.elapsedTime * 0.003
    if (mesh2Ref.current) mesh2Ref.current.rotation.z = -state.clock.elapsedTime * 0.002
  })
  
  return (
    <>
      <mesh ref={meshRef} position={[5, 3, -15]}>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial map={texture} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={mesh2Ref} position={[-6, -3, -18]}>
        <planeGeometry args={[25, 25]} />
        <meshBasicMaterial map={texture2} transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </>
  )
}

// Kali Logo
function KaliLogoWithAura({ scrollProgress, mouse }) {
  const groupRef = useRef()
  const chakraRef = useRef()
  const auraRef = useRef()
  
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    return loader.load(KaliLogo)
  }, [])
  
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const scroll = scrollProgress.get()
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.1 + scroll * 0.5
    groupRef.current.position.z = -scroll * 2
    groupRef.current.rotation.y = Math.sin(t * 0.12) * 0.08 + mouse.x * 0.2
    groupRef.current.rotation.x = Math.sin(t * 0.08) * 0.03 + mouse.y * 0.15
    if (chakraRef.current) chakraRef.current.rotation.z = t * (0.3 + scroll * 0.4)
    if (auraRef.current) {
      const pulse = 1 + Math.sin(t * 0.8) * 0.15 + scroll * 0.2
      auraRef.current.scale.setScalar(pulse)
    }
  })
  
  return (
    <group ref={groupRef} position={[0, 0, 1]}>
      <mesh>
        <planeGeometry args={[1.6, 1.6]} />
        <meshBasicMaterial map={texture} transparent opacity={0.95} side={THREE.DoubleSide} />
      </mesh>
      <group ref={chakraRef} position={[0, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <torusGeometry args={[2.3, 0.035, 16, 80]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.25} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh>
          <torusGeometry args={[2, 0.025, 16, 80]} />
          <meshBasicMaterial color="#367BF0" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh>
          <torusGeometry args={[1.7, 0.018, 16, 80]} />
          <meshBasicMaterial color="#64b5f6" transparent opacity={0.35} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
      <group ref={auraRef} position={[0, 0, -0.2]}>
        <mesh>
          <circleGeometry args={[2.8, 64]} />
          <meshBasicMaterial color="#367BF0" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
    </group>
  )
}

// Floating particles
function FloatingParticles({ scrollProgress, mouse }) {
  const points = useRef()
  const particleCount = 100
  
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const vel = []
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      pos[i3] = (Math.random() - 0.5) * 20
      pos[i3 + 1] = (Math.random() - 0.5) * 15
      pos[i3 + 2] = Math.random() * 10 - 5
      vel.push({ x: (Math.random() - 0.5) * 0.003, y: (Math.random() - 0.5) * 0.003, z: (Math.random() - 0.5) * 0.002 })
    }
    return { positions: pos, velocities: vel }
  }, [])
  
  useFrame((state) => {
    if (!points.current) return
    const posArray = points.current.geometry.attributes.position.array
    const scroll = scrollProgress.get()
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      posArray[i3] += velocities[i].x + mouse.x * 0.002
      posArray[i3 + 1] += velocities[i].y + mouse.y * 0.002
      posArray[i3 + 2] += velocities[i].z + scroll * 0.01
      if (posArray[i3] > 10) posArray[i3] = -10
      if (posArray[i3] < -10) posArray[i3] = 10
      if (posArray[i3 + 1] > 7.5) posArray[i3 + 1] = -7.5
      if (posArray[i3 + 1] < -7.5) posArray[i3 + 1] = 7.5
    }
    points.current.geometry.attributes.position.needsUpdate = true
  })
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#00e5ff" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  )
}

// Main Galaxy Scene with Saturn Ring
function GalaxyScene() {
  const scrollProgress = useScrollProgress()
  const mouse = useMousePosition()
  
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#010105']} />
        
        {/* Ambient light for Saturn */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        
        <CameraController scrollProgress={scrollProgress} mouse={mouse} />
        <NebulaClouds />
        <DeepStarfield scrollProgress={scrollProgress} />
        <SpiralGalaxy scrollProgress={scrollProgress} mouse={mouse} />
        <GalacticCore scrollProgress={scrollProgress} mouse={mouse} />
        
        {/* SATURN RING - Positioned to the side */}
        <SaturnRing scrollProgress={scrollProgress} mouse={mouse} />
        
        <FloatingParticles scrollProgress={scrollProgress} mouse={mouse} />
        <KaliLogoWithAura scrollProgress={scrollProgress} mouse={mouse} />
        
        <fog attach="fog" args={['#010105', 10, 60]} />
        
        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
          <Vignette darkness={0.6} offset={0.3} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default GalaxyScene
