import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import '@google/model-viewer'

interface ARVisualizerProps {
  modelType: 'muro' | 'piscina' | 'quincho' | null
  onClose: () => void
}

// Modelos 3D de ejemplo (usando URLs públicas de Google)
const MODEL_URLS = {
  muro: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  piscina: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb',
  quincho: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'
}

const MODEL_NAMES = {
  muro: 'Muro de Albañilería',
  piscina: 'Piscina Moderna',
  quincho: 'Quincho con Deck'
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any
    }
  }
}

const ARVisualizer = ({ modelType, onClose }: ARVisualizerProps) => {
  const modelViewerRef = useRef<any>(null)

  useEffect(() => {
    // Verificar soporte WebXR
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        if (!supported) {
          console.warn('AR no soportado en este dispositivo')
        }
      }).catch(console.error)
    }
  }, [])

  if (!modelType) return null

  const modelUrl = MODEL_URLS[modelType]
  const modelName = MODEL_NAMES[modelType]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col"
    >
      {/* Header */}
      <div className="glass-strong border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <h2 className="text-xl font-bold text-neon-cyan">{modelName}</h2>
            <p className="text-sm text-gray-400">Modo Realidad Aumentada</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full glass hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* AR Viewer */}
      <div className="flex-1 relative">
        <model-viewer
          ref={modelViewerRef}
          src={modelUrl}
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          touch-action="pan-y"
          auto-rotate
          shadow-intensity="1"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent'
          }}
          alt={modelName}
        >
          {/* Botón AR */}
          <button
            slot="ar-button"
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-banana rounded-2xl font-bold text-dark-950 text-lg shadow-2xl hover:scale-105 transition-transform flex items-center space-x-3"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Ver en Mi Espacio</span>
          </button>

          {/* Loading indicator */}
          <div slot="poster" className="absolute inset-0 flex items-center justify-center glass">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-neon-cyan">Cargando modelo 3D...</p>
            </div>
          </div>
        </model-viewer>

        {/* Controles flotantes */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
          <div className="glass-strong rounded-2xl p-4 max-w-xs pointer-events-auto">
            <h3 className="text-sm font-semibold text-neon-banana mb-2">Instrucciones</h3>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Arrastra para rotar el modelo</li>
              <li>• Pellizca para hacer zoom</li>
              <li>• Click "Ver en Mi Espacio" para AR</li>
            </ul>
          </div>

          <div className="glass-strong rounded-xl p-3 pointer-events-auto">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-300">WebXR Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info panel */}
      <div className="glass-strong border-t border-white/10 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Escala</p>
              <p className="text-lg font-bold text-white">1:1</p>
            </div>
            <div className="text-center border-x border-white/10">
              <p className="text-xs text-gray-400 mb-1">Dimensiones</p>
              <p className="text-lg font-bold text-neon-cyan">Real</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Precisión</p>
              <p className="text-lg font-bold text-neon-banana">Alta</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ARVisualizer
