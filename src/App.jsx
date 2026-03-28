import React, { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import Overlay from './components/Overlay'

export default function App() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [glitching, setGlitching] = useState(false)

  const handleMouseMove = useCallback((e) => {
    setMouse({
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1
    })
  }, [])

  return (
    <div onMouseMove={handleMouseMove} style={{ width: '100%', minHeight: '100vh' }}>
      {/* 3D Canvas — fixed background layer */}
      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 2, 8], fov: 50 }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 2]}
        >
          <Scene mouse={mouse} glitching={glitching} />
        </Canvas>
      </div>

      {/* 2D content overlay */}
      <Overlay setGlitching={setGlitching} />
    </div>
  )
}
