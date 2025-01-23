import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import { planetMaterial } from './shaders'

export default function Planet() {
  const meshRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value += delta
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.15, 256, 256]} />
      <shaderMaterial {...planetMaterial} />
    </mesh>
  )
}
