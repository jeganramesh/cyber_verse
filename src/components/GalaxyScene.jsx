import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import KaliLogo from '../assets/kalilinux-logo.svg'

// Procedural Spiral Galaxy with bright blue core
function SpiralGalaxy({ scrollProgress = 0 }) {
  const points = useRef()
  const groupRef = useRef()
  
  const { positions, colors, sizes } = useMemo(() => {
    const count = 4000
    const pos = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)
    const szs = new Float32Array(count)
    
    // Blue/cyan color palette for bright galaxy
    const colorCore = new THREE.Color('#b8b6b6')
    const colorInner = new THREE.Color('#64b5f6')
    const colorMid = new THREE.Color('#1e88e5')
    const colorOuter = new THREE.Color('#1565c0')
    const colorAccent = new THREE.Color('#00e5ff')
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Spiral galaxy formula with multiple arms
      const radius = 3 + Math.random() * 12
      const spinAngle = radius * 0.5
      const branchAngle = (i % 4) * ((Math.PI * 2) / 4)
      
      // Add randomness for natural look
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 1.2
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 1.2
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 1.0
      
      // Spiral arm positioning
      pos[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
      pos[i3 + 1] = randomY * 3
      pos[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ - 3
      
      // Color gradient from center to edge
      const t = radius / 15
      let mixedColor
      if (t < 0.2) {
        mixedColor = colorCore.clone().lerp(colorInner, t / 0.2)
      } else if (t < 0.5) {
        mixedColor = colorInner.clone().lerp(colorMid, (t - 0.2) / 0.3)
      } else {
        mixedColor = colorMid.clone().lerp(colorOuter, (t - 0.5) / 0.5)
      }
      
      // Add accent stars
      if (Math.random() > 0.9) {
        mixedColor.lerp(colorAccent, 0.6)
      }
      
      cols[i3] = mixedColor.r
      cols[i3 + 1] = mixedColor.g
      cols[i3 + 2] = mixedColor.b
      
      // Size varies by distance from center - smaller particles
      szs[i] = (0.04 + Math.random() * 0.08) * (1 - t * 0.4)
    }
    
    return { positions: pos, colors: cols, sizes: szs }
  }, [])
  
  useFrame((state) => {
    if (points.current) {
      // Slow rotation
      points.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })
  
  return (
    <group ref={groupRef}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={8000}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={8000}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

// Bright glowing galactic core
function GalacticCore() {
  const coreRef = useRef()
  
  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.z = state.clock.elapsedTime * 0.03
    }
  })
  
  return (
    <group ref={coreRef} position={[0, 0, -2]}>
      {/* Bright white-blue core - reduced exposure */}
      <mesh>
        <circleGeometry args={[1.2, 64]} />
        <meshBasicMaterial
          color="#d6d5d5"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Inner blue glow */}
      <mesh>
        <circleGeometry args={[1.8, 64]} />
        <meshBasicMaterial
          color="#90caf9"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Middle glow */}
      <mesh>
        <circleGeometry args={[2.8, 64]} />
        <meshBasicMaterial
          color="#42a5f5"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh>
        <circleGeometry args={[4, 64]} />
        <meshBasicMaterial
          color="#1e88e5"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Radial rays */}
      <mesh rotation={[0, 0, 0]}>
        <ringGeometry args={[5, 8, 64]} />
        <meshBasicMaterial
          color="#64b5f6"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Outer ring */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <ringGeometry args={[8, 12, 64]} />
        <meshBasicMaterial
          color="#1565c0"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

// Star particles with parallax
function StarField({ count = 3000, scrollProgress = 0 }) {
  const points = useRef()
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Wide spread for parallax effect
      pos[i3] = (Math.random() - 0.5) * 50
      pos[i3 + 1] = (Math.random() - 0.5) * 50
      pos[i3 + 2] = -5 - Math.random() * 20
    }
    return pos
  }, [count])
  
  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const colorChoice = Math.random()
      if (colorChoice > 0.85) {
        // Blue stars
        cols[i3] = 0.7 + Math.random() * 0.3
        cols[i3 + 1] = 0.8 + Math.random() * 0.2
        cols[i3 + 2] = 1.0
      } else if (colorChoice > 0.7) {
        // White-blue stars
        cols[i3] = 0.9 + Math.random() * 0.1
        cols[i3 + 1] = 0.95
        cols[i3 + 2] = 1.0
      } else {
        // White stars
        cols[i3] = 1.0
        cols[i3 + 1] = 1.0
        cols[i3 + 2] = 1.0
      }
    }
    return cols
  }, [count])
  
  useFrame((state) => {
    if (points.current) {
      // Very slow rotation for parallax
      points.current.rotation.y = state.clock.elapsedTime * 0.003
      // Parallax based on scroll
      points.current.position.z = scrollProgress * 5
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
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

// Nebula clouds for atmosphere
function NebulaClouds() {
  const meshRef = useRef()
  const mesh2Ref = useRef()
  
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    
    // Blue nebula
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
    gradient.addColorStop(0, 'rgba(100, 181, 246, 0.4)')
    gradient.addColorStop(0.4, 'rgba(41, 121, 255, 0.2)')
    gradient.addColorStop(1, 'rgba(26, 35, 126, 0)')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 512)
    
    return new THREE.CanvasTexture(canvas)
  }, [])
  
  const texture2 = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    
    // Cyan/purple nebula
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
    gradient.addColorStop(0, 'rgba(0, 229, 255, 0.3)')
    gradient.addColorStop(0.5, 'rgba(156, 39, 176, 0.15)')
    gradient.addColorStop(1, 'rgba(26, 35, 126, 0)')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 512)
    
    return new THREE.CanvasTexture(canvas)
  }, [])
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.008
    }
    if (mesh2Ref.current) {
      mesh2Ref.current.rotation.z = -state.clock.elapsedTime * 0.006
    }
  })
  
  return (
    <>
      <mesh ref={meshRef} position={[5, 3, -10]}>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={mesh2Ref} position={[-6, -3, -12]}>
        <planeGeometry args={[25, 25]} />
        <meshBasicMaterial
          map={texture2}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}

