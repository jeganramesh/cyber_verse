import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function Stars({ count = 2000, scrollY = 0 }) {
  const ref = useRef()
  
  // Generate star positions - random spread across 3D space (not centralized)
  const positions = useMemo(() => {
    console.log('[Stars] Generating positions for count:', count)
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Random positions in a large 3D box, centered around origin
      // Using larger spread for more natural look
      positions[i * 3] = (Math.random() - 0.5) * 6  // x: -3 to 3
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6  // y: -3 to 3
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4  // z: -2 to 2 (shallower depth)
    }
    console.log('[Stars] Positions generated, sample:', positions[0], positions[1], positions[2])
    return positions
  }, [count])

  // Generate star colors
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
      ref.current.rotation.y = state.clock.elapsedTime * 0.01
      ref.current.rotation.x = state.clock.elapsedTime * 0.005
      ref.current.position.y = scrollY * 0.0001
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} colors={starColors} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={0.008}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.9}
        />
      </Points>
    </group>
  )
}

function GalaxyBackground() {
  const scrollY = typeof window !== 'undefined' ? window.scrollY : 0
  
  // Debug: Log when component renders
  console.log('[GalaxyBackground] Rendering with scrollY:', scrollY)
  
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Full screen canvas */}
      <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
        <color attach="background" args={['#050505']} />
        <Stars count={3000} scrollY={scrollY} />
        <fog attach="fog" args={['#050505', 0.5, 3]} />
      </Canvas>
    </div>
  )
}

export default GalaxyBackground
