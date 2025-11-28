import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Project, BudgetItem, ProjectMetadata } from '../types.ts';
import { getProjects, createProject, analyzeBudget, updateProject, deleteProject } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import MagicEyeButton from './MagicEyeButton';
import BudgetList from './BudgetList';
import { DashboardSkeleton, BudgetListSkeleton } from './LoadingSkeleton';
import { AnimatePresence, motion } from 'framer-motion';

const DreamMode = lazy(() => import('./DreamMode'));
const WizardFlow = lazy(() => import('./WizardFlow'));
const OnboardingWizard = lazy(() => import('./OnboardingWizard'));
const ProjectDetail = lazy(() => import('./ProjectDetail'));

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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const retryCountRef = useRef(0);
  const hasFetchedRef = useRef(false);
  const [showWizard, setShowWizard] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(
    !localStorage.getItem('arkitecto_onboarding_completed')
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!user || hasFetchedRef.current) return;

    const fetchProjects = async () => {
      setLoading(true);

      try {
        const userProjects = await getProjects();
        setProjects(userProjects);
        setError(null);
        hasFetchedRef.current = true;
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || err.message || 'Error de conexion';
        const isNetworkError = errorMessage.includes('Network') || errorMessage.includes('ERR_');

        if (isNetworkError && retryCountRef.current < 3) {
          // Auto-retry silently
          retryCountRef.current += 1;
          setTimeout(fetchProjects, 2000);
          return;
        }

        // Only show non-network errors, or network errors after all retries
        if (!isNetworkError) {
          setError(errorMessage);
        }
        // For network errors, just stop loading - user can still use the app
        hasFetchedRef.current = true;
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const handleWizardComplete = async (answers: Record<string, string>) => {
    // Construir instrucción desde las respuestas
    const instruction = `
      Tipo de proyecto: ${answers.type}
      Dimensiones: ${answers.dimensions}
      Nivel de calidad: ${answers.quality}
      Detalles: ${answers.details}
      Ubicación: ${answers.location}
      
      Genera un presupuesto detallado con APU para este proyecto.
    `;
    
    setShowWizard(false);
    
    // Llamar a la función existente de análisis
    // The handleBudgetCapture function expects a file, but the new flow doesn't have one.
    // I will pass a dummy file for now. This will need to be fixed in the backend.
    const dummyFile = new File([""], "dummy.txt", { type: "text/plain" });
    await handleBudgetCapture(dummyFile, instruction);
  };

  const handleUpdateProject = async (projectId: string, updates: Partial<ProjectMetadata>) => {
    try {
      const updatedProject = await updateProject(projectId, updates);
      setProjects(projects.map(p => p.id === projectId ? updatedProject : p));
      setSelectedProject(updatedProject); // Actualiza el proyecto seleccionado también
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update project.');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
        setProjects(projects.filter(p => p.id !== projectId));
        setSelectedProject(null); // Cierra el detalle
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to delete project.');
      }
    }
  };


const handleBudgetCapture = async (file: File, instruction: string) => {
    setIsAnalyzing(true);
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
      setIsAnalyzing(false);
    }
  };

  const clearBudget = () => {
    setBudgetItems([]);
    setBudgetTotal(0);
    setBudgetAnalysis(null);
    setBudgetCosts({});
  };

  const dismissError = () => setError(null);

  // Loading state with skeleton
  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-4 md:p-8">
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-semibold">Generando presupuesto con IA...</p>
            <p className="text-gray-400 text-sm mt-2">Analizando APUs y calculando costos</p>
          </div>
        </div>
      )}
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
            onClick={() => setShowWizard(true)}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <div className="mb-4 glass p-4 rounded-xl border border-neon-cyan/20">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full"
                />
                <p className="text-neon-cyan font-medium">Analizando presupuesto con catalogo APU profesional...</p>
              </div>
            </div>
            <BudgetListSkeleton count={4} />
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

            {/* Action Buttons */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={clearBudget}
                className="px-4 py-2 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Volver al Dashboard</span>
              </button>
              <button
                onClick={clearBudget}
                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Limpiar</span>
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
                onClick={() => setSelectedProject(project)}
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
              onClick={() => setShowWizard(true)}
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
        {showDreamMode && (
          <Suspense fallback={
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin"></div>
            </div>
          }>
            <DreamMode onClose={() => setShowDreamMode(false)} />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <Suspense fallback={
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin"></div>
            </div>
          }>
            <ProjectDetail
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
              onUpdate={handleUpdateProject}
              onDelete={handleDeleteProject}
            />
          </Suspense>
        )}
      </AnimatePresence>
      
      {/* Wizard Flow */}
      <AnimatePresence>
        {showWizard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <Suspense fallback={
              <div className="flex items-center justify-center p-8">
                <div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin"></div>
              </div>
            }>
              <WizardFlow onComplete={handleWizardComplete} />
            </Suspense>
            <button
              onClick={() => setShowWizard(false)}
              className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding */}
      <AnimatePresence>
        {showOnboarding && (
           <Suspense fallback={<div></div>}>
            <OnboardingWizard onComplete={() => {
              localStorage.setItem('arkitecto_onboarding_completed', 'true');
              setShowOnboarding(false);
            }} />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}
