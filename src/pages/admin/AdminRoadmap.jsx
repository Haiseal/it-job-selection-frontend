import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";

export default function AdminRoadmap() {
  const { id } = useParams(); // job_path_id
  const jobPathId = id;

  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    step_order: 1,
    title: "",
    description: "",
    estimated_hours: "",
  });

  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    try {
      setErr("");
      setLoading(true);
      const res = await api.get(`/job-paths/${jobPathId}/roadmap`);
      setItems(res.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [jobPathId]);

  const reset = () => {
    setForm({ step_order: 1, title: "", description: "", estimated_hours: "" });
    setEditingId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setErr("");

      if (!form.title.trim()) {
        setErr("Title is required");
        return;
      }

      const payload = {
        step_order: Number(form.step_order),
        title: form.title,
        description: form.description,
        estimated_hours: form.estimated_hours === "" ? null : Number(form.estimated_hours),
      };

      if (editingId) {
        await api.put(`/roadmap-items/${editingId}`, payload);
      } else {
        await api.post(`/job-paths/${jobPathId}/roadmap`, payload);
      }

      await load();
      reset();
    } catch (e2) {
      setErr(e2?.response?.data?.message || e2.message || "Save failed");
    }
  };

  const onEdit = (r) => {
    setEditingId(r.id);
    setForm({
      step_order: r.step_order ?? 1,
      title: r.title ?? "",
      description: r.description ?? "",
      estimated_hours: r.estimated_hours ?? "",
    });
  };

  const onDelete = async (rid) => {
    if (!confirm("Delete this roadmap item?")) return;
    try {
      setErr("");
      await api.delete(`/roadmap-items/${rid}`);
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin • Roadmap</h1>
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

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="border rounded p-4">
          <div className="font-semibold mb-3">
            {editingId ? `Edit Roadmap Item #${editingId}` : "Add Roadmap Item"}
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm font-medium">Step order</div>
                <input
                  type="number"
                  min="1"
                  className="w-full border rounded px-3 py-2"
                  value={form.step_order}
                  onChange={(e) =>
                    setForm({ ...form, step_order: e.target.value })
                  }
                />
              </div>
              <div>
                <div className="text-sm font-medium">Estimated hours</div>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  className="w-full border rounded px-3 py-2"
                  value={form.estimated_hours}
                  onChange={(e) =>
                    setForm({ ...form, estimated_hours: e.target.value })
                  }
                  placeholder="optional"
                />
              </div>
            </div>

            <div>
              <div className="text-sm font-medium">Title</div>
              <input
                className="w-full border rounded px-3 py-2"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., Learn SQL Basics"
              />
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
                  onClick={reset}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="border rounded p-4">
          <div className="font-semibold mb-3">Roadmap List</div>

          {loading ? (
            <div>Loading...</div>
          ) : items.length === 0 ? (
            <div className="text-gray-600">No roadmap items yet.</div>
          ) : (
            <div className="space-y-3">
              {items
                .slice()
                .sort((a, b) => (a.step_order ?? 0) - (b.step_order ?? 0))
                .map((r) => (
                  <div key={r.id} className="border rounded p-3">
                    <div className="font-semibold">
                      Step {r.step_order}: {r.title}
                    </div>
                    {r.description && (
                      <div className="text-sm text-gray-700 mt-1">
                        {r.description}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      hours: {r.estimated_hours ?? "—"}
                    </div>

                    <div className="mt-2 flex gap-2">
                      <button
                        className="border px-3 py-1 rounded"
                        onClick={() => onEdit(r)}
                      >
                        Edit
                      </button>
                      <button
                        className="border px-3 py-1 rounded"
                        onClick={() => onDelete(r.id)}
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
