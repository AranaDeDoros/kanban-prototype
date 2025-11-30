import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { TokenContext } from "../context/TokenContext";

export  function ProtectedRoute({ children }) {
  const { token, loading } = useContext(TokenContext);

  if (loading) return <div>Loading...</div>;

  if (!token) return <Navigate to="/login" replace />;

  return children;
}
