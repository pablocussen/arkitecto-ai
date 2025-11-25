const Header = () => {
  return (
    <header className="glass-strong border-b border-white/10">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-banana flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-dark-950"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
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
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-neon-cyan to-neon-banana rounded-xl blur opacity-30 animate-pulse-slow"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-cyan to-neon-banana bg-clip-text text-transparent">
                Arkitecto AI
              </h1>
              <p className="text-sm text-gray-400">Presupuestos inteligentes</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-4 py-2 glass rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
