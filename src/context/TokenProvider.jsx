import { useState, useEffect } from "react";
import { TokenContext } from "./TokenContext";

export function TokenProvider({ children }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const appName = "KanbanProto";

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setLoading(false);
    }
  }, []);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
  };

  return (
    <TokenContext.Provider value={{ token, login, logout, appName, loading }}>
      {children}
    </TokenContext.Provider>
  );
}
