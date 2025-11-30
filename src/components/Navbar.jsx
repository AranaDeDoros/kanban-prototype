import { useTokenContext } from "../hooks/useTokenContext";

export function Navbar() {
  const { token,  logout, appName } = useTokenContext();
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <img src="/public/kanban.png" alt="Logo" className="h-8 w-8 mr-2" />
        <span className="font-bold text-lg">{appName}</span>
      </div>

      <div className="flex items-center space-x-4">
        {token && (
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 bg-gradient-to-r from-red-500 to-rose-700
            hover:from-red-600 hover:to-rose-600 rounded transition-all shadow-md hover:shadow-lg
            active:scale-[0.98]"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
