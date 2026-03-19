import { useRef, useMemo, useEffect } from "react"
import { useFrame, extend } from "@react-three/fiber"
import * as THREE from "three"

// Procedural gradient texture for ring (rainbow-like)
function createRingGradientTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 512
  canvas.height = 64
  const ctx = canvas.getContext("2d")

  // Create gradient from cyan to purple to orange (cyberpunk style)
  const gradient = ctx.createLinearGradient(0, 0, 512, 0)
  gradient.addColorStop(0, "rgba(0, 229, 255, 0.9)")   // Cyan
  gradient.addColorStop(0.2, "rgba(54, 123, 240, 0.9)")  // Blue
  gradient.addColorStop(0.4, "rgba(156, 39, 176, 0.85)") // Purple
  gradient.addColorStop(0.6, "rgba(233, 30, 99, 0.8)")   // Pink
  gradient.addColorStop(0.8, "rgba(255, 152, 0, 0.85)")  // Orange
  gradient.addColorStop(1, "rgba(255, 193, 7, 0.9)")     // Amber

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 512, 64)

  // Add subtle dark bands for Saturn ring effect
  ctx.globalAlpha = 0.3
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * 512
    const width = Math.random() * 30 + 5
    ctx.fillStyle = "#000000"
    ctx.fillRect(x, 0, width, 64)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  return texture
}

// Procedural glow texture
function createGlowTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext("2d")

  // Radial gradient for soft glow - reduced intensity
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  gradient.addColorStop(0, "rgba(0, 229, 255, 0.4)")
  gradient.addColorStop(0.3, "rgba(54, 123, 240, 0.25)")
  gradient.addColorStop(0.6, "rgba(156, 39, 176, 0.1)")
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 256)

  return new THREE.CanvasTexture(canvas)
}

// Saturn Planet Component - Optimized for 60 FPS
function SaturnPlanet({ position = [-6, -2, 3], scrollProgress = 0, mouseRef }) {
  const planetRef = useRef()
  const ringRef = useRef()
  const glowRef = useRef()
  const wireRef = useRef()
  const groupRef = useRef()

  // Create textures once
  const ringTexture = useMemo(() => createRingGradientTexture(), [])
  const glowTexture = useMemo(() => createGlowTexture(), [])

  // Planet material - simple but effective
  const planetMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.6,
    metalness: 0.2,
  }), [])

  // Ring material - using gradient texture
  const ringMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    map: ringTexture,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9,
  }), [ringTexture])

  // Glow material - sprite for fake bloom - reduced intensity
  const glowMaterial = useMemo(() => new THREE.SpriteMaterial({
    map: glowTexture,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
  }), [glowTexture])

  // Wireframe material for outer sphere - reduced intensity
  const wireMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0x66ccff,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
  }), [])

  useFrame((state) => {
    if (!groupRef.current) return

    const t = state.clock.elapsedTime
    const scroll = scrollProgress.get ? scrollProgress.get() : scrollProgress
    const mx = mouseRef?.current?.x || 0
    const my = mouseRef?.current?.y || 0

    // Planet rotation - slow and smooth
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.002
    }

    // Ring rotation - slower, tilted
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.0015
    }

    // Wireframe sphere rotation
    if (wireRef.current) {
      wireRef.current.rotation.x += 0.001
      wireRef.current.rotation.y += 0.0005
    }

    // Glow follows planet
    if (glowRef.current) {
      glowRef.current.material.rotation = t * 0.1
    }

    // Group floating animation
    groupRef.current.position.y = position[1] + Math.sin(t * 0.4) * 0.15

    // Mouse parallax
    groupRef.current.position.x = position[0] + mx * 0.5
    groupRef.current.position.y = position[1] + my * 0.3

    // Scroll movement
    groupRef.current.position.z = position[2] - scroll * 2
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Main Planet - 32 segments for performance */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <primitive object={planetMaterial} attach="material" />
      </mesh>

      {/* Saturn Ring - gradient texture, tilted */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[1.5, 2.5, 64]} />
        <primitive object={ringMaterial} attach="material" />
      </mesh>

      {/* Glow Effect - sprite (fake bloom, no postprocessing) - reduced scale */}
      <sprite ref={glowRef} scale={[3, 3, 1]}>
        <primitive object={glowMaterial} attach="material" />
      </sprite>

      {/* Wireframe Sphere - icosahedron for cyber look */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[2.8, 1]} />
        <primitive object={wireMaterial} attach="material" />
      </mesh>
    </group>
  )
}

// SaturnGlowRings - Simplified for performance (removed heavy torus rings)
function SaturnGlowRings({ position = [-6, -2, 3], scrollProgress = 0, mouseRef }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return

    const t = state.clock.elapsedTime
    const scroll = scrollProgress.get ? scrollProgress.get() : scrollProgress
    const mx = mouseRef?.current?.x || 0
    const my = mouseRef?.current?.y || 0

    groupRef.current.rotation.y = t * 0.1
    groupRef.current.position.z = position[2] - scroll * 2 + 0.5
    groupRef.current.position.x = mx * 0.3
    groupRef.current.position.y = my * 0.2
  })

  // Simple glowing rings using basic geometry (no custom shaders)
  const rings = useMemo(() => [
    { radius: 2.0, tube: 0.02, color: "#00e5ff", speed: 0.3, tilt: 0 },
    { radius: 2.5, tube: 0.015, color: "#367bf0", speed: -0.2, tilt: 0.3 },
  ], [])

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2] + 0.1]}>
      {rings.map((ring, index) => (
        <mesh key={index} rotation={[Math.PI / 2, 0, ring.tilt]}>
          <torusGeometry args={[ring.radius, ring.tube, 16, 64]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

// Main Saturn Component
function Saturn({ scrollProgress = 0, mouseRef }) {
  const scroll = scrollProgress.get ? scrollProgress : { get: () => scrollProgress }

  return (
    <group>
      <SaturnPlanet 
        position={[-6, -2, 3]} 
        scrollProgress={scroll} 
        mouseRef={mouseRef} 
      />
      <SaturnGlowRings 
        position={[-6, -2, 3]} 
        scrollProgress={scroll} 
        mouseRef={mouseRef} 
      />
    </group>
  )
}

export default Saturn
