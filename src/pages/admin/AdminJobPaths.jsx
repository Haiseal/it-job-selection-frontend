import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function AdminJobPaths() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    difficulty: "beginner",
  });

  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    try {
      setErr("");
      setLoading(true);
      const res = await api.get("/job-paths");
      setItems(res.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({ name: "", description: "", difficulty: "beginner" });
    setEditingId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setErr("");

      if (!form.name.trim()) {
        setErr("Name is required");
        return;
      }

      if (editingId) {
        await api.put(`/job-paths/${editingId}`, form);
      } else {
        await api.post("/job-paths", form);
      }

      await load();
      resetForm();
    } catch (e2) {
      setErr(e2?.response?.data?.message || e2.message || "Save failed");
    }
  };

  const onEdit = (jp) => {
    setEditingId(jp.id);
    setForm({
      name: jp.name ?? "",
      description: jp.description ?? "",
      difficulty: jp.difficulty ?? "beginner",
    });
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this job path?")) return;
    try {
      setErr("");
      await api.delete(`/job-paths/${id}`);
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Admin • Job Paths</h1>
      <p className="text-gray-600 mt-1">
        CRUD job paths link to Requirements & Roadmap
      </p>

      {err && (
        <div className="mt-4 border rounded p-3 bg-red-50 text-red-700">
          {err}
        </div>
      )}

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="border rounded p-4">
          <div className="font-semibold mb-3">
            {editingId ? `Edit JobPath #${editingId}` : "Add JobPath"}
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <div className="text-sm font-medium">Name</div>
              <input
                className="w-full border rounded px-3 py-2"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Data Engineer"
              />
            </div>

            <div>
              <div className="text-sm font-medium">Difficulty</div>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.difficulty}
                onChange={(e) =>
                  setForm({ ...form, difficulty: e.target.value })
                }
              >
                <option value="beginner">beginner</option>
                <option value="intermediate">intermediate</option>
                <option value="advanced">advanced</option>
              </select>
            </div>

            <div>
              <div className="text-sm font-medium">Description</div>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Short description..."
              />
            </div>

            <div className="flex gap-2">
              <button className="bg-black text-white px-4 py-2 rounded">
                {editingId ? "Save" : "Add"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="border px-4 py-2 rounded"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="border rounded p-4">
          <div className="font-semibold mb-3">List</div>

          {loading ? (
            <div>Loading...</div>
          ) : items.length === 0 ? (
            <div className="text-gray-600">No job paths yet.</div>
          ) : (
            <div className="space-y-3">
              {items.map((jp) => (
                <div
                  key={jp.id}
                  className="border rounded p-3 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold">{jp.name}</div>
                    <div className="text-sm text-gray-600">
                      {jp.difficulty}
                    </div>
                    {jp.description && (
                      <div className="text-sm mt-1">{jp.description}</div>
                    )}

                    <div className="mt-2 flex gap-3 text-sm underline">
                      <Link to={`/admin/job-paths/${jp.id}/requirements`}>
                        Requirements
                      </Link>
                      <Link to={`/admin/job-paths/${jp.id}/roadmap`}>
                        Roadmap
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      className="border px-3 py-1 rounded"
                      onClick={() => onEdit(jp)}
                    >
                      Edit
                    </button>
                    <button
                      className="border px-3 py-1 rounded"
                      onClick={() => onDelete(jp.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
