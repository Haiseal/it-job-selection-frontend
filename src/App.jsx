import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Skills from "./pages/Skills";
import ProtectedRoute from "./components/ProtectedRoute";
import Recommend from "./pages/Recommend";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Các route cần login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/recommend" element={<Recommend />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
