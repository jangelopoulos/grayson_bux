import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { USERS } from "../config/users";

function getEmoji(name) {
  const user = USERS.find(u => u.displayName === name);
  return user?.emoji || "🤙";
}

const GROUP_COLORS = [
  { border: "rgba(108,71,255,0.35)", bg: "rgba(108,71,255,0.06)", badge: "badge-purple" },
  { border: "rgba(0,230,118,0.3)", bg: "rgba(0,230,118,0.05)", badge: "badge-green" },
  { border: "rgba(255,109,0,0.3)", bg: "rgba(255,109,0,0.05)", badge: "badge-orange" },
  { border: "rgba(255,214,0,0.3)", bg: "rgba(255,214,0,0.05)", badge: "badge-yellow" },
];

export default function Groups() {
  const { daySetup, groups, leaderboard } = useApp();
  const navigate = useNavigate();

  if (!daySetup.complete || groups.length === 0) {
    return (
      <div className="page fade-up">
        <div className="page-header">
          <h1>Groups 👥</h1>
          <p>No groups yet. Someone needs to set up the day.</p>
        </div>
        <div className="card-lg text-center" style={{ padding: 40 }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>🤷</div>
          <h3 style={{ marginBottom: 8 }}>No groups assigned yet</h3>
          <p className="text-muted text-sm">Day hasn't been set up. Classic admin behaviour.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page fade-up">
      <div className="page-header">
        <h1>Groups 👥</h1>
        <p>{groups.length} group{groups.length !== 1 ? "s" : ""}, randomly assigned. Deal with it.</p>
      </div>

      {groups.map((group, gi) => {
        const color = GROUP_COLORS[gi % GROUP_COLORS.length];
        return (
          <div
            key={group.id}
            className="card-lg"
            style={{ border: `1.5px solid ${color.border}`, background: color.bg }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span className={`badge ${color.badge}`}>{group.name}</span>
              <span style={{ fontSize: "0.8rem", color: "var(--text2)" }}>{group.members.length} members</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {group.members.map(name => {
                const lb = leaderboard.find(p => p.name === name);
                const reactionCount = lb?.reactions?.length || 0;
                return (
                  <div key={name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="player-avatar">{getEmoji(name)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text2)" }}>
                        {lb ? `${lb.total} pts total` : "No scores yet"}
                        {reactionCount > 0 && ` · ${reactionCount} roast${reactionCount !== 1 ? "s" : ""}`}
                      </div>
                    </div>
                    {lb && lb.total > 0 && (
                      <div style={{ fontSize: "0.9rem", fontWeight: 900, color: "var(--accent2)" }}>
                        {lb.total}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="card" style={{ marginTop: 4 }}>
        <p className="text-sm text-muted text-center">
          Groups are locked in for the whole day. No swapsies. You get what you get.
        </p>
      </div>
    </div>
  );
}
