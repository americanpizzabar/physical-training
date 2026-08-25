"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { todayISO } from "./date";

const KEY = "prime:v1";

function emptyState() {
  return {
    profile: { name: "", weightKg: 70, age: null, sex: null, goalBodyFat: null },
    onboarding: { done: false },
    diagnosis: null,
    logs: { sleep: {}, steps: {}, sports: [], workouts: [] },
    settings: { stepGoalBase: 7000 },
  };
}

function load() {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    // shallow-merge to tolerate older shapes
    const base = emptyState();
    return {
      ...base,
      ...parsed,
      profile: { ...base.profile, ...(parsed.profile || {}) },
      onboarding: { ...base.onboarding, ...(parsed.onboarding || {}) },
      logs: { ...base.logs, ...(parsed.logs || {}) },
      settings: { ...base.settings, ...(parsed.settings || {}) },
    };
  } catch {
    return emptyState();
  }
}

const StoreCtx = createContext(null);

const uid = () => Math.random().toString(36).slice(2, 10);

export function StoreProvider({ children }) {
  const [state, setState] = useState(emptyState);
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(KEY, JSON.stringify(state));
      } catch {}
    }, 120);
  }, [state, hydrated]);

  // --- actions ---
  const actions = {
    setProfile: (patch) => setState((s) => ({ ...s, profile: { ...s.profile, ...patch } })),

    finishOnboarding: (profile, diagnosis) =>
      setState((s) => ({
        ...s,
        profile: { ...s.profile, ...profile },
        diagnosis,
        onboarding: { done: true },
      })),

    setDiagnosis: (diagnosis) => setState((s) => ({ ...s, diagnosis })),

    logSleep: (hours, iso = todayISO()) =>
      setState((s) => ({ ...s, logs: { ...s.logs, sleep: { ...s.logs.sleep, [iso]: hours } } })),

    logSteps: (count, iso = todayISO()) =>
      setState((s) => ({ ...s, logs: { ...s.logs, steps: { ...s.logs.steps, [iso]: count } } })),

    addSteps: (delta, iso = todayISO()) =>
      setState((s) => {
        const cur = s.logs.steps[iso] || 0;
        return { ...s, logs: { ...s.logs, steps: { ...s.logs.steps, [iso]: Math.max(0, cur + delta) } } };
      }),

    addSport: (sport, iso = todayISO()) =>
      setState((s) => ({
        ...s,
        logs: { ...s.logs, sports: [...s.logs.sports, { id: sport.id, minutes: sport.minutes, date: iso, key: uid() }] },
      })),

    removeSport: (key) =>
      setState((s) => ({ ...s, logs: { ...s.logs, sports: s.logs.sports.filter((x) => x.key !== key) } })),

    // Ensure today's workout exists; returns nothing (state updated).
    ensureWorkout: (iso = todayISO()) =>
      setState((s) => {
        if (s.logs.workouts.some((w) => w.date === iso)) return s;
        return {
          ...s,
          logs: { ...s.logs, workouts: [...s.logs.workouts, { key: uid(), date: iso, exercises: [], cardio: { done: false, minutes: 0 } }] },
        };
      }),

    addExercise: (name, muscle, iso = todayISO()) =>
      setState((s) => {
        const workouts = [...s.logs.workouts];
        let w = workouts.find((x) => x.date === iso);
        if (!w) {
          w = { key: uid(), date: iso, exercises: [], cardio: { done: false, minutes: 0 } };
          workouts.push(w);
        }
        if (!w.exercises.some((e) => e.name === name)) {
          w.exercises = [...w.exercises, { key: uid(), name, muscle, sets: [] }];
        }
        return { ...s, logs: { ...s.logs, workouts } };
      }),

    removeExercise: (exKey, iso = todayISO()) =>
      setState((s) => ({
        ...s,
        logs: {
          ...s.logs,
          workouts: s.logs.workouts.map((w) =>
            w.date === iso ? { ...w, exercises: w.exercises.filter((e) => e.key !== exKey) } : w
          ),
        },
      })),

    addSet: (exKey, set, iso = todayISO()) =>
      setState((s) => {
        const workouts = s.logs.workouts.map((w) => {
          if (w.date !== iso) return w;
          return {
            ...w,
            exercises: w.exercises.map((e) => (e.key === exKey ? { ...e, sets: [...e.sets, set] } : e)),
          };
        });
        return { ...s, logs: { ...s.logs, workouts } };
      }),

    removeSet: (exKey, idx, iso = todayISO()) =>
      setState((s) => {
        const workouts = s.logs.workouts.map((w) => {
          if (w.date !== iso) return w;
          return {
            ...w,
            exercises: w.exercises.map((e) =>
              e.key === exKey ? { ...e, sets: e.sets.filter((_, i) => i !== idx) } : e
            ),
          };
        });
        return { ...s, logs: { ...s.logs, workouts } };
      }),

    setCardio: (minutes, iso = todayISO()) =>
      setState((s) => {
        const workouts = s.logs.workouts.map((w) =>
          w.date === iso ? { ...w, cardio: { done: true, minutes } } : w
        );
        return { ...s, logs: { ...s.logs, workouts } };
      }),

    redoDiagnosis: () => setState((s) => ({ ...s, onboarding: { done: false } })),

    resetAll: () => setState(emptyState()),
  };

  return <StoreCtx.Provider value={{ state, hydrated, actions }}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
