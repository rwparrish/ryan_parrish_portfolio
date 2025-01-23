import { useRef, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, Matrix4, CatmullRomCurve3, Mesh } from 'three'
import { planetMaterial } from './shaders'
import { useNavigate } from 'react-router-dom'
import { Html } from '@react-three/drei'
import * as THREE from 'three';

interface MoonData {
  position: [number, number, number];
  label: string;
  description: string;
  path: string;
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
}

const moonData: MoonData[] = [
  {
    position: [1, 0, 0],
    label: "About",
    description: "Learn more about me and my journey",
    path: "/about",
    orbitRadius: 2,
    orbitSpeed: .2,
    size: 0.15
  },
  {
    position: [-0.5, 0, 0.866],
    label: "Make First Contact",
    description: "Get in touch and start a conversation",
    path: "/contact",
    orbitRadius: 2.5,
    orbitSpeed: 0.035,
    size: 0.12
  },
  {
    position: [-0.5, 0, -0.866],
    label: "Projects",
    description: "Explore my portfolio of work",
    path: "/projects",
    orbitRadius: 3,
    orbitSpeed: 0.025,
    size: 0.18
  }
];

const COLORS = {
  glow: "#ffff00",
  terminal: "#00ff88",
  terminalBg: 'rgba(0, 8, 20, 0.9)',
  moonBase: "#888888",
  moonHighlight: "#ffffff",
} as const;

interface MoonProps {
  data: MoonData;
  isSelected: boolean;
  onClick: () => void;
  time: number;
}

const Moon = ({ data, isSelected, onClick, time }: MoonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { orbitRadius, orbitSpeed, size } = data;
  
  const angle = time * orbitSpeed;
  const x = Math.cos(angle) * orbitRadius;
  const z = Math.sin(angle) * orbitRadius;
  const position: [number, number, number] = [x, 0, z];

  return (
    <group position={position}>
      <mesh 
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setIsHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setIsHovered(false);
        }}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={isSelected || isHovered ? COLORS.glow : COLORS.moonBase}
          emissive={isSelected || isHovered ? COLORS.glow : COLORS.moonBase}
          emissiveIntensity={isSelected ? 0.5 : isHovered ? 0.3 : 0.1}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      {(isSelected || isHovered) && (
        <Html
          center
          style={{
            pointerEvents: 'none',
            transform: 'translateZ(0)',
          }}
          distanceFactor={2}
          zIndexRange={[100, 0]}
        >
          <Terminal label={data.label} description={data.description} />
        </Html>
      )}
    </group>
  );
};

const GLOW_COLOR = "#ffff00";  // Yellow for dots and trails
const TERMINAL_COLOR = "#00ff88";  // Original green for terminal

const Terminal = ({ label, description }) => (
  <div style={{
    background: COLORS.terminalBg,
    border: `2px solid ${COLORS.terminal}`,
    boxShadow: `0 0 20px rgba(0, 255, 136, 0.3)`,
    padding: '23px',
    borderRadius: '9px',
    color: COLORS.terminal,
    width: '450px',
    fontFamily: '"Share Tech Mono", monospace',
    position: 'relative',
    pointerEvents: 'none',
    userSelect: 'none',
  }}>
    <div style={{
      position: 'absolute',
      top: '-14px',
      left: '23px',
      background: COLORS.terminalBg,
      padding: '0 12px',
      color: COLORS.terminal,
      fontSize: '18px',
    }}>
      [TERMINAL_ACCESS]
    </div>
    <h3 style={{
      margin: '0 0 12px 0',
      fontSize: '32px',
      borderBottom: '1px solid #ffff0055',
      paddingBottom: '9px',
    }}>
      {'> '}{label}
    </h3>
    <p style={{
      margin: 0,
      fontSize: '22px',
      lineHeight: '1.4',
      opacity: '0.9',
    }}>
      {'>> '}{description}
    </p>
    <div style={{
      marginTop: '20px',
      fontSize: '18px',
      opacity: '0.7',
    }}>
      [CLICK TO PROCEED]
    </div>
  </div>
);

