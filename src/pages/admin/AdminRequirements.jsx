// src/pages/admin/AdminRequirements.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function AdminRequirements() {
  const { id } = useParams(); // job_path_id
  const jobPathId = String(id || "");

  const [reqs, setReqs] = useState([]);
  const [skills, setSkills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    skill_id: "",
    required_level: 3,
    weight: 1.0,
  });

  // editing theo composite: { skill_id, required_level, weight }
  const [editing, setEditing] = useState(null);

  const skillMap = useMemo(() => {
    const m = new Map();
    for (const s of skills) m.set(Number(s.id), s.name);
    return m;
  }, [skills]);

  const normalizeError = (e, fallback) => {
    return (
      e?.response?.data?.message ||
      e?.response?.data?.error ||
      e?.message ||
      fallback
    );
  };

  const load = async () => {
    if (!jobPathId) return;
    try {
      setErr("");
      setMsg("");
      setLoading(true);

      const [reqRes, skillRes] = await Promise.all([
        api.get(`/job-paths/${jobPathId}/requirements`),
        api.get("/skills"),
      ]);

      const reqData = Array.isArray(reqRes?.data) ? reqRes.data : [];
      const skillData = Array.isArray(skillRes?.data) ? skillRes.data : [];

      setReqs(reqData);
      setSkills(skillData);

      // set default skill nếu đang trống
      setForm((prev) => {
        if (prev.skill_id) return prev;
        if (skillData.length === 0) return prev;
        return { ...prev, skill_id: String(skillData[0].id) };
      });
    } catch (e) {
      setErr(normalizeError(e, "Load failed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobPathId]);

  const onAdd = async (e) => {
    e.preventDefault();
    try {
      setErr("");
      setMsg("");

      if (!form.skill_id) {
        setErr("Choose a skill");
        return;
      }

      await api.post(`/job-paths/${jobPathId}/requirements`, {
        skill_id: Number(form.skill_id),
        required_level: Number(form.required_level),
        weight: Number(form.weight),
      });

      setMsg("Added!");
      await load();
    } catch (e) {
      setErr(normalizeError(e, "Add failed"));
    }
  };

  const startEdit = (r) => {
    setErr("");
    setMsg("");
    setEditing({
      skill_id: Number(r.skill_id),
      required_level: Number(r.required_level),
      weight: Number(r.weight),
    });
  };

  const cancelEdit = () => setEditing(null);

  const saveEdit = async () => {
    if (!editing) return;
    try {
      setErr("");
      setMsg("");

      await api.put(
        `/job-paths/${jobPathId}/requirements/${editing.skill_id}`,
        {
          required_level: Number(editing.required_level),
          weight: Number(editing.weight),
        }
      );

      setMsg("Updated!");
      setEditing(null);
      await load();
    } catch (e) {
      setErr(normalizeError(e, "Update failed"));
    }
  };

  const onDelete = async (r) => {
    const sid = Number(r.skill_id);
    if (!Number.isFinite(sid)) {
      setErr("Missing skill_id to delete.");
      return;
    }
    if (!confirm("Delete this requirement?")) return;

    try {
      setErr("");
      setMsg("");

      await api.delete(`/job-paths/${jobPathId}/requirements/${sid}`);

      setMsg("Deleted!");
      await load();
    } catch (e) {
      setErr(normalizeError(e, "Delete failed"));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin • Requirements</h1>
          <p className="text-gray-600 mt-1">JobPath ID: {jobPathId}</p>
        </div>

        <Link className="underline" to="/admin/job-paths">
          ← Back to Job Paths
        </Link>
      </div>

      {err && (
        <div className="mt-4 border rounded p-3 bg-red-50 text-red-700">
          {err}
        </div>
      )}

      {msg && !err && (
        <div className="mt-4 border rounded p-3 bg-green-50 text-green-700">
          {msg}
        </div>
      )}

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {/* Add Requirement */}
        <div className="border rounded p-4">
          <div className="font-semibold mb-3">Add Requirement</div>

          <form onSubmit={onAdd} className="space-y-3">
            <div>
              <div className="text-sm font-medium">Skill</div>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.skill_id}
                onChange={(e) => setForm({ ...form, skill_id: e.target.value })}
                disabled={skills.length === 0}
              >
                {skills.length === 0 ? (
                  <option value="">(No skills)</option>
                ) : (
                  skills.map((s) => (
                    <option key={s.id} value={String(s.id)}>
                      {s.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm font-medium">Required level (1–5)</div>
                <input
                  type="number"
                  min="1"
                  max="5"
                  className="w-full border rounded px-3 py-2"
                  value={form.required_level}
                  onChange={(e) =>
                    setForm({ ...form, required_level: e.target.value })
                  }
                />
              </div>

              <div>
                <div className="text-sm font-medium">Weight</div>
                <input
                  type="number"
                  step="0.05"
                  min="0.1"
                  className="w-full border rounded px-3 py-2"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                />
              </div>
            </div>

            <button
              className="bg-black text-white px-4 py-2 rounded disabled:opacity-60"
              disabled={!form.skill_id}
            >
              Add
            </button>

            <div className="text-xs text-gray-600">
              * POST/PUT/DELETE cần account có role <b>advisor</b>.
            </div>
          </form>
        </div>

        {/* Current Requirements */}
        <div className="border rounded p-4">
          <div className="font-semibold mb-3">Current Requirements</div>

          {loading ? (
            <div>Loading...</div>
          ) : reqs.length === 0 ? (
            <div className="text-gray-600">No requirements yet.</div>
          ) : (
            <div className="space-y-3">
              {reqs.map((r) => {
                const key = `${r.job_path_id}-${r.skill_id}`;
                const skillName =
                  r.skill_name ??
                  skillMap.get(Number(r.skill_id)) ??
                  `Skill #${r.skill_id}`;

                const isEditing =
                  editing && Number(editing.skill_id) === Number(r.skill_id);

                return (
                  <div key={key} className="border rounded p-3">
                    <div className="font-semibold">{skillName}</div>

                    {isEditing ? (
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          min="1"
                          max="5"
                          className="border rounded px-3 py-2"
                          value={editing.required_level}
                          onChange={(e) =>
                            setEditing({
                              ...editing,
                              required_level: e.target.value,
                            })
                          }
                        />
                        <input
                          type="number"
                          step="0.05"
                          min="0.1"
                          className="border rounded px-3 py-2"
                          value={editing.weight}
                          onChange={(e) =>
                            setEditing({ ...editing, weight: e.target.value })
                          }
                        />

                        <div className="col-span-2 flex gap-2">
                          <button
                            className="bg-black text-white px-4 py-2 rounded"
                            onClick={saveEdit}
                            type="button"
                          >
                            Save
                          </button>
                          <button
                            className="border px-4 py-2 rounded"
                            onClick={cancelEdit}
                            type="button"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-700 mt-1">
                        level: <b>{r.required_level}</b> • weight:{" "}
                        <b>{r.weight}</b>
                      </div>
                    )}

                    <div className="mt-2 flex gap-2">
                      <button
                        className="border px-3 py-1 rounded"
                        onClick={() => startEdit(r)}
                      >
                        Edit
                      </button>
                      <button
                        className="border px-3 py-1 rounded"
                        onClick={() => onDelete(r)}
                      >
                        Delete
                      </button>
                    </div>

                    <div className="text-xs text-gray-600 mt-2">
                      Endpoint: <code>/job-paths/{jobPathId}/requirements/{r.skill_id}</code>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
