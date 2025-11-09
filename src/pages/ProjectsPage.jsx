import React, { useState } from "react";
import KanbanBoard from "../components/KanbanBoard";
import { useProjects } from "../api/useProjects";
import { useTokenContext } from "../context/TokenContext";

export default function ProjectsPage() {
  const token = useTokenContext();
  const { data: projects } = useProjects(token);
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <div className="flex gap-4 mb-6">
        {projects?.map((p) => (
          <button
            key={p.id}
            className={`px-3 py-1 rounded ${
              selectedProject === p.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedProject(p.id)}
          >
            {p.name}
          </button>
        ))}
      </div>
      {selectedProject && <KanbanBoard projectId={selectedProject} />}
    </div>
  );
}