const SpaceshipTrail = ({ startPos, endPos, radius, reverse = false }) => {
  const instancedMeshRef = useRef();
  const numShips = 20;
  const shipHeight = radius * 0.03; // Distance from planet surface

  const curve = useMemo(() => {
    const start = new Vector3(...startPos).normalize();
    const end = new Vector3(...endPos).normalize();
    
    // Create points for a more precise surface-following curve
    const points = [];
    const segments = 50;
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      // Spherical interpolation to maintain constant radius
      const point = new Vector3().copy(start).lerp(end, t).normalize();
      point.multiplyScalar(radius + shipHeight); // Constant distance from surface
      points.push(point);
    }
    
    return new CatmullRomCurve3(points, false);
  }, [startPos, endPos, radius, shipHeight]);

  useFrame(({ clock }) => {
    if (!instancedMeshRef.current) return;

    const time = clock.getElapsedTime();
    const matrix = new Matrix4();
    const tempVec = new Vector3();

    for (let i = 0; i < numShips; i++) {
      const t = (time * 0.15 + i / numShips) % 1; // Slowed down speed
      const position = curve.getPoint(t);
      
      // Calculate orientation to align with planet surface
      const tangent = curve.getTangent(t);
      const normal = position.clone().normalize();
      const binormal = new Vector3().crossVectors(tangent, normal).normalize();
      const correctedTangent = new Vector3().crossVectors(normal, binormal);

      // Create orientation matrix
      matrix.makeBasis(correctedTangent, normal, binormal);
      matrix.setPosition(position);
      
      // Apply slight oscillation to y-axis for more dynamic movement
      const oscillation = Math.sin(time * 5 + i) * 0.0002;
      tempVec.copy(position).add(normal.multiplyScalar(oscillation));
      matrix.setPosition(tempVec);

      instancedMeshRef.current.setMatrixAt(i, matrix);
    }
    
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={instancedMeshRef} args={[null, null, numShips]}>
      <boxGeometry args={[0.02, 0.005, 0.01]} />
      <meshBasicMaterial 
        color={reverse ? "#ffd700" : GLOW_COLOR} // Gold for reverse, yellow for forward
        transparent 
        opacity={0.8}
        toneMapped={false}
      />
    </instancedMesh>
  );
};

const GalaxyBackground = () => {
  const starsCount = 2000;
  const positions = useMemo(() => {
    const pos = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount; i++) {
      const radius = Math.random() * 50 + 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      
      const spiralOffset = (radius / 50) * Math.PI * 2;
      const finalTheta = theta + spiralOffset;
      
      pos[i * 3] = radius * Math.cos(finalTheta) * Math.sin(phi);
      pos[i * 3 + 1] = (radius * 0.3) * Math.sin(finalTheta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, []);

  const starColors = useMemo(() => {
    const colors = new Float32Array(starsCount * 3);
    const baseColors = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#fffcdb'),
      new THREE.Color('#fff4b5'),
      new THREE.Color('#ffdede'),
    ];
    
    for (let i = 0; i < starsCount; i++) {
      const color = baseColors[Math.floor(Math.random() * baseColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return colors;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={starColors.length / 3}
          array={starColors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default function Planet() {
  const meshRef = useRef<Mesh>();
  const [selectedMoon, setSelectedMoon] = useState<number | null>(null);
  const [time, setTime] = useState(0);
  const navigate = useNavigate();
  const { camera } = useThree();

  useFrame(({ clock }) => {
    if (meshRef.current?.material) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = clock.getElapsedTime();
      setTime(clock.getElapsedTime());
    }
  });

  const handleMoonClick = (index: number) => {
    setSelectedMoon(index);
    setTimeout(() => {
      navigate(moonData[index].path);
    }, 1000);
  };

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial {...planetMaterial} />
      </mesh>

      {/* Orbit rings */}
      {moonData.map((moon, index) => (
        <mesh key={`orbit-${index}`} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[moon.orbitRadius - 0.01, moon.orbitRadius + 0.01, 64]} />
          <meshBasicMaterial
            color={selectedMoon === index ? COLORS.glow : "#444444"}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Moons */}
      {moonData.map((moon, index) => (
        <Moon
          key={`moon-${index}`}
          data={moon}
          isSelected={selectedMoon === index}
          onClick={() => handleMoonClick(index)}
          time={time}
        />
      ))}
    </group>
  );
}
