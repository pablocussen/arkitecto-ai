import { Component, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: string
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: '' }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      errorInfo: errorInfo.componentStack || ''
    })

    // TODO: Send to error tracking service (Sentry, etc.)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: '' })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-strong rounded-3xl p-8 max-w-md w-full text-center border-2 border-red-500/30"
          >
            {/* Error Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              Algo salio mal
            </h2>

            <p className="text-gray-400 mb-6">
              Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
            </p>

            {/* Error details (collapsible in development) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-400">
                  Detalles tecnicos
                </summary>
                <pre className="mt-2 p-3 bg-black/30 rounded-lg text-xs text-red-400 overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo && (
                    <>
                      {'\n\nComponent Stack:'}
                      {this.state.errorInfo}
                    </>
                  )}
                </pre>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => window.history.back()}
                className="flex-1 px-6 py-3 glass rounded-xl hover:bg-white/10 transition-colors text-gray-300"
              >
                Volver
              </button>
              <button
                onClick={this.handleRetry}
                className="flex-1 px-6 py-3 bg-neon-cyan text-dark-950 font-semibold rounded-xl hover:bg-neon-cyan/90 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
