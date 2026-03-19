import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

function GalaxySwirl() {
  const mesh = useRef()
  
  // Create procedural galaxy texture using canvas
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    const ctx = canvas.getContext('2d')
    
    // Dark background
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, 1024, 1024)
    
    // Draw spiral galaxy
    const centerX = 512
    const centerY = 512
    
    // Draw multiple spiral arms
    for (let arm = 0; arm < 4; arm++) {
      const armAngle = (arm * Math.PI * 2) / 4
      
      for (let i = 0; i < 800; i++) {
        const t = i / 800
        const angle = armAngle + t * 6 // Spiral tightness
        const radius = t * 300 // Max radius
        
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        
        // Random spread
        const spread = (1 - t) * 30
        const offsetX = (Math.random() - 0.5) * spread
        const offsetY = (Math.random() - 0.5) * spread
        
        // Star color - blue/purple gradient
        const brightness = Math.random()
        const r = Math.floor(30 + brightness * 40)
        const g = Math.floor(20 + brightness * 80)
        const b = Math.floor(80 + brightness * 175)
        
        const alpha = (0.3 + Math.random() * 0.7) * (1 - t * 0.5)
        const size = 1 + Math.random() * 2
        
        ctx.beginPath()
        ctx.arc(x + offsetX, y + offsetY, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        ctx.fill()
      }
    }
    
    // Add bright core
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100)
    gradient.addColorStop(0, 'rgba(100, 150, 255, 0.8)')
    gradient.addColorStop(0.3, 'rgba(50, 100, 200, 0.4)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1024, 1024)
    
    const tex = new THREE.CanvasTexture(canvas)
    return tex
  }, [])

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.z += 0.0004
    }
  })

  return (
    <mesh ref={mesh} position={[0, 0, -2]}>
      <planeGeometry args={[40, 40]} />
      <meshBasicMaterial
        map={texture}
        transparent
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export default GalaxySwirl
