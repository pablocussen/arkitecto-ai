import { useState, useEffect } from 'react';
import { Project, BudgetItem } from '../types.ts';
import { getProjects, createProject, analyzeBudget } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import MagicEyeButton from './MagicEyeButton';
import DreamMode from './DreamMode';
import BudgetList from './BudgetList';
import { AnimatePresence, motion } from 'framer-motion';

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDreamMode, setShowDreamMode] = useState(false);
  const [analyzingBudget, setAnalyzingBudget] = useState(false);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [budgetTotal, setBudgetTotal] = useState(0);
  const [budgetAnalysis, setBudgetAnalysis] = useState<string | null>(null);
  const [budgetCosts, setBudgetCosts] = useState<{
    subtotalDirecto?: number;
    manoObra?: number;
    gastosGenerales?: number;
    imprevistos?: number;
    utilidad?: number;
    totalConIva?: number;
  }>({});
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);

      try {
        const userProjects = await getProjects();
        setProjects(userProjects);
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || err.message || 'Error de conexion';
        if (errorMessage.includes('Network') && retryCount < 2) {
          // Auto-retry on network errors (backend cold start)
          setRetryCount(prev => prev + 1);
          setTimeout(() => fetchProjects(), 2000);
          return;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user, retryCount]);

  const handleCreateProject = async () => {
    const title = prompt("Nombre del proyecto:");
    if (title) {
      try {
        setError(null);
        const newProject = await createProject({ title });
        setProjects([...projects, newProject]);
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message);
      }
    }
  };

  const handleBudgetCapture = async (file: File, instruction: string) => {
    setAnalyzingBudget(true);
    setError(null);
    setBudgetItems([]);
    setBudgetTotal(0);
    setBudgetAnalysis(null);
    setBudgetCosts({});

    try {
      const result = await analyzeBudget(file, instruction);
      if (result.success && result.presupuesto?.items) {
        setBudgetItems(result.presupuesto.items);
        setBudgetTotal(result.presupuesto.total_estimado ||
          result.presupuesto.items.reduce((sum, item) => sum + item.subtotal, 0));
        setBudgetAnalysis(result.analisis || null);
        setBudgetCosts({
          subtotalDirecto: result.presupuesto.subtotal_directo,
          manoObra: result.presupuesto.mano_obra,
          gastosGenerales: result.presupuesto.gastos_generales,
          imprevistos: result.presupuesto.imprevistos,
          utilidad: result.presupuesto.utilidad,
          totalConIva: result.presupuesto.total_con_iva
        });
      } else {
        setError('No se pudo generar el presupuesto. Intenta con otra descripcion.');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Error de conexion';
      setError(errorMessage);
    } finally {
      setAnalyzingBudget(false);
    }
  };

  const clearBudget = () => {
    setBudgetItems([]);
    setBudgetTotal(0);
    setBudgetAnalysis(null);
    setBudgetCosts({});
  };

  const dismissError = () => setError(null);

  // Loading state with animation
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full mb-6"
        />
        <p className="text-neon-cyan font-semibold text-lg">Cargando proyectos...</p>
        <p className="text-gray-500 text-sm mt-2">Conectando con el servidor</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
          >
            <div className="bg-red-500/90 backdrop-blur-sm text-white px-6 py-4 rounded-xl shadow-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
              <button onClick={dismissError} className="ml-4 hover:bg-white/20 p-1 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Gestiona tus proyectos y presupuestos</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowDreamMode(true)}
            className="px-4 py-2 font-bold text-dark-950 bg-gradient-to-r from-neon-banana to-neon-cyan rounded-lg hover:opacity-90 transition-all hover:shadow-lg hover:shadow-neon-cyan/30 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span>Modo Sueno</span>
          </button>
          <button
            onClick={handleCreateProject}
            className="px-4 py-2 font-bold text-dark-950 bg-neon-cyan rounded-lg hover:bg-opacity-90 transition-all hover:shadow-lg hover:shadow-neon-cyan/30 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nuevo Proyecto</span>
          </button>
        </div>
      </div>

      {/* Budget Analysis Loading */}
      <AnimatePresence>
        {analyzingBudget && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-8 glass-strong p-8 rounded-2xl text-center border border-neon-cyan/20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full mx-auto mb-4"
            />
            <p className="text-neon-cyan font-semibold text-lg">Analizando presupuesto...</p>
            <p className="text-gray-400 text-sm mt-2">Buscando partidas APU relevantes</p>
            <div className="mt-4 flex justify-center space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="w-2 h-2 bg-neon-cyan rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Budget Results */}
      <AnimatePresence>
        {budgetItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            {/* Analysis Summary */}
            {budgetAnalysis && (
              <div className="mb-4 glass p-4 rounded-xl border border-neon-cyan/20">
                <p className="text-gray-300 text-sm whitespace-pre-line">{budgetAnalysis}</p>
              </div>
            )}

            {/* Clear Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={clearBudget}
                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Limpiar presupuesto</span>
              </button>
            </div>

            <BudgetList
              items={budgetItems}
              total={budgetTotal}
              subtotalDirecto={budgetCosts.subtotalDirecto}
              manoObra={budgetCosts.manoObra}
              gastosGenerales={budgetCosts.gastosGenerales}
              imprevistos={budgetCosts.imprevistos}
              utilidad={budgetCosts.utilidad}
              totalConIva={budgetCosts.totalConIva}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects Section */}
      {projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <svg className="w-5 h-5 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>Mis Proyectos</span>
            <span className="text-sm text-gray-500">({projects.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-strong p-6 rounded-2xl hover:border-neon-cyan/30 border border-transparent transition-all cursor-pointer hover:shadow-lg hover:shadow-neon-cyan/10 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-neon-cyan transition-colors">
                    {project.metadata.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    project.metadata.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    project.metadata.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                    project.metadata.status === 'approved' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {project.metadata.status === 'draft' ? 'Borrador' :
                     project.metadata.status === 'budgeted' ? 'Presupuestado' :
                     project.metadata.status === 'approved' ? 'Aprobado' :
                     project.metadata.status === 'in_progress' ? 'En Progreso' :
                     project.metadata.status === 'completed' ? 'Completado' : project.metadata.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                  {project.metadata.description || 'Sin descripcion'}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(project.metadata.created_at).toLocaleDateString('es-CL')}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {projects.length === 0 && budgetItems.length === 0 && !analyzingBudget && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-banana/20 flex items-center justify-center">
            <svg className="w-12 h-12 text-neon-cyan/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-300 mb-2">Bienvenido a Arkitecto AI</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            Comienza analizando un presupuesto con el boton flotante o crea tu primer proyecto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleCreateProject}
              className="px-6 py-3 bg-neon-cyan text-dark-950 font-bold rounded-xl hover:shadow-lg hover:shadow-neon-cyan/30 transition-all"
            >
              Crear Primer Proyecto
            </button>
            <button
              onClick={() => setShowDreamMode(true)}
              className="px-6 py-3 glass border border-neon-cyan/30 text-neon-cyan font-bold rounded-xl hover:bg-neon-cyan/10 transition-all"
            >
              Explorar Modo Sueno
            </button>
          </div>
        </motion.div>
      )}

      {/* Magic Eye Floating Button */}
      <MagicEyeButton onCapture={handleBudgetCapture} disabled={analyzingBudget} />

      {/* Dream Mode Modal */}
      <AnimatePresence>
        {showDreamMode && <DreamMode onClose={() => setShowDreamMode(false)} />}
      </AnimatePresence>
    </div>
  );
}
