import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { saveAuth } from "../utils/auth";

export default function Register() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // mặc định student
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { email, password, role });
      // nếu backend register trả luôn token thì save luôn
      if (res.data?.token) {
        saveAuth(res.data);
        nav("/dashboard");
      } else {
        // nếu backend không trả token, chuyển qua login
        nav("/login");
      }
    } catch (error) {
      setErr(error?.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold">Register</h1>

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

        <select
          className="w-full border rounded p-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">student</option>
          <option value="advisor">advisor</option>
        </select>

        {err && <div className="text-red-600 text-sm">{err}</div>}

        <button
          disabled={loading}
          className="w-full bg-black text-white rounded p-2 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <p className="mt-3 text-sm">
        Đã có tài khoản? <Link className="underline" to="/login">Login</Link>
      </p>
    </div>
  );
}
