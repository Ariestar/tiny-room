import { motion } from "framer-motion";
import ProjectCard from "../components/ProjectCard";
import projects from "../assets/data/projects";

export default function Projects() {
  return (
    <motion.section
      className="projects-page max-w-5xl mx-auto py-12 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </motion.section>
  );
} 