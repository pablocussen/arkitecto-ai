import { motion } from 'framer-motion'

const LoadingOverlay = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center"
    >
      <div className="text-center">
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
          className="w-24 h-24 mx-auto mb-8"
        >
          <div className="w-full h-full rounded-full border-4 border-neon-cyan/20 border-t-neon-cyan"></div>
        </motion.div>

        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl font-bold text-neon-cyan mb-2"
        >
          Analizando...
        </motion.h2>

        <p className="text-gray-400">
          Procesando imagen con IA
        </p>

        <div className="mt-8 flex items-center justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-3 h-3 bg-neon-banana rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default LoadingOverlay
