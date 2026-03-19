import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

// Simplified Animated Ring - no custom shaders, basic materials only
function AnimatedRing({ 
  radius = 3, 
  tube = 0.02, 
  color = "#00e5ff", 
  rotationSpeed = 0.5,
  rotationAxis = "z",
  tilt = 0,
  scrollOffset = 0,
  mouseInfluence = { x: 0, y: 0 }
}) {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    
    const t = state.clock.elapsedTime
    
    // Simple rotation animation
    const rotationAmount = t * rotationSpeed
    if (rotationAxis === "z") {
      meshRef.current.rotation.z = rotationAmount + tilt
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.1 + mouseInfluence.y * 0.3
    } else if (rotationAxis === "x") {
      meshRef.current.rotation.x = rotationAmount + tilt
      meshRef.current.rotation.z = Math.sin(t * 0.3) * 0.1 + mouseInfluence.x * 0.3
    }
    
    // Scroll-based movement
    meshRef.current.position.z = -scrollOffset * 2
    
    // Mouse parallax
    meshRef.current.position.x = mouseInfluence.x * 0.5
    meshRef.current.position.y = mouseInfluence.y * 0.5
  })

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, tilt]}>
      <torusGeometry args={[radius, tube, 16, 48]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.2}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

// Simplified Ring System - reduced ring count for performance
function RingSystem({ scrollProgress = 0, mouseRef }) {
  const groupRef = useRef()
  
  // Reduced ring count - only 4 rings instead of 7
  const rings = useMemo(() => [
    { radius: 2.5, tube: 0.015, color: "#00e5ff", speed: 0.4, axis: "z", tilt: 0 },
    { radius: 3.0, tube: 0.02, color: "#367bf0", speed: -0.3, axis: "z", tilt: 0.2 },
    { radius: 3.5, tube: 0.012, color: "#64b5f6", speed: 0.25, axis: "x", tilt: -0.15 },
    { radius: 4.0, tube: 0.018, color: "#90caf9", speed: -0.2, axis: "x", tilt: Math.PI / 3 },
  ], [])

  useFrame((state) => {
    if (!groupRef.current) return
    
    const t = state.clock.elapsedTime
    const scroll = scrollProgress.get ? scrollProgress.get() : scrollProgress
    const mx = mouseRef?.current?.x || 0
    const my = mouseRef?.current?.y || 0
    
    // Gentle group rotation
    groupRef.current.rotation.y = t * 0.05
    groupRef.current.rotation.x = my * 0.1
    groupRef.current.rotation.z = mx * 0.08
    
    // Scroll movement
    groupRef.current.position.z = -scroll * 3
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {rings.map((ring, index) => (
        <AnimatedRing
          key={index}
          radius={ring.radius}
          tube={ring.tube}
          color={ring.color}
          rotationSpeed={ring.speed}
          rotationAxis={ring.axis}
          tilt={ring.tilt}
          scrollOffset={scrollProgress}
          mouseInfluence={{ x: mouseRef?.current?.x || 0, y: mouseRef?.current?.y || 0 }}
        />
      ))}
    </group>
  )
}

// Simplified Orbiting Particles - reduced count
function OrbitingParticles({ count = 100, radius = 4 }) {
  const pointsRef = useRef()

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)

    const colorPalette = [
      new THREE.Color("#00e5ff"),
      new THREE.Color("#367bf0"),
      new THREE.Color("#64b5f6"),
    ]

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const angle = (i / count) * Math.PI * 2
      const r = radius + (Math.random() - 0.5) * 0.5
      const height = (Math.random() - 0.5) * 0.3

      pos[i3] = Math.cos(angle) * r
      pos[i3 + 1] = height
      pos[i3 + 2] = Math.sin(angle) * r

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      cols[i3] = color.r
      cols[i3 + 1] = color.g
      cols[i3 + 2] = color.b
    }

    return { positions: pos, colors: cols }
  }, [count, radius])

  useFrame((state) => {
    if (!pointsRef.current) return
    const t = state.clock.elapsedTime
    pointsRef.current.rotation.y = t * 0.3
  })

  return (
    <points ref={pointsRef}>
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
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

// Main GlowingRings component - Simplified for performance
function GlowingRings({ scrollProgress = 0, mouseRef }) {
  const scroll = scrollProgress.get ? scrollProgress : { get: () => scrollProgress }

  return (
    <group>
      {/* Concentric glowing rings - reduced count */}
      <RingSystem scrollProgress={scroll} mouseRef={mouseRef} />
      
      {/* Reduced orbiting particles */}
      <OrbitingParticles count={150} radius={4.5} />
    </group>
  )
}

export default GlowingRings
