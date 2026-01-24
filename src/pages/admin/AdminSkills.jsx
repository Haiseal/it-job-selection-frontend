import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminSkills() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const load = async () => {
    setErr(""); setMsg("");
    const res = await api.get("/skills");
    setItems(res.data || []);
  };

  useEffect(() => {
    const load = async () => {
        setErr(""); 
        setMsg("");
        const res = await api.get("/skills");
        setItems(res.data || []);
    };

    load();
    }, []);


  const add = async () => {
    try {
      setErr(""); setMsg("");
      await api.post("/skills", { name });
      setName("");
      setMsg("Added!");
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    }
  };

  const update = async (id, newName) => {
    try {
      setErr(""); setMsg("");
      await api.put(`/skills/${id}`, { name: newName });
      setMsg("Updated!");
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete skill?")) return;
    try {
      setErr(""); setMsg("");
      await api.delete(`/skills/${id}`);
      setMsg("Deleted!");
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Admin • Skills</h1>

      {(err || msg) && (
        <div className={`mt-3 border rounded p-3 ${err ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
          {err || msg}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <input
          className="border rounded px-3 py-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New skill name..."
        />
        <button className="border rounded px-4 py-2 bg-black text-white" onClick={add} disabled={!name.trim()}>
          Add
        </button>
      </div>

      <div className="mt-6 space-y-2">
        {items.map((s) => (
          <SkillRow key={s.id} s={s} onUpdate={update} onDelete={remove} />
        ))}
      </div>
    </div>
  );
}

function SkillRow({ s, onUpdate, onDelete }) {
  const [edit, setEdit] = useState(false);
  const [val, setVal] = useState(s.name);

  return (
    <div className="border rounded p-3 flex items-center justify-between">
      <div className="w-full">
        {!edit ? (
          <div className="font-semibold">{s.name}</div>
        ) : (
          <input className="border rounded px-3 py-2 w-full" value={val} onChange={(e) => setVal(e.target.value)} />
        )}
        <div className="text-xs text-gray-600">id: {s.id}</div>
      </div>

      <div className="flex gap-2 ml-4">
        {!edit ? (
          <button className="border rounded px-3 py-2" onClick={() => setEdit(true)}>Edit</button>
        ) : (
          <button className="border rounded px-3 py-2 bg-black text-white"
            onClick={() => { onUpdate(s.id, val); setEdit(false); }}>
            Save
          </button>
        )}
        <button className="border rounded px-3 py-2" onClick={() => onDelete(s.id)}>Delete</button>
      </div>
    </div>
  );
}
