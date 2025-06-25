import type { MetaFunction } from "react-router";
import ProjectsPage from "../pages/Projects";

export const meta: MetaFunction = () => [
  { title: "Projects" },
  { name: "description", content: "My projects" },
];

export default function Projects() {
  return <ProjectsPage />;
} 