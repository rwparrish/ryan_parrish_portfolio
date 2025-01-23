import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Planet from './components/Planet'
import { planetContainer } from './components/Planet/styles'

export default function App() {
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
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 3, 5]} intensity={1} />
          <Planet />
          <OrbitControls 
            enableZoom={true}
            minDistance={2}
            maxDistance={6}
          />
        </Canvas>
      </div>
    </div>
  )
}
