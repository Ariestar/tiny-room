import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import type { Project } from '../types';
import projects from '../assets/data/projects';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 在实际应用中，这里可能是一个API调用
    // 现在我们从静态数据中获取
    setLoading(true);
    try {
      const foundProject = projects.find(p => p.id === id);
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
  }, [id]);

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
            <span>{project.date}</span>
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

        {project.technologies && project.technologies.length > 0 && (
          <div className="project-tech mb-8">
            <h2 className="text-xl font-semibold mb-4">使用技术</h2>
            <ul className="list-disc list-inside">
              {project.technologies.map(tech => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>
        )}

        {project.images && project.images.length > 0 && (
          <div className="project-gallery mb-8">
            <h2 className="text-xl font-semibold mb-4">项目图库</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.images.map((img, index) => (
                <figure key={index} className="project-gallery-item">
                  <img
                    src={img.url}
                    alt={img.caption || `${project.title} 图片 ${index + 1}`}
                    className="w-full h-auto rounded-md shadow-sm"
                  />
                  {img.caption && (
                    <figcaption className="text-sm text-gray-500 mt-2">{img.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}

        {project.link && (
          <div className="project-link mt-8">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
            >
              访问项目
            </a>
          </div>
        )}
      </article>
    </main>
  );
}
