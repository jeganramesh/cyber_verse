import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useScroll } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import KaliLogo from '../assets/kalilinux-logo.svg'

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

// ─── Scroll hook ──────────────────────────────────────────────────────────────
function useScrollProgress() {
  const { scrollYProgress } = useScroll()
  return scrollYProgress
}

// ─── Mouse parallax hook ──────────────────────────────────────────────────────
function useMouseRef() {
  const mouseRef = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  return mouseRef
}

// ─── Camera Rig - GSAP-powered cinematic animation ─────────────────────────────────
function CameraController({ scrollProgress }) {
  const { camera } = useThree()
  const time = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const isInitialized = useRef(false)
  const timelineRef = useRef(null)

  // Camera rig object - the single source of truth
  const cameraRig = useRef({
    x: -4,
    y: 2,
    z: 18,
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
    const progress = scrollProgress.get()
    
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
      z: 14,
      duration: 1,
      ease: 'power2.out'
    })

    // Stage 2: Close-up - Zoom toward galaxy center
    tl.to(cameraRig.current, {
      x: 0,
      y: 0.5,
      z: 10,
      duration: 1,
      ease: 'power2.inOut'
    })

    // Stage 3: Center Align - Move to center
    tl.to(cameraRig.current, {
      x: 0,
      y: 0,
      z: 8,
      duration: 1,
      ease: 'power1.inOut'
    })

    // Stage 4: Core Focus - Deep zoom (INTENSE moment)
    tl.to(cameraRig.current, {
      z: 5,
      duration: 1.5,
      ease: 'power3.in'
    })

    // Stage 5: Exit Wide - Zoom out
    tl.to(cameraRig.current, {
      x: 0,
      y: 0,
      z: 4,
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
      camera.position.set(-4, 2, 18)
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

// ─── Galaxy disk — procedural canvas texture ──────────────────────────────────
function makeGalaxyTexture() {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const cx = size / 2
  const cy = size / 2

  // Deep space base
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, size, size)

  // Outer deep blue halo
  const halo = ctx.createRadialGradient(cx, cy, size * 0.1, cx, cy, size * 0.5)
  halo.addColorStop(0, 'rgba(30,  80, 255, 0.0)')
  halo.addColorStop(0.5, 'rgba(20,  60, 200, 0.35)')
  halo.addColorStop(1, 'rgba(5,   10,  60, 0.0)')
  ctx.fillStyle = halo
  ctx.fillRect(0, 0, size, size)

  // Mid blue ring
  const ring = ctx.createRadialGradient(cx, cy, size * 0.05, cx, cy, size * 0.38)
  ring.addColorStop(0, 'rgba(60, 140, 255, 0.0)')
  ring.addColorStop(0.55, 'rgba(50, 130, 255, 0.5)')
  ring.addColorStop(1, 'rgba(10,  40, 160, 0.0)')
  ctx.fillStyle = ring
  ctx.fillRect(0, 0, size, size)

  // Bright core
  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.12)
  core.addColorStop(0, 'rgba(255, 255, 255, 1.0)')
  core.addColorStop(0.2, 'rgba(160, 210, 255, 0.95)')
  core.addColorStop(0.5, 'rgba(80,  150, 255, 0.7)')
  core.addColorStop(1, 'rgba(30,   80, 200, 0.0)')
  ctx.fillStyle = core
  ctx.fillRect(0, 0, size, size)

  // Spiral arms painted with arcs
  const arms = 4
  for (let arm = 0; arm < arms; arm++) {
    const baseAngle = (arm / arms) * Math.PI * 2
    for (let i = 0; i < 320; i++) {
      const t = i / 320
      const radius = (0.04 + t * 0.44) * size
      const angle = baseAngle + t * Math.PI * 3.4
      const x = cx + Math.cos(angle) * radius
      const y = cy + Math.sin(angle) * radius
      const alpha = (1 - t) * 0.55 + 0.05
      const r = Math.round(60 + t * 10)
      const g = Math.round(130 + (1 - t) * 80)
      const b = 255
      const dotR = (1 - t * 0.75) * (size * 0.036) + Math.random() * (size * 0.012)
      const grad = ctx.createRadialGradient(x, y, 0, x, y, dotR)
      grad.addColorStop(0, `rgba(${r},${g},${b},${alpha.toFixed(2)})`)
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(x, y, dotR, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Second thinner spiral layer for detail
  for (let arm = 0; arm < arms; arm++) {
    const baseAngle = (arm / arms) * Math.PI * 2 + 0.45
    for (let i = 0; i < 200; i++) {
      const t = i / 200
      const radius = (0.03 + t * 0.36) * size
      const angle = baseAngle + t * Math.PI * 3.0
      const x = cx + Math.cos(angle) * radius
      const y = cy + Math.sin(angle) * radius
      const alpha = (1 - t) * 0.3 + 0.05
      const dotR = (1 - t * 0.8) * (size * 0.022)
      const grad = ctx.createRadialGradient(x, y, 0, x, y, dotR)
      grad.addColorStop(0, `rgba(120,200,255,${alpha.toFixed(2)})`)
      grad.addColorStop(1, `rgba(50,100,255,0)`)
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(x, y, dotR, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  return new THREE.CanvasTexture(canvas)
}

function GalaxyDisk({ scrollProgress }) {
  const diskRef = useRef()
  const disk2Ref = useRef()
  const texture = useMemo(() => makeGalaxyTexture(), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const scroll = scrollProgress.get()
    if (diskRef.current) {
      diskRef.current.rotation.z = t * 0.008
      // Tilt slightly with scroll for "flying into" depth feel
      diskRef.current.rotation.x = Math.PI / 2 + scroll * 0.4
    }
    if (disk2Ref.current) {
      disk2Ref.current.rotation.z = -t * 0.004
      disk2Ref.current.rotation.x = Math.PI / 2 + scroll * 0.4
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Main galaxy disk */}
      <mesh ref={diskRef} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 26, 1, 1]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Slightly larger ghosted rotation layer for depth */}
      <mesh ref={disk2Ref} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30, 1, 1]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

// ─── Galactic core glow layers ────────────────────────────────────────────────
function GalacticCore({ scrollProgress }) {
  const coreRef = useRef()
  const glowRef = useRef()
  const haloRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const scroll = scrollProgress.get()
    const pulse = 1 + Math.sin(t * 0.7) * 0.08
    if (coreRef.current) {
      coreRef.current.scale.setScalar(pulse * (1 + scroll * 0.3))
      coreRef.current.rotation.z = t * 0.02
    }
    if (glowRef.current) {
      glowRef.current.rotation.z = -t * 0.01
      glowRef.current.scale.setScalar(1 + Math.sin(t * 0.4) * 0.06)
    }
    if (haloRef.current) {
      haloRef.current.rotation.z = t * 0.005
    }
  })

  return (
    <group position={[0, 0, 0.1]}>
      {/* White hot center */}
      <mesh>
        <circleGeometry args={[0.35, 64]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Inner blue-white glow */}
      <mesh>
        <circleGeometry args={[0.7, 64]} />
        <meshBasicMaterial color="#b8d8ff" transparent opacity={0.85} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Mid glow */}
      <mesh ref={coreRef}>
        <circleGeometry args={[1.6, 64]} />
        <meshBasicMaterial color="#4499ff" transparent opacity={0.55} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Outer glow */}
      <mesh ref={glowRef}>
        <circleGeometry args={[3.2, 64]} />
        <meshBasicMaterial color="#2266ee" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Wide halo */}
      <mesh ref={haloRef}>
        <circleGeometry args={[5.5, 64]} />
        <meshBasicMaterial color="#1144cc" transparent opacity={0.12} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

// ─── Spiral particle arms ─────────────────────────────────────────────────────
function SpiralParticles({ scrollProgress, mouseRef }) {
  const pointsRef = useRef()

  const { positions, colors, sizes } = useMemo(() => {
    const count = 3500
    const pos = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)
    const szs = new Float32Array(count)

    const coreColor = new THREE.Color('#ffffff')
    const innerColor = new THREE.Color('#88ccff')
    const midColor = new THREE.Color('#3388ff')
    const outerColor = new THREE.Color('#0033cc')
    const accentColor = new THREE.Color('#00ddff')

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const arms = 4
      const arm = i % arms
      const baseAngle = (arm / arms) * Math.PI * 2

      // Logarithmic-style radius distribution — more stars near center
      const rnd = Math.pow(Math.random(), 0.65)
      const radius = 0.3 + rnd * 10.5

      // Tighter at core, more spread at edges
      const spread = 0.08 + rnd * 0.6
      const spinAngle = radius * 0.42
      const angle = baseAngle + spinAngle

      const jx = (Math.random() - 0.5) * spread
      const jy = (Math.random() - 0.5) * spread * 0.18
      const jz = (Math.random() - 0.5) * spread

      pos[i3] = Math.cos(angle) * radius + jx
      pos[i3 + 1] = jy
      pos[i3 + 2] = Math.sin(angle) * radius + jz

      // Color by radius
      const t = Math.min(radius / 10.5, 1)
      let c
      if (t < 0.15) c = coreColor.clone().lerp(innerColor, t / 0.15)
      else if (t < 0.45) c = innerColor.clone().lerp(midColor, (t - 0.15) / 0.30)
      else c = midColor.clone().lerp(outerColor, (t - 0.45) / 0.55)

      if (Math.random() > 0.91) c.lerp(accentColor, 0.6 + Math.random() * 0.4)

      cols[i3] = c.r
      cols[i3 + 1] = c.g
      cols[i3 + 2] = c.b

      // Size: larger near center
      szs[i] = 0.03 + (1 - t) * 0.12
    }

    return { positions: pos, colors: cols, sizes: szs }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const t = state.clock.elapsedTime
    const scroll = scrollProgress.get()
    // Very slow rotation — cinematic feel
    pointsRef.current.rotation.y = t * 0.008 + scroll * 0.1
    // Subtle mouse tilt
    pointsRef.current.rotation.x = mouseRef.current.y * 0.06
    pointsRef.current.rotation.z = mouseRef.current.x * 0.04
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={3500} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={3500} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        vertexColors
        transparent
        opacity={0.88}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

// ─── 3000 background stars with parallax ─────────────────────────────────────
function ParallaxStars({ mouseRef, scrollProgress }) {
  const layer1Ref = useRef()
  const layer2Ref = useRef()
  const layer3Ref = useRef()

  const [pos1, cols1] = useMemo(() => {
    const count = 1600
    const pos = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 55 + Math.random() * 60
      pos[i3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i3 + 2] = r * Math.cos(phi) - 40
      // White-blue
      cols[i3] = 0.75 + Math.random() * 0.25
      cols[i3 + 1] = 0.85 + Math.random() * 0.15
      cols[i3 + 2] = 1.0
    }
    return [pos, cols]
  }, [])

  const [pos2, cols2] = useMemo(() => {
    const count = 900
    const pos = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3] = (Math.random() - 0.5) * 120
      pos[i3 + 1] = (Math.random() - 0.5) * 120
      pos[i3 + 2] = -30 - Math.random() * 70
      cols[i3] = 0.8 + Math.random() * 0.2
      cols[i3 + 1] = 0.9 + Math.random() * 0.1
      cols[i3 + 2] = 1.0
    }
    return [pos, cols]
  }, [])

  const [pos3, cols3] = useMemo(() => {
    const count = 500
    const pos = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3] = (Math.random() - 0.5) * 80
      pos[i3 + 1] = (Math.random() - 0.5) * 80
      pos[i3 + 2] = -15 - Math.random() * 40
      const warm = Math.random() > 0.7
      cols[i3] = warm ? 1.0 : 0.7 + Math.random() * 0.3
      cols[i3 + 1] = warm ? 0.85 + Math.random() * 0.1 : 0.9
      cols[i3 + 2] = warm ? 0.7 + Math.random() * 0.2 : 1.0
    }
    return [pos, cols]
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const scroll = scrollProgress.get()
    const mx = mouseRef.current.x
    const my = mouseRef.current.y

    if (layer1Ref.current) {
      layer1Ref.current.rotation.y = t * 0.003
      layer1Ref.current.position.x = mx * 0.3
      layer1Ref.current.position.y = my * 0.2
      layer1Ref.current.position.z = scroll * 4
    }
    if (layer2Ref.current) {
      layer2Ref.current.rotation.y = t * 0.006
      layer2Ref.current.position.x = mx * 0.6
      layer2Ref.current.position.y = my * 0.4
      layer2Ref.current.position.z = scroll * 8
    }
    if (layer3Ref.current) {
      layer3Ref.current.rotation.y = t * 0.012
      layer3Ref.current.position.x = mx * 1.0
      layer3Ref.current.position.y = my * 0.7
      layer3Ref.current.position.z = scroll * 12
    }
  })

  return (
    <>
      <points ref={layer1Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={1600} array={pos1} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={1600} array={cols1} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.06} vertexColors transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
      </points>

      <points ref={layer2Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={900} array={pos2} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={900} array={cols2} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.08} vertexColors transparent opacity={0.65} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
      </points>

      <points ref={layer3Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={500} array={pos3} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={500} array={cols3} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.1} vertexColors transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
      </points>
    </>
  )
}

