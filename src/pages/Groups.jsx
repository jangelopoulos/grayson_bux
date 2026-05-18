import { useState } from "react";
import { useApp } from "../context/AppContext";
import { USERS } from "../config/users";

const ANGRY_GIF = "https://media.tenor.com/gTC7dFgceip/angry.gif";
const CONGRATS_GIF = "https://media.tenor.com/qfunVGTp022.gif";

function getUser(name) {
  return USERS.find(u => u.displayName === name);
}

export default function Groups() {
  const { daySetup, leaderboard, auth, sendGif } = useApp();
  const [justSent, setJustSent] = useState({}); // { [name]: 'congrats'|'angry' }

  const players = daySetup.complete
    ? daySetup.attendeeNames
    : USERS.map(u => u.displayName);

  const canReact = !!auth;

  function handleGif(name, type) {
    if (!canReact || auth.displayName === name) return;
    const gifUrl = type === "angry" ? ANGRY_GIF : CONGRATS_GIF;
    sendGif(name, type, gifUrl);
    setJustSent(prev => ({ ...prev, [name]: type }));
    setTimeout(() => setJustSent(prev => ({ ...prev, [name]: null })), 2000);
  }

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
          const isMe = auth?.displayName === name;
          const sent = justSent[name];

          return (
            <div
              key={name}
              className="card-lg"
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px" }}
            >
              {/* Profile avatar */}
              <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", border: "2px solid var(--border2)", flexShrink: 0, background: "var(--bg4)", position: "relative" }}>
                {user?.tenorId ? (
                  <iframe
                    src={`https://tenor.com/embed/${user.tenorId}`}
                    style={{ position: "absolute", top: "-10%", left: "-10%", width: "120%", height: "120%", border: "none", pointerEvents: "none" }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen
                  />
                ) : user?.gif ? (
                  <img src={user.gif} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>{user?.emoji || "🤙"}</div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: "1.05rem" }}>
                  {name}
                  {isMe && <span style={{ fontSize: "0.7rem", color: "var(--text3)", fontWeight: 600, marginLeft: 6 }}>you</span>}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text2)", marginTop: 2 }}>
                  {lb && lb.total > 0 ? `${lb.total} pts` : "No points yet"}
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

              {/* GIF buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                {!isMe ? (
                  <>
                    <button
                      onClick={() => handleGif(name, "congrats")}
                      style={{
                        background: sent === "congrats" ? "rgba(0,230,118,0.15)" : "var(--bg3)",
                        border: `1.5px solid ${sent === "congrats" ? "var(--green2)" : "var(--border)"}`,
                        borderRadius: 8, padding: "6px 10px", fontSize: "1.2rem",
                        cursor: "pointer", transition: "all 0.15s", lineHeight: 1,
                      }}
                    >
                      🎉
                    </button>
                    <button
                      onClick={() => handleGif(name, "angry")}
                      style={{
                        background: sent === "angry" ? "rgba(255,23,68,0.15)" : "var(--bg3)",
                        border: `1.5px solid ${sent === "angry" ? "var(--red)" : "var(--border)"}`,
                        borderRadius: 8, padding: "6px 10px", fontSize: "1.2rem",
                        cursor: "pointer", transition: "all 0.15s", lineHeight: 1,
                      }}
                    >
                      😡
                    </button>
                  </>
                ) : (
                  <div style={{ fontSize: "0.65rem", color: "var(--text3)", textAlign: "center", width: 40 }}>that's you</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
