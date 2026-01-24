import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdvisorRoute from "./components/AdvisorRoute";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Skills from "./pages/Skills";
import Recommend from "./pages/Recommend";
import History from "./pages/History";
import RunResult from "./pages/RunResult";

// Day 15
import AdminSkills from "./pages/admin/AdminSkills";
import AdminJobPaths from "./pages/admin/AdminJobPaths";
import AdminRequirements from "./pages/admin/AdminRequirements";
import AdminRoadmap from "./pages/admin/AdminRoadmap";


export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/history" element={<History />} />
          <Route path="/runs/:runId" element={<RunResult />} />

          {/* Advisor (Day 15) */}
          <Route element={<AdvisorRoute />}>
            <Route path="/admin/skills" element={<AdminSkills />} />
              <Route path="/admin/job-paths" element={<AdminJobPaths />} />
              <Route path="/admin/job-paths/:id/requirements" element={<AdminRequirements />} />
              <Route path="/admin/job-paths/:id/roadmap" element={<AdminRoadmap />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer />
    </>
  );
}
