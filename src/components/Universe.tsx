import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';


const starfieldShader = {
  vertexShader: `
    varying vec3 vPos;
    
    void main() {
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vPos;
    uniform float uTime;
    
    float random(vec3 pos) {
      return fract(sin(dot(pos.xyz, vec3(70.9898, 78.233, 32.4355))) * 43758.5453123);
    }
    
    float noise(vec3 pos) {
      vec3 i = floor(pos);
      vec3 f = fract(pos);
      f = f * f * (3.0 - 2.0 * f);
      
      float a = random(i);
      float b = random(i + vec3(1.0, 0.0, 0.0));
      float c = random(i + vec3(0.0, 1.0, 0.0));
      float d = random(i + vec3(1.0, 1.0, 0.0));
      float e = random(i + vec3(0.0, 0.0, 1.0));
      float f1 = random(i + vec3(1.0, 0.0, 1.0));
      float g = random(i + vec3(0.0, 1.0, 1.0));
      float h = random(i + vec3(1.0, 1.0, 1.0));
      
      return mix(
        mix(
          mix(a, b, f.x),
          mix(c, d, f.x),
          f.y),
        mix(
          mix(e, f1, f.x),
          mix(g, h, f.x),
          f.y),
        f.z);
    }
    
    void main() {
      // Fixed star positions relative to view
      vec3 starPos = normalize(vPos) * 100.0;
      
      // Multiple layers of stars
      float stars = 0.0;
      
      // Layer 1: Large, bright stars
      float n1 = noise(starPos * 2.0);
      stars += step(0.97, n1) * 1.0;
      
      // Layer 2: Medium stars
      float n2 = noise(starPos * 4.0 + 123.456);
      stars += step(0.98, n2) * 0.8;
      
      // Layer 3: Small stars
      float n3 = noise(starPos * 8.0 + 789.012);
      stars += step(0.99, n3) * 0.6;
      
      // Twinkling effect
      float twinkle = sin(uTime + n1 * 10.0) * 0.5 + 0.5;
      stars *= 0.8 + 0.2 * twinkle;
      
      // Nebula
      vec3 nebPos = normalize(vPos) * 5.0 + vec3(uTime * 0.02);
      float neb = noise(nebPos);
      neb += noise(nebPos * 2.0) * 0.5;
      neb = smoothstep(0.3, 0.7, neb);
      
      // Colors
      vec3 starColor = vec3(1.0, 0.95, 0.8); // Warm white
      vec3 nebulaColor = mix(
        vec3(0.1, 0.2, 0.5),   // Dark blue
        vec3(0.5, 0.2, 0.5),   // Purple
        neb
      );
      
      // Combine with higher star brightness
      vec3 finalColor = starColor * stars * 3.0 + nebulaColor * 0.15;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

export default function Universe() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <>
      <mesh>
        <sphereGeometry args={[100, 64, 64]} />
        <shaderMaterial
          ref={materialRef}
          side={THREE.BackSide}
          uniforms={{
            uTime: { value: 0 }
          }}
          vertexShader={starfieldShader.vertexShader}
          fragmentShader={starfieldShader.fragmentShader}
          transparent={true}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
