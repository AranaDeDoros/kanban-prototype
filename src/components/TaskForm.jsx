import React, { useEffect, useState } from "react";
import { useCreateTask } from "../api/useCreateTask";

export function CreateTaskForm({ token, onTaskCreated, projectId }) {
  const defaultObj = {
    title: "",
    description: "",
    status: "backlog",
    project: projectId,
  };
  const [formData, setFormData] = useState(defaultObj);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { mutate: createTask, isPending } = useCreateTask(token);

  useEffect(() => {
    if (projectId) {
      setFormData((prev) => ({ ...prev, project: projectId }));
    }
  }, [projectId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.project) {
      setError("Missing project ID");
      return;
    }

    createTask(formData, {
      onSuccess: (newTask) => {
        onTaskCreated?.(newTask);
        setFormData({
          title: "",
          description: "",
          status: "backlog",
          project: projectId,
        });
      },
      onError: () => setError("Error creating task"),
    });
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Create Task</h2>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="backlog" defaultValue aria-readonly disabled>
            Backlog
          </option>
        </select>
      </div>

      {/*  <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Project ID
        </label>
        <input
          type="number"
          name="project"
          value={formData.project}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div> */}

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition"
      >
        {loading ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}
