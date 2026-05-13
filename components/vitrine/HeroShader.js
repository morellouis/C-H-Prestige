'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Shader custom : surface dorée fluide qui réagit à la souris.
 * - Noise multi-octave pour la déformation
 * - Mélange entre noir profond et tons dorés
 * - Specular subtil pour donner un effet "liquide"
 */
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;

  // Noise par Inigo Quilez
  vec3 hash3(vec2 p) {
    vec3 q = vec3(dot(p, vec2(127.1, 311.7)),
                  dot(p, vec2(269.5, 183.3)),
                  dot(p, vec2(419.2, 371.9)));
    return fract(sin(q) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(hash3(i + vec2(0.0, 0.0)).xy - 0.5, f - vec2(0.0, 0.0)),
                   dot(hash3(i + vec2(1.0, 0.0)).xy - 0.5, f - vec2(1.0, 0.0)), u.x),
               mix(dot(hash3(i + vec2(0.0, 1.0)).xy - 0.5, f - vec2(0.0, 1.0)),
                   dot(hash3(i + vec2(1.0, 1.0)).xy - 0.5, f - vec2(1.0, 1.0)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv * 3.0;

    // Influence souris
    vec2 mouseInfluence = (uMouse - 0.5) * 0.6;
    p += mouseInfluence;

    // Déformation animée
    float t = uTime * 0.15;
    vec2 q = vec2(fbm(p + t), fbm(p - t + 5.2));
    vec2 r = vec2(fbm(p + q + vec2(1.7, 9.2) + t * 0.5),
                  fbm(p + q + vec2(8.3, 2.8) - t * 0.5));
    float f = fbm(p + 2.0 * r);

    // Palette moderne : noir profond → violet sombre → violet électrique → lavande lumineuse
    vec3 noir = vec3(0.02, 0.02, 0.04);
    vec3 violetSombre = vec3(0.12, 0.05, 0.22);
    vec3 violetElec = vec3(0.49, 0.23, 0.93);   // #7c3aed
    vec3 lavande = vec3(0.78, 0.71, 0.98);      // #c4b5fd

    vec3 col = noir;
    col = mix(col, violetSombre, smoothstep(0.0, 0.4, f));
    col = mix(col, violetElec, smoothstep(0.3, 0.7, f));
    col = mix(col, lavande, smoothstep(0.6, 0.95, f) * length(q));

    // Vignette
    float vig = 1.0 - smoothstep(0.4, 1.0, length(uv - 0.5));
    col *= mix(0.5, 1.0, vig);

    // Grain léger
    float grain = (hash3(uv * uResolution + uTime).x - 0.5) * 0.04;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
  }
`

function ShaderPlane() {
  const meshRef = useRef()
  const { viewport, size } = useThree()
  const mouse = useRef({ x: 0.5, y: 0.5 })
  const targetMouse = useRef({ x: 0.5, y: 0.5 })

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
  }), [])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    // Lissage de la souris
    mouse.current.x += (targetMouse.current.x - mouse.current.x) * 0.05
    mouse.current.y += (targetMouse.current.y - mouse.current.y) * 0.05
    uniforms.uTime.value += delta
    uniforms.uMouse.value.set(mouse.current.x, mouse.current.y)
    uniforms.uResolution.value.set(size.width, size.height)
  })

  // Écoute du mouvement souris
  useMemo(() => {
    if (typeof window === 'undefined') return
    const onMove = (e) => {
      targetMouse.current.x = e.clientX / window.innerWidth
      targetMouse.current.y = 1 - (e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}

export default function HeroShader() {
  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 2]}
      camera={{ position: [0, 0, 1], fov: 50 }}
      gl={{ antialias: true, alpha: false }}
    >
      <ShaderPlane />
    </Canvas>
  )
}
