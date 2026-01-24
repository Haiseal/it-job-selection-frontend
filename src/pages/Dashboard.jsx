import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

// decode JWT payload (không cần thư viện)
function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}


const toNum = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};


const asArray = (v) => (Array.isArray(v) ? v : []);


function normalizeRuns(raw) {
  if (!raw) return null;

  if (Array.isArray(raw)) return raw;


  if (raw.data) {
    const inner = normalizeRuns(raw.data);
    if (inner !== null) return inner;
  }

  if (Array.isArray(raw.runs)) return raw.runs;
  if (Array.isArray(raw.items)) return raw.items;
  if (Array.isArray(raw.history)) return raw.history;
  if (Array.isArray(raw.results)) return raw.results;

  return null;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [mySkills, setMySkills] = useState([]);
  const [history, setHistory] = useState([]);


  const [latestTop, setLatestTop] = useState(null); // { job_name, score }

  const token = localStorage.getItem("token") || "";
  const me = useMemo(() => parseJwt(token), [token]); // { id, email, role, ... }

  
  const fetchHistory = async () => {
    const endpoints = [
      "/recommend/runs",     
      "/recommend/history",  
      "/runs",
      "/history",
    ];

    for (const url of endpoints) {
      try {
        const res = await api.get(url);
        const parsed = normalizeRuns(res.data);
        if (parsed !== null) return parsed; // parse được thì dừng
      } catch {
        // bỏ qua -> thử endpoint tiếp theo
      }
    }
    return [];
  };

  const load = async () => {
    try {
      setErr("");
      setLoading(true);

      // 1) Skills của user
      const skillsRes = await api.get("/me/skills");
      setMySkills(asArray(skillsRes.data));

      // 2) History/Runs (fallback nhiều endpoint)
      const runs = await fetchHistory();
      setHistory(asArray(runs));
    } catch (e) {
      setErr(
        e?.response?.data?.message ||
          e?.message ||
          "Load dashboard failed"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSkills = mySkills.length;
  const filledSkills = mySkills.filter((s) => toNum(s.level, 0) > 0).length;

  // ✅ latest run: ưu tiên created_at, nếu không có thì ưu tiên id lớn hơn
  const latest = useMemo(() => {
    if (!history || history.length === 0) return null;

    const copy = [...history];
    copy.sort((a, b) => {
      const ta = new Date(a.created_at || a.createdAt || 0).getTime();
      const tb = new Date(b.created_at || b.createdAt || 0).getTime();

      // nếu có created_at thì sort theo time
      if (ta && tb) return tb - ta;

      // fallback: sort theo id
      return toNum(b.id, 0) - toNum(a.id, 0);
    });

    return copy[0];
  }, [history]);

  // lấy runId theo nhiều kiểu key
  const latestRunId =
    latest?.run_id ?? latest?.id ?? latest?.runId ?? latest?.run?.id ?? null;

  // ✅ Khi có latestRunId -> gọi API results để lấy TOP job điểm cao nhất
  useEffect(() => {
    const fetchTopJob = async () => {
      if (!latestRunId) {
        setLatestTop(null);
        return;
      }
      try {
        const res = await api.get(`/recommend/runs/${latestRunId}/results`);
        const results = asArray(res?.data?.results);

        if (results.length === 0) {
          setLatestTop(null);
          return;
        }

        // sort score giảm dần
        const sorted = [...results].sort(
          (a, b) => toNum(b.score, 0) - toNum(a.score, 0)
        );
        const best = sorted[0];

        setLatestTop({
          job_name: best.job_name ?? best.name ?? best.job_title ?? "(unknown)",
          score: toNum(best.score, 0),
        });
      } catch {
        // không phá UI, chỉ fallback về null
        setLatestTop(null);
      }
    };

    fetchTopJob();
  }, [latestRunId]);

  if (loading) return <div className="max-w-5xl mx-auto p-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Tóm tắt tiến độ và các bước tiếp theo.
          </p>
        </div>

        <button className="border rounded px-4 py-2" onClick={load} type="button">
          Refresh
        </button>
      </div>

      {err && (
        <div className="mt-4 border rounded p-3 bg-red-50 text-red-700">
          {err}
        </div>
      )}

      {/* Cards */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="border rounded p-4">
          <div className="text-sm text-gray-600">Account</div>
          <div className="mt-1 font-semibold">{me?.email || "(unknown)"}</div>
          <div className="text-sm text-gray-700">
            role: <b>{me?.role || "unknown"}</b>
          </div>
        </div>

        <div className="border rounded p-4">
          <div className="text-sm text-gray-600">Skills</div>
          <div className="mt-1 text-2xl font-bold">
            {filledSkills}/{totalSkills}
          </div>
          <div className="text-sm text-gray-700">skills có level &gt; 0</div>
        </div>

        <div className="border rounded p-4">
          <div className="text-sm text-gray-600">Latest Recommendation</div>

          {!latestRunId ? (
            <div className="mt-2 text-sm text-gray-700">
              Chưa có recommendation.
            </div>
          ) : (
            <div className="mt-2">
              <div className="font-semibold">Run #{latestRunId}</div>

              <div className="text-sm text-gray-700">
                Top job:{" "}
                <b>{latestTop?.job_name ?? "(loading...)"}</b>
              </div>

              {latestTop?.score !== null && latestTop?.score !== undefined && (
                <div className="text-sm text-gray-700">
                  Score: <b>{toNum(latestTop.score).toFixed(4)}</b>
                </div>
              )}

              <Link
                className="inline-block mt-2 underline text-sm"
                to={`/runs/${latestRunId}`}
              >
                View details →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 border rounded p-4">
        <div className="font-semibold">Quick Actions</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link className="border rounded px-4 py-2" to="/skills">
            Update Skills
          </Link>
          <Link className="border rounded px-4 py-2" to="/recommend">
            Generate Recommendation
          </Link>
          <Link className="border rounded px-4 py-2" to="/history">
            View History ({history.length})
          </Link>
        </div>
      </div>

      {/* Skills preview */}
      <div className="mt-6 border rounded p-4">
        <div className="font-semibold">Your Skills (preview)</div>
        {mySkills.length === 0 ? (
          <div className="text-gray-600 mt-2">No skills yet.</div>
        ) : (
          <div className="mt-3 grid sm:grid-cols-2 gap-2">
            {mySkills.slice(0, 8).map((s) => (
              <div
                key={s.skill_id ?? s.id ?? s.name}
                className="border rounded p-3"
              >
                <div className="font-semibold">{s.skill_name ?? s.name}</div>
                <div className="text-sm text-gray-700">level: {s.level}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