// ─── Kali Linux SVG logo at galaxy center ─────────────────────────────────────
function KaliLogoCenter({ scrollProgress, mouseRef }) {
  const groupRef = useRef()
  const aura1Ref = useRef()
  const aura2Ref = useRef()
  const aura3Ref = useRef()
  const ringRef = useRef()

  const logoTexture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    return loader.load(KaliLogo)
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const scroll = scrollProgress.get()

    if (groupRef.current) {
      // Floating up/down
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.12
      // Very slow rotation around Y
      groupRef.current.rotation.y = t * 0.04
      // Subtle tilt with mouse
      groupRef.current.rotation.x = mouseRef.current.y * 0.08 + Math.sin(t * 0.3) * 0.02
      // Move along with camera on scroll
      groupRef.current.position.z = 0.5 - scroll * 1.5
    }

    // Aura pulse
    const pulse = 1 + Math.sin(t * 0.8) * 0.12
    if (aura1Ref.current) aura1Ref.current.scale.setScalar(pulse)
    if (aura2Ref.current) aura2Ref.current.scale.setScalar(1 + Math.sin(t * 0.5 + 1) * 0.1)
    if (aura3Ref.current) aura3Ref.current.scale.setScalar(1 + Math.sin(t * 0.35 + 2) * 0.08)

    // Orbit ring slow spin
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.12
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.18) * 0.15
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0.5]}>

      {/* Wide outer aura — barely visible, very large */}
      <mesh ref={aura3Ref}>
        <circleGeometry args={[4.0, 64]} />
        <meshBasicMaterial color="#001888" transparent opacity={0.09} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Mid aura */}
      <mesh ref={aura2Ref}>
        <circleGeometry args={[2.6, 64]} />
        <meshBasicMaterial color="#1144ee" transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Inner aura — soft blue halo */}
      <mesh ref={aura1Ref}>
        <circleGeometry args={[1.6, 64]} />
        <meshBasicMaterial color="#2266ff" transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Orbit ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.95, 0.022, 16, 100]} />
        <meshBasicMaterial color="#44aaff" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Second orbit ring, counter-rotate */}
      <mesh rotation={[Math.PI / 2 + 0.3, 0, Math.PI * 0.3]}>
        <torusGeometry args={[2.3, 0.012, 16, 100]} />
        <meshBasicMaterial color="#2277cc" transparent opacity={0.18} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Kali SVG as texture — black silhouette on plane */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[2.0, 2.0]} />
        <meshBasicMaterial
          map={logoTexture}
          transparent
          opacity={0.92}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Thin edge blue rim light behind logo */}
      <mesh position={[0, 0, -0.02]}>
        <circleGeometry args={[1.18, 64]} />
        <meshBasicMaterial color="#3399ff" transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  )
}

