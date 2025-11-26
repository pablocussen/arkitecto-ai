import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateSketch } from '../services/api'

interface DreamModeProps {
  onClose: () => void
}

const DREAM_PROMPTS = [
  'Piscina moderna con deck de madera',
  'Quincho con parrilla y zona de estar',
  'Jardin vertical con iluminacion LED',
  'Terraza techada con pergola',
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
        setError('No se pudo generar la imagen. Intenta con otra descripcion.')
      }
    } catch (err) {
      console.error('Error generando imagen:', err)
      setError('Error de conexion. Verifica que el backend este corriendo.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col"
    >
      {/* Header - Compacto */}
      <div className="glass-strong border-b border-white/10 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-neon-cyan to-neon-banana bg-clip-text text-transparent">
              Modo Sueno
            </h2>
            <p className="text-xs text-gray-400">Visualiza tu proyecto con IA</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full glass hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 pb-6 max-w-4xl mx-auto space-y-4">

          {/* Seccion 1: Foto + Descripcion en mobile, lado a lado en desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Foto */}
            <div className="glass-strong rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-neon-cyan/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-neon-cyan">1</span>
                </div>
                <h3 className="text-sm font-semibold text-white">Foto de tu Espacio</h3>
              </div>

              {!imagePreview ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-40 sm:h-52 border-2 border-dashed border-neon-cyan/30 rounded-xl hover:border-neon-cyan/60 transition-colors flex flex-col items-center justify-center gap-2"
                >
                  <svg className="w-10 h-10 text-neon-cyan/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm text-gray-400">Toca para capturar</span>
                  <span className="text-xs text-gray-500">Patio, jardin, terreno...</span>
                </button>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-40 sm:h-52 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => {
                      setImagePreview(null)
                      setSelectedImage(null)
                      setGeneratedImage(null)
                    }}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500/90 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

            {/* Descripcion */}
            <div className="glass-strong rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-neon-banana/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-neon-banana">2</span>
                </div>
                <h3 className="text-sm font-semibold text-white">Describe tu Vision</h3>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ej: Piscina moderna con deck de madera..."
                className="w-full px-3 py-2.5 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 border border-white/10 resize-none text-sm"
                rows={3}
              />

              {/* Ideas rapidas - Grid compacto */}
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Ideas rapidas:</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {DREAM_PROMPTS.map((dreamPrompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPrompt(dreamPrompt)}
                      className="px-2 py-1.5 glass rounded-lg text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors border border-white/5 text-left truncate"
                    >
                      {dreamPrompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Boton Generar - Siempre visible y destacado */}
          <button
            onClick={handleGenerate}
            disabled={!selectedImage || !prompt.trim() || isGenerating}
            className="w-full py-4 bg-gradient-to-r from-neon-cyan to-neon-banana rounded-xl font-bold text-dark-950 text-base hover:shadow-lg hover:shadow-neon-cyan/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-dark-950/30 border-t-dark-950 rounded-full animate-spin"></div>
                <span>Generando tu vision...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span>Generar Vision</span>
              </>
            )}
          </button>

          {/* Seccion 3: Resultado */}
          <div className="glass-strong rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-neon-cyan/20 to-neon-banana/20 flex items-center justify-center">
                <span className="text-xs font-bold text-white">3</span>
              </div>
              <h3 className="text-sm font-semibold text-white">Tu Proyecto Imaginado</h3>
            </div>

            <AnimatePresence mode="wait">
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 flex flex-col items-center justify-center"
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
                    className="w-16 h-16 mb-4"
                  >
                    <div className="w-full h-full rounded-full border-4 border-neon-cyan/20 border-t-neon-cyan"></div>
                  </motion.div>
                  <p className="text-neon-cyan text-sm font-semibold mb-1">Generando render...</p>
                  <p className="text-gray-500 text-xs">La IA esta imaginando tu proyecto</p>
                </motion.div>
              )}

              {!isGenerating && !generatedImage && !error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-10 flex flex-col items-center justify-center text-center"
                >
                  <svg className="w-14 h-14 text-neon-banana/30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <p className="text-gray-400 text-sm mb-1">Tu render aparecera aqui</p>
                  <p className="text-gray-500 text-xs">Sube una foto y describe tu vision</p>
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

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button className="py-2.5 glass rounded-xl hover:bg-white/10 transition-colors text-sm text-gray-300 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Descargar
                    </button>
                    <button className="py-2.5 glass rounded-xl hover:bg-white/10 transition-colors text-sm text-gray-300 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Compartir
                    </button>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-10 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-red-400 text-sm mb-2">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-xs text-gray-400 hover:text-white transition-colors underline"
                  >
                    Intentar de nuevo
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </motion.div>
  )
}

export default DreamMode
