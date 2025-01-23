import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useRef } from 'react'

export default function Planet() {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  
  // Create a noise texture for terrain
  const noiseTexture = new THREE.TextureLoader().load('/noise.png', (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  })

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4169e1" />
        <mesh>
          <sphereGeometry args={[2, 64, 64]} /> {/* Increased segments for smoother surface */}
          <meshStandardMaterial
            ref={materialRef}
            color="#1e4877"  // Deep blue base color
            metalness={0.2}
            roughness={0.8}
            displacementMap={noiseTexture}
            displacementScale={0.2}
            bumpMap={noiseTexture}
            bumpScale={0.1}
            emissive="#4169e1"
            emissiveIntensity={0.1}
          />
        </mesh>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  )
}
