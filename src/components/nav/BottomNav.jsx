import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const NAV_ITEMS = [
  { to: "/itinerary", emoji: "📋", label: "Plan" },
  { to: "/groups", emoji: "👥", label: "Groups" },
  { to: "/leaderboard", emoji: "🏆", label: "Table" },
  { to: "/admin", emoji: "🔐", label: "Admin", adminOnly: true },
];

export default function BottomNav() {
  const { auth, logout } = useApp();
  const navigate = useNavigate();

  const items = NAV_ITEMS.filter(item => !item.adminOnly || auth?.role === "admin");

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <span className="nav-item-emoji">{item.emoji}</span>
          {item.label}
        </NavLink>
      ))}
      <button className="nav-item" onClick={handleLogout} style={{ flex: "0 0 auto", paddingLeft: 12, paddingRight: 12 }}>
        <span className="nav-item-emoji">🚪</span>
        Out
      </button>
    </nav>
  );
}
