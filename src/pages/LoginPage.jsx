import React, {  useState } from "react";
import { useAuth } from "../api/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
    setLoading(true)
    auth(
      {
        username: username,
        password: password,
      },
      {
        onSuccess: (auth) => {
          console.log("auth -> " + auth);
          localStorage.setItem("token", auth.access);
          localStorage.setItem("refresh", auth.refresh);
          setLoading(false);
          navigate("/projects");
        },
        onError: () => {
          setError("Login error");
          setLoading(false);
        }
      }
    );
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form
        method="POST"
        onSubmit={handleSubmit}
        className="bg-slate-200 shadow-md rounded-lg p-6 w-full max-w-md mx-auto"
      >
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleUsername}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePassword}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "login in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
