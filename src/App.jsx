import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import ProjectsPage from "./pages/ProjectsPage";
import TasksPage from "./pages/TasksPage";
import AccountsPage from "./pages/AccountsPage";
import { TokenContext } from "./context/TokenContext";
import { useToken } from "./api/useToken";

const queryClient = new QueryClient();

function AppContent() {
  console.log("AppContent mounted");

  const { data, isLoading, error } = useToken();

  console.log("Token query result:", { data, isLoading, error });

  if (isLoading) return <p>Loading token...</p>;
  if (error) return <p>Failed to load token</p>;

  const token = data.access;



  return (
    <TokenContext.Provider value={token}>
      <div className="p-6">
        <Routes>
          <Route path="/" element={<AccountsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="*" element={<NotFoundPage />} /> {/* Fallback route */}
        </Routes>
      </div>
    </TokenContext.Provider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
