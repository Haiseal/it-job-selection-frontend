import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function History() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [runs, setRuns] = useState([]);

  const load = async () => {
    try {
      setErr("");
      setLoading(true);
      const res = await api.get("/recommend/runs"); // ✅ backend của bạn
      setRuns(res.data?.runs ?? res.data ?? []);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Load history failed";
      setErr(msg);
      setRuns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Recommendation History</h1>
          <p className="text-gray-600 mt-1">
            List of times you have generated recommendations.
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="border rounded px-4 py-2 disabled:opacity-60"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {err && (
        <div className="mt-4 border rounded p-3 bg-red-50 text-red-700">
          {err}
        </div>
      )}

      {!loading && !err && runs.length === 0 && (
        <div className="mt-6 text-gray-600">
          Chưa có lịch sử. Hãy qua trang <b>Recommend</b> để generate.
        </div>
      )}

      {runs.length > 0 && (
        <div className="mt-6 space-y-3">
          {runs.map((r) => (
            <div key={r.run_id ?? r.id} className="border rounded p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">
                    Run #{r.run_id ?? r.id}
                  </div>
                  <div className="text-sm text-gray-600">
                    {r.created_at ? `created: ${r.created_at}` : ""}
                    {r.top_job_name ? ` • top: ${r.top_job_name}` : ""}
                    {r.top_score != null ? ` • score: ${r.top_score}` : ""}
                  </div>
                </div>

                <Link
                  to={`/runs/${r.run_id ?? r.id}`}
                  className="text-sm underline"
                >
                  View details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
