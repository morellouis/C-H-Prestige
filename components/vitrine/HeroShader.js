'use client'
import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Shader hero "Aurora" : champ de couleurs fluide cream/violet
 * qui suit le pointeur. Pas de noir dominant — un fond clair et vibrant.
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

  // Hash & noise classiques d'Inigo Quilez
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
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  // Mélange linéaire respectant la perception de luminosité
  vec3 mixSrgb(vec3 a, vec3 b, float t) {
    return pow(mix(pow(a, vec3(2.2)), pow(b, vec3(2.2)), t), vec3(1.0/2.2));
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 centered = (uv - 0.5) * aspect;
    vec2 mouseCentered = (uMouse - 0.5) * aspect;

    // Distance à la souris (zone de chaleur)
    float distMouse = length(centered - mouseCentered);
    float halo = smoothstep(0.8, 0.0, distMouse);

    // Noise multi-couches qui flotte
    float t = uTime * 0.08;
    vec2 p = uv * 2.5 + mouseCentered * 0.4;
    vec2 q = vec2(fbm(p + t), fbm(p - t + vec2(5.2, 1.3)));
    vec2 r = vec2(
      fbm(p + q + vec2(1.7, 9.2) + t * 0.7),
      fbm(p + q + vec2(8.3, 2.8) - t * 0.7)
    );
    float f = fbm(p + 2.5 * r);

    // Palette claire et premium
    vec3 cream     = vec3(0.980, 0.974, 0.961);  // #faf9f6
    vec3 lavandeP  = vec3(0.929, 0.910, 0.988);  // #ede8fc
    vec3 lavande   = vec3(0.776, 0.706, 0.984);  // #c6b4fb
    vec3 violet    = vec3(0.486, 0.227, 0.929);  // #7c3aed
    vec3 magenta   = vec3(0.925, 0.282, 0.600);  // #ec4899

    // Composition : base cream → lavande → violet vibrant selon le noise
    vec3 col = cream;
    col = mixSrgb(col, lavandeP, smoothstep(0.0, 0.35, f));
    col = mixSrgb(col, lavande, smoothstep(0.25, 0.55, f));
    col = mixSrgb(col, violet, smoothstep(0.5, 0.85, f) * 0.85);

    // Le halo de la souris ajoute du magenta et de la luminosité
    col = mixSrgb(col, magenta, halo * 0.35 * smoothstep(0.4, 0.9, f));
    col += halo * 0.06; // léger éclat global

    // Lignes lumineuses subtiles (effet aurore)
    float aurora = abs(sin(f * 8.0 + uTime * 0.3 + length(q) * 2.0));
    aurora = smoothstep(0.85, 1.0, aurora);
    col += aurora * 0.15 * lavande;

    // Vignette TRÈS douce, vers du violet pas du noir
    float vig = 1.0 - smoothstep(0.5, 1.2, length((uv - 0.5) * aspect));
    col = mixSrgb(col, col * 0.92 + violet * 0.04, 1.0 - vig);

    // Grain fin
    float grain = (hash3(uv * uResolution + uTime).x - 0.5) * 0.025;
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
    // Lissage souris (lerp)
    mouse.current.x += (targetMouse.current.x - mouse.current.x) * 0.06
    mouse.current.y += (targetMouse.current.y - mouse.current.y) * 0.06
    uniforms.uTime.value += delta
    uniforms.uMouse.value.set(mouse.current.x, mouse.current.y)
    uniforms.uResolution.value.set(size.width, size.height)
  })

  useEffect(() => {
    function onPointer(e) {
      const x = (e.clientX ?? e.touches?.[0]?.clientX) / window.innerWidth
      const y = 1 - (e.clientY ?? e.touches?.[0]?.clientY) / window.innerHeight
      targetMouse.current.x = x
      targetMouse.current.y = y
    }
    window.addEventListener('mousemove', onPointer)
    window.addEventListener('touchmove', onPointer)
    return () => {
      window.removeEventListener('mousemove', onPointer)
      window.removeEventListener('touchmove', onPointer)
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
