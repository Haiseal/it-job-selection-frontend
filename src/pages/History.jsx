import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function History() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [items, setItems] = useState([]);

  const load = async () => {
    try {
      setErr("");
      setLoading(true);

      // ✅ đúng theo plan Day 13–14
      const res = await api.get("/recommend/history");
      const list = Array.isArray(res.data) ? res.data : (res.data?.items ?? []);
      setItems(list);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Load history failed";

      setErr(msg);

      // Nếu backend trả 401 (token hết hạn) => đá về login
      if (e?.response?.status === 401) nav("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (s) => {
    if (!s) return "";
    const d = new Date(s);
    return isNaN(d.getTime()) ? s : d.toLocaleString();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Recommendation History</h1>
          <p className="text-gray-600 mt-1">
            Danh sách các lần bạn đã generate recommendation.
          </p>
        </div>

        <button
          onClick={load}
          className="border rounded px-4 py-2 hover:bg-gray-50"
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {err && (
        <div className="mt-4 border rounded p-3 bg-red-50 text-red-700">
          {err}
        </div>
      )}

      {loading && (
        <div className="mt-6 text-gray-600">Đang tải lịch sử...</div>
      )}

      {!loading && !err && items.length === 0 && (
        <div className="mt-6 border rounded p-4 bg-gray-50 text-gray-700">
          Chưa có lịch sử. Hãy qua trang <b>Recommend</b> và bấm Generate.
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="mt-6 space-y-3">
          {items.map((it) => (
            <button
              key={it.run_id || it.id}
              onClick={() => nav(`/recommend/runs/${it.run_id || it.id}`)}
              className="w-full text-left border rounded p-4 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold">
                  Run #{it.run_id || it.id}
                </div>
                <div className="text-sm text-gray-600">
                  {formatDate(it.created_at || it.createdAt)}
                </div>
              </div>

              <div className="text-sm text-gray-700 mt-2">
                Top job: <b>{it.top_job_name || it.top_job || it.topJob || "N/A"}</b>
                {" • "}
                Score: <b>{it.top_score || it.score || it.topScore || "N/A"}</b>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
