import React from 'react'
import { EffectComposer, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

// ─── Post-Processing Effects ───
export default function Effects() {
  return (
    <EffectComposer disableNormalPass>
      {/* Noise disabled for background stability */}
    </EffectComposer>
  )
}
