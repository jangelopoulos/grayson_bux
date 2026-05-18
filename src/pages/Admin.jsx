import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { REACTIONS } from "../config/users";

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Admin() {
  const { auth, reactionLog, scores, daySetup, activeActivity, setActiveActivity, resetScores, resetReactions, resetAll, ACTIVITIES } = useApp();
  const navigate = useNavigate();
  const [confirmReset, setConfirmReset] = useState(null);

  if (!auth || auth.role !== "admin") {
    return (
      <div className="page fade-up">
        <div className="page-header"><h1>Admin 🔐</h1></div>
        <div className="card text-center" style={{ padding: 40 }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>🚫</div>
          <h3>Not for you, pal.</h3>
          <p className="text-muted text-sm" style={{ marginTop: 8 }}>Admin access only. Jog on.</p>
        </div>
      </div>
    );
  }

  function doReset(type) {
    if (type === "scores") resetScores();
    if (type === "reactions") resetReactions();
    if (type === "all") resetAll();
    setConfirmReset(null);
  }

  const reactionById = (id) => REACTIONS.find(r => r.id === id);

  return (
    <div className="page fade-up">
      <div className="page-header">
        <h1>Admin Panel 🔐</h1>
        <p>You're the sheriff. Don't abuse it.</p>
      </div>

      {/* Active Activity Control */}
      <div className="card-lg" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
          Active Activity
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {ACTIVITIES.map(a => (
            <button
              key={a.id}
              className={`btn btn-sm ${activeActivity === a.id ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveActivity(a.id)}
            >
              {a.emoji} {a.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted" style={{ marginTop: 8 }}>Current: {ACTIVITIES.find(a => a.id === activeActivity)?.label}</p>
      </div>

      {/* Score Summary */}
      <div className="card-lg" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
          Score Summary
        </div>
        {ACTIVITIES.map(a => {
          const actScores = scores[a.id] || {};
          const count = Object.keys(actScores).length;
          const total = daySetup.attendeeNames?.length || 0;
          return (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: "1.2rem" }}>{a.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>{a.label}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text2)" }}>{count}/{total} scores entered</div>
              </div>
              <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/activity/${a.id}`)}>
                Edit →
              </button>
            </div>
          );
        })}
      </div>

      {/* Reaction Feed */}
      <div className="card-lg" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Reaction Feed ({reactionLog.length})
          </div>
        </div>
        {reactionLog.length === 0 ? (
          <p className="text-sm text-muted">Nothing yet. The lads are being nice. Give it time.</p>
        ) : (
          <div style={{ maxHeight: 320, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
            {[...reactionLog].reverse().map(entry => {
              const r = reactionById(entry.reaction?.id) || entry.reaction;
              return (
                <div key={entry.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "1.1rem" }}>{r?.emoji || "💬"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700 }}>
                      <span style={{ color: "var(--accent2)" }}>{entry.sender}</span>
                      {" → "}
                      <span>{entry.target}</span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text2)" }}>{r?.label}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text3)", fontStyle: "italic" }}>{r?.roast}</div>
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text3)", whiteSpace: "nowrap" }}>{formatTime(entry.timestamp)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reset Controls */}
      <div className="card-lg" style={{ border: "1px solid rgba(255,23,68,0.2)", background: "rgba(255,23,68,0.03)" }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
          Danger Zone 🧨
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {confirmReset ? (
            <div>
              <p style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 10 }}>
                You sure? {confirmReset === "all" ? "This wipes EVERYTHING." : `This resets all ${confirmReset}.`} Can't undo this one.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-danger btn-sm" onClick={() => doReset(confirmReset)}>Yeah, do it</button>
                <button className="btn btn-secondary btn-sm" onClick={() => setConfirmReset(null)}>Nah, cancel</button>
              </div>
            </div>
          ) : (
            <>
              <button className="btn btn-danger btn-sm" onClick={() => setConfirmReset("scores")}>Reset all scores</button>
              <button className="btn btn-danger btn-sm" onClick={() => setConfirmReset("reactions")}>Reset all reactions</button>
              <button className="btn btn-danger btn-sm" onClick={() => setConfirmReset("all")}>Nuclear reset — wipe everything</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
