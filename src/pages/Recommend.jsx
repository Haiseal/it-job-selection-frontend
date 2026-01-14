import { useState } from "react";
import api from "../api/axios";

export default function Recommend() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);

  const onGenerate = async () => {
    try {
      setErr("");
      setLoading(true);

      // backend Week1: POST /recommend (auth required)
      const res = await api.post("/recommend", {}); // body rỗng OK
      setData(res.data);
      console.log("Recommend response:", res.data);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Generate recommendation failed";
      setErr(msg);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // safe arrays
  const ranked = data?.ranked ?? [];
  const top = data?.top ?? [];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Recommendation</h1>
          <p className="text-gray-600 mt-1">
            Bấm nút để tạo gợi ý nghề phù hợp + gaps + roadmap.
          </p>
        </div>

        <button
          onClick={onGenerate}
          disabled={loading}
          className="border rounded px-4 py-2 bg-black text-white disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate Recommendation"}
        </button>
      </div>

      {err && (
        <div className="mt-4 border rounded p-3 bg-red-50 text-red-700">
          {err}
        </div>
      )}

      {!data && !loading && (
        <div className="mt-6 text-gray-600">
          Chưa có kết quả. Hãy bấm <b>Generate Recommendation</b>.
        </div>
      )}

      {/* Ranked jobs */}
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

      {/* Top detail: gaps + roadmap */}
      {top.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Top Details</h2>

          <div className="mt-3 space-y-6">
            {top.map((job) => (
              <div key={job.job_path_id} className="border rounded p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold">{job.job_name}</div>
                    <div className="text-sm text-gray-600">
                      score: <b>{job.score}</b> • difficulty: {job.difficulty}
                    </div>
                  </div>
                </div>

                {/* gaps */}
                <div className="mt-4">
                  <div className="font-semibold">Skill gaps</div>
                  {(job.gaps ?? []).length === 0 ? (
                    <div className="text-gray-600 text-sm mt-1">
                      Không có gaps (hoặc backend chưa trả gaps).
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

                {/* roadmap */}
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
    </div>
  );
}
