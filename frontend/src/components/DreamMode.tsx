import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateSketch } from '../services/api'

interface DreamModeProps {
  onClose: () => void
}

const DREAM_PROMPTS = [
  'Piscina moderna con deck de madera',
  'Quincho con parrilla y zona de estar',
  'Jardín vertical con iluminación LED',
  'Terraza techada con pérgola',
  'Muro de piedra natural',
  'Patio con fuente de agua'
]

const DreamMode = ({ onClose }: DreamModeProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setGeneratedImage(null)
      setError(null)
    }
  }

  const handleGenerate = async () => {
    if (!selectedImage || !prompt.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const result = await generateSketch(selectedImage, prompt)

      if (result.success && result.generated_image) {
        setGeneratedImage(result.generated_image)
      } else {
        setError('No se pudo generar la imagen. Intenta con otra descripción.')
      }
    } catch (err) {
      console.error('Error generando imagen:', err)
      setError('Error de conexión. Verifica que el backend esté corriendo.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col overflow-y-auto"
    >
      {/* Header */}
      <div className="glass-strong border-b border-white/10 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-cyan to-neon-banana bg-clip-text text-transparent">
              Modo Sueño
            </h2>
            <p className="text-sm text-gray-400">Visualiza tu proyecto antes de construirlo</p>
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

      {/* Content */}
      <div className="flex-1 p-4 max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Input */}
          <div className="space-y-6">
            {/* Image upload */}
            <div className="glass-strong rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">1. Foto de tu Espacio</h3>

              {!imagePreview ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-64 border-2 border-dashed border-neon-cyan/30 rounded-xl hover:border-neon-cyan/60 transition-colors flex flex-col items-center justify-center space-y-3"
                >
                  <svg className="w-16 h-16 text-neon-cyan/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-400">Capturar o seleccionar foto</span>
                  <span className="text-xs text-gray-500">Patio, jardín, terreno...</span>
                </button>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => {
                      setImagePreview(null)
                      setSelectedImage(null)
                      setGeneratedImage(null)
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Prompt input */}
            <div className="glass-strong rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">2. Describe tu Visión</h3>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ej: Piscina moderna con deck de madera, iluminación LED perimetral y zona de descanso..."
                className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 border border-white/10 resize-none"
                rows={6}
              />

              {/* Quick prompts */}
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-2">Ideas rápidas:</p>
                <div className="flex flex-wrap gap-2">
                  {DREAM_PROMPTS.map((dreamPrompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPrompt(dreamPrompt)}
                      className="px-3 py-1 glass rounded-lg text-xs text-gray-300 hover:bg-white/10 transition-colors border border-white/5"
                    >
                      {dreamPrompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!selectedImage || !prompt.trim() || isGenerating}
              className="w-full px-6 py-4 bg-gradient-to-r from-neon-cyan to-neon-banana rounded-2xl font-bold text-dark-950 text-lg hover:shadow-lg hover:shadow-neon-cyan/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-3 border-dark-950/30 border-t-dark-950 rounded-full animate-spin"></div>
                  <span>Soñando...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span>Generar Visión</span>
                </>
              )}
            </button>
          </div>

          {/* Right: Output */}
          <div className="space-y-6">
            <div className="glass-strong rounded-2xl p-6 min-h-[600px]">
              <h3 className="text-lg font-semibold text-white mb-4">3. Tu Proyecto Imaginado</h3>

              <AnimatePresence mode="wait">
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-96 flex flex-col items-center justify-center"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-24 h-24 mb-8"
                    >
                      <div className="w-full h-full rounded-full border-4 border-neon-cyan/20 border-t-neon-cyan"></div>
                    </motion.div>
                    <p className="text-neon-cyan text-lg font-semibold mb-2">Generando render...</p>
                    <p className="text-gray-400 text-sm">La IA está imaginando tu proyecto</p>
                  </motion.div>
                )}

                {!isGenerating && !generatedImage && !error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-96 flex flex-col items-center justify-center text-center"
                  >
                    <svg className="w-24 h-24 text-neon-banana/30 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <p className="text-gray-400 mb-2">Tu render aparecerá aquí</p>
                    <p className="text-gray-500 text-sm max-w-xs">Sube una foto y describe tu visión para comenzar</p>
                  </motion.div>
                )}

                {generatedImage && !isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img
                      src={generatedImage}
                      alt="Render generado"
                      className="w-full rounded-xl shadow-2xl"
                    />

                    <div className="mt-4 flex space-x-3">
                      <button className="flex-1 px-4 py-2 glass rounded-xl hover:bg-white/10 transition-colors text-sm text-gray-300">
                        Descargar
                      </button>
                      <button className="flex-1 px-4 py-2 glass rounded-xl hover:bg-white/10 transition-colors text-sm text-gray-300">
                        Compartir
                      </button>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-96 flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <p className="text-red-400 mb-2">{error}</p>
                    <button
                      onClick={() => setError(null)}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Intentar de nuevo
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default DreamMode
