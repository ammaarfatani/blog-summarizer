import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  const menu = [
    {
      name: "Home",
      path: "/",
      icon: <Home size={18} />,
    },
    {
      name: "dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Summarizer",
      path: "/summarizer",
      icon: <FileText size={18} />,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#000] text-white flex flex-col">
      <div className="flex flex-col items-center py-8 border-b border-white/10">
  <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold">
    {user?.email?.[0]?.toUpperCase() || "U"}
  </div>

  <h2 className="mt-4 text-lg font-semibold uppercase">
    {user?.email
      ? user.email
          .split("@")[0]         
          .replace(/[^a-zA-Z0]/g, " ") 
      : "AMMAR FATANI"}
  </h2>
</div>


      <nav className="mt-6 flex-1 px-3 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-white/10"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
