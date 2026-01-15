import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function RunResult() {
  const { runId } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setErr("");
        setLoading(true);

        // ✅ endpoint week1 bạn từng định dùng
        const res = await api.get(`/recommend/runs/${runId}/results`);
        setData(res.data);
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "Load run results failed";
        setErr(msg);
        if (e?.response?.status === 401) nav("/login");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [runId, nav]);

  const ranked = data?.ranked ?? [];
  const top = data?.top ?? [];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Run #{runId}</h1>
          <p className="text-gray-600 mt-1">
            Xem lại kết quả recommendation đã lưu.
          </p>
        </div>

        <button
          onClick={() => nav("/history")}
          className="border rounded px-4 py-2 hover:bg-gray-50"
        >
          Back
        </button>
      </div>

      {err && (
        <div className="mt-4 border rounded p-3 bg-red-50 text-red-700">
          {err}
        </div>
      )}

      {loading && <div className="mt-6 text-gray-600">Đang tải...</div>}

      {!loading && data && (
        <>
          {/* Ranked */}
          {ranked.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold">Ranked Jobs</h2>
              <div className="mt-3 space-y-3">
                {ranked.map((j) => (
                  <div
                    key={j.job_path_id}
                    className="border rounded p-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold">{j.job_name}</div>
                      <div className="text-sm text-gray-600">
                        difficulty: {j.difficulty} • gaps: {j.gaps_count}
                      </div>
                    </div>
                    <div className="font-bold">{j.score}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top detail */}
          {top.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Top Details</h2>

              <div className="mt-3 space-y-6">
                {top.map((job) => (
                  <div key={job.job_path_id} className="border rounded p-5">
                    <div className="text-lg font-bold">{job.job_name}</div>
                    <div className="text-sm text-gray-600">
                      score: <b>{job.score}</b> • difficulty: {job.difficulty}
                    </div>

                    <div className="mt-4">
                      <div className="font-semibold">Skill gaps</div>
                      {(job.gaps ?? []).length === 0 ? (
                        <div className="text-gray-600 text-sm mt-1">
                          Không có gaps.
                        </div>
                      ) : (
                        <ul className="mt-2 list-disc pl-5 space-y-1">
                          {(job.gaps ?? []).map((g) => (
                            <li key={g.skill_id} className="text-sm">
                              <b>{g.skill_name}</b>: required {g.required_level} •
                              you {g.user_level_0_5} • missing <b>{g.missing}</b>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="mt-4">
                      <div className="font-semibold">Roadmap</div>
                      {(job.roadmap ?? []).length === 0 ? (
                        <div className="text-gray-600 text-sm mt-1">
                          Chưa có roadmap items.
                        </div>
                      ) : (
                        <div className="mt-2 space-y-2">
                          {(job.roadmap ?? []).map((r) => (
                            <div key={r.id} className="border rounded p-3">
                              <div className="font-semibold">
                                Step {r.step_order}: {r.title}
                              </div>
                              <div className="text-sm text-gray-700">
                                {r.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
