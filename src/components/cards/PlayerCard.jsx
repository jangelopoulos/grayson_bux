import { useState } from "react";
import { REACTIONS } from "../../config/users";

const MEME_PLACEHOLDERS = [
  { emoji: "😂", label: "GIF incoming" },
  { emoji: "💀", label: "Actually dead" },
  { emoji: "🤡", label: "Classic clown" },
  { emoji: "🫡", label: "Sending respect (not really)" },
  { emoji: "🔥", label: "This is fine" },
  { emoji: "🫢", label: "Did not see that coming" },
];

function getMeme() {
  return MEME_PLACEHOLDERS[Math.floor(Math.random() * MEME_PLACEHOLDERS.length)];
}

export default function PlayerCard({ player, emoji, isExpanded, onToggle, onReact, canReact, rank, isLast }) {
  const [recentMemes, setRecentMemes] = useState([]);
  const [justSent, setJustSent] = useState(null);

  function handleReact(reaction) {
    if (!canReact) return;
    onReact(reaction);
    const meme = getMeme();
    setRecentMemes(prev => [{ ...meme, reaction, id: Date.now() }, ...prev].slice(0, 3));
    setJustSent(reaction.id);
    setTimeout(() => setJustSent(null), 2000);
  }

  const reactionCounts = player.reactionCounts || {};
  const totalReactions = player.reactions?.length || 0;

  return (
    <div
      className={`player-card fade-up ${rank === 1 && player.total > 0 ? "glow-border" : ""}`}
      style={isLast && player.total > 0 ? { borderColor: "rgba(255,23,68,0.3)" } : {}}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div className="player-avatar" style={{ position: "relative" }}>
          {emoji}
          {rank === 1 && player.total > 0 && (
            <span style={{ position: "absolute", top: -8, right: -8, fontSize: "0.9rem" }}>👑</span>
          )}
          {isLast && player.total > 0 && (
            <span style={{ position: "absolute", top: -8, right: -8, fontSize: "0.9rem" }}>💀</span>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: "1rem" }}>{player.name}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text2)" }}>
            {player.total > 0 ? `${player.total} pts` : "No points yet"}
            {totalReactions > 0 && ` · ${totalReactions} roast${totalReactions !== 1 ? "s" : ""}`}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {player.total > 0 && (
            <div style={{ fontWeight: 900, fontSize: "1.2rem", color: rank === 1 ? "var(--yellow)" : "var(--accent2)" }}>
              {player.total}
            </div>
          )}
          <button
            onClick={onToggle}
            style={{ background: "none", color: "var(--text3)", fontSize: "1.1rem", padding: 4, transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "none" }}
          >
            ⌄
          </button>
        </div>
      </div>

      {/* Score pills */}
      {(player.burgerScore !== null || player.bowlingScore !== null || player.padelScore !== null) && (
        <div className="score-strip">
          {player.burgerScore !== null && <span className="score-pill score-pill-burger">🍔 {player.burgerScore}/10</span>}
          {player.bowlingScore !== null && <span className="score-pill score-pill-bowling">🎳 {player.bowlingScore}</span>}
          {player.padelScore !== null && <span className="score-pill score-pill-padel">🏓 {player.padelScore}W</span>}
        </div>
      )}

      {/* Top reactions summary */}
      {totalReactions > 0 && !isExpanded && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
          {REACTIONS.filter(r => reactionCounts[r.id]).map(r => (
            <span key={r.id} style={{ fontSize: "0.7rem", color: "var(--text3)", background: "var(--bg3)", padding: "2px 8px", borderRadius: 99, border: "1px solid var(--border)" }}>
              {r.emoji} ×{reactionCounts[r.id]}
            </span>
          ))}
        </div>
      )}

      {/* Expanded section */}
      {isExpanded && (
        <div style={{ marginTop: 14, borderTop: "1px solid var(--border)", paddingTop: 14 }}>
          {/* Reaction buttons */}
          {canReact && (
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                Send a roast 🔥
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {REACTIONS.map(reaction => {
                  const count = reactionCounts[reaction.id] || 0;
                  const sent = justSent === reaction.id;
                  return (
                    <button
                      key={reaction.id}
                      className="reaction-pill"
                      onClick={() => handleReact(reaction)}
                      style={sent ? { borderColor: "var(--accent)", color: "var(--accent2)", background: "rgba(108,71,255,0.12)" } : {}}
                    >
                      {reaction.emoji} {reaction.label}
                      {count > 0 && <span className="rp-count">{count}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {!canReact && (
            <div style={{ fontSize: "0.78rem", color: "var(--text3)", marginBottom: 10 }}>
              {totalReactions === 0 ? "No roasts yet. The lads are being uncharacteristically nice." : ""}
            </div>
          )}

          {/* Meme placeholders */}
          {recentMemes.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                Recent GIFs 🎞️
              </div>
              {recentMemes.map(meme => (
                <div key={meme.id} className="meme-card">
                  <div className="meme-thumb">{meme.emoji}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.8rem" }}>{meme.label}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text3)" }}>GIF placeholder — swap in real ones later</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* All reactions log for this player */}
          {player.reactions?.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                Roast history
              </div>
              {player.reactions.slice().reverse().slice(0, 5).map(r => {
                const rDef = REACTIONS.find(x => x.id === r.reaction?.id);
                return (
                  <div key={r.id} style={{ fontSize: "0.75rem", color: "var(--text2)", padding: "5px 0", borderBottom: "1px solid var(--border)", display: "flex", gap: 6 }}>
                    <span>{rDef?.emoji || "💬"}</span>
                    <span><strong>{r.sender}</strong> — {rDef?.label || r.reaction?.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
