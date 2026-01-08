import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { saveAuth } from "../utils/auth";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      // backend bạn đang trả: { user: {...}, token: "..." }
      saveAuth(res.data);
      nav("/dashboard");
    } catch (error) {
      setErr(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold">Login</h1>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input
          className="w-full border rounded p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded p-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {err && <div className="text-red-600 text-sm">{err}</div>}

        <button
          disabled={loading}
          className="w-full bg-black text-white rounded p-2 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <p className="mt-3 text-sm">
        Chưa có tài khoản? <Link className="underline" to="/register">Register</Link>
      </p>
    </div>
  );
}
