import { useState } from "react";
import { useAuth } from "../api/useAuth";
import { useNavigate } from "react-router-dom";
import { useTokenContext } from "../hooks/useTokenContext";
import { KeyIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Toast from "../components/Toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useTokenContext();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { mutate: auth } = useAuth();
  const [showToast, setShowToast] = useState(false);

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    console.log("submit");
    e.preventDefault();
    setLoading(true);
    auth(
      {
        username: username,
        password: password,
      },
      {
        onSuccess: (auth) => {
          console.log("auth -> " + JSON.stringify(auth));
          localStorage.setItem("refresh", auth.refresh);
          setLoading(false);
          login(auth.access);
          navigate("/projects");
        },
        onError: () => {
          setError("Login error");
          setLoading(false);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2500);
        },
      }
    );
  };

  return (
    <>
      <div className="flex h-130 items-center justify-center ">
        <form
          method="POST"
          onSubmit={handleSubmit}
          className="bg-slate-200 shadow-md rounded-lg p-6 w-75 max-w-md mx-auto flex flex-col justify-center items-center"
        >
          <div className="mb-3 w-full flex justify-center">
            <div
              className="w-40 h-40 bg-center bg-contain bg-no-repeat"
              style={{ backgroundImage: "url('/kanban.png')" }}
            />
          </div>
          <div className="mb-3 w-full">
            <label className="block text-sm font-medium text-gray-700"></label>
            <div className="relative w-full p-2">
              <UserCircleIcon className="size-6 text-sky-600 absolute left-5 top-1/2 -translate-y-1/3 pointer-events-none" />
              <input
                type="text"
                name="username"
                value={username}
                onChange={handleUsername}
                autoComplete="username"
                placeholder=" username"
                className="mt-1 block w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-12"
                required
              />
            </div>
          </div>
          <div className="mb-3 w-full">
            <label className="block text-sm font-medium text-gray-700"></label>
            <div className="relative w-full p-2">
              <KeyIcon className="size-6 text-sky-600 absolute left-5 top-1/2 -translate-y-1/3 pointer-events-none" />
              <input
                type="password"
                name="password"
                value={password}
                onChange={handlePassword}
                autoComplete="current-password"
                placeholder="password"
                className="mt-1 block w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-12"
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`
            w-full py-2 rounded-md font-semibold text-white
            bg-gradient-to-r from-blue-500 to-cyan-500
            hover:from-blue-600 hover:to-cyan-600
            transition-all shadow-md hover:shadow-lg
            active:scale-[0.98]
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message="Login error. Please check your credentials."
        duration={2500}
      />
    </>
  );
}
