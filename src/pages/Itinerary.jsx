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

const SCHEDULE = [
  { time: "12:30pm",  emoji: "🍔", title: "Burgers", venue: "Leonard's House of Love", note: "Vegan friendly option TBC — someone's problem to sort" },
  { time: "2:30pm",   emoji: "🎳", title: "Bowling", venue: "Kingpin, Crown",           note: null },
  { time: "4:30–6pm", emoji: "🏓", title: "Padel",   venue: "Docklands",               note: null },
];

function ScheduleCard() {
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(108,71,255,0.15) 0%, rgba(245,0,87,0.08) 100%)",
      border: "1.5px solid rgba(108,71,255,0.3)",
      borderRadius: "var(--radius-lg)",
      padding: "20px",
      marginBottom: 20,
    }}>
      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--accent2)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
        Saturday's plan
      </div>
      {SCHEDULE.map((item, idx) => (
        <div key={item.time} style={{ display: "flex", gap: 14, paddingBottom: idx < SCHEDULE.length - 1 ? 20 : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(108,71,255,0.18)", border: "2px solid rgba(108,71,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>
              {item.emoji}
            </div>
            {idx < SCHEDULE.length - 1 && (
              <div style={{ width: 2, flex: 1, background: "rgba(108,71,255,0.2)", margin: "4px 0", minHeight: 16 }} />
            )}
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: "1.05rem", lineHeight: 1.1 }}>{item.title}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "4px 0" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--accent2)" }}>{item.time}</span>
              <span style={{ color: "var(--text3)", fontSize: "0.7rem" }}>·</span>
              <span style={{ fontSize: "0.82rem", color: "var(--text2)", fontWeight: 600 }}>{item.venue}</span>
            </div>
            {item.note && <div style={{ fontSize: "0.72rem", color: "var(--text3)", fontStyle: "italic" }}>{item.note}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Itinerary() {
  const { daySetup, groups, activeActivity, setActiveActivity, scores, auth, ACTIVITIES } = useApp();
  const navigate = useNavigate();

  const activityDone = (id) => {
    const actScores = scores[id] || {};
    return (daySetup.attendeeNames || []).some(n => actScores[n] !== undefined);
  };

  return (
    <div className="page fade-up">
      <div className="page-header">
        <h1>Grayson's Bucks Day 🍾</h1>
        <p>Survive the day. Earn the bragging rights.</p>
      </div>

      {/* Always show the schedule */}
      <ScheduleCard />

      {/* Day not set up yet */}
      {!daySetup.complete && (
        <div className="card-lg" style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>🏗️</div>
          <h3 style={{ marginBottom: 6 }}>Day not set up yet</h3>
          <p className="text-muted text-sm" style={{ marginBottom: 16 }}>
            {auth?.role === "admin" ? "Get in there and set it up." : "Waiting for admin to get their act together."}
          </p>
          {auth?.role === "admin" && (
            <button className="btn btn-primary" onClick={() => navigate("/setup")}>
              Set up the day 🚀
            </button>
          )}
        </div>
      )}

      {/* Interactive tracker — only when day is set up */}
      {daySetup.complete && (
        <>
          <div className="card-lg" style={{ marginBottom: 20 }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
              Live tracker
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
                        <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/activity/${activity.id}`)}>
                          {done ? "View scores" : auth?.role === "admin" ? "Enter scores" : "View"} →
                        </button>
                        {auth?.role === "admin" && !done && !isActive && (
                          <button className="btn btn-sm btn-secondary" onClick={() => setActiveActivity(activity.id)} style={{ fontSize: "0.7rem" }}>
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

          <div className="card" style={{ background: "rgba(108,71,255,0.06)", borderColor: "rgba(108,71,255,0.2)", marginBottom: 12 }}>
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
            <button className="btn btn-sm btn-secondary" onClick={() => navigate("/setup")} style={{ fontSize: "0.8rem" }}>
              ↩ Re-setup day (resets everything)
            </button>
          )}
        </>
      )}
    </div>
  );
}
