import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import MagicEyeButton from './components/MagicEyeButton'
import BudgetList from './components/BudgetList'
import Header from './components/Header'
import LoadingOverlay from './components/LoadingOverlay'
import ARVisualizer from './components/ARVisualizer'
import DreamMode from './components/DreamMode'
import { BudgetItem, AnalysisResponse } from './types'
import { analyzeBudget } from './services/api'

type Tab = 'presupuesto' | 'vision'
type VisionMode = 'imaginar' | 'medir' | null
type ARModel = 'muro' | 'piscina' | 'quincho' | null

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('presupuesto')
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [analysisText, setAnalysisText] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  // PRO features state
  const [visionMode, setVisionMode] = useState<VisionMode>(null)
  const [arModel, setArModel] = useState<ARModel>(null)

  const handleImageCapture = async (imageFile: File, instruction: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response: AnalysisResponse = await analyzeBudget(imageFile, instruction)

      if (response.success) {
        setAnalysisText(response.analisis)
        setBudgetItems(response.presupuesto.items)
        setActiveTab('presupuesto') // Switch to budget tab after analysis
      } else {
        setError('Error al analizar la imagen. Por favor intenta nuevamente.')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Error de conexión. Verifica que el backend esté corriendo.')
    } finally {
      setIsLoading(false)
    }
  }

  const totalEstimado = budgetItems.reduce((sum, item) => sum + item.subtotal, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10">
        <Header />

        {/* Tabs Navigation */}
        <div className="glass-strong border-b border-white/10 sticky top-0 z-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('presupuesto')}
                className={`px-6 py-4 font-semibold transition-all relative ${
                  activeTab === 'presupuesto'
                    ? 'text-neon-cyan'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>Presupuesto</span>
                </span>
                {activeTab === 'presupuesto' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-banana"></div>
                )}
              </button>

              <button
                onClick={() => setActiveTab('vision')}
                className={`px-6 py-4 font-semibold transition-all relative ${
                  activeTab === 'vision'
                    ? 'text-neon-banana'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span>Visión</span>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-neon-cyan to-neon-banana text-dark-950 text-xs font-bold rounded">PRO</span>
                </span>
                {activeTab === 'vision' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-banana to-neon-cyan"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Tab: Presupuesto */}
          {activeTab === 'presupuesto' && (
            <>
              {/* Analysis Text */}
              {analysisText && (
                <div className="mb-8 glass-strong rounded-2xl p-6 border-l-4 border-neon-cyan">
                  <h2 className="text-neon-cyan text-lg font-semibold mb-2">Análisis</h2>
                  <p className="text-gray-300">{analysisText}</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-8 glass-strong rounded-2xl p-6 border-l-4 border-red-500">
                  <h2 className="text-red-400 text-lg font-semibold mb-2">Error</h2>
                  <p className="text-gray-300">{error}</p>
                </div>
              )}

              {/* Budget List */}
              {budgetItems.length > 0 && (
                <BudgetList items={budgetItems} total={totalEstimado} />
              )}

              {/* Empty State */}
              {budgetItems.length === 0 && !isLoading && !error && (
                <div className="text-center py-20">
                  <div className="inline-block p-8 glass rounded-3xl">
                    <svg
                      className="w-24 h-24 mx-auto mb-6 text-neon-cyan opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-400 mb-2">
                      Bienvenido a Arkitecto AI
                    </h2>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Captura una imagen de tu proyecto o plano y te ayudaré a generar un presupuesto estimado
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Tab: Visión PRO */}
          {activeTab === 'vision' && (
            <div className="space-y-6">
              <div className="glass-strong rounded-2xl p-8 text-center border-2 border-neon-banana/30">
                <div className="inline-block p-4 bg-gradient-to-br from-neon-cyan to-neon-banana rounded-2xl mb-4">
                  <svg className="w-12 h-12 text-dark-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-banana bg-clip-text text-transparent mb-4">
                  Herramientas de Visualización PRO
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                  Lleva tus proyectos al siguiente nivel con renderizado IA y realidad aumentada
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Imaginar Mode */}
                  <button
                    onClick={() => setVisionMode('imaginar')}
                    className="glass-strong rounded-2xl p-8 hover:bg-white/5 transition-all border-2 border-white/10 hover:border-neon-cyan/50 group text-left"
                  >
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-banana/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Modo Sueño</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Genera renders fotorrealistas de tu proyecto usando IA
                    </p>
                    <div className="flex items-center space-x-2 text-neon-cyan text-sm font-semibold">
                      <span>Abrir Generador</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>

                  {/* Medir Mode */}
                  <button
                    onClick={() => setVisionMode('medir')}
                    className="glass-strong rounded-2xl p-8 hover:bg-white/5 transition-all border-2 border-white/10 hover:border-neon-banana/50 group text-left"
                  >
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-banana/20 to-neon-cyan/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-neon-banana" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Realidad Aumentada</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Visualiza elementos 3D en tu espacio real usando AR
                    </p>
                    <div className="flex items-center space-x-2 text-neon-banana text-sm font-semibold">
                      <span>Abrir AR Viewer</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>

              {/* AR Model Selection */}
              {visionMode === 'medir' && (
                <div className="glass-strong rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Selecciona un elemento para visualizar</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setArModel('muro')}
                      className="glass rounded-xl p-4 hover:bg-white/10 transition-colors border border-white/10 hover:border-neon-cyan/50"
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">🧱</div>
                        <p className="text-white font-semibold">Muro</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setArModel('piscina')}
                      className="glass rounded-xl p-4 hover:bg-white/10 transition-colors border border-white/10 hover:border-neon-cyan/50"
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">🏊</div>
                        <p className="text-white font-semibold">Piscina</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setArModel('quincho')}
                      className="glass rounded-xl p-4 hover:bg-white/10 transition-colors border border-white/10 hover:border-neon-cyan/50"
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">🏡</div>
                        <p className="text-white font-semibold">Quincho</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Magic Eye Button */}
        <MagicEyeButton onCapture={handleImageCapture} disabled={isLoading} />

        {/* Loading Overlay */}
        {isLoading && <LoadingOverlay />}

        {/* AR Visualizer */}
        <AnimatePresence>
          {arModel && (
            <ARVisualizer
              modelType={arModel}
              onClose={() => setArModel(null)}
            />
          )}
        </AnimatePresence>

        {/* Dream Mode */}
        <AnimatePresence>
          {visionMode === 'imaginar' && (
            <DreamMode onClose={() => setVisionMode(null)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
