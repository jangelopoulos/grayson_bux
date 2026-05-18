import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useParams, useNavigate } from "react-router-dom";

const SCORE_TIPS = {
  burgers: "Rate each person's burger performance. Did they smash it? Did they fold? Be honest. Be brutal.",
  bowling: "Enter actual bowling scores (0–300). No inflating. We know what you got.",
  padel: "How many games did each person win? Be honest. Actually, don't be — this is more fun if someone's lying.",
};

export default function ActivityScoring() {
  const { name } = useParams();
  const { ACTIVITIES, daySetup, scores, submitScore, auth, setActiveActivity } = useApp();
  const navigate = useNavigate();

  const activity = ACTIVITIES.find(a => a.id === name);
  const [localScores, setLocalScores] = useState(() => {
    const existing = scores[name] || {};
    const obj = {};
    (daySetup.attendeeNames || []).forEach(n => {
      obj[n] = existing[n] !== undefined ? String(existing[n]) : "";
    });
    return obj;
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  if (!activity) {
    return (
      <div className="page fade-up">
        <div className="page-header"><h1>404 — What's this?</h1></div>
        <div className="card text-center" style={{ padding: 32 }}>
          <p className="text-muted">That activity doesn't exist. Someone's having a laugh.</p>
          <button className="btn btn-secondary mt-3" onClick={() => navigate("/itinerary")}>← Back</button>
        </div>
      </div>
    );
  }

  if (!daySetup.complete) {
    return (
      <div className="page fade-up">
        <div className="page-header"><h1>{activity.emoji} {activity.label}</h1></div>
        <div className="card text-center" style={{ padding: 32 }}>
          <p className="text-muted">Day hasn't started yet. Sort it out.</p>
          <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => navigate("/itinerary")}>← Back</button>
        </div>
      </div>
    );
  }

  function handleChange(playerName, val) {
    setLocalScores(prev => ({ ...prev, [playerName]: val }));
    setSaved(false);
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (auth?.role !== "admin") {
      setError("Only admins can submit scores. Who let you in here?");
      return;
    }
    let hasAny = false;
    for (const [player, val] of Object.entries(localScores)) {
      if (val === "" || val === undefined) continue;
      const num = Number(val);
      if (isNaN(num) || num < 0 || num > activity.scoreMax) {
        setError(`Score for ${player} must be between 0 and ${activity.scoreMax}`);
        return;
      }
      submitScore(name, player, num);
      hasAny = true;
    }
    if (!hasAny) {
      setError("Enter at least one score, come on.");
      return;
    }
    setActiveActivity(name);
    setSaved(true);
  }

  const isAdmin = auth?.role === "admin";
  const existingScores = scores[name] || {};
  const hasExisting = Object.keys(existingScores).length > 0;

  return (
    <div className="page fade-up">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <button onClick={() => navigate("/itinerary")} style={{ background: "none", color: "var(--text2)", fontSize: "1.2rem", padding: 4 }}>←</button>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800 }}>
            {activity.emoji} {activity.label}
          </h1>
          <p style={{ color: "var(--text2)", fontSize: "0.82rem" }}>{activity.scoreLabel} · max {activity.scoreMax} {activity.scoreUnit}</p>
        </div>
      </div>

      <div className="alert alert-info" style={{ marginBottom: 16 }}>
        {SCORE_TIPS[name] || "Enter scores below."}
      </div>

      {!isAdmin && (
        <div className="alert alert-error" style={{ marginBottom: 16 }}>
          View only — only admins can submit scores.
        </div>
      )}

      {saved && (
        <div className="alert alert-success">Scores saved. The table has updated. Someone's not happy.</div>
      )}
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card-lg">
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>
            Scores
          </div>
          {daySetup.attendeeNames.map(playerName => {
            const existing = existingScores[playerName];
            return (
              <div key={playerName} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ fontWeight: 700, fontSize: "0.9rem" }}>{playerName}</label>
                  {existing !== undefined && (
                    <span className="badge badge-green">
                      Logged: {existing} {activity.scoreUnit}
                    </span>
                  )}
                </div>
                {activity.id === "burgers" ? (
                  <div>
                    <input
                      type="range"
                      min={0}
                      max={activity.scoreMax}
                      value={localScores[playerName] || 0}
                      onChange={e => handleChange(playerName, e.target.value)}
                      disabled={!isAdmin}
                      style={{ width: "100%", marginBottom: 4 }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text2)" }}>
                      <span>0 — Tragic</span>
                      <span style={{ fontWeight: 700, color: "var(--accent2)" }}>{localScores[playerName] || 0} / {activity.scoreMax}</span>
                      <span>10 — Elite</span>
                    </div>
                  </div>
                ) : (
                  <input
                    type="number"
                    placeholder={`${activity.scoreLabel} (0–${activity.scoreMax})`}
                    min={0}
                    max={activity.scoreMax}
                    value={localScores[playerName] || ""}
                    onChange={e => handleChange(playerName, e.target.value)}
                    disabled={!isAdmin}
                  />
                )}
              </div>
            );
          })}
        </div>

        {isAdmin && (
          <button type="submit" className="btn btn-primary btn-full" style={{ fontSize: "1rem" }}>
            Save scores 💾
          </button>
        )}
      </form>

      {hasExisting && (
        <div style={{ marginTop: 16 }}>
          <div className="card">
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
              Current standings for {activity.label}
            </div>
            {Object.entries(existingScores)
              .sort((a, b) => b[1] - a[1])
              .map(([name, score], i) => (
                <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 900, fontSize: "0.85rem", color: "var(--text3)" }}>#{i + 1}</span>
                    <span style={{ fontWeight: 700 }}>{name}</span>
                  </div>
                  <span style={{ fontWeight: 900, color: "var(--accent2)" }}>{score} {activity.scoreUnit}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
