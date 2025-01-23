import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Planet from './components/Planet'
import Universe from './components/Universe'
import { planetContainer } from './components/Planet/styles'

export default function App() {
  // Calculate initial camera position
  const distance = 6;  // Increased from 4
  const angleInDegrees = 35;
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  
  const x = distance * Math.sin(angleInRadians);
  const y = distance * Math.sin(angleInRadians);
  const z = distance * Math.cos(angleInRadians);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#000'
    }}>
      <div style={planetContainer}>
        <Canvas camera={{ position: [x, y, z], fov: 45 }}>
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
    </div>
  )
}
