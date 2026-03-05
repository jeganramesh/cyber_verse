import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import KaliLogo from "../assets/kalilinux-logo.svg"

// Right aligned - position changed to [5.5, 0, 2]
function KaliLogo3D({ scrollProgress = 0, position = [5.5, 0, 2] }) {
  const logoRef = useRef()

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const tex = loader.load(KaliLogo)
    tex.needsUpdate = true
    return tex
  }, [])

  useFrame((state) => {
    if (!logoRef.current) return

    const t = state.clock.elapsedTime

    logoRef.current.position.x = position[0]
    logoRef.current.position.y = position[1] + Math.sin(t * 0.6) * 0.15
    logoRef.current.position.z = position[2] - scrollProgress * 2

    // Subtle rotation
    logoRef.current.rotation.y = Math.sin(t * 0.3) * 0.1
    logoRef.current.rotation.z = Math.sin(t * 0.4) * 0.05
  })

  return (
    <group ref={logoRef} position={position}>

      {/* CORE GLOW */}
      <mesh>
        <circleGeometry args={[1.8, 64]} />
        <meshBasicMaterial
          color="#3ba3ff"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* OUTER GLOW */}
      <mesh>
        <circleGeometry args={[3.5, 64]} />
        <meshBasicMaterial
          color="#1a6cff"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* LARGE GALAXY HALO */}
      <mesh rotation={[0, 0, 0]}>
        <ringGeometry args={[4, 7, 64]} />
        <meshBasicMaterial
          color="#367BF0"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* KALI LOGO */}
      <mesh position={[0, 0, 0.2]}>
        <planeGeometry args={[1.4, 1.4]} />
        <meshBasicMaterial
          map={texture}
          transparent
        />
      </mesh>

    </group>
  )
}

export default KaliLogo3D