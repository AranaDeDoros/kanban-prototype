import { useState } from "react";
import { useAuth } from "../api/useAuth";
import { useNavigate } from "react-router-dom";
import { useTokenContext } from "../hooks/useTokenContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useTokenContext();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { mutate: auth } = useAuth();

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    console.log("submit");
    e.preventDefault();
    setError("");
    setLoading(true);
    auth(
      {
        username: username,
        password: password,
      },
      {
        onSuccess: (auth) => {
          console.log("auth -> " + JSON.stringify(auth));
          //localStorage.setItem("token", auth.access);
          localStorage.setItem("refresh", auth.refresh);
          setLoading(false);
          login(auth.access);
          navigate("/projects");
        },
        onError: () => {
          setError("Login error");
          setLoading(false);
        },
      }
    );
  };

  return (
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
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleUsername}
            autoComplete="username"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-3 w-full">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePassword}
            autoComplete="current-password"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full py-2 rounded-md font-semibold text-white
            bg-gradient-to-r from-blue-500 to-cyan-500
            hover:from-blue-600 hover:to-cyan-600
            transition-all shadow-md hover:shadow-lg
            active:scale-[0.98]
          "
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
