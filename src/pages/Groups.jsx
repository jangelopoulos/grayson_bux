import { useApp } from "../context/AppContext";
import { USERS } from "../config/users";

function getUser(name) {
  return USERS.find(u => u.displayName === name);
}

export default function Groups() {
  const { daySetup, leaderboard } = useApp();

  const players = daySetup.complete
    ? daySetup.attendeeNames
    : USERS.map(u => u.displayName);

  return (
    <div className="page fade-up">
      <div className="page-header">
        <h1>The Crew 👥</h1>
        <p>All {players.length} lads. One legend. Zero refunds.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {players.map(name => {
          const user = getUser(name);
          const lb = leaderboard.find(p => p.name === name);
          const reactionCount = lb?.reactions?.length || 0;

          return (
            <div
              key={name}
              className="card-lg"
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px" }}
            >
              {/* Profile GIF / avatar */}
              <div style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid var(--border2)",
                flexShrink: 0,
                background: "var(--bg4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {user?.gif ? (
                  <img
                    src={user.gif}
                    alt={name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ fontSize: "1.8rem" }}>{user?.emoji || "🤙"}</span>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: "1.05rem" }}>{name}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text2)", marginTop: 2 }}>
                  {lb && lb.total > 0
                    ? `${lb.total} pts`
                    : "No points yet"}
                  {reactionCount > 0 && ` · ${reactionCount} roast${reactionCount !== 1 ? "s" : ""}`}
                </div>
                {lb && (lb.burgerScore !== null || lb.bowlingScore !== null || lb.padelScore !== null) && (
                  <div style={{ display: "flex", gap: 5, marginTop: 5, flexWrap: "wrap" }}>
                    {lb.burgerScore !== null && <span className="score-pill score-pill-burger">🍔 {lb.burgerScore}</span>}
                    {lb.bowlingScore !== null && <span className="score-pill score-pill-bowling">🎳 {lb.bowlingScore}</span>}
                    {lb.padelScore !== null && <span className="score-pill score-pill-padel">🏓 {lb.padelScore}W</span>}
                  </div>
                )}
              </div>

              {/* Points badge */}
              {lb && lb.total > 0 && (
                <div style={{ fontWeight: 900, fontSize: "1.3rem", color: "var(--accent2)", flexShrink: 0 }}>
                  {lb.total}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
