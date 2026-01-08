


import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";
import api from "../api/axios";
import { useEffect } from "react";

export default function Dashboard() {
  const nav = useNavigate();
  const user = getUser();

  useEffect(() => {
    api.get("/me/skills")
      .then((res) => {
        console.log("Skills:", res.data);
      })
      .catch((err) => {
        console.error("API error:", err.response?.status);
      });
  }, []);

  const onLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-gray-700">
        Xin chào: <b>{user?.email}</b> — role: <b>{user?.role}</b>
      </p>

      <button onClick={onLogout} className="mt-4 border rounded px-3 py-2">
        Logout
      </button>
    </div>
  );
}
