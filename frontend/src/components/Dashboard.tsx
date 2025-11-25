import { useState, useEffect } from 'react';
import { Project } from '../types';
import { getProjects, createProject } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <button
          onClick={handleCreateProject}
          className="px-4 py-2 font-bold text-dark-950 bg-neon-cyan rounded-md hover:bg-opacity-90 transition-colors"
        >
          Create Project
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="glass-strong p-6 rounded-2xl">
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
      {projects.length === 0 && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-400">No projects yet</h2>
          <p className="text-gray-500">Click "Create Project" to get started.</p>
        </div>
      )}
    </div>
  );
}