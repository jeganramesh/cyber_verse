import { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import KaliLogo from "../assets/kalilinux-logo.svg"

// Center aligned - visible on screen
function KaliLogo3D({ scrollProgress = 0, position = [0, 0, 0] }) {
  const logoRef = useRef()

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const tex = loader.load(KaliLogo)
    tex.needsUpdate = true
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  useEffect(() => {
    if (logoRef.current) {
      logoRef.current.position.set(position[0], position[1], position[2])
    }
  }, [position])

  useFrame((state) => {
    if (!logoRef.current) return

    const t = state.clock.elapsedTime
    
    // Base position with gentle floating animation
    const baseX = position[0]
    const baseY = position[1] + Math.sin(t * 0.6) * 0.15
    const baseZ = position[2]
    
    // Apply scroll - move up and fade back slightly, but stay visible
    const scrollOffset = scrollProgress * 3
    
    logoRef.current.position.x = baseX
    logoRef.current.position.y = baseY + scrollOffset * 0.5
    logoRef.current.position.z = baseZ - scrollProgress * 0.5

    // Subtle rotation for depth
    logoRef.current.rotation.y = Math.sin(t * 0.3) * 0.1
    logoRef.current.rotation.z = Math.sin(t * 0.4) * 0.05
    
    // Scale down slightly as user scrolls to reveal content
    const scale = Math.max(0.6, 1 - scrollProgress * 0.3)
    logoRef.current.scale.setScalar(scale)
  })

  return (
    <group ref={logoRef} position={position}>

      {/* KALI LOGO - Main visible logo */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* CORE GLOW - Behind logo */}
      <mesh position={[0, 0, -0.1]}>
        <circleGeometry args={[2.2, 64]} />
        <meshBasicMaterial
          color="#3ba3ff"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* MIDDLE GLOW */}
      <mesh position={[0, 0, -0.2]}>
        <circleGeometry args={[2.8, 64]} />
        <meshBasicMaterial
          color="#1a6cff"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* OUTER GLOW */}
      <mesh position={[0, 0, -0.3]}>
        <circleGeometry args={[4, 64]} />
        <meshBasicMaterial
          color="#0d47a1"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* LARGE GALAXY HALO */}
      <mesh rotation={[0, 0, 0]} position={[0, 0, -0.4]}>
        <ringGeometry args={[4.5, 8, 64]} />
        <meshBasicMaterial
          color="#367BF0"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

    </group>
  )
}

export default KaliLogo3D