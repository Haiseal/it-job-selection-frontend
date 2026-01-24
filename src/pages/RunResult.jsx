import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";


const toNum = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export default function RunResult() {
  const { runId } = useParams();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);

  
  const [roadmaps, setRoadmaps] = useState({}); // { [jobPathId]: roadmapItems[] }


  const load = async () => {
    try {
      setErr("");
      setLoading(true);

      const res = await api.get(`/recommend/runs/${runId}/results`);
      setData(res.data);
    } catch (e) {
      const msg =
        e?.response?.data?.message || e?.message || "Load run result failed";
      setErr(msg);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!runId) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId]);

  
  const resultsRaw = data?.results || [];


  const ranked = useMemo(() => {
    const mapped = resultsRaw.map((r) => {
      const score = toNum(r.score, 0);

      const difficulty =
        r.difficulty ?? r.job_difficulty ?? r.level ?? r.job_level ?? "-";

      const gaps =
        r.gaps ??
        r.explanation_json?.gaps ?? 
        [];

      const gapsCount =
        r.gaps_count ??
        r.gap_count ??
        (Array.isArray(gaps) ? gaps.length : "-") ??
        r.missing_count ??
        "-";

      return {
        id: r.id, 
        run_id: r.run_id,
        job_path_id: r.job_path_id,
        job_name: r.job_name ?? "Unknown job",
        score,
        difficulty,
        gaps_count: gapsCount,
        gaps,
      };
    });

    mapped.sort((a, b) => b.score - a.score);
    return mapped;
  }, [resultsRaw]);

  
  const top = ranked.slice(0, 3);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        if (!top.length) return;

        const missing = top
          .map((t) => t.job_path_id)
          .filter((id) => id && roadmaps[id] === undefined);

        if (missing.length === 0) return;

        const pairs = await Promise.all(
          missing.map(async (jobPathId) => {
            try {
              const res = await api.get(`/job-paths/${jobPathId}/roadmap`);
              return [jobPathId, res.data || []];
            } catch {
              return [jobPathId, []];
            }
          })
        );

        setRoadmaps((prev) => {
          const next = { ...prev };
          for (const [k, v] of pairs) next[k] = v;
          return next;
        });
      } catch {
        // ignore
      }
    };

    fetchRoadmaps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [top.map((t) => t.job_path_id).join("|")]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Run Result #{runId}</h1>
          <p className="text-gray-600 mt-1">Chi tiết kết quả của 1 lần chạy.</p>
        </div>
        <Link className="underline" to="/history">
          Back to history
        </Link>
      </div>

      {loading && <div className="mt-6">Loading...</div>}

      {err && (
        <div className="mt-4 border rounded p-3 bg-red-50 text-red-700">
          {err}
        </div>
      )}

      {!loading && !err && data && (
        <>
          {/* Ranked */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Ranked Jobs</h2>

            {ranked.length === 0 ? (
              <div className="mt-2 text-gray-600">No results.</div>
            ) : (
              <div className="mt-3 space-y-3">
                {ranked.map((j) => (
                  <div
                    key={j.job_path_id ?? j.id ?? j.job_name}
                    className="border rounded p-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold">{j.job_name}</div>
                      <div className="text-sm text-gray-600">
                        difficulty: {j.difficulty} • gaps: {j.gaps_count}
                      </div>
                    </div>
                    <div className="font-bold">{toNum(j.score).toFixed(4)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top details */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Top Details</h2>

            {top.length === 0 ? (
              <div className="mt-2 text-gray-600">No top jobs.</div>
            ) : (
              <div className="mt-3 space-y-6">
                {top.map((job) => {
                  const rm = roadmaps[job.job_path_id] || [];

                  return (
                    <div
                      key={job.job_path_id ?? job.job_name}
                      className="border rounded p-5"
                    >
                      <div className="text-lg font-bold">{job.job_name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        score: <b>{toNum(job.score).toFixed(4)}</b> • difficulty:{" "}
                        {job.difficulty}
                      </div>

                      {/* Gaps */}
                      <div className="mt-4">
                        <div className="font-semibold">Skill gaps</div>
                        {Array.isArray(job.gaps) && job.gaps.length > 0 ? (
                          <ul className="mt-2 list-disc pl-5 space-y-1">
                            {job.gaps.map((g, idx) => (
                              <li key={g.skill_id ?? idx} className="text-sm">
                                <b>{g.skill_name ?? `Skill #${g.skill_id}`}</b>: required{" "}
                                {g.required_level} • you {g.user_level_0_5} • missing{" "}
                                <b>{g.missing}</b>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-gray-600 text-sm mt-1">
                            (Run này không có gaps trong explanation_json.)
                          </div>
                        )}
                      </div>

                      {/* Roadmap */}
                      <div className="mt-4">
                        <div className="font-semibold">Roadmap</div>
                        {rm.length > 0 ? (
                          <div className="mt-2 space-y-2">
                            {rm
                              .slice()
                              .sort(
                                (a, b) =>
                                  toNum(a.step_order, 0) - toNum(b.step_order, 0)
                              )
                              .map((r, idx) => (
                                <div key={r.id ?? idx} className="border rounded p-3">
                                  <div className="font-semibold">
                                    Step {r.step_order ?? idx + 1}: {r.title ?? "Untitled"}
                                  </div>
                                  <div className="text-sm text-gray-700">
                                    {r.description ?? ""}
                                  </div>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="text-gray-600 text-sm mt-1">
                            (Roadmap not yet retrieved: check the GET endpoint /job-paths/:id/roadmap)
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </>
      )}
    </div>
  );
}
