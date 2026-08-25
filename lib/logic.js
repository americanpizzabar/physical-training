// Pure domain logic for the PRIME coaching app.
// Everything derives from the stored state; no side effects.

import { todayISO, lastNDates, isThisWeek } from "./date";

// ---- Exercise library -------------------------------------------------------
// muscle: primary muscle group used for weekly-volume tallies.
// type: "free" (barbell/dumbbell/bodyweight, joint-demanding) or "machine".
// machineAlt: safer machine substitute when the target joints are fatigued.
export const EXERCISES = [
  { name: "ベンチプレス", muscle: "胸", type: "free", joints: ["肩"], machineAlt: "マシンチェストプレス" },
  { name: "インクラインDBプレス", muscle: "胸", type: "free", joints: ["肩"], machineAlt: "マシンインクラインプレス" },
  { name: "ダンベルフライ", muscle: "胸", type: "free", joints: ["肩"], machineAlt: "ペックフライ (マシン)" },
  { name: "マシンチェストプレス", muscle: "胸", type: "machine", joints: [] },
  { name: "ペックフライ (マシン)", muscle: "胸", type: "machine", joints: [] },
  { name: "ラットプルダウン", muscle: "背中", type: "machine", joints: [] },
  { name: "シーテッドロー (マシン)", muscle: "背中", type: "machine", joints: [] },
  { name: "バーベルロー", muscle: "背中", type: "free", joints: ["腰", "肩"], machineAlt: "シーテッドロー (マシン)" },
  { name: "ダンベルショルダープレス", muscle: "肩", type: "free", joints: ["肩"], machineAlt: "マシンショルダープレス" },
  { name: "マシンショルダープレス", muscle: "肩", type: "machine", joints: [] },
  { name: "サイドレイズ", muscle: "肩", type: "free", joints: ["肩"], machineAlt: "マシンラテラルレイズ" },
  { name: "スクワット", muscle: "脚", type: "free", joints: ["膝", "腰"], machineAlt: "レッグプレス (マシン)" },
  { name: "レッグプレス (マシン)", muscle: "脚", type: "machine", joints: [] },
  { name: "レッグエクステンション", muscle: "脚", type: "machine", joints: [] },
  { name: "ケーブルフライ", muscle: "胸", type: "machine", joints: [] },
  { name: "トライセプスプレスダウン", muscle: "腕", type: "machine", joints: [] },
  { name: "アームカール", muscle: "腕", type: "free", joints: [], machineAlt: "マシンカール" },
  { name: "アブローラー", muscle: "体幹", type: "free", joints: ["腰", "体幹"], machineAlt: "アブドミナルマシン" },
  // --- 自重 (bodyweight) ---
  { name: "腕立て伏せ", muscle: "胸", type: "bodyweight", joints: ["肩"], machineAlt: "マシンチェストプレス" },
  { name: "膝つき腕立て", muscle: "胸", type: "bodyweight", joints: [] },
  { name: "ディップス（自重）", muscle: "胸", type: "bodyweight", joints: ["肩"], machineAlt: "ペックフライ (マシン)" },
  { name: "懸垂", muscle: "背中", type: "bodyweight", joints: ["肩"], machineAlt: "ラットプルダウン" },
  { name: "斜め懸垂", muscle: "背中", type: "bodyweight", joints: [] },
  { name: "バックエクステンション（自重）", muscle: "背中", type: "bodyweight", joints: ["腰"] },
  { name: "パイクプッシュアップ", muscle: "肩", type: "bodyweight", joints: ["肩"], machineAlt: "マシンショルダープレス" },
  { name: "自重スクワット", muscle: "脚", type: "bodyweight", joints: ["膝", "腰"] },
  { name: "ブルガリアンスクワット（自重）", muscle: "脚", type: "bodyweight", joints: ["膝"] },
  { name: "ランジ（自重）", muscle: "脚", type: "bodyweight", joints: ["膝"] },
  { name: "カーフレイズ（自重）", muscle: "脚", type: "bodyweight", joints: [] },
  { name: "ヒップリフト", muscle: "脚", type: "bodyweight", joints: [] },
  { name: "ナロープッシュアップ", muscle: "腕", type: "bodyweight", joints: ["肩"] },
  { name: "プランク", muscle: "体幹", type: "bodyweight", joints: [] },
  { name: "クランチ", muscle: "体幹", type: "bodyweight", joints: [] },
  { name: "レッグレイズ", muscle: "体幹", type: "bodyweight", joints: [] },
];

