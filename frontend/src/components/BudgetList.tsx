import { motion } from 'framer-motion'
import { BudgetItem } from '../types'

interface BudgetListProps {
  items: BudgetItem[]
  total: number
}

const BudgetList = ({ items, total }: BudgetListProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-neon-cyan">
          Presupuesto Estimado
        </h2>
        <div className="glass-strong px-6 py-3 rounded-xl">
          <span className="text-sm text-gray-400 mr-3">Total</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-neon-cyan to-neon-banana bg-clip-text text-transparent">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-2xl p-6 hover:bg-white/5 transition-colors border border-white/5 hover:border-neon-cyan/30"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {item.elemento}
                </h3>
                <p className="text-sm text-gray-400 mb-2">
                  {item.descripcion}
                </p>
                <div className="inline-block px-3 py-1 glass rounded-lg text-xs text-neon-cyan border border-neon-cyan/20">
                  {item.apu_origen}
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-neon-banana">
                  {formatCurrency(item.subtotal)}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400 border-t border-white/5 pt-3 mt-3">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Cantidad:</span>
                <span className="font-semibold text-white">
                  {item.cantidad.toFixed(2)} {item.unidad}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Precio unitario:</span>
                <span className="font-semibold text-white">
                  {formatCurrency(item.precio_unitario)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: items.length * 0.1 + 0.2 }}
        className="glass-strong rounded-2xl p-6 border-2 border-neon-cyan/30 mt-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Total de partidas</p>
            <p className="text-3xl font-bold text-white">{items.length}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 mb-1">Monto total estimado</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-banana bg-clip-text text-transparent">
              {formatCurrency(total)}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default BudgetList
