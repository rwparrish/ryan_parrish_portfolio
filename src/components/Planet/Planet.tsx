import { useRef, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, Matrix4, CatmullRomCurve3 } from 'three'
import { planetMaterial } from './shaders'
import { useNavigate } from 'react-router-dom'
import { Html } from '@react-three/drei'
import * as THREE from 'three';

const dotData = [
  {
    position: [1, 0, 0],
    label: "About",
    description: "Learn more about me and my journey",
    path: "/about"
  },
  {
    position: [-0.5, 0, 0.866],
    label: "Make First Contact",
    description: "Get in touch and start a conversation",
    path: "/contact"
  },
  {
    position: [-0.5, 0, -0.866],
    label: "Projects",
    description: "Explore my portfolio of work",
    path: "/projects"
  }
];

const GLOW_COLOR = "#ffff00";  // Yellow for dots and trails
const TERMINAL_COLOR = "#00ff88";  // Original green for terminal

const Terminal = ({ label, description }) => (
  <div style={{
    background: 'rgba(0, 8, 20, 0.9)',
    border: `2px solid ${TERMINAL_COLOR}`,
    boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',  // Reverted to original green glow
    padding: '23px',
    borderRadius: '9px',
    color: TERMINAL_COLOR,  // Reverted to original green
    width: '345px',
    fontFamily: '"Share Tech Mono", monospace',
    position: 'relative',
  }}>
    <div style={{
      position: 'absolute',
      top: '-14px',
      left: '23px',
      background: 'rgba(0, 8, 20, 0.9)',
      padding: '0 12px',
      color: TERMINAL_COLOR,
      fontSize: '16px',
    }}>
      [TERMINAL_ACCESS]
    </div>
    <h3 style={{
      margin: '0 0 12px 0',
      fontSize: '28px',
      borderBottom: '1px solid #ffff0055',
      paddingBottom: '9px',
    }}>
      {'> '}{label}
    </h3>
    <p style={{
      margin: 0,
      fontSize: '18px',
      lineHeight: '1.4',
      opacity: '0.9',
    }}>
      {'>> '}{description}
    </p>
    <div style={{
      marginTop: '17px',
      fontSize: '16px',
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

const Planet = () => {
  const meshRef = useRef<Mesh>(null)
  const groupRef = useRef();  // New ref for the entire planet group
  const navigate = useNavigate();
  const radius = 1.15;
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);
  const [selectedDot, setSelectedDot] = useState<number | null>(null);
  const { camera } = useThree();
  const dotRefs = useRef(dotData.map(() => new Vector3()));

  // Add rotation animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Slow rotation - adjust the multiplier (0.1) to change speed
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  useFrame(() => {
    dotData.forEach((dot, index) => {
      const worldPos = dotRefs.current[index];
      const x = dot.position[0] * radius;
      const y = dot.position[1] * radius;
      const z = dot.position[2] * radius;
      
      worldPos.set(x, y, z);
      meshRef.current.localToWorld(worldPos);

      const dotToCam = new Vector3().subVectors(camera.position, worldPos);
      const dotNormal = worldPos.clone().normalize();
      const dotProduct = dotToCam.dot(dotNormal);

      if (dotProduct < 0 && hoveredDot === index) {
        setHoveredDot(null);
      }
    });
  })

  const handleDotClick = (index: number) => {
    setSelectedDot(index);
    setTimeout(() => {
      navigate(dotData[index].path);
    }, 1000);
  };

  return (
    <>
      <GalaxyBackground />
      <group ref={groupRef}>  {/* Add ref to the main group */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[radius, 256, 256]} />
          <shaderMaterial {...planetMaterial} />
        </mesh>
        
        {/* Connect all dots with trails */}
        {dotData.map((start, i) => {
          const nextIndex = (i + 1) % dotData.length;
          return (
            <SpaceshipTrail 
              key={i}
              startPos={start.position}
              endPos={dotData[nextIndex].position}
              radius={radius}
            />
          );
        })}
        
        {dotData.map((dot, index) => {
          const pos = [
            dot.position[0] * radius,
            dot.position[1] * radius,
            dot.position[2] * radius
          ];
          
          return (
            <group key={index} position={pos}>
              {/* Glow effect */}
              <mesh visible={hoveredDot === index}>
                <sphereGeometry args={[0.08, 32, 32]} />
                <meshBasicMaterial 
                  color={GLOW_COLOR} 
                  transparent 
                  opacity={0.3} 
                />
              </mesh>
              
              {/* Main dot */}
              <mesh
                onPointerOver={() => setHoveredDot(index)}
                onPointerOut={() => setHoveredDot(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDotClick(index);
                }}
              >
                <sphereGeometry args={[0.05, 32, 32]} />
                <meshBasicMaterial color={GLOW_COLOR} />
              </mesh>

              {/* Terminal Popup - only show if dot is facing camera */}
              {(hoveredDot === index || selectedDot === index) && (
                <Html
                  position={[0, 0.2, 0]}
                  center
                  style={{
                    transform: 'scale(0.8)',
                    pointerEvents: 'none',
                  }}
                  occlude={[meshRef]}
                >
                  <Terminal label={dot.label} description={dot.description} />
                </Html>
              )}
            </group>
          );
        })}
      </group>
    </>
  )
}

export default Planet