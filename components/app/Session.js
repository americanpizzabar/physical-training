"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { EXERCISES, MUSCLES, findExercise, recommendWeight, machineSwaps } from "@/lib/logic";
import { todayISO } from "@/lib/date";
import { Card, Stepper, Modal } from "./ui";
import { IconBolt, IconCheck, IconLock, IconRun, IconPlus, IconArrow, IconAlert } from "./icons";

export default function Session() {
  const { state, actions } = useStore();
  const today = todayISO();
  const workout = state.logs.workouts.find((w) => w.date === today) || { exercises: [], cardio: { done: false } };
  const exercises = workout.exercises || [];
  const [picker, setPicker] = useState(false);
  const [openEx, setOpenEx] = useState(null); // exercise key currently logging

  const strengthDone = exercises.some((e) => (e.sets || []).length > 0);
  const swaps = useMemo(() => machineSwaps(exercises.map((e) => e.name), state), [exercises, state]);

  return (
    <div className="app-scroll">
      <h2 className="h-title" style={{ fontSize: 18, marginBottom: 16 }}>本日のセッション</h2>

      {/* concurrent banner */}
      <Card style={{ padding: "12px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10, borderColor: "rgba(203,163,90,.28)" }}>
        <span style={{ color: "var(--gold)", flex: "none" }}><IconBolt size={16} /></span>
        <div style={{ fontSize: 11.5, color: "var(--dim)", lineHeight: 1.5 }}>脂肪燃焼の黄金順序 — <b style={{ color: "var(--tx)" }}>筋トレ → 有酸素</b>。筋トレ完了で有酸素が解放されます。</div>
      </Card>

      {/* fatigue-based machine swap suggestion */}
      {swaps.length > 0 && (
        <Card style={{ padding: "14px 15px", marginBottom: 16, borderColor: "rgba(219,150,90,.4)", background: "linear-gradient(180deg,rgba(219,150,90,.10),var(--surface))" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ color: "var(--amber)", flex: "none", marginTop: 1 }}><IconAlert size={17} /></span>
            <div style={{ fontSize: 11.5, color: "var(--dim)", lineHeight: 1.6 }}>
              最近のスポーツで <b style={{ color: "var(--tx)" }}>{[...new Set(swaps.map((s) => s.reason))].join("・")}</b> が疲労。安全なマシン種目への置換をおすすめします：
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {swaps.map((s) => (
                  <div key={s.from} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                    <span style={{ color: "var(--faint)", textDecoration: "line-through" }}>{s.from}</span>
                    <IconArrow size={13} />
                    <span style={{ fontWeight: 700 }}>{s.to}</span>
                    <button className="btn btn-outline" style={{ padding: "3px 9px", fontSize: 11, marginLeft: "auto" }}
                      onClick={() => actions.addExercise(s.to, findExercise(s.to)?.muscle)}>追加</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* strength */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 2px 10px" }}>
        <span className="h-title" style={{ fontSize: 14, color: "var(--gold)" }}>① 筋トレ</span>
        <span style={{ fontSize: 12, color: "var(--dim)" }}>{exercises.filter((e) => e.sets.length > 0).length} / {exercises.length || "—"} 種目</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
        {exercises.map((ex) => (
          <ExerciseCard key={ex.key} ex={ex} open={openEx === ex.key} onToggle={() => setOpenEx(openEx === ex.key ? null : ex.key)} />
        ))}
        {exercises.length === 0 && (
          <Card style={{ padding: 20, textAlign: "center", color: "var(--faint)", fontSize: 12.5, borderStyle: "dashed", borderColor: "rgba(255,255,255,.12)" }}>
            種目を追加して記録を始めましょう
          </Card>
        )}
      </div>

      <button className="btn btn-ghost2" style={{ width: "100%", marginBottom: 20, padding: 13 }} onClick={() => setPicker(true)}>
        <IconPlus size={17} /> 種目を追加
      </button>

      {/* cardio */}
      <div className="h-title" style={{ fontSize: 14, color: strengthDone ? "var(--teal)" : "var(--faint)", margin: "0 2px 10px" }}>② 有酸素</div>
      {strengthDone ? <CardioPanel workout={workout} /> : (
        <Card style={{ padding: 20, textAlign: "center", borderStyle: "dashed", borderColor: "rgba(255,255,255,.12)", background: "var(--surface2)" }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: "rgba(255,255,255,.05)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "var(--faint)" }}><IconLock size={20} /></div>
          <div className="h-title" style={{ fontSize: 14, color: "var(--dim)" }}>ロック中</div>
          <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 6, lineHeight: 1.6 }}>筋トレを1種目でも記録すると<br />有酸素が解放されます</div>
        </Card>
      )}

      <ExercisePicker open={picker} onClose={() => setPicker(false)} onPick={(name, muscle) => { actions.addExercise(name, muscle); setPicker(false); }} existing={exercises.map((e) => e.name)} />
    </div>
  );
}

function ExerciseCard({ ex, open, onToggle }) {
  const { state, actions } = useStore();
  const rec = recommendWeight(state, ex.name);
  const [weight, setWeight] = useState(rec ? rec.weight : 20);
  const [reps, setReps] = useState(10);
  const [rir, setRir] = useState(1);
  const done = ex.sets.length > 0;

  const save = () => {
    actions.addSet(ex.key, { weight, reps, rir });
    setRir(1);
  };

  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", cursor: "pointer" }} onClick={onToggle}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", flex: "none", display: "flex", alignItems: "center", justifyContent: "center",
          background: done ? "var(--teal)" : "transparent", border: done ? "none" : "2px solid #3A3A42", color: done ? "#0B0B0D" : "var(--faint)" }}>
          {done ? <IconCheck size={14} /> : <span className="disp" style={{ fontSize: 12, fontWeight: 800 }}>{ex.sets.length}</span>}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700 }}>{ex.name}</div>
          <div style={{ fontSize: 11, color: "var(--faint)", marginTop: 1 }}>
            {ex.sets.length ? ex.sets.map((s) => `${s.weight}×${s.reps}`).join(" / ") : (findExercise(ex.name)?.muscle || "") + " ・ 未記録"}
          </div>
        </div>
        <span style={{ color: "var(--gold)", fontSize: 12, fontWeight: 700 }}>{open ? "閉じる" : "記録"}</span>
      </div>

      {open && (
        <div style={{ padding: "4px 14px 16px", borderTop: "1px solid var(--line)" }}>
          {rec && (
            <div style={{ fontSize: 11.5, color: "var(--teal)", margin: "12px 0", display: "flex", alignItems: "center", gap: 6 }}>
              <IconBolt size={13} /> RIR履歴から推奨 <b>{rec.weight}kg</b>（{rec.note}）
            </div>
          )}
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "var(--faint)", marginBottom: 6, textAlign: "center" }}>重量 (kg)</div>
              <Stepper value={weight} onChange={setWeight} step={2.5} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "var(--faint)", marginBottom: 6, textAlign: "center" }}>回数</div>
              <Stepper value={reps} onChange={setReps} step={1} min={1} />
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ fontWeight: 700 }}>RIR ・ あと何回できた？</span>
              <span className="disp" style={{ fontWeight: 900, color: rir >= 1 && rir <= 2 ? "var(--gold)" : "var(--dim)" }}>{rir}</span>
            </div>
            <div style={{ fontSize: 10.5, color: "var(--faint)", marginBottom: 10 }}>適正ゾーンは 1〜2</div>
            <input className="range" type="range" min={0} max={4} step={1} value={rir} onChange={(e) => setRir(parseInt(e.target.value))} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--faint)", marginTop: 4 }}>
              <span>0 限界</span><span style={{ color: "var(--gold)" }}>1</span><span style={{ color: "var(--gold)" }}>2</span><span>3</span><span>4+ 余裕</span>
            </div>
          </div>

          <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={save}>このセットを記録</button>

          {ex.sets.length > 0 && (
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
              {ex.sets.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", fontSize: 12, color: "var(--dim)" }}>
                  <span style={{ width: 52, color: "var(--faint)" }}>Set {i + 1}</span>
                  <span style={{ flex: 1 }}>{s.weight}kg × {s.reps}</span>
                  <span style={{ color: "var(--gold)", fontWeight: 700, marginRight: 12 }}>RIR {s.rir}</span>
                  <button onClick={() => actions.removeSet(ex.key, i)} style={{ background: "none", border: "none", color: "var(--faint)", cursor: "pointer", fontSize: 16 }} aria-label="削除">×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function CardioPanel({ workout }) {
  const { actions } = useStore();
  const [min, setMin] = useState(workout.cardio?.minutes || 25);
  const done = workout.cardio?.done;
  return (
    <Card style={{ padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 16 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(95,176,165,.14)", color: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><IconRun size={19} /></div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>有酸素運動</div>
          <div style={{ fontSize: 11.5, color: done ? "var(--teal)" : "var(--dim)", marginTop: 1 }}>{done ? `記録済み ・ ${workout.cardio.minutes}分` : "時間を記録"}</div>
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: "var(--faint)", marginBottom: 6, textAlign: "center" }}>時間 (分)</div>
        <Stepper value={min} onChange={setMin} step={5} min={5} />
      </div>
      <button className="btn btn-primary" onClick={() => actions.setCardio(min)}>{done ? "更新する" : "有酸素を記録"}</button>
    </Card>
  );
}

function ExercisePicker({ open, onClose, onPick, existing }) {
  return (
    <Modal open={open} onClose={onClose} title="種目を追加">
      {MUSCLES.map((m) => {
        const list = EXERCISES.filter((e) => e.muscle === m);
        if (!list.length) return null;
        return (
          <div key={m} style={{ marginBottom: 16 }}>
            <div className="sec-label" style={{ marginBottom: 8 }}>{m}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {list.map((e) => (
                <button key={e.name} className="chip2" disabled={existing.includes(e.name)}
                  style={{ opacity: existing.includes(e.name) ? 0.4 : 1 }}
                  onClick={() => onPick(e.name, e.muscle)}>
                  {e.name}{e.type === "machine" ? " ⚙" : ""}
                </button>
              ))}
            </div>
          </div>
        );
      })}
      <div style={{ fontSize: 11, color: "var(--faint)", marginTop: 4 }}>⚙ = 関節にやさしいマシン種目</div>
    </Modal>
  );
}
