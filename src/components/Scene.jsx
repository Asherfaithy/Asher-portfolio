import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import Effects from './Effects'

// ─── Camera Controller ───
// Smoothly flies the camera closer and adjusts the angle based on native standard scrolling.
function CameraController() {
  const vec = new THREE.Vector3()
  
  useFrame((state) => {
    // Calculate scroll progress (0.0 to 1.0)
    const scrollY = window.scrollY
    const maxScroll = document.body.scrollHeight - window.innerHeight
    const progress = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0

    // Starting position (high and far)
    const startPos = new THREE.Vector3(0, 2.5, 9)
    // Ending position at the bottom of the page (close up and level)
    const endPos = new THREE.Vector3(0, 0.5, 4.5)

    // Interpolate between the two
    vec.copy(startPos).lerp(endPos, progress)
    
    // Apply damping for a smooth elastic camera feel
    state.camera.position.lerp(vec, 0.05)
    
    // Always look at the center structure
    state.camera.lookAt(0, 0, 0)
  })

  return null
}

// ─── Starfield Particles ───
// Tiny static white and cyan points that twinkle
function DigitalRain({ count = 1000 }) {
  const pointsRef = useRef()

  const [positions, baseColors, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const bCol = new Float32Array(count * 3)
    const ph = new Float32Array(count)
    
    const colorWhite = new THREE.Color('#ffffff')
    const colorCyan = new THREE.Color('#00f2ff')

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30

      const mixedColor = Math.random() > 0.8 ? colorCyan : colorWhite
      bCol[i * 3] = mixedColor.r
      bCol[i * 3 + 1] = mixedColor.g
      bCol[i * 3 + 2] = mixedColor.b

      ph[i] = Math.random() * Math.PI * 2
    }
    return [pos, bCol, ph]
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    const colors = pointsRef.current.geometry.attributes.color.array
    const time = state.clock.elapsedTime
    
    for (let i = 0; i < count; i++) {
      const blink = 0.2 + 0.8 * Math.abs(Math.sin(time * 1.5 + phases[i]))
      colors[i * 3] = baseColors[i * 3] * blink
      colors[i * 3 + 1] = baseColors[i * 3 + 1] * blink
      colors[i * 3 + 2] = baseColors[i * 3 + 2] * blink
    }
    pointsRef.current.geometry.attributes.color.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={baseColors.length / 3}
          array={new Float32Array(baseColors)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ─── Main Scene ───
export default function Scene({ mouse, glitching }) {
  return (
    <>
      <color attach="background" args={['#1a1c20']} />

      {/* Camera Scroll Sync */}
      <CameraController />

      {/* Particle Background */}
      <DigitalRain />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      {/* Cyan point light to create dynamic reflections on the glass fortress */}
      <pointLight position={[2, 2, 2]} color="#00f2ff" intensity={5} distance={15} />
      <pointLight position={[-3, -1, 3]} color="#ffffff" intensity={2} distance={10} />
      <pointLight position={[0, -5, 0]} color="#00f2ff" intensity={3} distance={10} />

      {/* Atmosphere / Grounding Shadow */}
      <ContactShadows
        position={[0, -2.5, 0]}
        scale={15}
        resolution={512}
        far={10}
        blur={2}
        opacity={0.4}
        color="#000000"
      />

      {/* Post Processing Effects */}
      <Effects glitching={glitching} />
    </>
  )
}
