import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MagicEyeButtonProps {
  onCapture: (file: File, instruction: string) => void
  disabled?: boolean
}

const MagicEyeButton = ({ onCapture, disabled = false }: MagicEyeButtonProps) => {
  const [showModal, setShowModal] = useState(false)
  const [instruction, setInstruction] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
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
    }
  }

  const handleSubmit = () => {
    if (selectedImage && instruction.trim()) {
      onCapture(selectedImage, instruction)
      setShowModal(false)
      setInstruction('')
      setSelectedImage(null)
      setImagePreview(null)
    }
  }

  const openCamera = () => {
    fileInputRef.current?.click()
    setShowModal(true)
  }

  return (
    <>
      {/* Floating Magic Eye Button */}
      <motion.button
        onClick={openCamera}
        disabled={disabled}
        className="fixed bottom-8 right-8 w-20 h-20 rounded-full bg-gradient-to-br from-neon-cyan to-neon-banana shadow-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(0, 243, 255, 0.5)',
            '0 0 40px rgba(255, 244, 79, 0.5)',
            '0 0 20px rgba(0, 243, 255, 0.5)',
          ],
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity },
        }}
      >
        <svg
          className="w-10 h-10 text-dark-950"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </motion.button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong rounded-3xl p-8 max-w-lg w-full border-2 border-neon-cyan/30"
            >
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-neon-cyan to-neon-banana bg-clip-text text-transparent">
                Analizar Proyecto
              </h2>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-6 rounded-xl overflow-hidden border-2 border-neon-cyan/20">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              {/* Select Image Button */}
              {!imagePreview && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full mb-6 py-12 border-2 border-dashed border-neon-cyan/30 rounded-xl hover:border-neon-cyan/60 transition-colors flex flex-col items-center justify-center space-y-3"
                >
                  <svg
                    className="w-12 h-12 text-neon-cyan/50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-gray-400">Capturar o seleccionar imagen</span>
                </button>
              )}

              {/* Instruction Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ¿Qué necesitas presupuestar?
                </label>
                <textarea
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="Ej: Necesito presupuestar la construcción de un muro de 10 metros..."
                  className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 border border-white/10"
                  rows={4}
                />
              </div>

              {/* Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 glass rounded-xl hover:bg-white/10 transition-colors text-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedImage || !instruction.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-banana rounded-xl font-semibold text-dark-950 hover:shadow-lg hover:shadow-neon-cyan/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Analizar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MagicEyeButton
