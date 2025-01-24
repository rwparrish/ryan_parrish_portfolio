import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Planet from './Planet'
import Universe from './Universe'
import { planetContainer } from './Planet/styles'
import { BridgeLayout } from './BridgeLayout'

export default function App() {
  const cameraPosition = useMemo(() => {
    const distance = 6;  // Increased from 4
    const angleInDegrees = 35;
    const angleInRadians = (angleInDegrees * Math.PI) / 180;
    
    return {
      x: distance * Math.sin(angleInRadians),
      y: distance * Math.sin(angleInRadians),
      z: distance * Math.cos(angleInRadians)
    };
  }, []);

  return (
    <BridgeLayout>
      <div style={planetContainer}>
        <Canvas camera={{ position: [cameraPosition.x, cameraPosition.y, cameraPosition.z], fov: 45 }}>
          <Universe />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 3, 5]} intensity={1} />
          <Planet />
          <OrbitControls 
            enableZoom={true}
            minDistance={3}    // Increased from 2
            maxDistance={8}    // Increased from 6
          />
        </Canvas>
      </div>
    </BridgeLayout>
  )
}
