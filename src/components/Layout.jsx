import { useApp } from "../context/AppContext";
import BottomNav from "./nav/BottomNav";

export default function Layout({ children }) {
  const { auth, activeActivity, ACTIVITIES } = useApp();
  const act = ACTIVITIES.find(a => a.id === activeActivity);

  return (
    <div className="app-shell">
      <div className="brand-header">
        <div className="brand-title">Grayson's Bucks Day 🍾</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {act && <span style={{ fontSize: "0.72rem", color: "var(--text3)", fontWeight: 600 }}>{act.emoji} {act.label}</span>}
          {auth && (
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text2)", background: "var(--bg3)", padding: "3px 8px", borderRadius: 99, border: "1px solid var(--border)" }}>
              {auth.emoji} {auth.displayName}
              {auth.role === "admin" && <span style={{ color: "var(--accent2)", marginLeft: 4 }}>★</span>}
            </span>
          )}
        </div>
      </div>
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
