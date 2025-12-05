import { useEffect, useState } from "react";
import { useTokenContext } from "../hooks/useTokenContext";
import { useUser } from "../api/useUser";
import { useCreateProject } from "../api/useCreateProject";
import Toast from "../components/Toast";
import { useUsers } from "../api/useUsers";
import MembersMultiSelect from "../components/MultiSelect";

export default function CreateProjectPage() {
  const defaultObj = {
    name: "",
    description: "",
    members: [],
    owner: {},
  };

  const { token } = useTokenContext();
  const { data: user } = useUser(token);
  const [owner, setOwner] = useState(null);
  const [formData, setFormData] = useState(defaultObj);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: users, isLoading } = useUsers(token);
  const { mutate: createProject } = useCreateProject(token);
  const [showToast, setShowToast] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    console.log("user changed in CreateProjectPage:", user);
    if (user) {
      console.log("setting owner to ", user);
      setOwner(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!user?.username) {
      setError("Missing owner.");
      setLoading(false);
      return;
    }

    if (formData.members.length < 1) {
      setError("Must add at least one member");
      setLoading(false);
      return;
    }

    createProject(formData, {
      onSuccess: () => {
        setFormData(defaultObj);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
      },
      onError: () => setError("Error creating project"),
      onSettled: () => {
        setLoading(false);
        handleReset();
      },
    });
  };

  const handleReset = () => {
    setFormData(defaultObj);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-lg px-6 w-full h-full max-w-md mx-auto"
      >
        <div className="mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
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
          <div className="mb-2 max-h-40 overflow-y-auto"></div>
        </div>
        <div className="mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Members
          </label>
          {/*  <select
            name="members"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
          >
            <option value="1" defaultValue aria-readonly>
              Users this will evenually show a list of users
            </option>
          </select> */}
          <MembersMultiSelect
            users={users}
            isLoading={isLoading}
            value={selectedMembers}
            onChange={(values) => {
              setSelectedMembers(values);
              setFormData((prev) => ({
                ...prev,
                members: values.map((v) => v.value),
              }));
            }}
          />
        </div>

        <div className="mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Owner
          </label>
          <input
            type="text"
            name="owner"
            defaultValue={owner?.username ?? ""}
            readOnly
            /* onChange={handleChange} */
            className="mt-1 bg-gray-100 cursor-not-allowed block w-full border border-gray-300 rounded-md p-2
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 caret-blue"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-1">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className=" w-full py-2 rounded-md font-semibold text-white
            bg-gradient-to-r from-blue-500 to-cyan-500
            hover:from-blue-600 hover:to-cyan-600
            transition-all shadow-md hover:shadow-lg
            active:scale-[0.98]"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message="Project created successfully!"
      />
    </>
  );
}
