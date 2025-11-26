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

  const generateShareText = () => {
    const totalIva = totalConIva || Math.round(total * 1.19)
    let text = `*PRESUPUESTO ARKITECTO AI*\n`
    text += `━━━━━━━━━━━━━━━━━━━\n\n`
    text += `📋 *${items.length} Partidas*\n\n`
    items.slice(0, 5).forEach((item, i) => {
      text += `${i + 1}. ${item.elemento}\n`
      text += `   ${formatCurrency(item.subtotal)}\n`
    })
    if (items.length > 5) {
      text += `\n... y ${items.length - 5} partidas mas\n`
    }
    text += `\n━━━━━━━━━━━━━━━━━━━\n`
    text += `💰 *Total Neto:* ${formatCurrency(total)}\n`
    text += `📊 *IVA (19%):* ${formatCurrency(Math.round(total * 0.19))}\n`
    text += `✅ *TOTAL:* ${formatCurrency(totalIva)}\n\n`
    text += `_Generado con Arkitecto AI PRO_`
    return text
  }

  const handleShareWhatsApp = async () => {
    const text = generateShareText()
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const handleShareEmail = async () => {
    const totalIva = totalConIva || Math.round(total * 1.19)
    const subject = `Presupuesto Arkitecto AI - ${formatCurrency(totalIva)}`
    const body = generateShareText().replace(/\*/g, '').replace(/━/g, '-')
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = url
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
            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-white/10" />
            {/* Share Buttons */}
            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-2 glass rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-all flex items-center gap-2 border border-white/10 hover:border-green-500/30"
              title="Compartir por WhatsApp"
            >
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button
              onClick={handleShareEmail}
              className="px-3 py-2 glass rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-all flex items-center gap-2 border border-white/10 hover:border-blue-500/30"
              title="Enviar por Email"
            >
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">Email</span>
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

      {/* Professional Cost Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: items.length * 0.1 + 0.2 }}
        className="glass-strong rounded-2xl p-6 border-2 border-neon-cyan/30 mt-8"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Resumen de Costos
        </h3>

        <div className="space-y-3">
          {/* Items count */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Partidas analizadas</span>
            <span className="text-white font-medium">{items.length} items</span>
          </div>

          {/* Subtotal Directo */}
          {subtotalDirecto !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal Directo (Materiales)</span>
              <span className="text-white font-medium">{formatCurrency(subtotalDirecto)}</span>
            </div>
          )}

          {/* Mano de Obra */}
          {manoObra !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Mano de Obra (18%)</span>
              <span className="text-white font-medium">{formatCurrency(manoObra)}</span>
            </div>
          )}

          {/* Gastos Generales */}
          {gastosGenerales !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Gastos Generales (8%)</span>
              <span className="text-white font-medium">{formatCurrency(gastosGenerales)}</span>
            </div>
          )}

          {/* Imprevistos */}
          {imprevistos !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Imprevistos (5%)</span>
              <span className="text-white font-medium">{formatCurrency(imprevistos)}</span>
            </div>
          )}

          {/* Utilidad */}
          {utilidad !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Utilidad (10%)</span>
              <span className="text-white font-medium">{formatCurrency(utilidad)}</span>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-white/10 my-3" />

          {/* Total Neto */}
          <div className="flex justify-between">
            <span className="text-gray-300 font-medium">Total Neto</span>
            <span className="text-white font-bold text-lg">{formatCurrency(total)}</span>
          </div>

          {/* IVA */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">IVA (19%)</span>
            <span className="text-white font-medium">{formatCurrency(Math.round(total * 0.19))}</span>
          </div>

          {/* Total con IVA - Destacado */}
          <div className="bg-gradient-to-r from-neon-cyan/20 to-neon-banana/20 rounded-xl p-4 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-white font-bold">TOTAL CON IVA</span>
              <span className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-banana bg-clip-text text-transparent">
                {formatCurrency(totalConIva || Math.round(total * 1.19))}
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            Precios estimados basados en catalogo APU profesional (ONDAC/CDT compatible) - CLP 2024/2025
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default BudgetList
