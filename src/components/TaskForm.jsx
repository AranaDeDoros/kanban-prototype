import React, { useEffect, useState } from "react";
import { useCreateTask } from "../api/useCreateTask";
import { CriteriaList } from "./CriteriaList";
import RichText from "./RichText";

export function CreateTaskForm({ token, onTaskCreated, projectId }) {
  const defaultObj = {
    title: "",
    description: "",
    status: "backlog",
    project: projectId,
    estimate_points: 1,
    priority: "regular",
    acceptance_criteria: "",
  };
  const [formData, setFormData] = useState(defaultObj);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { mutate: createTask } = useCreateTask(token);
  const [criteriaResetKey, setCriteriaResetKey] = useState(0);

  const [criteriaList, setCriteriaList] = useState([]);
  const handleCriteriaText = (items) => {
    setCriteriaList(items);
    console.log(items.map((c) => c.value).join("\n"));
  };

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
    setLoading(true);

    if (!formData.project) {
      setError("Missing project ID");
      setLoading(false);
      return;
    }

    if (criteriaList.length > 0) {
      formData.acceptance_criteria = criteriaList
        .map((c) => c.value)
        .join("\n");
    } else if (criteriaList.length < 1) {
      console.log(criteriaList);
      setError("Must add at least one criteria");
      setLoading(false);
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
          estimate_points: 1,
          priority: "regular",
          acceptance_criteria: "",
        });
      },
      onError: () => setError("Error creating task"),
      onSettled: () => {
        setLoading(false);
        handleReset();
      },
    });
  };

  const handleReset = () => {
    setCriteriaResetKey((prev) => prev + 1);
    setCriteriaList([]);
    setFormData(defaultObj);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg px-6 w-full max-w-md mx-auto"
    >
      <div className="mb-1">
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-100 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 caret-blue"
          required
        />
      </div>
      <div className="mb-1">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 caret-blue"
        />
        {/* <div className="mb-2 max-h-40 overflow-y-auto">
          <RichText
            value={formData.description}
            onChange={(html) =>
              setFormData((prev) => ({ ...prev, description: html }))
            }
          />
        </div> */}
      </div>
      <div className="mb-1">
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          name="status"
          disabled
          defaultValue={formData.status}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
        >
          {/* <option value="">Select a status</option> */}
          <option value="backlog" defaultValue aria-readonly>
            Backlog
          </option>
        </select>
      </div>

      <div className="mb-1 max-h-32 overflow-y-auto">
        <CriteriaList key={criteriaResetKey} onChange={handleCriteriaText} />
        {/* <ol>
          {criteriaList.map((c, idx) => {
            return <li key={idx}>{c.value}</li>;
          })}
        </ol> */}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-1">
        <div className="mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Estimate
          </label>
          <input
            type="number"
            max={10}
            name="estimate_points"
            value={formData.estimate_points}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 caret-blue"
            required
          />
        </div>

        <div className="mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select priority</option>
            <option value="low">Low</option>
            <option value="regular">Regular</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-1">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="text-lg w-full py-2 rounded-md font-semibold text-white
                    bg-gradient-to-r from-sky-600 to-sky-800
                    hover:from-sky-600 hover:to-sky-600
                    transition-all shadow-md hover:shadow-lg
                    active:scale-[0.98]"
      >
        {loading ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}
