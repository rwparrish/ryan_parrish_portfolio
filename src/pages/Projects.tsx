import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Planet from '../components/Planet'

export default function Projects() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#000',
      color: '#00ff88'
    }}>
      <h1>Projects</h1>
      <p>Explore my portfolio of work.</p>
      
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        cursor: 'pointer'
      }}>
        <a href="/" style={{ color: '#00ff88', textDecoration: 'none' }}>← Return to Home</a>
      </div>
    </div>
  )
}
