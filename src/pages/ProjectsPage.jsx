import { useState } from "react";
import KanbanBoard from "../components/KanbanBoard";
import { useProjects } from "../api/useProjects";
import { useUser } from "../api/useUser";
import { useTokenContext } from "../hooks/useTokenContext";

export default function ProjectsPage() {
  const { token } = useTokenContext();
  const { data: projects } = useProjects(token);
  const { data: user } = useUser(token);
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <div className="flex gap-4 mb-6">
        {projects?.map((p) => (
          <button
            key={p.id}
            className={`px-3 py-1 rounded ${
              selectedProject === p.id ? "bg-blue-600" : "bg-gray-200"
            } text-white
            bg-gradient-to-r from-indigo-500 to-cyan-500
            hover:from-indigo-600 hover:to-cyan-600
            transition-all shadow-md hover:shadow-lg
            active:scale-[0.98]"`}
            onClick={() => setSelectedProject(p.id)}
          >
            {p.name}
          </button>
        ))}
      </div>
      {selectedProject && (
        <KanbanBoard projectId={selectedProject} user={user} />
      )}
    </div>
  );
}