export function equipLabel(type) {
  return type === "machine" ? "マシン" : type === "bodyweight" ? "自重" : "フリー";
}

export function isBodyweight(name) {
  return findExercise(name)?.type === "bodyweight";
}

export const MUSCLES = ["胸", "背中", "肩", "脚", "腕", "体幹"];

export function findExercise(name) {
  return EXERCISES.find((e) => e.name === name) || null;
}

// ---- Sports -----------------------------------------------------------------
// parts: body regions this sport overloads (drives fatigue management).
export const SPORTS = [
  { id: "tennis", label: "テニス", parts: ["右肩", "体幹"] },
  { id: "golf", label: "ゴルフ", parts: ["体幹", "腰"] },
  { id: "volleyball", label: "バレーボール", parts: ["肩", "脚"] },
  { id: "running", label: "ランニング", parts: ["脚"] },
  { id: "swim", label: "水泳", parts: ["肩", "背中"] },
  { id: "bike", label: "サイクリング", parts: ["脚"] },
];

export function findSport(id) {
  return SPORTS.find((s) => s.id === id) || null;
}

// ---- Sleep-linked muscle protection ----------------------------------------
export function recentSleepAvg(state, days = 3) {
  const sleep = state.logs.sleep || {};
  const dates = lastNDates(days);
  const vals = dates.map((d) => sleep[d]).filter((v) => typeof v === "number");
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

// Returns null when there is not enough sleep data yet.
export function protectionState(state) {
  const avg = recentSleepAvg(state, 3);
  const short = countRecentShortSleep(state, 3);
  if (avg == null) {
    return { known: false, on: false, pace: 1.0, priority: "normal", avg: null, shortDays: 0 };
  }
  const on = avg < 6;
  return {
    known: true,
    on,
    pace: on ? 0.5 : 1.0, // % of bodyweight per week
    priority: on ? "strength" : "normal",
    avg,
    shortDays: short,
  };
}

export function countRecentShortSleep(state, days = 3) {
  const sleep = state.logs.sleep || {};
  return lastNDates(days).filter((d) => typeof sleep[d] === "number" && sleep[d] < 6).length;
}

// ---- Protein target ---------------------------------------------------------
export function proteinTarget(state) {
  const w = state.profile.weightKg || 70;
  const prot = protectionState(state);
  const perKg = prot.on ? 1.8 : 1.6; // protect muscle harder when sleep-deprived
  return Math.round(w * perKg);
}

// ---- NEAT / steps -----------------------------------------------------------
export function isWorkoutDay(state, iso = todayISO()) {
  return (state.logs.workouts || []).some(
    (w) => w.date === iso && (w.exercises || []).some((e) => (e.sets || []).length > 0)
  );
}

export function neatState(state, iso = todayISO()) {
  const steps = (state.logs.steps || {})[iso] ?? 0;
  const workout = isWorkoutDay(state, iso);
  const base = state.settings?.stepGoalBase || 7000;
  const target = workout ? Math.max(base, 8000) : base;
  const remaining = Math.max(0, target - steps);
  return { steps, target, remaining, workout, strict: workout, pct: Math.min(1, steps / target) };
}

// ---- RIR-based weight recommendation ---------------------------------------
// Uses the most recent logged set of an exercise. Target RIR zone is 1–2.
export function lastSetFor(state, exName) {
  const workouts = [...(state.logs.workouts || [])].sort((a, b) => (a.date < b.date ? 1 : -1));
  for (const w of workouts) {
    for (const ex of w.exercises || []) {
      if (ex.name === exName && (ex.sets || []).length > 0) {
        return ex.sets[ex.sets.length - 1];
      }
    }
  }
  return null;
}

export function recommendWeight(state, exName) {
  const last = lastSetFor(state, exName);
  if (!last || typeof last.weight !== "number") return null;
  const step = last.weight >= 40 ? 2.5 : 1.25;
  let next = last.weight;
  let note = "現状維持";
  if (last.rir >= 3) {
    next = last.weight + step * 2;
    note = "余力あり — 増量";
  } else if (last.rir === 2) {
    next = last.weight + step;
    note = "適正 — 微増";
  } else if (last.rir === 1) {
    next = last.weight;
    note = "適正ゾーン維持";
  } else {
    next = Math.max(0, last.weight - step);
    note = "追い込み過ぎ — 減量";
  }
  return { weight: Math.round(next * 4) / 4, note, from: last };
}

// For bodyweight moves, progress reps instead of load (target RIR zone 1–2).
export function recommendReps(state, exName) {
  const last = lastSetFor(state, exName);
  if (!last || typeof last.reps !== "number") return null;
  let next = last.reps;
  let note = "現状維持";
  if (last.rir >= 3) {
    next = last.reps + 2;
    note = "余力あり — 回数を増やす";
  } else if (last.rir === 2) {
    next = last.reps + 1;
    note = "適正 — 微増";
  } else if (last.rir === 1) {
    note = "適正ゾーン維持";
  } else {
    next = Math.max(1, last.reps - 1);
    note = "追い込み過ぎ — 少し減らす";
  }
  return { reps: next, note, from: last };
}

// ---- Weekly training volume (sets per muscle) ------------------------------
export function weeklyVolume(state, ref = todayISO()) {
  const vol = Object.fromEntries(MUSCLES.map((m) => [m, 0]));
  for (const w of state.logs.workouts || []) {
    if (!isThisWeek(w.date, ref)) continue;
    for (const ex of w.exercises || []) {
      const meta = findExercise(ex.name);
      const muscle = meta?.muscle || ex.muscle;
      if (muscle && vol[muscle] != null) vol[muscle] += (ex.sets || []).length;
    }
  }
  return vol; // target zone 10–20
}

// ---- Aerobic minutes this week (cardio + sports) ---------------------------
export function aerobicThisWeek(state, ref = todayISO()) {
  let cardio = 0;
  const bySport = {};
  for (const w of state.logs.workouts || []) {
    if (isThisWeek(w.date, ref)) cardio += w.cardio?.minutes || 0;
  }
  for (const s of state.logs.sports || []) {
    if (!isThisWeek(s.date, ref)) continue;
    bySport[s.id] = (bySport[s.id] || 0) + (s.minutes || 0);
  }
  const sportsTotal = Object.values(bySport).reduce((a, b) => a + b, 0);
  return { cardio, bySport, sportsTotal, total: cardio + sportsTotal, min: 150, max: 300 };
}

// ---- Fatigue by body part (drives machine swaps) ---------------------------
// Sums recent load (last 2 days) from sports + free-weight training per region.
export function fatigueByPart(state, ref = todayISO()) {
  const parts = {};
  const bump = (p, v) => {
    parts[p] = (parts[p] || 0) + v;
  };
  const recent = lastNDates(2, ref);
  for (const s of state.logs.sports || []) {
    if (!recent.includes(s.date)) continue;
    const meta = findSport(s.id);
    const load = Math.min(1, (s.minutes || 0) / 90);
    (meta?.parts || []).forEach((p) => bump(p, 0.6 + 0.4 * load));
  }
  for (const w of state.logs.workouts || []) {
    if (!recent.includes(w.date)) continue;
    for (const ex of w.exercises || []) {
      const meta = findExercise(ex.name);
      if (meta && (meta.type === "free" || meta.type === "bodyweight"))
        (meta.joints || []).forEach((p) => bump(p, 0.3 * (ex.sets || []).length));
    }
  }
  // classify
  const out = {};
  for (const [p, v] of Object.entries(parts)) {
    out[p] = { load: v, level: v >= 1.4 ? "high" : v >= 0.7 ? "med" : "low" };
  }
  return out;
}

export function fatiguedParts(state, ref = todayISO()) {
  const f = fatigueByPart(state, ref);
  return Object.entries(f)
    .filter(([, v]) => v.level === "high")
    .map(([p]) => p);
}

// Suggests machine swaps for planned free-weight exercises that load a fatigued joint.
export function machineSwaps(plannedNames, state, ref = todayISO()) {
  const hot = new Set(fatiguedParts(state, ref));
  // treat "右肩"/"肩" as the same joint family
  const norm = (p) => p.replace(/^(右|左)/, "");
  const hotNorm = new Set([...hot].map(norm));
  const swaps = [];
  for (const name of plannedNames) {
    const meta = findExercise(name);
    if (!meta || (meta.type !== "free" && meta.type !== "bodyweight")) continue;
    const hit = (meta.joints || []).some((j) => hotNorm.has(norm(j)));
    if (hit && meta.machineAlt) swaps.push({ from: name, to: meta.machineAlt, reason: (meta.joints || []).filter((j) => hotNorm.has(norm(j))).join("・") });
  }
  return swaps;
}

// ---- Diagnosis --------------------------------------------------------------
export const DIAGNOSIS_QUESTIONS = [
  {
    key: "sleep",
    q: "平均的な睡眠時間は？",
    options: [
      { label: "7時間以上", score: 20 },
      { label: "6〜7時間", score: 45 },
      { label: "5〜6時間", score: 70 },
      { label: "5時間未満", score: 90 },
    ],
  },
  {
    key: "train",
    q: "週の筋トレ頻度は？",
    options: [
      { label: "週3回以上", score: -15 },
      { label: "週1〜2回", score: 5 },
      { label: "ほとんどしない", score: 15 },
    ],
  },
  {
    key: "age",
    q: "年代は？",
    options: [
      { label: "40代", score: 55 },
      { label: "50代", score: 70 },
      { label: "60代以上", score: 82 },
    ],
  },
  {
    key: "neat",
    q: "普段の活動量は？",
    options: [
      { label: "よく歩く・立ち仕事", score: 30 },
      { label: "普通", score: 55 },
      { label: "ほぼ座っている", score: 80 },
    ],
  },
  {
    key: "protein",
    q: "たんぱく質の摂取は？",
    options: [
      { label: "毎食しっかり", score: 25 },
      { label: "1日1回程度", score: 55 },
      { label: "あまり摂れていない", score: 80 },
    ],
  },
];

const TYPE_INFO = {
  sleep: {
    type: "睡眠不足タイプ",
    desc: "睡眠不足下の減量は脂肪ではなく筋肉を削ります。まず眠りを整えることが最短の近道です。",
    rx: [
      "減量ペースを週0.5%に抑え筋肉を守る",
      "就寝ルーティンで睡眠6時間以上を確保",
      "睡眠不足の日は有酸素より筋トレを優先",
    ],
  },
  anabolic: {
    type: "アナボリック抵抗性タイプ",
    desc: "加齢で筋肉が刺激に反応しにくい状態。「同じ努力」では筋肉が守れず代謝が落ちています。",
    rx: [
      "各部位を週10〜20セットまで積み上げる",
      "RIR1〜2の適正強度で確実に効かせる",
      "たんぱく質を体重×1.6g以上に",
    ],
  },
  neat: {
    type: "脳の省エネタイプ",
    desc: "運動した日ほど脳が無意識に活動量を減らし消費を相殺。日常の一歩が鍵です。",
    rx: [
      "筋トレ日は歩数目標を8,000歩に引き上げ",
      "夕方に歩数不足なら追加のウォーキング",
      "座位を1時間ごとに中断する",
    ],
  },
  protein: {
    type: "たんぱく質不足タイプ",
    desc: "材料不足では筋肉は守れません。まず毎食のたんぱく質から立て直します。",
    rx: [
      "たんぱく質を体重×1.6〜1.8gへ",
      "毎食に主菜（肉・魚・卵・大豆）を1品",
      "筋トレ後30分以内に補給",
    ],
  },
};

export function computeDiagnosis(answers) {
  // answers: { sleep, train, age, neat, protein } => selected score numbers
  const sleep = clamp(answers.sleep ?? 50);
  const anabolic = clamp((answers.age ?? 55) + (answers.train ?? 5));
  const neat = clamp(answers.neat ?? 55);
  const protein = clamp(answers.protein ?? 55);
  const scores = { 睡眠不足: sleep, アナボリック抵抗性: anabolic, "脳の省エネ": neat, たんぱく質不足: protein };
  const keyMap = { 睡眠不足: "sleep", アナボリック抵抗性: "anabolic", "脳の省エネ": "neat", たんぱく質不足: "protein" };
  const topLabel = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  const info = TYPE_INFO[keyMap[topLabel]];
  return { scores, top: topLabel, ...info };
}

function clamp(v, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, v));
}
