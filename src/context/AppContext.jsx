import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { USERS, ACTIVITIES } from "../config/users";

const AppContext = createContext(null);

function loadState(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function saveState(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function AppProvider({ children }) {
  const [auth, setAuth] = useState(() => loadState("bucks_auth", null));
  const [daySetup, setDaySetup] = useState(() => loadState("bucks_daySetup", { complete: false, attendeeNames: [] }));
  const [groups, setGroups] = useState(() => loadState("bucks_groups", []));
  const [scores, setScores] = useState(() => loadState("bucks_scores", {}));
  const [reactionLog, setReactionLog] = useState(() => loadState("bucks_reactions", []));
  const [gifLog, setGifLog] = useState(() => loadState("bucks_giflog", []));
  const [activeActivity, setActiveActivityState] = useState(() => loadState("bucks_activeActivity", "burgers"));

  useEffect(() => { saveState("bucks_auth", auth); }, [auth]);
  useEffect(() => { saveState("bucks_daySetup", daySetup); }, [daySetup]);
  useEffect(() => { saveState("bucks_groups", groups); }, [groups]);
  useEffect(() => { saveState("bucks_scores", scores); }, [scores]);
  useEffect(() => { saveState("bucks_reactions", reactionLog); }, [reactionLog]);
  useEffect(() => { saveState("bucks_giflog", gifLog); }, [gifLog]);
  useEffect(() => { saveState("bucks_activeActivity", activeActivity); }, [activeActivity]);

  const login = useCallback((username, password) => {
    const user = USERS.find(u => u.username === username && u.password === password);
    if (!user) return false;
    setAuth({ username: user.username, role: user.role, displayName: user.displayName, emoji: user.emoji });
    return true;
  }, []);

  const logout = useCallback(() => {
    setAuth(null);
  }, []);

  const setupDay = useCallback((attendeeNames) => {
    // Shuffle and assign to groups of 2 if possible, otherwise balanced
    const shuffled = [...attendeeNames].sort(() => Math.random() - 0.5);
    const total = shuffled.length;
    const groupSize = total <= 4 ? total : Math.ceil(total / Math.ceil(total / 4));
    const newGroups = [];
    for (let i = 0; i < shuffled.length; i += groupSize) {
      newGroups.push({
        id: `group_${newGroups.length + 1}`,
        name: `Group ${newGroups.length + 1}`,
        members: shuffled.slice(i, i + groupSize),
      });
    }
    setGroups(newGroups);
    setDaySetup({ complete: true, attendeeNames });
    setScores({});
    setReactionLog([]);
  }, []);

  const submitScore = useCallback((activity, playerName, score) => {
    setScores(prev => ({
      ...prev,
      [activity]: {
        ...(prev[activity] || {}),
        [playerName]: Number(score),
      },
    }));
  }, []);

  const sendReaction = useCallback((targetPlayer, reaction) => {
    if (!auth) return;
    setReactionLog(prev => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        sender: auth.displayName || auth.username,
        target: targetPlayer,
        reaction,
        timestamp: new Date().toISOString(),
      },
    ]);
  }, [auth]);

  const sendGif = useCallback((targetPlayer, type, gifUrl) => {
    if (!auth) return;
    setGifLog(prev => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        sender: auth.displayName || auth.username,
        senderEmoji: auth.emoji || "👤",
        target: targetPlayer,
        type, // 'congrats' | 'angry'
        gifUrl,
        timestamp: new Date().toISOString(),
      },
    ]);
  }, [auth]);

  const setActiveActivity = useCallback((activityId) => {
    setActiveActivityState(activityId);
  }, []);

  const resetScores = useCallback(() => {
    setScores({});
  }, []);

  const resetReactions = useCallback(() => {
    setReactionLog([]);
    setGifLog([]);
  }, []);

  const resetAll = useCallback(() => {
    setScores({});
    setReactionLog([]);
    setGifLog([]);
    setGroups([]);
    setDaySetup({ complete: false, attendeeNames: [] });
    setActiveActivityState("burgers");
  }, []);

  // Compute leaderboard
  const leaderboard = (() => {
    if (!daySetup.attendeeNames?.length) return [];
    return daySetup.attendeeNames.map(name => {
      const burgerScore = scores.burgers?.[name] ?? null;
      const bowlingScore = scores.bowling?.[name] ?? null;
      const padelScore = scores.padel?.[name] ?? null;

      // Points: burgers = vibe score (1-10), bowling = score/10 (0-30), padel = wins*5 (0-50)
      const burgerPts = burgerScore !== null ? burgerScore : 0;
      const bowlingPts = bowlingScore !== null ? Math.floor(bowlingScore / 10) : 0;
      const padelPts = padelScore !== null ? padelScore * 5 : 0;
      const total = burgerPts + bowlingPts + padelPts;

      const reactions = reactionLog.filter(r => r.target === name);
      const reactionCounts = reactions.reduce((acc, r) => {
        acc[r.reaction.id] = (acc[r.reaction.id] || 0) + 1;
        return acc;
      }, {});

      return {
        name,
        burgerScore,
        bowlingScore,
        padelScore,
        burgerPts,
        bowlingPts,
        padelPts,
        total,
        reactions,
        reactionCounts,
      };
    }).sort((a, b) => b.total - a.total);
  })();

  return (
    <AppContext.Provider value={{
      auth,
      login,
      logout,
      daySetup,
      setupDay,
      groups,
      scores,
      submitScore,
      reactionLog,
      sendReaction,
      gifLog,
      sendGif,
      activeActivity,
      setActiveActivity,
      leaderboard,
      resetScores,
      resetReactions,
      resetAll,
      ACTIVITIES,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
