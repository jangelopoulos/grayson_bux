import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { USERS, ACTIVITIES } from "../config/users";
import { supabase } from "../config/supabase";

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
  const [gifLog, setGifLog] = useState([]);
  const [activeActivity, setActiveActivityState] = useState(() => loadState("bucks_activeActivity", "burgers"));

  useEffect(() => { saveState("bucks_auth", auth); }, [auth]);
  useEffect(() => { saveState("bucks_daySetup", daySetup); }, [daySetup]);
  useEffect(() => { saveState("bucks_groups", groups); }, [groups]);
  useEffect(() => { saveState("bucks_scores", scores); }, [scores]);
  useEffect(() => { saveState("bucks_reactions", reactionLog); }, [reactionLog]);
  useEffect(() => { saveState("bucks_activeActivity", activeActivity); }, [activeActivity]);

  // Load gifLog from Supabase on mount and subscribe to real-time inserts
  useEffect(() => {
    supabase
      .from("bucks_gif_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) setGifLog(data.map(row => ({
          id: row.id,
          sender: row.sender,
          senderEmoji: row.sender_emoji,
          target: row.target,
          type: row.type,
          gifUrl: row.gif_url,
          timestamp: row.created_at,
        })));
      });

    const channel = supabase
      .channel("bucks_gif_log_changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "bucks_gif_log" }, payload => {
        const row = payload.new;
        setGifLog(prev => [{
          id: row.id,
          sender: row.sender,
          senderEmoji: row.sender_emoji,
          target: row.target,
          type: row.type,
          gifUrl: row.gif_url,
          timestamp: row.created_at,
        }, ...prev].slice(0, 50));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

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
    supabase.from("bucks_gif_log").insert({
      sender: auth.displayName || auth.username,
      sender_emoji: auth.emoji || "👤",
      target: targetPlayer,
      type,
      gif_url: gifUrl,
    });
    // Optimistic local update so sender sees it immediately
    setGifLog(prev => [{
      id: Date.now() + Math.random(),
      sender: auth.displayName || auth.username,
      senderEmoji: auth.emoji || "👤",
      target: targetPlayer,
      type,
      gifUrl,
      timestamp: new Date().toISOString(),
    }, ...prev].slice(0, 50));
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
    supabase.from("bucks_gif_log").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  }, []);

  const resetAll = useCallback(() => {
    setScores({});
    setReactionLog([]);
    setGifLog([]);
    setGroups([]);
    setDaySetup({ complete: false, attendeeNames: [] });
    setActiveActivityState("burgers");
    supabase.from("bucks_gif_log").delete().neq("id", "00000000-0000-0000-0000-000000000000");
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
