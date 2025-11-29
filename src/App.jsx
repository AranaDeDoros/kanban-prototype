import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import ProjectsPage from "./pages/ProjectsPage";
import LoginPage from "./pages/LoginPage";
import { TokenContext } from "./context/TokenContext";
import { useToken } from "./api/useToken";
import CreateProjectPage from "./pages/CreateProjectPage";

const queryClient = new QueryClient();

function AppContent() {
  console.log("AppContent mounted");
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  const { data, isLoading, error } = useToken();
  const token = !isLoginPage ? data?.access : null;

  if (!isLoginPage) {
    if (isLoading) return <p>Loading token...</p>;
    if (error) return <p>Failed to load token</p>;
  }

  return (
    <div className="p-6">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/projects"
          element={
            <TokenContext.Provider value={token}>
              <ProjectsPage />
            </TokenContext.Provider>
          }
        />

        <Route
          path="/projects/new"
          element={
            <TokenContext.Provider value={token}>
              <CreateProjectPage />
            </TokenContext.Provider>
          }
        />

        <Route
          path="*"
          element={
            <TokenContext.Provider value={token}>
              <NotFoundPage />
            </TokenContext.Provider>
          }
        />
      </Routes>
    </div>
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
