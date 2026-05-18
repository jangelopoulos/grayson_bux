import { useState } from "react";
import { useApp } from "../context/AppContext";
import { USERS } from "../config/users";
import PlayerCard from "../components/cards/PlayerCard";

function getEmoji(name) {
  const user = USERS.find(u => u.displayName === name);
  return user?.emoji || "🤙";
}

const RANK_ICONS = ["👑", "🥈", "🥉"];
const BOTTOM_ROASTS = [
  "Absolutely tragic. Go home.",
  "That's embarrassing, mate.",
  "Maybe try a different sport. Or any sport.",
  "The group chat will remember this.",
  "Rock bottom. Literally.",
];

function getRoast() {
  return BOTTOM_ROASTS[Math.floor(Math.random() * BOTTOM_ROASTS.length)];
}

export default function Leaderboard() {
  const { leaderboard, daySetup, sendReaction, auth } = useApp();
  const [expandedPlayer, setExpandedPlayer] = useState(null);
  const [roast] = useState(getRoast);

  if (!daySetup.complete || leaderboard.length === 0) {
    return (
      <div className="page fade-up">
        <div className="page-header">
          <h1>Leaderboard 🏆</h1>
          <p>Nothing to see yet. The day hasn't started.</p>
        </div>
        <div className="card-lg text-center" style={{ padding: 40 }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>📊</div>
          <h3 style={{ marginBottom: 8 }}>No scores yet</h3>
          <p className="text-muted text-sm">Once scores are in, you'll know who's the actual worst.</p>
        </div>
      </div>
    );
  }

  const hasAnyScore = leaderboard.some(p => p.total > 0);
  const lastPlace = leaderboard[leaderboard.length - 1];
  const firstPlace = leaderboard[0];

  return (
    <div className="page fade-up">
      <div className="page-header">
        <h1>Leaderboard 🏆</h1>
        <p>Who's the best? Who's the worst? Both matter.</p>
      </div>

      {hasAnyScore && (
        <>
          <div
            className="card-lg glow-border"
            style={{ textAlign: "center", background: "rgba(108,71,255,0.06)", marginBottom: 20 }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: 4 }}>👑</div>
            <div style={{ fontWeight: 900, fontSize: "1.3rem", marginBottom: 2 }}>{firstPlace.name}</div>
            <div style={{ color: "var(--accent2)", fontWeight: 700, fontSize: "1.5rem" }}>{firstPlace.total} pts</div>
            <div style={{ color: "var(--text2)", fontSize: "0.8rem", marginTop: 4 }}>Current top dog. Don't let it go to their head.</div>
          </div>

          {lastPlace !== firstPlace && (
            <div className="card" style={{ background: "rgba(255,23,68,0.05)", border: "1px solid rgba(255,23,68,0.2)", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: "1.6rem" }}>💀</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--red)" }}>{lastPlace.name} — last place</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text2)" }}>{roast}</div>
                </div>
                <div style={{ marginLeft: "auto", fontWeight: 900, color: "var(--red)", fontSize: "1.1rem" }}>{lastPlace.total} pts</div>
              </div>
            </div>
          )}
        </>
      )}

      {!hasAnyScore && (
        <div className="alert alert-info">Scores not in yet. Probably still eating their burgers.</div>
      )}

      <div className="card-lg" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
          Full table
        </div>
        <div style={{ fontSize: "0.72rem", color: "var(--text3)", marginBottom: 14 }}>
          Burgers: vibe × 1pt · Bowling: score ÷ 10 · Padel: wins × 5pts
        </div>
        {leaderboard.map((player, idx) => (
          <div key={player.name} className="lb-row">
            <div className="lb-rank">
              {idx === 0 && hasAnyScore ? "👑" : idx < 3 && hasAnyScore ? RANK_ICONS[idx] : <span style={{ color: "var(--text3)", fontSize: "0.9rem" }}>#{idx + 1}</span>}
              {idx === leaderboard.length - 1 && leaderboard.length > 1 && hasAnyScore ? "💀" : null}
            </div>
            <div className="player-avatar" style={{ width: 32, height: 32, fontSize: "1rem" }}>
              {getEmoji(player.name)}
            </div>
            <div className="lb-name">
              <div>{player.name}</div>
              <div className="score-strip">
                {player.burgerScore !== null && (
                  <span className="score-pill score-pill-burger">🍔 {player.burgerScore}</span>
                )}
                {player.bowlingScore !== null && (
                  <span className="score-pill score-pill-bowling">🎳 {player.bowlingScore}</span>
                )}
                {player.padelScore !== null && (
                  <span className="score-pill score-pill-padel">🏓 {player.padelScore}</span>
                )}
              </div>
            </div>
            <div className="lb-pts">{player.total}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
          Player cards — tap to roast
        </div>
        {leaderboard.map(player => (
          <PlayerCard
            key={player.name}
            player={player}
            emoji={getEmoji(player.name)}
            isExpanded={expandedPlayer === player.name}
            onToggle={() => setExpandedPlayer(expandedPlayer === player.name ? null : player.name)}
            onReact={(reaction) => sendReaction(player.name, reaction)}
            canReact={!!auth && auth.displayName !== player.name}
            rank={leaderboard.indexOf(player) + 1}
            isLast={leaderboard.indexOf(player) === leaderboard.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
