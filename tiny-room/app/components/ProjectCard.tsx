import { motion } from "framer-motion";

export interface Project {
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      className="project-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <img
        src={project.imageUrl}
        alt={project.title}
        className="w-full h-40 object-cover rounded-md mb-3"
      />
      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
        {project.description}
      </p>
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-600 hover:underline text-sm"
        >
          View Project →
        </a>
      )}
    </motion.article>
  );
} 