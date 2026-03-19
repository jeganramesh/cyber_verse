import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Optimized mouse tracking
function useMousePosition() {
  const mouseRef = useRef({ x: 0, y: 0 })
  
  useEffect(() => {
    let ticking = false
    
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
      
      if (!ticking) {
        requestAnimationFrame(() => {
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  return mouseRef
}

// Camera that responds to mouse
function CameraController({ mouseRef }) {
  const { camera } = useThree()
  
  useFrame(() => {
    camera.position.x += (mouseRef.current.x * 0.1 - camera.position.x) * 0.02
    camera.position.y += (mouseRef.current.y * 0.08 - camera.position.y) * 0.02
    camera.lookAt(0, 0, 0)
  })
  
  return null
}

// Optimized Stars with better performance
function Stars({ count = 2500 }) {
  const ref = useRef()
  const mouseRef = useMousePosition()
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return positions
  }, [count])

  const starColors = useMemo(() => {
    const colors = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const colorChoice = Math.random()
      if (colorChoice > 0.9) {
        colors[i * 3] = 0.8 + Math.random() * 0.2
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1
        colors[i * 3 + 2] = 1.0
      } else if (colorChoice > 0.8) {
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1
        colors[i * 3 + 2] = 0.7 + Math.random() * 0.2
      } else {
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 1.0
        colors[i * 3 + 2] = 1.0
      }
    }
    return colors
  }, [count])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.008
      ref.current.rotation.x = state.clock.elapsedTime * 0.004
      
      // Subtle mouse parallax
      ref.current.position.x = mouseRef.current.x * 0.1
      ref.current.position.y = mouseRef.current.y * 0.1
    }
  })

  return (
    <group ref={ref} rotation={[0, 0, Math.PI / 4]}>
      <points>
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
            array={starColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          transparent
          vertexColors
          size={0.006}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.85}
        />
      </points>
    </group>
  )
}

// Twinkling stars overlay
function TwinklingStars({ count = 500 }) {
  const ref = useRef()
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3] = (Math.random() - 0.5) * 8
      pos[i3 + 1] = (Math.random() - 0.5) * 8
      pos[i3 + 2] = -1 - Math.random() * 3
      
      // Brighter colors
      cols[i3] = 0.9 + Math.random() * 0.1
      cols[i3 + 1] = 0.95
      cols[i3 + 2] = 1.0
    }
    
    return [pos, cols]
  }, [count])
  
  useFrame((state) => {
    if (ref.current) {
      // Very slow drift
      ref.current.rotation.z = state.clock.elapsedTime * 0.002
    }
  })
  
  return (
    <points ref={ref}>
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
        size={0.015}
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

// Optimized main component
function GalaxyBackground() {
  const mouseRef = useMousePosition()
  
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 1.5], fov: 75 }}
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#030308']} />
        
        <CameraController mouseRef={mouseRef} />
        
        <Stars count={2500} />
        <TwinklingStars count={400} />
        
        <fog attach="fog" args={['#030308', 0.8, 4]} />
      </Canvas>
      
      {/* Gradient overlay for depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(3, 3, 8, 0.3) 50%, rgba(3, 3, 8, 0.8) 100%)',
        }}
      />
    </div>
  )
}

export default GalaxyBackground
