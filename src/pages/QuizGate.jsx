import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

// ── Q1: Greeks ───────────────────────────────────────────────────────────────
function Q1({ onNext }) {
  const options = ["Turks", "Chinese", "Indians", "Greeks"];
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);

  function toggle(opt) {
    if (result) return;
    setSelected(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]);
  }

  function submit() {
    if (!selected.length) return;
    const correct = selected.includes("Greeks") && selected.length === 1;
    setResult(correct ? "correct" : "wrong");
  }

  return (
    <div className="fade-up">
      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
        Question 1 of 3
      </div>
      <h2 style={{ fontSize: "1.3rem", marginBottom: 20 }}>Which race invented everything?</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            style={{
              padding: "14px 18px",
              borderRadius: "var(--radius)",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: result ? "default" : "pointer",
              background: selected.includes(opt) ? "rgba(108,71,255,0.15)" : "var(--bg3)",
              border: `2px solid ${selected.includes(opt) ? "var(--accent)" : "var(--border)"}`,
              color: selected.includes(opt) ? "var(--accent2)" : "var(--text)",
              textAlign: "left",
              transition: "all 0.15s",
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      {result === "correct" && (
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img src="https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUyMmZheHpzY2ZubXFqZXJrbjA3b3h1MW5rMnI2a3U5ZHhmdWNmdTMxOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1SfxXOJ0Q2Xni/giphy.gif" alt="you better believe it" style={{ width: "100%", borderRadius: "var(--radius)", marginBottom: 12 }} />
          <div style={{ fontWeight: 900, fontSize: "1.2rem", color: "var(--green)", marginBottom: 4 }}>You better believe it.</div>
          <button className="btn btn-primary btn-full" style={{ marginTop: 12 }} onClick={onNext}>Next →</button>
        </div>
      )}

      {result === "wrong" && (
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: "2rem", marginBottom: 6 }}>💀</div>
          <div style={{ fontWeight: 900, fontSize: "1rem", color: "var(--red)", marginBottom: 4 }}>Embarrassing. Genuinely.</div>
          <div style={{ fontSize: "0.82rem", color: "var(--text2)", marginBottom: 12 }}>Have a think. Try again.</div>
          <button className="btn btn-secondary btn-sm" onClick={() => { setSelected([]); setResult(null); }}>Try again</button>
        </div>
      )}

      {!result && (
        <button
          className="btn btn-primary btn-full"
          onClick={submit}
          disabled={!selected.length}
          style={{ opacity: selected.length ? 1 : 0.5 }}
        >
          Submit
        </button>
      )}
    </div>
  );
}

// ── Q2: Rank the degenerates ─────────────────────────────────────────────────
const VILLAINS = [
  { id: "epstein", name: "Jeffrey Epstein", emoji: "🏝️" },
  { id: "diddy", name: "P Diddy", emoji: "🎵" },
  { id: "harvey", name: "Harvey Weinstein", emoji: "🎬" },
];

// Correct order by id
const CORRECT_ORDER = ["epstein", "diddy", "harvey"];

function Q2({ onNext }) {
  const [order, setOrder] = useState(() => [...VILLAINS].sort(() => Math.random() - 0.5));
  const [result, setResult] = useState(null);

  function moveLeft(idx) {
    if (idx === 0 || result) return;
    const next = [...order];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    setOrder(next);
  }

  function moveRight(idx) {
    if (idx === order.length - 1 || result) return;
    const next = [...order];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    setOrder(next);
  }

  function submit() {
    const isCorrect = order.every((v, i) => v.id === CORRECT_ORDER[i]);
    setResult(isCorrect ? "correct" : "wrong");
  }

  return (
    <div className="fade-up">
      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
        Question 2 of 3
      </div>
      <h2 style={{ fontSize: "1.3rem", marginBottom: 6 }}>Rank from worst to… also worst.</h2>
      <p style={{ fontSize: "0.82rem", color: "var(--text2)", marginBottom: 20 }}>Drag into order — #1 is the absolute pinnacle of wrong.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, justifyContent: "center" }}>
        {order.map((villain, idx) => (
          <div key={villain.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              #{idx + 1}
            </div>
            <div style={{
              background: "var(--bg3)",
              border: `2px solid ${result === "correct" ? "var(--green2)" : result === "wrong" ? "var(--red)" : "var(--border2)"}`,
              borderRadius: "var(--radius)",
              padding: "12px 6px",
              textAlign: "center",
              width: "100%",
              transition: "border-color 0.3s",
            }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 4 }}>{villain.emoji}</div>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, lineHeight: 1.2 }}>{villain.name}</div>
            </div>
            {!result && (
              <div style={{ display: "flex", gap: 4 }}>
                <button
                  onClick={() => moveLeft(idx)}
                  disabled={idx === 0}
                  style={{ background: "var(--bg4)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 8px", color: idx === 0 ? "var(--text3)" : "var(--text)", fontSize: "0.8rem", cursor: idx === 0 ? "not-allowed" : "pointer" }}
                >
                  ←
                </button>
                <button
                  onClick={() => moveRight(idx)}
                  disabled={idx === order.length - 1}
                  style={{ background: "var(--bg4)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 8px", color: idx === order.length - 1 ? "var(--text3)" : "var(--text)", fontSize: "0.8rem", cursor: idx === order.length - 1 ? "not-allowed" : "pointer" }}
                >
                  →
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {result === "correct" && (
        <div style={{ textAlign: "center", marginBottom: 20, animation: "fadeUp 0.4s ease" }}>
          <div style={{ fontSize: "3rem", marginBottom: 8 }}>🎟️</div>
          <div style={{ fontWeight: 900, fontSize: "1.2rem", color: "var(--green)", marginBottom: 4 }}>1 free ticket to the island for you.</div>
          <div style={{ fontSize: "0.82rem", color: "var(--text2)", marginBottom: 16 }}>Correct. You clearly know your stuff. Concerning, but correct.</div>
          <button className="btn btn-primary btn-full" onClick={onNext}>Next →</button>
        </div>
      )}

      {result === "wrong" && (
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: "2rem", marginBottom: 6 }}>❌</div>
          <div style={{ fontWeight: 900, fontSize: "1rem", color: "var(--red)", marginBottom: 4 }}>Not quite. Think harder.</div>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 8 }} onClick={() => setResult(null)}>Try again</button>
        </div>
      )}

      {!result && (
        <button className="btn btn-primary btn-full" onClick={submit}>Submit ranking</button>
      )}
    </div>
  );
}

