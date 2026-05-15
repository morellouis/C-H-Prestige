'use client'
import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

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

  // Hash & noise (Inigo Quilez)
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
    return mix(mix(dot(hash3(i + vec2(0.0, 0.0)).xy * 2.0 - 1.0, f - vec2(0.0, 0.0)),
                   dot(hash3(i + vec2(1.0, 0.0)).xy * 2.0 - 1.0, f - vec2(1.0, 0.0)), u.x),
               mix(dot(hash3(i + vec2(0.0, 1.0)).xy * 2.0 - 1.0, f - vec2(0.0, 1.0)),
                   dot(hash3(i + vec2(1.0, 1.0)).xy * 2.0 - 1.0, f - vec2(1.0, 1.0)), u.x), u.y);
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
    float aspect = uResolution.x / uResolution.y;
    vec2 centered = (uv - 0.5) * vec2(aspect, 1.0);
    vec2 mouseCentered = (uMouse - 0.5) * vec2(aspect, 1.0);

    // Halo souris : zone d'attraction lumineuse
    float distMouse = length(centered - mouseCentered);
    float halo = smoothstep(0.9, 0.0, distMouse);
    float haloSerre = smoothstep(0.3, 0.0, distMouse);

    // Coordonnées du bruit influencées par la souris
    float t = uTime * 0.1;
    vec2 p = uv * 3.0 + mouseCentered * 0.8;
    vec2 q = vec2(fbm(p + t), fbm(p - t + vec2(5.2, 1.3)));
    vec2 r = vec2(
      fbm(p + 2.0 * q + vec2(1.7, 9.2) + t * 0.7),
      fbm(p + 2.0 * q + vec2(8.3, 2.8) - t * 0.7)
    );
    float f = fbm(p + 3.0 * r);

    // REMAP du bruit de [-1, 1] vers [0, 1] (corrige le problème de fond blanc)
    f = clamp(f * 0.5 + 0.5, 0.0, 1.0);

    // Palette premium violet/magenta/cream avec ÉCART de luminosité visible
    vec3 lavandeP  = vec3(0.918, 0.890, 0.992);  // #eae3fd - tres clair
    vec3 lavande   = vec3(0.776, 0.706, 0.984);  // #c6b4fb
    vec3 violet    = vec3(0.486, 0.227, 0.929);  // #7c3aed - violet electrique
    vec3 magenta   = vec3(0.925, 0.282, 0.600);  // #ec4899 - magenta vif
    vec3 indigo    = vec3(0.310, 0.157, 0.768);  // #4f28c4

    // Bandes de couleurs basées sur f, qui couvrent toute la valeur [0,1]
    vec3 col = lavandeP;
    col = mix(col, lavande, smoothstep(0.30, 0.55, f));
    col = mix(col, violet, smoothstep(0.50, 0.75, f));
    col = mix(col, indigo, smoothstep(0.75, 0.95, f) * 0.85);

    // Léger ajout de magenta pour la chaleur
    col = mix(col, magenta, smoothstep(0.55, 0.70, f) * length(q) * 0.4);

    // Halo souris : tâche lumineuse qui suit le pointeur
    col = mix(col, magenta, halo * 0.4 * smoothstep(0.3, 0.8, f));
    col = mix(col, vec3(1.0, 0.95, 1.0), haloSerre * 0.3);

    // Lignes aurores
    float aurora = abs(sin(f * 10.0 + uTime * 0.4 + length(r) * 3.0));
    aurora = smoothstep(0.88, 1.0, aurora);
    col += aurora * 0.2 * vec3(0.9, 0.7, 1.0);

    // Vignette TRÈS douce — vers violet pas vers noir
    float vig = 1.0 - smoothstep(0.4, 1.3, length(centered));
    col = mix(col * 0.85 + indigo * 0.05, col, vig);

    // Grain
    float grain = (hash3(uv * uResolution + uTime).x - 0.5) * 0.02;
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
    mouse.current.x += (targetMouse.current.x - mouse.current.x) * 0.07
    mouse.current.y += (targetMouse.current.y - mouse.current.y) * 0.07
    uniforms.uTime.value += delta
    uniforms.uMouse.value.set(mouse.current.x, mouse.current.y)
    uniforms.uResolution.value.set(size.width, size.height)
  })

  useEffect(() => {
    function onMouse(e) {
      targetMouse.current.x = e.clientX / window.innerWidth
      targetMouse.current.y = 1 - e.clientY / window.innerHeight
    }
    function onTouch(e) {
      if (!e.touches[0]) return
      targetMouse.current.x = e.touches[0].clientX / window.innerWidth
      targetMouse.current.y = 1 - e.touches[0].clientY / window.innerHeight
    }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchmove', onTouch, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchmove', onTouch)
    }
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
