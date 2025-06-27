import { motion } from 'framer-motion';
import { useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import { useProjects } from '../contexts/DataContext';

export default function Projects() {
  const { data: projects, loading, actions } = useProjects();

  useEffect(() => {
    // 组件挂载时加载项目数据
    actions.getAll();
  }, []);

  if (loading.isLoading) {
    return (
      <motion.section
        className="projects-page max-w-5xl mx-auto py-12 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">加载项目中...</div>
        </div>
      </motion.section>
    );
  }

  if (loading.error) {
    return (
      <motion.section
        className="projects-page max-w-5xl mx-auto py-12 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">加载失败: {loading.error}</div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="projects-page max-w-5xl mx-auto py-12 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </motion.section>
  );
}
