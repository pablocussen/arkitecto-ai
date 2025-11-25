import { useState, useEffect } from 'react';
import { Project, BudgetItem } from '../types.ts';
import { getProjects, createProject, analyzeBudget } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import MagicEyeButton from './MagicEyeButton';
import DreamMode from './DreamMode';
import BudgetList from './BudgetList';
import { AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDreamMode, setShowDreamMode] = useState(false);
  const [analyzingBudget, setAnalyzingBudget] = useState(false);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [budgetTotal, setBudgetTotal] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      try {
        const userProjects = await getProjects();
        setProjects(userProjects);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const handleCreateProject = async () => {
    const title = prompt("Enter project title:");
    if (title) {
      try {
        const newProject = await createProject({ title });
        setProjects([...projects, newProject]);
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleBudgetCapture = async (file: File, instruction: string) => {
    setAnalyzingBudget(true);
    setError(null);
    setBudgetItems([]);
    setBudgetTotal(0);

    try {
      const result = await analyzeBudget(file, instruction);
      if (result.success && result.presupuesto?.items) {
        setBudgetItems(result.presupuesto.items);
        setBudgetTotal(result.presupuesto.total_estimado || result.presupuesto.items.reduce((sum, item) => sum + item.subtotal, 0));
      } else {
        setError('Error al analizar el presupuesto');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setAnalyzingBudget(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowDreamMode(true)}
            className="px-4 py-2 font-bold text-dark-950 bg-gradient-to-r from-neon-banana to-neon-cyan rounded-md hover:opacity-90 transition-colors"
          >
            Modo Sueño
          </button>
          <button
            onClick={handleCreateProject}
            className="px-4 py-2 font-bold text-dark-950 bg-neon-cyan rounded-md hover:bg-opacity-90 transition-colors"
          >
            Crear Proyecto
          </button>
        </div>
      </div>

      {/* Budget Analysis Results */}
      {analyzingBudget && (
        <div className="mb-8 glass-strong p-8 rounded-2xl text-center">
          <div className="w-12 h-12 border-4 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neon-cyan font-semibold">Analizando presupuesto...</p>
          <p className="text-gray-400 text-sm">La IA está procesando tu imagen</p>
        </div>
      )}

      {budgetItems.length > 0 && (
        <div className="mb-8">
          <BudgetList items={budgetItems} total={budgetTotal} />
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="glass-strong p-6 rounded-2xl hover:border-neon-cyan/30 border border-transparent transition-colors cursor-pointer">
            <h2 className="text-xl font-bold text-white">{project.metadata.title}</h2>
            <p className="text-gray-400">{project.metadata.description}</p>
            <div className="mt-4">
              <span className="inline-block bg-gray-700 text-gray-300 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                {project.metadata.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      {projects.length === 0 && budgetItems.length === 0 && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-400">Sin proyectos aún</h2>
          <p className="text-gray-500">Usa el botón flotante para analizar presupuestos o crea un proyecto.</p>
        </div>
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