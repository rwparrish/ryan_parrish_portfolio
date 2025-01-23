import { useRef, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Mesh, Vector3, InstancedMesh, Matrix4, CatmullRomCurve3, BoxGeometry } from 'three'
import { planetMaterial } from './shaders'
import { useNavigate } from 'react-router-dom'
import { Html } from '@react-three/drei'

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

const Terminal = ({ label, description }) => (
  <div style={{
    background: 'rgba(0, 8, 20, 0.9)',
    border: '2px solid #00ff88',
    boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
    padding: '23px',
    borderRadius: '9px',
    color: '#00ff88',
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
      color: '#00ff88',
      fontSize: '16px',
    }}>
      [TERMINAL_ACCESS]
    </div>
    <h3 style={{
      margin: '0 0 12px 0',
      fontSize: '28px',
      borderBottom: '1px solid #00ff8855',
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

const SpaceshipTrail = ({ startPos, endPos, radius }) => {
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
      {/* Rectangular ship shape */}
      <boxGeometry args={[0.02, 0.005, 0.01]} /> {/* width, height, depth */}
      <meshBasicMaterial 
        color="#00ff88" 
        transparent 
        opacity={0.8}
        toneMapped={false} // Makes the color more vibrant
      />
    </instancedMesh>
  );
};

const Planet = () => {
  const meshRef = useRef<Mesh>(null)
  const navigate = useNavigate();
  const radius = 1.15;
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);
  const [selectedDot, setSelectedDot] = useState<number | null>(null);
  const { camera } = useThree();
  const dotRefs = useRef(dotData.map(() => new Vector3()));

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
    <group>
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
              <meshBasicMaterial color="#00ff88" transparent opacity={0.3} />
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
              <meshBasicMaterial color="#00ff88" />
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
  )
}

export default Planet