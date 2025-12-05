import { useState } from "react";
import KanbanBoard from "../components/KanbanBoard";
import { useProjects } from "../api/useProjects";
import { useUser } from "../api/useUser";
import { useNavigate } from "react-router-dom";
import { useTokenContext } from "../hooks/useTokenContext";
import { PlusIcon } from "@heroicons/react/24/solid";

export default function ProjectsPage() {
  const { token } = useTokenContext();
  const { data: projects } = useProjects(token);
  const { data: user } = useUser(token);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();
  const goToCreateProject = () => {
    navigate("/projects/new");
  };

  console.log(user);

  return (
    <div className="p-1">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold mb-4">Projects</h1>
        <div className="flex gap-4 mb-2">
          {user?.isAdmin && (
            <button
              onClick={goToCreateProject}
              className="px-3 py-1 rounded bg-indigo-600 rounded-md font-semibold text-white
                          bg-gradient-to-r from-indigo-500 to-cyan-500
                          hover:from-indigo-600 hover:to-cyan-600
                          transition-all shadow-md hover:shadow-lg
                          active:scale-[0.98]"
            >
              <PlusIcon className="size-5 inline-block mr-1" />
              project
            </button>
          )}
        </div>
      </div>
      <div className="flex gap-4 mb-2">
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
      {projects?.length === 0 && (
        <div className="flex gap-4 mb-6">
          <p>
            No projects found or assigned.{" "}
            {user?.isAdmin && "Your may create a new one."}
          </p>
        </div>
      )}
      {selectedProject && (
        <KanbanBoard projectId={selectedProject} user={user} />
      )}
    </div>
  );
}
