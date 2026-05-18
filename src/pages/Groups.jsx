import { useState } from "react";
import { useApp } from "../context/AppContext";
import { USERS } from "../config/users";

const ANGRY_GIF = "https://tenor.com/embed/7058302348984723881";
const CONGRATS_GIF = "https://tenor.com/embed/13500890569322376370";

function getUser(name) {
  return USERS.find(u => u.displayName === name);
}

function GifModal({ gifUrl, target, type, onClose }) {
  const isTenor = gifUrl?.startsWith("https://tenor.com/embed/");
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.92)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 20,
        animation: "fadeUp 0.2s ease",
      }}
    >
      <div style={{ marginBottom: 14, textAlign: "center" }}>
        <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>{type === "angry" ? "😡" : "🎉"}</div>
        <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text)" }}>
          {type === "angry" ? `${target} is getting it 😡` : `Big up ${target} 🎉`}
        </div>
      </div>

      <div
        onClick={e => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 400, borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--bg3)" }}
      >
        {isTenor ? (
          <iframe
            src={gifUrl}
            style={{ width: "100%", height: 340, border: "none", display: "block" }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen
          />
        ) : (
          <img src={gifUrl} alt="reaction" style={{ width: "100%", display: "block" }} />
        )}
      </div>

      <button
        onClick={onClose}
        style={{
          marginTop: 20, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff", borderRadius: 99, padding: "10px 28px", fontWeight: 700, fontSize: "0.9rem",
          cursor: "pointer",
        }}
      >
        Close
      </button>
      <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", marginTop: 10 }}>or tap anywhere to close</p>
    </div>
  );
}

export default function Groups() {
  const { daySetup, leaderboard, auth, sendGif } = useApp();
  const [justSent, setJustSent] = useState({});
  const [modal, setModal] = useState(null); // { gifUrl, target, type }

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
    setModal({ gifUrl, target: name, type });
  }

  return (
    <div className="page fade-up">
      {modal && (
        <GifModal
          gifUrl={modal.gifUrl}
          target={modal.target}
          type={modal.type}
          onClose={() => setModal(null)}
        />
      )}

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
