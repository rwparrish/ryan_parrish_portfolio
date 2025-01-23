export const planetMaterial = {
  uniforms: {
    uTime: { value: 0 }
  },
  vertexShader: `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying float vAtmosphere;
    varying vec3 vViewDir;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      vec4 viewPos = modelViewMatrix * vec4(position, 1.0);
      vec3 viewDir = normalize(-viewPos.xyz);
      vViewDir = viewDir;
      
      float fresnel = 1.0 - max(dot(vNormal, viewDir), 0.0);
      vAtmosphere = pow(fresnel, 2.0);
      
      gl_Position = projectionMatrix * viewPos;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying float vAtmosphere;
    varying vec3 vViewDir;

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      // Base planet color (darker blue)
      vec3 baseColor = vec3(0.1, 0.2, 0.4);
      
      // Atmosphere color (lighter blue)
      vec3 atmosphereColor = vec3(0.4, 0.6, 1.0);
      
      // Cloud color
      vec3 cloudColor = vec3(0.9, 0.9, 1.0);
      
      // Create moving cloud patterns using multiple noise layers
      float time = uTime * 0.1;
      vec2 uv = vUv;
      
      // Large cloud formations
      float clouds = snoise(vec2(uv.x * 4.0 + time * 0.2, uv.y * 4.0)) * 0.5;
      clouds += snoise(vec2(uv.x * 8.0 - time * 0.1, uv.y * 8.0)) * 0.25;
      clouds += snoise(vec2(uv.x * 16.0 + time * 0.05, uv.y * 16.0)) * 0.125;
      clouds = smoothstep(0.1, 0.6, clouds);
      
      // Add swirling motion to the clouds
      float swirl = snoise(vec2(
        uv.x * 2.0 + time * 0.3 + clouds * 0.2,
        uv.y * 2.0 + time * 0.2
      )) * 0.3;
      clouds += swirl;
      
      // Mix colors based on cloud coverage and atmosphere
      vec3 cloudMix = mix(atmosphereColor, cloudColor, clouds * 0.6);
      vec3 finalColor = mix(baseColor, cloudMix, 0.8);
      
      // Add rim lighting effect
      finalColor = mix(finalColor, atmosphereColor, vAtmosphere * 0.4);
      
      // Add some depth to the atmosphere
      float depth = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 1.5);
      finalColor = mix(finalColor, atmosphereColor * 1.2, depth * 0.3);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
}