// ─── Nebula clouds for depth atmosphere ───────────────────────────────────────
function NebulaClouds() {
  const a = useRef()
  const b = useRef()
  const c = useRef()

  const texA = useMemo(() => {
    const cv = document.createElement('canvas'); cv.width = cv.height = 256
    const ctx = cv.getContext('2d')
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    g.addColorStop(0, 'rgba(30,100,255,0.55)')
    g.addColorStop(0.4, 'rgba(20, 70,200,0.25)')
    g.addColorStop(1, 'rgba(10, 20,120,0)')
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256)
    return new THREE.CanvasTexture(cv)
  }, [])

  const texB = useMemo(() => {
    const cv = document.createElement('canvas'); cv.width = cv.height = 256
    const ctx = cv.getContext('2d')
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    g.addColorStop(0, 'rgba(0, 180,255,0.45)')
    g.addColorStop(0.5, 'rgba(50, 80,200,0.2)')
    g.addColorStop(1, 'rgba(10, 20,150,0)')
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256)
    return new THREE.CanvasTexture(cv)
  }, [])

  const texC = useMemo(() => {
    const cv = document.createElement('canvas'); cv.width = cv.height = 256
    const ctx = cv.getContext('2d')
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    g.addColorStop(0, 'rgba(80,  60,200,0.4)')
    g.addColorStop(0.45, 'rgba(40,  30,160,0.18)')
    g.addColorStop(1, 'rgba(10,  10, 80,0)')
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256)
    return new THREE.CanvasTexture(cv)
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (a.current) a.current.rotation.z = t * 0.004
    if (b.current) b.current.rotation.z = -t * 0.003
    if (c.current) c.current.rotation.z = t * 0.002
  })

  return (
    <>
      <mesh ref={a} position={[7, 4, -18]}>
        <planeGeometry args={[35, 35]} />
        <meshBasicMaterial map={texA} transparent opacity={0.45} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={b} position={[-8, -5, -22]}>
        <planeGeometry args={[28, 28]} />
        <meshBasicMaterial map={texB} transparent opacity={0.38} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={c} position={[3, -8, -16]}>
        <planeGeometry args={[22, 22]} />
        <meshBasicMaterial map={texC} transparent opacity={0.32} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </>
  )
}

