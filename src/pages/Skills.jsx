
import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [myMap, setMyMap] = useState({}); // { [skill_id]: level }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setMsg("");

        // 1) load all skills
        const sRes = await api.get("/skills");
        setSkills(sRes.data || []);

        // 2) load my skills (auth)
        const meRes = await api.get("/me/skills");
        // meRes.data expected: [{ skill_id, level, ... }]
        const map = {};
        (meRes.data || []).forEach((x) => {
          map[x.skill_id] = x.level;
        });
        setMyMap(map);
      } catch (e) {
        setMsg(e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const categories = useMemo(() => {
    // group by category
    const g = {};
    for (const sk of skills) {
      const c = sk.category || "Other";
      if (!g[c]) g[c] = [];
      g[c].push(sk);
    }
    return g;
  }, [skills]);

  const setLevel = (skillId, level) => {
    setMyMap((prev) => ({ ...prev, [skillId]: level }));
  };

  const saveAll = async () => {
    try {
      setSaving(true);
      setMsg("");

      // Save từng skill (đơn giản, chắc chắn đúng)
      const entries = Object.entries(myMap);
      for (const [skillIdStr, level] of entries) {
        const skill_id = Number(skillIdStr);
        await api.post("/me/skills", { skill_id, level }); // validate 0–3
      }

      setMsg("Saved ✅");
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Skill Assessment</h1>
      <p className="text-sm opacity-80 mb-4">Chọn level 0–3 cho từng kỹ năng.</p>

      {msg && <div className="mb-4 p-3 rounded border">{msg}</div>}

      {Object.keys(categories).map((cat) => (
        <div key={cat} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{cat}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categories[cat].map((sk) => {
              const level = myMap[sk.id] ?? 0;
              return (
                <div key={sk.id} className="p-3 border rounded">
                  <div className="font-medium">{sk.name}</div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm opacity-70">Level:</span>
                    <select
                      className="border rounded px-2 py-1"
                      value={level}
                      onChange={(e) => setLevel(sk.id, Number(e.target.value))}
                    >
                      <option value={0}>0</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <button
        onClick={saveAll}
        disabled={saving}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
