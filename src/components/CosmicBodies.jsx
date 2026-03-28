import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

// ─── Single Planet Component ───
function Planet({ item, radius, speed, phase, color, isGlass, yOffset }) {
  const [hovered, setHovered] = useState(false)
  const orbitRef = useRef()
  const planetRef = useRef()
  
  useFrame((state, delta) => {
    // Orbital rotation around the center
    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * speed
    }
    // Planet self-rotation & floating bob
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.5
      planetRef.current.rotation.x += delta * 0.2
      planetRef.current.position.y = yOffset + Math.sin(state.clock.elapsedTime * 2 + phase) * 0.2
      
      // Scale up smoothly on hover
      const targetScale = hovered ? 1.3 : 1
      planetRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  // HUD Label Styles
  const labelStyle = {
    background: 'rgba(0, 242, 255, 0.05)',
    border: '1px solid rgba(0, 242, 255, 0.6)',
    color: '#00f2ff',
    padding: '4px 8px',
    fontFamily: 'monospace',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    textShadow: '0 0 8px rgba(0, 242, 255, 0.8)',
    pointerEvents: 'none',
    opacity: hovered ? 1 : 0,
    transform: hovered ? 'translateY(0) scale(1)' : 'translateY(15px) scale(0.8)',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  }

  return (
    <group ref={orbitRef} rotation={[0, phase, 0]}>
      <group position={[radius, 0, 0]} ref={planetRef}>
        
        <mesh 
          onPointerOver={() => {
            setHovered(true)
            document.body.style.cursor = 'pointer'
          }} 
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = 'auto'
          }}
        >
          <sphereGeometry args={[0.25, 32, 32]} />
          
          {isGlass ? (
            <meshPhysicalMaterial 
              color={color} 
              transmission={0.95} 
              opacity={1}
              metalness={0.2}
              roughness={0.05}
              ior={1.5}
              thickness={0.5} 
              emissive={hovered ? color : '#000000'}
              emissiveIntensity={hovered ? 0.8 : 0}
            />
          ) : (
            <meshStandardMaterial 
              color={color} 
              roughness={0.2}
              metalness={0.8}
              emissive={color}
              emissiveIntensity={hovered ? 2.0 : 0.3}
            />
          )}
        </mesh>
        
        {/* Data Reveal HUD */}
        <Html 
          distanceFactor={8} // Scales the text natively based on camera distance
          center 
          position={[0, 0.6, 0]} 
          zIndexRange={[100, 0]} // Ensure UI stays on top
          style={{ pointerEvents: 'none' }}
        >
          <div style={labelStyle}>
            [ {item.toUpperCase()} ]
          </div>
        </Html>

      </group>
    </group>
  )
}

// ─── Cosmic Bodies Controller ───
export default function CosmicBodies() {
  // Planet Configuration based on Marquee items
  const planets = [
    { item: 'Fiction', color: '#00f2ff', isGlass: false, radius: 3.5, speed: 0.15, phase: 0, yOffset: 0.5 },
    { item: 'Research Papers', color: '#ffffff', isGlass: false, radius: 4.5, speed: 0.1, phase: Math.PI / 2.5, yOffset: -0.3 },
    { item: 'Screenplays', color: '#ffffff', isGlass: true, radius: 3.0, speed: 0.2, phase: Math.PI, yOffset: -0.8 },
    { item: 'Copywriting', color: '#ffcba4', isGlass: false, radius: 5.0, speed: 0.08, phase: Math.PI * 1.5, yOffset: 0.2 },
    { item: 'Articles', color: '#00f2ff', isGlass: true, radius: 4.0, speed: 0.12, phase: Math.PI * 1.8, yOffset: 0.8 },
  ]

  return (
    <group>
      {planets.map((planet, idx) => (
        <Planet key={idx} {...planet} />
      ))}
    </group>
  )
}