// ── Q3: Boobs or Bum ─────────────────────────────────────────────────────────
// Swap these src values for real photos — keep the alt text
const CARD_OPTIONS = [
  { id: "boobs", label: "Boobs", emoji: "🍒", placeholder: "swap for real photo" },
  { id: "bum", label: "Bum", emoji: "🍑", placeholder: "swap for real photo" },
];

function Q3({ onComplete }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  function submit() {
    if (!selected) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="fade-up" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
          Question 3 of 3
        </div>
        <div style={{ fontSize: "3rem", marginBottom: 12 }}>✅</div>
        <h2 style={{ fontSize: "1.4rem", marginBottom: 8 }}>Either is correct.</h2>
        <p style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--accent2)", marginBottom: 20 }}>Just no fatties!</p>
        <button className="btn btn-primary btn-full" style={{ fontSize: "1rem" }} onClick={onComplete}>
          Enter the day 🍾
        </button>
      </div>
    );
  }

  return (
    <div className="fade-up">
      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
        Question 3 of 3
      </div>
      <h2 style={{ fontSize: "1.3rem", marginBottom: 20 }}>Boobs or bum?</h2>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {CARD_OPTIONS.map(opt => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            style={{
              flex: 1,
              borderRadius: "var(--radius-lg)",
              border: `2.5px solid ${selected === opt.id ? "var(--accent)" : "var(--border)"}`,
              background: selected === opt.id ? "rgba(108,71,255,0.12)" : "var(--bg3)",
              padding: "32px 16px",
              cursor: "pointer",
              transition: "all 0.15s",
              boxShadow: selected === opt.id ? "0 0 20px var(--accent-glow)" : "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: "3rem" }}>{opt.emoji}</span>
            <span style={{ fontWeight: 900, fontSize: "1.2rem", color: selected === opt.id ? "var(--accent2)" : "var(--text)" }}>
              {opt.label}
            </span>
          </button>
        ))}
      </div>

      <button
        className="btn btn-primary btn-full"
        onClick={submit}
        disabled={!selected}
        style={{ opacity: selected ? 1 : 0.5, fontSize: "1rem" }}
      >
        Lock it in
      </button>
    </div>
  );
}

// ── Main Quiz Gate ────────────────────────────────────────────────────────────
export default function QuizGate() {
  const [step, setStep] = useState(0); // 0 = intro, 1 = Q1, 2 = Q2, 3 = Q3
  const navigate = useNavigate();
  const { auth } = useApp();

  function complete() {
    sessionStorage.setItem("bucks_quiz_done", "1");
    navigate("/itinerary");
  }

  return (
    <div className="login-page" style={{ justifyContent: "flex-start", paddingTop: 40 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {step === 0 && (
          <div className="login-card fade-up" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>🛑</div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: 8 }}>Hold on, {auth?.displayName}.</h2>
            <p style={{ color: "var(--text2)", fontSize: "0.9rem", marginBottom: 8 }}>
              Before you get in, you must answer some questions.
            </p>
            <p style={{ color: "var(--text3)", fontSize: "0.8rem", marginBottom: 24 }}>
              Get them wrong and you're going home.
            </p>
            <button className="btn btn-primary btn-full" style={{ fontSize: "1rem" }} onClick={() => setStep(1)}>
              Let's go 🎯
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="login-card">
            <Q1 onNext={() => setStep(2)} />
          </div>
        )}

        {step === 2 && (
          <div className="login-card">
            <Q2 onNext={() => setStep(3)} />
          </div>
        )}

        {step === 3 && (
          <div className="login-card">
            <Q3 onComplete={complete} />
          </div>
        )}
      </div>
    </div>
  );
}
