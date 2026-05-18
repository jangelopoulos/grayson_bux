import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const ACTIVITY_ROASTS = {
  burgers: ["No one ordered a salad. Proud of every single one of you.", "The burgers were mid but the vibes were immaculate.", "Someone got sauce on their shirt already."],
  bowling: ["The gutter balls were elite.", "At least you tried. Actually no, some of you didn't.", "The bumper requests have been noted and will be discussed."],
  padel: ["Pretend tennis for people who can't play tennis.", "The racket grip was incorrect the entire time.", "Someone claimed they 'used to play tennis'. Sure mate."],
};

function getRoast(id) {
  const arr = ACTIVITY_ROASTS[id];
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function Itinerary() {
  const { daySetup, setupDay, groups, activeActivity, setActiveActivity, scores, auth, ACTIVITIES } = useApp();
  const navigate = useNavigate();

  if (!daySetup.complete) {
    return (
      <div className="page fade-up">
        <div className="page-header">
          <h1>The Itinerary 📋</h1>
          <p>Day hasn't been set up yet. Admin needs to get their act together.</p>
        </div>
        <div className="card-lg text-center" style={{ padding: 40 }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>🏗️</div>
          <h3 style={{ marginBottom: 8 }}>Nothing to see here... yet</h3>
          <p className="text-muted text-sm" style={{ marginBottom: 20 }}>The day hasn't been set up. Someone needs to be in charge here.</p>
          {auth?.role === "admin" && (
            <button className="btn btn-primary" onClick={() => navigate("/setup")}>
              Set up the day 🚀
            </button>
          )}
          {auth?.role !== "admin" && (
            <p className="text-sm text-muted">Waiting for admin to set things up. Classic.</p>
          )}
        </div>
      </div>
    );
  }

  const activityDone = (id) => {
    const act = ACTIVITIES.find(a => a.id === id);
    if (!act) return false;
    const actScores = scores[id] || {};
    return daySetup.attendeeNames.some(n => actScores[n] !== undefined);
  };

  const activeIdx = ACTIVITIES.findIndex(a => a.id === activeActivity);

  return (
    <div className="page fade-up">
      <div className="page-header">
        <h1>The Plan 📋</h1>
        <p>Burgers → Bowling → Padel. Don't mess it up.</p>
      </div>

      <div className="card-lg" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
          Today's agenda
        </div>
        <div>
          {ACTIVITIES.map((activity, idx) => {
            const done = activityDone(activity.id);
            const isActive = activity.id === activeActivity;
            return (
              <div key={activity.id} className="timeline-item">
                <div className="timeline-left">
                  <div className={`timeline-dot ${isActive ? "active" : done ? "done" : ""}`}>
                    {done ? "✓" : activity.emoji}
                  </div>
                  {idx < ACTIVITIES.length - 1 && <div className="timeline-line" />}
                </div>
                <div style={{ flex: 1, paddingBottom: idx < ACTIVITIES.length - 1 ? 20 : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 800, fontSize: "1rem" }}>{activity.label}</span>
                    {isActive && <span className="badge badge-purple">NOW</span>}
                    {done && !isActive && <span className="badge badge-green">DONE</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--accent2)" }}>{activity.time}</span>
                    <span style={{ color: "var(--text3)", fontSize: "0.75rem" }}>·</span>
                    <span style={{ fontSize: "0.82rem", color: "var(--text2)", fontWeight: 600 }}>{activity.venue}</span>
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "var(--text3)", marginBottom: 10 }}>
                    {done ? getRoast(activity.id) : activity.description}
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => navigate(`/activity/${activity.id}`)}
                    >
                      {done ? "View scores" : auth?.role === "admin" ? "Enter scores" : "View"} →
                    </button>
                    {auth?.role === "admin" && !done && !isActive && (
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setActiveActivity(activity.id)}
                        style={{ fontSize: "0.7rem" }}
                      >
                        Set active
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card" style={{ background: "rgba(108,71,255,0.06)", borderColor: "rgba(108,71,255,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "1.5rem" }}>👥</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{daySetup.attendeeNames.length} lads in attendance</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text2)" }}>Split into {groups.length} group{groups.length !== 1 ? "s" : ""} — groups locked in</div>
          </div>
          <button className="btn btn-sm btn-secondary" style={{ marginLeft: "auto" }} onClick={() => navigate("/groups")}>
            View →
          </button>
        </div>
      </div>

      {auth?.role === "admin" && (
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-sm btn-secondary" onClick={() => navigate("/setup")} style={{ fontSize: "0.8rem" }}>
            ↩ Re-setup day (this resets everything)
          </button>
        </div>
      )}
    </div>
  );
}
