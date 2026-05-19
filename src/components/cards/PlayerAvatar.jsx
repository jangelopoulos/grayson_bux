// Renders a player's avatar: direct URL (avatar), Tenor iframe (tenorId), or emoji fallback.
// Priority: avatar > tenorId > gif > emoji
import { USERS } from "../../config/users";

export function getUser(name) {
  return USERS.find(u => u.displayName === name) || {};
}

export default function PlayerAvatar({ name, size = 44 }) {
  const user = getUser(name);

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: "50%",
    overflow: "hidden",
    border: "2px solid var(--border2)",
    background: "var(--bg4)",
    flexShrink: 0,
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  if (user.avatar) {
    return (
      <div style={containerStyle}>
        <img src={user.avatar} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }

  if (user.tenorId) {
    return (
      <div style={containerStyle}>
        <iframe
          src={`https://tenor.com/embed/${user.tenorId}`}
          style={{ position: "absolute", top: "-10%", left: "-10%", width: "120%", height: "120%", border: "none", pointerEvents: "none" }}
          scrolling="no"
          frameBorder="0"
          allowFullScreen
        />
      </div>
    );
  }

  if (user.gif) {
    return (
      <div style={containerStyle}>
        <img src={user.gif} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <span style={{ fontSize: size * 0.4 }}>{user.emoji || "🤙"}</span>
    </div>
  );
}
