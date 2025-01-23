export const planetMaterial = {
  uniforms: {
    uTime: { value: 0 }
  },
  vertexShader: `
    uniform float uTime;
    varying vec3 vNormal;
    varying float vAtmosphere;
    varying vec3 vViewDir;
    varying vec3 vWorldPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      
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
    varying vec3 vNormal;
    varying float vAtmosphere;
    varying vec3 vViewDir;
    varying vec3 vWorldPosition;

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

    float triplanarNoise(vec3 p, float scale, float speed) {
      vec3 norm = normalize(vNormal);
      norm = abs(norm);
      norm = norm / (norm.x + norm.y + norm.z);
      
      float time = uTime * speed * 0.25;
      
      // Sample noise for each axis projection
      float noiseXY = snoise(p.xy * scale + vec2(time));
      float noiseXZ = snoise(p.xz * scale + vec2(time * 1.1));
      float noiseYZ = snoise(p.yz * scale + vec2(time * 0.9));
      
      return noiseXY * norm.z + noiseXZ * norm.y + noiseYZ * norm.x;
    }

    float landNoise(vec3 p, float scale) {
      vec3 norm = normalize(vNormal);
      norm = abs(norm);
      norm = norm / (norm.x + norm.y + norm.z);
      
      float noiseXY = snoise(p.xy * scale);
      float noiseXZ = snoise(p.xz * scale);
      float noiseYZ = snoise(p.yz * scale);
      
      return noiseXY * norm.z + noiseXZ * norm.y + noiseYZ * norm.x;
    }

    float ridgedNoise(vec2 p) {
      return 1.0 - abs(snoise(p));
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      for (int i = 0; i < 5; i++) {
        value += amplitude * snoise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    float randomLight(vec2 uv) {
      return fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }

    // float continent(vec3 p, vec3 center, float scale, float threshold) {
    //   vec3 relative = normalize(p - center);
    //   vec2 coords = vec2(
    //     atan(relative.z, relative.x),
    //     acos(relative.y)
    //   ) * scale;
      
    //   float shape = fbm(coords);
    //   shape = smoothstep(threshold - 0.2, threshold + 0.2, shape);
      
    //   float d = distance(p, center);
    //   shape *= smoothstep(1.0, 0.5, d);
      
    //   return shape;
    // }

    void main() {
      vec3 deepOceanColor = vec3(0.05, 0.12, 0.3);
      vec3 oceanColor = vec3(0.1, 0.15, 0.35);
      vec3 atmosphereColor = vec3(0.4, 0.6, 1.0);
      vec3 cloudColor = vec3(0.95, 0.95, 1.0);
      
      vec3 p = normalize(vWorldPosition);
      float time = uTime * 0.035;

      // Base ocean color
      vec3 baseColor = mix(deepOceanColor, oceanColor, 0.5);

      // Light direction from the left
      vec3 lightDir = normalize(vec3(-1.0, 0.0, 0.0));
      float lightIntensity = max(dot(normalize(vNormal), lightDir), 0.0);

      // Apply lighting to the base color
      baseColor *= lightIntensity;

      // Cloud layers
      float clouds = triplanarNoise(p, 2.0, 0.16) * 0.5;
      clouds += triplanarNoise(p, 4.0, -0.09) * 0.25;
      clouds += triplanarNoise(p, 8.0, 0.03) * 0.125;
      
      clouds = smoothstep(0.1, 0.6, clouds + 0.2);
      float swirl = triplanarNoise(p + clouds * 0.1, 1.0, 0.24) * 0.3;
      clouds += swirl;
      clouds = clamp(clouds, 0.0, 1.0);

      vec3 cloudMix = mix(baseColor, cloudColor, clouds * 0.7);
      vec3 finalColor = mix(baseColor, cloudMix, 0.6);

      finalColor = mix(finalColor, atmosphereColor, vAtmosphere * 0.3);
      float depth = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 1.5);
      finalColor = mix(finalColor, atmosphereColor * 1.2, depth * 0.25);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
}