// ─── Main exported component ──────────────────────────────────────────────────
function GalaxyScene() {
  const scrollProgress = useScrollProgress()
  const mouseRef = useMouseRef()

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 18], fov: 58 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 1.8]}
      >
        {/* Background color — deep space black */}
        <color attach="background" args={['#000308']} />

        {/* Blue point light from galaxy core */}
        <pointLight position={[0, 0, 2]} color="#3377ff" intensity={4} distance={30} decay={2} />
        <pointLight position={[0, 0, -5]} color="#1144cc" intensity={2} distance={25} decay={2} />

        {/* Ambient space light — very dim blue tint */}
        <ambientLight color="#050d20" intensity={0.8} />

        {/* Camera controller */}
        <CameraController scrollProgress={scrollProgress} />

        {/* Scene elements */}
        <NebulaClouds />
        <ParallaxStars mouseRef={mouseRef} scrollProgress={scrollProgress} />
        <GalaxyDisk scrollProgress={scrollProgress} />
        <SpiralParticles scrollProgress={scrollProgress} mouseRef={mouseRef} />
        <GalacticCore scrollProgress={scrollProgress} />
        <KaliLogoCenter scrollProgress={scrollProgress} mouseRef={mouseRef} />

        {/* Subtle fog for depth */}
        <fog attach="fog" args={['#000308', 18, 80]} />

        {/* Post-processing */}
        <EffectComposer>
          <Bloom
            intensity={2.2}
            luminanceThreshold={0.08}
            luminanceSmoothing={0.92}
            mipmapBlur
            radius={0.85}
          />
          <Vignette darkness={0.65} offset={0.25} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default GalaxyScene
