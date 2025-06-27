import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import type { Project } from '../types';
import { useProjects } from '../contexts/DataContext';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: projects, actions: projectActions } = useProjects();

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      try {
        // 首先确保数据已加载
        await projectActions.getAll();

        const foundProject = projects.find((p: Project) => p.id.toString() === id);
        if (foundProject) {
          setProject(foundProject);
          setError(null);
        } else {
          setError('找不到该项目');
          setProject(null);
        }
      } catch (err) {
        setError('加载项目时出错');
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id, projects, projectActions]);

  if (loading) {
    return (
      <main className="container mx-auto p-4 pt-16">
        <div className="flex justify-center items-center min-h-[50vh]">
          <p>加载中...</p>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="container mx-auto p-4 pt-16">
        <div className="flex justify-center items-center min-h-[50vh] flex-col">
          <h2 className="text-xl font-bold text-red-500">错误</h2>
          <p>{error || '未知错误'}</p>
          <a href="/projects" className="mt-4 text-teal-600 hover:underline">
            返回项目列表
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <article className="project-detail">
        <div className="mb-8">
          <a href="/projects" className="text-teal-600 hover:underline mb-4 inline-block">
            ← 返回项目列表
          </a>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{project.title}</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map(tag => (
              <span key={tag} className="text-sm bg-teal-100 text-teal-800 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="text-sm text-gray-500 mb-4">
            <span>{project.date || project.startDate}</span>
            <span className="mx-2">•</span>
            <span>{project.category}</span>
            {project.client && (
              <>
                <span className="mx-2">•</span>
                <span>客户: {project.client}</span>
              </>
            )}
            {project.duration && (
              <>
                <span className="mx-2">•</span>
                <span>周期: {project.duration}</span>
              </>
            )}
          </div>
        </header>

        <div className="project-image mb-8">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full max-h-[500px] object-cover rounded-lg shadow-md"
          />
        </div>

        <div className="project-content mb-8">
          <h2 className="text-xl font-semibold mb-4">项目描述</h2>
          <p className="mb-4">{project.description}</p>
          {project.details && <p className="mb-4">{project.details}</p>}
        </div>

        {((project.technologies && project.technologies.length > 0) ||
          (project.techStack && project.techStack.length > 0)) && (
          <div className="project-tech mb-8">
            <h2 className="text-xl font-semibold mb-4">使用技术</h2>
            <ul className="list-disc list-inside">
              {(project.technologies || project.techStack).map(tech => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="project-actions mt-8 flex gap-4">
          {(project.link || project.demoUrl) && (
            <a
              href={project.link || project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
            >
              访问项目
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              查看代码
            </a>
          )}
        </div>
      </article>
    </main>
  );
}
