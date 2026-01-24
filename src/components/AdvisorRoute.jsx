import { Navigate, Outlet } from "react-router-dom";
import { getUser, getToken } from "../utils/auth";

export default function AdvisorRoute() {
  const token = getToken?.() || localStorage.getItem("token");
  const user = getUser?.();

  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== "advisor") return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
