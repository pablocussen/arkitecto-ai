import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Project } from '../types'

interface ProjectDetailProps {
  project: Project
  onClose: () => void
  onUpdate?: (project: Project) => void
  onDelete?: (projectId: string) => void
}

export default function ProjectDetail({ project, onClose, onUpdate, onDelete }: ProjectDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(project.metadata.title)
  const [description, setDescription] = useState(project.metadata.description || '')
  const [status, setStatus] = useState(project.metadata.status)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const statusColors: { [key: string]: string } = {
    draft: 'bg-gray-500/20 text-gray-400',
    budgeted: 'bg-blue-500/20 text-blue-400',
    approved: 'bg-purple-500/20 text-purple-400',
    in_progress: 'bg-yellow-500/20 text-yellow-400',
    completed: 'bg-green-500/20 text-green-400'
  }

  const statusLabels: { [key: string]: string } = {
    draft: 'Borrador',
    budgeted: 'Presupuestado',
    approved: 'Aprobado',
    in_progress: 'En Progreso',
    completed: 'Completado'
  }

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...project,
        metadata: {
          ...project.metadata,
          title,
          description,
          status
        }
      })
    }
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (onDelete && project.id) {
      onDelete(project.id)
      onClose()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong rounded-3xl p-8 max-w-2xl w-full border-2 border-neon-cyan/30 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold bg-transparent border-b-2 border-neon-cyan/50 text-white focus:outline-none w-full"
              />
            ) : (
              <h2 className="text-2xl font-bold text-white">{project.metadata.title}</h2>
            )}
            <p className="text-gray-400 text-sm mt-1">
              Creado el {formatDate(project.metadata.created_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Estado</label>
          {isEditing ? (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="w-full px-4 py-2 glass rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 border border-white/10"
            >
              <option value="draft">Borrador</option>
              <option value="budgeted">Presupuestado</option>
              <option value="approved">Aprobado</option>
              <option value="in_progress">En Progreso</option>
              <option value="completed">Completado</option>
            </select>
          ) : (
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${statusColors[status]}`}>
              {statusLabels[status]}
            </span>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Descripcion</label>
          {isEditing ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe el proyecto..."
              className="w-full px-4 py-2 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 border border-white/10"
            />
          ) : (
            <p className="text-gray-300">
              {project.metadata.description || 'Sin descripcion'}
            </p>
          )}
        </div>

        {/* Budget Summary */}
        {project.budget && project.budget.items && project.budget.items.length > 0 && (
          <div className="mb-6 glass p-4 rounded-xl border border-neon-cyan/20">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Resumen Presupuesto
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-400 text-sm">Partidas</span>
                <p className="text-white font-semibold">{project.budget.items.length}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Total Final</span>
                <p className="text-neon-cyan font-bold text-lg">
                  {formatCurrency(project.budget.total_final)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Location */}
        {project.metadata.location && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">Ubicacion</label>
            <div className="flex items-center gap-2 text-gray-300">
              <svg className="w-5 h-5 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{project.metadata.location.address}, {project.metadata.location.city}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-white/10">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2 glass rounded-lg hover:bg-white/10 transition-colors text-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-neon-cyan text-dark-950 font-semibold rounded-lg hover:bg-neon-cyan/90 transition-colors"
              >
                Guardar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 glass rounded-lg hover:bg-red-500/20 transition-colors text-red-400 border border-red-500/20"
              >
                Eliminar
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 px-4 py-2 glass rounded-lg hover:bg-white/10 transition-colors text-white border border-white/10"
              >
                Editar
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-neon-cyan text-dark-950 font-semibold rounded-lg hover:bg-neon-cyan/90 transition-colors"
              >
                Cerrar
              </button>
            </>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 rounded-3xl flex items-center justify-center"
            >
              <div className="text-center p-6">
                <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">Eliminar Proyecto</h3>
                <p className="text-gray-400 mb-6">
                  Esta accion no se puede deshacer. El proyecto y todos sus datos seran eliminados permanentemente.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-6 py-2 glass rounded-lg hover:bg-white/10 transition-colors text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-6 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors text-white font-semibold"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
