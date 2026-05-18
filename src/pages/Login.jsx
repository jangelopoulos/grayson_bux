import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const ok = login(username.trim().toLowerCase(), password);
    if (ok) {
      navigate("/itinerary");
    } else {
      setError("Wrong username or password, genius.");
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
    }
  }

  return (
    <div className="login-page">
      <div className={`login-card fade-up ${shaking ? "shake" : ""}`}>
        <div className="text-center mb-3" style={{ marginBottom: 24 }}>
          <div style={{ fontSize: "3rem", marginBottom: 8 }}>🍾</div>
          <h1 style={{ fontSize: "1.6rem", marginBottom: 4 }}>Grayson's Bucks Day</h1>
          <p className="text-muted text-sm">Survive the day. Earn the bragging rights.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              Username
            </label>
            <input
              type="text"
              placeholder="who are you, exactly"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(""); }}
              autoCapitalize="none"
              autoComplete="username"
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              autoComplete="current-password"
            />
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

          <button type="submit" className="btn btn-primary btn-full" style={{ fontSize: "1rem" }}>
            Let's go 🚀
          </button>
        </form>

        <p className="text-center text-xs text-muted" style={{ marginTop: 20 }}>
          No account? Tell Grayson to sort his life out.
        </p>
      </div>
    </div>
  );
}
