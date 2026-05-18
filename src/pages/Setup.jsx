import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { USERS } from "../config/users";

export default function Setup() {
  const { setupDay } = useApp();
  const navigate = useNavigate();
  // Get player users (non-admin) for selection
  const availablePlayers = USERS.map(u => u.displayName);
  const [selected, setSelected] = useState([]);
  const [customName, setCustomName] = useState("");

  function toggle(name) {
    setSelected(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  }

  function addCustom(e) {
    e.preventDefault();
    const name = customName.trim();
    if (!name || selected.includes(name)) return;
    setSelected(prev => [...prev, name]);
    setCustomName("");
  }

  function removePlayer(name) {
    setSelected(prev => prev.filter(n => n !== name));
  }

  function handleSetup() {
    if (selected.length < 2) return;
    setupDay(selected);
    navigate("/itinerary");
  }

  const groupPreview = (() => {
    if (selected.length < 2) return [];
    const total = selected.length;
    const groupSize = total <= 4 ? total : Math.ceil(total / Math.ceil(total / 4));
    const groups = [];
    for (let i = 0; i < total; i += groupSize) {
      groups.push(selected.slice(i, i + groupSize));
    }
    return groups;
  })();

  return (
    <div className="page fade-up">
      <div className="page-header">
        <h1>Set Up the Day 🍾</h1>
        <p>Who's actually shown up? Pick your lads.</p>
      </div>

      <div className="card-lg">
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
          Select Attendees
        </div>
        <div className="chip-select">
          {availablePlayers.map(name => (
            <button
              key={name}
              className={`chip ${selected.includes(name) ? "selected" : ""}`}
              onClick={() => toggle(name)}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="divider" />

        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
          Add extra lads not on the list
        </div>
        <form onSubmit={addCustom} style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder="Name..."
            value={customName}
            onChange={e => setCustomName(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-secondary btn-sm" style={{ whiteSpace: "nowrap" }}>
            Add
          </button>
        </form>

        {selected.length > 0 && (
          <>
            <div className="divider" />
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
              Going ({selected.length})
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {selected.map(name => (
                <span key={name} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "var(--bg4)", borderRadius: 99, padding: "4px 10px", fontSize: "0.8rem", fontWeight: 600 }}>
                  {name}
                  <button onClick={() => removePlayer(name)} style={{ background: "none", color: "var(--text3)", fontSize: "0.9rem", lineHeight: 1, padding: "0 2px" }}>×</button>
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {groupPreview.length > 0 && (
        <div className="card-lg">
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
            Group Preview (randomised on start)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {groupPreview.map((g, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="badge badge-purple">Group {i + 1}</span>
                <span style={{ fontSize: "0.85rem", color: "var(--text2)" }}>{g.join(", ")}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-3" style={{ marginTop: 10 }}>Groups are randomly shuffled when you hit start.</p>
        </div>
      )}

      <button
        className="btn btn-primary btn-full"
        onClick={handleSetup}
        disabled={selected.length < 2}
        style={{ opacity: selected.length < 2 ? 0.5 : 1, fontSize: "1rem" }}
      >
        Lock in the groups & start 🔒
      </button>

      {selected.length < 2 && (
        <p className="text-center text-sm text-muted mt-2">Pick at least 2 people to get going</p>
      )}
    </div>
  );
}
