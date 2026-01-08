import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `px-3 py-1 rounded ${isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"}`;

  return (
    <div className="border-b bg-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold">
          IT Job Selection
        </Link>

        <div className="flex gap-2 text-sm">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/login" className={linkClass}>Login</NavLink>
          <NavLink to="/register" className={linkClass}>Register</NavLink>
        </div>
      </div>
    </div>
  );
}
