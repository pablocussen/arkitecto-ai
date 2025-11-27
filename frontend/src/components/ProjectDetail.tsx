import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, ProjectMetadata, BudgetItem } from '../types';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
  onUpdate: (projectId: string, updates: Partial<ProjectMetadata>) => void;
  onDelete: (projectId: string) => void;
}

const ProjectDetail = ({ project, onClose, onUpdate, onDelete }: ProjectDetailProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [newItem, setNewItem] = useState({
    elemento: '',
    descripcion: '',
    cantidad: '',
    unidad: '',
    precio_unitario: ''
  });

  // Use a state to manage the edited project data
  const [editableMetadata, setEditableMetadata] = useState<Partial<ProjectMetadata>>({
    title: project.metadata.title,
    description: project.metadata.description || '',
    status: project.metadata.status,
  });

  // Keep the editable state in sync if the project prop changes
  useEffect(() => {
    setEditableMetadata({
      title: project.metadata.title,
      description: project.metadata.description || '',
      status: project.metadata.status,
    });
  }, [project]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableMetadata(prev => ({ ...prev, [name]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const statusColors: { [key: string]: string } = {
    draft: 'bg-gray-500/20 text-gray-400',
    budgeted: 'bg-blue-500/20 text-blue-400',
    approved: 'bg-purple-500/20 text-purple-400',
    in_progress: 'bg-yellow-500/20 text-yellow-400',
    completed: 'bg-green-500/20 text-green-400',
  };

  const statusLabels: { [key: string]: string } = {
    draft: 'Borrador',
    budgeted: 'Presupuestado',
    approved: 'Aprobado',
    in_progress: 'En Progreso',
    completed: 'Completado',
  };

  const handleSave = () => {
    onUpdate(project.id, editableMetadata);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(project.id);
    onClose();
  };

  const handleAddBudgetItem = () => {
    const cantidad = parseFloat(newItem.cantidad);
    const precio_unitario = parseFloat(newItem.precio_unitario);

    if (!newItem.elemento || isNaN(cantidad) || !newItem.unidad || isNaN(precio_unitario)) {
      alert('Por favor completa todos los campos');
      return;
    }

    const budgetItem: BudgetItem = {
      elemento: newItem.elemento,
      descripcion: newItem.descripcion,
      cantidad,
      unidad: newItem.unidad,
      precio_unitario,
      subtotal: cantidad * precio_unitario,
    };

    const currentBudget = project.budget || { items: [], total_final: 0 };
    const updatedBudget = {
      ...currentBudget,
      items: [...currentBudget.items, budgetItem],
      total_final: currentBudget.items.reduce((sum, item) => sum + item.subtotal, 0) + budgetItem.subtotal,
    };

    onUpdate(project.id, { budget: updatedBudget });
    setNewItem({ elemento: '', descripcion: '', cantidad: '', unidad: '', precio_unitario: '' });
    setShowAddItemForm(false);
  };

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
                name="title"
                value={editableMetadata.title}
                onChange={handleInputChange}
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
              name="status"
              value={editableMetadata.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 glass rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 border border-white/10"
            >
              <option value="draft">Borrador</option>
              <option value="budgeted">Presupuestado</option>
              <option value="approved">Aprobado</option>
              <option value="in_progress">En Progreso</option>
              <option value="completed">Completado</option>
            </select>
          ) : (
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${statusColors[project.metadata.status]}`}>
              {statusLabels[project.metadata.status]}
            </span>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Descripcion</label>
          {isEditing ? (
            <textarea
              name="description"
              value={editableMetadata.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Describe el proyecto..."
              className="w-full px-4 py-2 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 border border-white/10"
            />
          ) : (
            <p className="text-gray-300">
              {project.metadata.description || (
                <button onClick={() => setIsEditing(true)} className="text-neon-cyan hover:underline">
                  Añadir descripción
                </button>
              )}
            </p>
          )}
        </div>

        {/* Budget Section */}
        <div className="mb-6 glass p-4 rounded-xl border border-neon-cyan/20">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Presupuesto</span>
            </div>
            <button
              onClick={() => setShowAddItemForm(true)}
              className="text-sm font-semibold text-neon-cyan hover:text-white transition-colors p-1 rounded-full hover:bg-neon-cyan/20"
              title="Agregar partida"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </h3>

          {project.budget && project.budget.items && project.budget.items.length > 0 ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="glass-strong p-3 rounded-lg">
                  <span className="text-gray-400 text-xs">Partidas</span>
                  <p className="text-white font-semibold text-lg">{project.budget.items.length}</p>
                </div>
                <div className="glass-strong p-3 rounded-lg">
                  <span className="text-gray-400 text-xs">Total Final</span>
                  <p className="text-neon-cyan font-bold text-lg">
                    {formatCurrency(project.budget.total_final)}
                  </p>
                </div>
              </div>

              {/* Itemized List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {project.budget.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-strong p-3 rounded-lg border border-white/5 hover:border-neon-cyan/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold text-sm truncate">
                            {item.elemento}
                          </span>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {item.cantidad} {item.unidad}
                          </span>
                        </div>
                        {item.descripcion && (
                          <p className="text-xs text-gray-400 mb-1 truncate">{item.descripcion}</p>
                        )}
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-gray-400">
                            {formatCurrency(item.precio_unitario)} / {item.unidad}
                          </span>
                          <span className="text-neon-banana font-semibold">
                            {formatCurrency(item.subtotal)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const updatedItems = project.budget.items.filter((_, i) => i !== index);
                          const newTotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
                          onUpdate(project.id, {
                            budget: {
                              ...project.budget,
                              items: updatedItems,
                              total_final: newTotal
                            }
                          });
                        }}
                        className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 hover:text-red-300 flex-shrink-0"
                        title="Eliminar partida"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-400 text-sm mb-2">Sin partidas presupuestarias</p>
              <button
                onClick={() => setShowAddItemForm(true)}
                className="text-neon-cyan hover:text-white text-sm transition-colors"
              >
                Agregar primera partida →
              </button>
            </div>
          )}
        </div>

        {/* Add Budget Item Form */}
        <AnimatePresence>
          {showAddItemForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass p-4 rounded-xl border border-neon-cyan/20 mb-4"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar Partida
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Elemento *</label>
                  <input
                    type="text"
                    value={newItem.elemento}
                    onChange={(e) => setNewItem({ ...newItem, elemento: e.target.value })}
                    placeholder="Ej: Pintura latex"
                    className="w-full px-3 py-2 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 border border-white/10"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
                  <input
                    type="text"
                    value={newItem.descripcion}
                    onChange={(e) => setNewItem({ ...newItem, descripcion: e.target.value })}
                    placeholder="Detalles adicionales (opcional)"
                    className="w-full px-3 py-2 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 border border-white/10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Cantidad *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.cantidad}
                    onChange={(e) => setNewItem({ ...newItem, cantidad: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 border border-white/10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Unidad *</label>
                  <input
                    type="text"
                    value={newItem.unidad}
                    onChange={(e) => setNewItem({ ...newItem, unidad: e.target.value })}
                    placeholder="m2, ml, un"
                    className="w-full px-3 py-2 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 border border-white/10"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Precio Unitario *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.precio_unitario}
                    onChange={(e) => setNewItem({ ...newItem, precio_unitario: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-2 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 border border-white/10"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowAddItemForm(false);
                    setNewItem({ elemento: '', descripcion: '', cantidad: '', unidad: '', precio_unitario: '' });
                  }}
                  className="flex-1 px-4 py-2 glass rounded-lg hover:bg-white/10 transition-colors text-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddBudgetItem}
                  className="flex-1 px-4 py-2 bg-neon-cyan text-dark-950 font-semibold rounded-lg hover:bg-neon-cyan/90 transition-colors"
                >
                  Agregar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
  );
}

export default memo(ProjectDetail);
