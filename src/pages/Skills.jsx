import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [myLevels, setMyLevels] = useState({}); // { [skill_id]: level }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // 0-3
  const levelOptions = useMemo(() => [0, 1, 2, 3], []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setMsg("");

        // 1) load all skills
        const resSkills = await api.get("/skills");

        // 2) load my skills
        const resMe = await api.get("/me/skills");

        const listSkills = resSkills.data?.data || resSkills.data || [];
        const my = resMe.data?.data || resMe.data || [];

        // my: [{skill_id, skill_name, level}, ...] (tuỳ backend bạn trả)
        const map = {};
        for (const row of my) {
          // ưu tiên skill_id, fallback nếu backend trả id khác
          const sid = row.skill_id ?? row.id ?? row.skillId;
          if (sid != null) map[sid] = row.level ?? 0;
        }

        setSkills(listSkills);
        setMyLevels(map);
      } catch (e) {
        setMsg(e?.response?.data?.message || e?.message || "Load failed");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const onChangeLevel = (skillId, level) => {
    setMyLevels((prev) => ({ ...prev, [skillId]: Number(level) }));
  };

  const onSave = async () => {
    try {
      setSaving(true);
      setMsg("");

      // chỉ save những skill đang có trong list
      const payload = skills.map((s) => ({
        skill_id: s.id,
        level: myLevels[s.id] ?? 0,
      }));

      // Backend của bạn thường upsert 1 item/lần => gọi Promise.all
      await Promise.all(
        payload.map((item) => api.post("/me/skills", item))
      );

      setMsg("✅ Saved successfully!");
    } catch (e) {
      setMsg(e?.response?.data?.message || e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="max-w-5xl mx-auto p-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Skill Assessment</h1>
          <p className="text-gray-600">Chọn level 0–3 cho từng kỹ năng.</p>
        </div>

        <button
          onClick={onSave}
          disabled={saving}
          className="rounded bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {msg && (
        <div className="mt-4 rounded border p-3 text-sm">
          {msg}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {skills.map((s) => (
          <div key={s.id} className="rounded border p-4">
            <div className="font-semibold">{s.name}</div>

            <div className="mt-2 flex items-center gap-3">
              <div className="text-sm text-gray-600">Level:</div>
              <select
                className="rounded border px-2 py-1"
                value={myLevels[s.id] ?? 0}
                onChange={(e) => onChangeLevel(s.id, e.target.value)}
              >
                {levelOptions.map((lv) => (
                  <option key={lv} value={lv}>
                    {lv}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