// Kali Linux logo with blue aura
function KaliLogoWithAura({ scrollProgress = 0 }) {
  const logoRef = useRef()
  const groupRef = useRef()
  const chakraRef = useRef()
  
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    return loader.load(KaliLogo)
  }, [])
  
  useFrame((state) => {
    if (!logoRef.current || !groupRef.current) return
    
    const t = state.clock.elapsedTime
    
    // Floating animation
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.1
    
    // Very slow rotation
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.08
    groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.03
    
    // Chakra spiral rotation - horizontal spinning
    if (chakraRef.current) {
      chakraRef.current.rotation.z = t * 0.5 // Horizontal spin like chakra
    }
    
    // Slight parallax - removed scroll movement for logo
    groupRef.current.position.z = 0
  })
  
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Chakra spiral - horizontal rotating energy rings */}
      <group ref={chakraRef} position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        {/* Outer chakra ring */}
        <mesh>
          <torusGeometry args={[3.5, 0.08, 16, 100]} />
          <meshBasicMaterial
            color="#00e5ff"
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        {/* Middle chakra ring */}
        <mesh>
          <torusGeometry args={[3.2, 0.05, 16, 100]} />
          <meshBasicMaterial
            color="#367BF0"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        {/* Inner chakra ring */}
        <mesh>
          <torusGeometry args={[2.8, 0.04, 16, 100]} />
          <meshBasicMaterial
            color="#64b5f6"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        {/* Chakra spokes */}
        {[...Array(8)].map((_, i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 8]}>
            <planeGeometry args={[3.2, 0.03]} />
            <meshBasicMaterial
              color="#00e5ff"
              transparent
              opacity={0.2}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
        
        {/* Spiral energy pattern */}
        <mesh rotation={[0, 0, 0]}>
          <ringGeometry args={[2.5, 2.7, 64]} />
          <meshBasicMaterial
            color="#1e88e5"
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
      
      {/* Outer large glow */}
      <mesh>
        <circleGeometry args={[4.5, 64]} />
        <meshBasicMaterial
          color="#0d47a1"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh>
        <circleGeometry args={[3.5, 64]} />
        <meshBasicMaterial
          color="#1565c0"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Middle glow - bright blue */}
      <mesh>
        <circleGeometry args={[2.5, 64]} />
        <meshBasicMaterial
          color="#1e88e5"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Inner glow */}
      <mesh>
        <circleGeometry args={[1.8, 64]} />
        <meshBasicMaterial
          color="#367BF0"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Core bright glow */}
      <mesh>
        <circleGeometry args={[1.3, 64]} />
        <meshBasicMaterial
          color="#64b5f6"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Radial burst */}
      <mesh rotation={[0, 0, 0]}>
        <ringGeometry args={[1.6, 2.4, 32]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Kali Logo - black silhouette */}
      <mesh ref={logoRef} position={[0, 0, 0.1]}>
        <planeGeometry args={[1.3, 1.3]} />
        <meshBasicMaterial
          map={texture}
          transparent
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

// Camera controller for scroll and drift
function CameraController({ scrollProgress }) {
  const { camera } = useThree()
  const targetZ = useRef(8)
  
  useFrame((state) => {
    const t = state.clock.elapsedTime
    
    // Slight drift movement
    const driftX = Math.sin(t * 0.1) * 0.15
    const driftY = Math.cos(t * 0.08) * 0.1
    
    // Scroll moves camera forward through galaxy
    targetZ.current = 8 - scrollProgress * 12
    
    camera.position.x = driftX
    camera.position.y = driftY
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, 0.02)
    
    camera.lookAt(0, 0, 0)
  })
  
  return null
}

// Main Galaxy Scene Component
function GalaxySceneContent({ scrollProgress = 0 }) {
  return (
    <>
      {/* Deep space background */}
      <color attach="background" args={['#020208']} />
      <fog attach="fog" args={['#020208', 8, 35]} />
      
      {/* Ambient space light */}
      <ambientLight intensity={0.08} color="#4488ff" />
      
      {/* Blue point light from galaxy center */}
      <pointLight position={[0, 0, 2]} color="#64b5f6" intensity={2} distance={20} />
      <pointLight position={[0, 0, -2]} color="#1e88e5" intensity={1} distance={15} />
      
      {/* Nebula clouds */}
      <NebulaClouds />
      
      {/* Main spiral galaxy */}
      <SpiralGalaxy scrollProgress={scrollProgress} />
      
      {/* Galactic core */}
      <GalacticCore />
      
      {/* Kali Logo in center */}
      <KaliLogoWithAura scrollProgress={scrollProgress} />
      
      {/* Camera controller */}
      <CameraController scrollProgress={scrollProgress} />
      
      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          height={300}
        />
      </EffectComposer>
    </>
  )
}

// Main exported component with Canvas
export default function GalaxyScene() {
  const [scrollProgress, setScrollProgress] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight
      const progress = Math.min(window.scrollY / maxScroll, 1)
      setScrollProgress(progress)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <GalaxySceneContent scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  )
}
