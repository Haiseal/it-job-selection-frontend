import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function Navbar() {
  const navigate = useNavigate();

  // token state để Navbar re-render khi token đổi
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  // lắng nghe thay đổi localStorage (tab khác) + khi bạn tự setToken()
  useEffect(() => {
    const onStorage = () => setToken(localStorage.getItem("token") || "");
    window.addEventListener("storage", onStorage);

    // trick: mỗi lần focus lại tab cũng sync token (đỡ bị stale)
    window.addEventListener("focus", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onStorage);
    };
  }, []);

  const me = useMemo(() => parseJwt(token), [token]);
  const role = me?.role || "unknown";
  const loggedIn = !!token;

  const linkClass = ({ isActive }) =>
    `px-3 py-1 rounded text-sm ${
      isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  const logout = () => {
    localStorage.removeItem("token");
    setToken(""); // quan trọng: ép Navbar re-render ngay
    navigate("/login");
  };

  return (
    <div className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold">
          IT Job Selection
        </Link>

        <div className="flex items-center gap-2">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          {/* STUDENT menu */}
          {loggedIn && role === "student" && (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/skills" className={linkClass}>
                Skills
              </NavLink>
              <NavLink to="/recommend" className={linkClass}>
                Recommend
              </NavLink>
              <NavLink to="/history" className={linkClass}>
                History
              </NavLink>
            </>
          )}

          {/* ADVISOR menu */}
          {loggedIn && role === "advisor" && (
            <>
              <NavLink to="/admin/skills" className={linkClass}>
                Admin Skills
              </NavLink>
              <NavLink to="/admin/job-paths" className={linkClass}>
                Admin JobPaths
              </NavLink>
            </>
          )}

          {!loggedIn ? (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                Register
              </NavLink>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-600 ml-2">
                <b>{role}</b>
              </span>
              <button
                onClick={logout}
                className="ml-2 border rounded px-3 py-1 text-sm hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
