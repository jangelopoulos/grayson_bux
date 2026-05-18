import { useApp } from "../context/AppContext";

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Feed() {
  const { gifLog } = useApp();

  const sorted = [...gifLog].reverse();

  return (
    <div className="page fade-up">
      <div className="page-header">
        <h1>GIF Feed 🎞️</h1>
        <p>The full record. Nothing gets forgotten.</p>
      </div>

      {sorted.length === 0 ? (
        <div className="card-lg text-center" style={{ padding: 40 }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>🦗</div>
          <h3 style={{ marginBottom: 8 }}>Dead quiet in here</h3>
          <p className="text-muted text-sm">No GIFs sent yet. Someone needs to start something.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sorted.map(entry => (
            <div
              key={entry.id}
              className="card-lg fade-up"
              style={{
                borderColor: entry.type === "angry" ? "rgba(255,23,68,0.25)" : "rgba(0,230,118,0.2)",
                background: entry.type === "angry" ? "rgba(255,23,68,0.04)" : "rgba(0,230,118,0.03)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "1.4rem" }}>{entry.type === "angry" ? "😡" : "🎉"}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                      <span style={{ color: "var(--accent2)" }}>{entry.senderEmoji} {entry.sender}</span>
                      <span style={{ color: "var(--text3)" }}> → </span>
                      <span>{entry.target}</span>
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text3)" }}>
                      {entry.type === "angry" ? "sent an angry 😡" : "sent congrats 🎉"}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text3)" }}>{formatTime(entry.timestamp)}</div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text3)" }}>{timeAgo(entry.timestamp)}</div>
                </div>
              </div>
              {entry.gifUrl?.startsWith("https://tenor.com/embed/") ? (
                <div style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", height: 220 }}>
                  <iframe
                    src={entry.gifUrl}
                    style={{ width: "100%", height: "100%", border: "none", display: "block", pointerEvents: "none" }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              ) : (
                <img
                  src={entry.gifUrl}
                  alt={entry.type}
                  style={{ width: "100%", borderRadius: "var(--radius-sm)", display: "block", maxHeight: 220, objectFit: "cover" }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
