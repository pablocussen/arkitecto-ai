import { useState } from 'react'
import { motion } from 'framer-motion'
import { BudgetItem } from '../types'
import { exportToPDF, exportToExcel, exportToText, ExportData } from '../services/api'

interface BudgetListProps {
  items: BudgetItem[]
  total: number
  subtotalDirecto?: number
  manoObra?: number
  gastosGenerales?: number
  imprevistos?: number
  utilidad?: number
  totalConIva?: number
}

const BudgetList = ({
  items,
  total,
  subtotalDirecto,
  manoObra,
  gastosGenerales,
  imprevistos,
  utilidad,
  totalConIva
}: BudgetListProps) => {
  const [exporting, setExporting] = useState<'pdf' | 'excel' | 'text' | null>(null)
  const [showCopied, setShowCopied] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount)
  }

  const getExportData = (): ExportData => ({
    presupuesto: {
      items,
      total_estimado: total,
      subtotal_directo: subtotalDirecto,
      mano_obra: manoObra,
      gastos_generales: gastosGenerales,
      imprevistos: imprevistos,
      utilidad: utilidad,
      total_con_iva: totalConIva || Math.round(total * 1.19)
    }
  })

  const handleExportPDF = async () => {
    setExporting('pdf')
    try {
      const blob = await exportToPDF(getExportData())
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `presupuesto_arkitecto_${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting PDF:', error)
    } finally {
      setExporting(null)
    }
  }

  const handleExportExcel = async () => {
    setExporting('excel')
    try {
      const blob = await exportToExcel(getExportData())
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `presupuesto_arkitecto_${Date.now()}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting Excel:', error)
    } finally {
      setExporting(null)
    }
  }

  const handleCopyText = async () => {
    setExporting('text')
    try {
      const response = await exportToText(getExportData())
      if (response.success) {
        await navigator.clipboard.writeText(response.text)
        setShowCopied(true)
        setTimeout(() => setShowCopied(false), 2000)
      }
    } catch (error) {
      console.error('Error copying text:', error)
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-neon-cyan">
          Presupuesto Estimado
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          {/* Export Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleExportPDF}
              disabled={exporting !== null}
              className="px-3 py-2 glass rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-all flex items-center gap-2 border border-white/10 hover:border-neon-cyan/30 disabled:opacity-50"
              title="Descargar PDF"
            >
              {exporting === 'pdf' ? (
                <div className="w-4 h-4 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6zm2-6h8v1.5H8V14zm0 3h8v1.5H8V17zm0-6h3v1.5H8V11z"/>
                </svg>
              )}
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button
              onClick={handleExportExcel}
              disabled={exporting !== null}
              className="px-3 py-2 glass rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-all flex items-center gap-2 border border-white/10 hover:border-neon-cyan/30 disabled:opacity-50"
              title="Descargar Excel"
            >
              {exporting === 'excel' ? (
                <div className="w-4 h-4 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6zm2-6h2l1.5 2 1.5-2h2l-2.5 3 2.5 3h-2l-1.5-2-1.5 2H8l2.5-3-2.5-3z"/>
                </svg>
              )}
              <span className="hidden sm:inline">Excel</span>
            </button>
            <button
              onClick={handleCopyText}
              disabled={exporting !== null}
              className="px-3 py-2 glass rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-all flex items-center gap-2 border border-white/10 hover:border-neon-cyan/30 disabled:opacity-50 relative"
              title="Copiar al portapapeles"
            >
              {exporting === 'text' ? (
                <div className="w-4 h-4 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
              ) : showCopied ? (
                <svg className="w-4 h-4 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
              <span className="hidden sm:inline">{showCopied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
          {/* Total Badge */}
          <div className="glass-strong px-6 py-3 rounded-xl">
            <span className="text-sm text-gray-400 mr-3">Total</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-neon-cyan to-neon-banana bg-clip-text text-transparent">
              {formatCurrency(total)}
            </span>
          </div>
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
