"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { SPORTS, findSport, neatState, isWorkoutDay } from "@/lib/logic";
import { todayISO, lastNDates, jpWeekday, isThisWeek } from "@/lib/date";
import { Card, Stepper, Bar } from "./ui";
import { IconMoon, IconFoot, IconTennis, IconAlert, IconPlus } from "./icons";

export default function Record() {
  const { state, actions } = useStore();
  const today = todayISO();
  const sleepToday = state.logs.sleep[today];
  const [sleep, setSleep] = useState(sleepToday ?? 7);
  const neat = neatState(state);
  const workoutToday = isWorkoutDay(state);

  const [sportId, setSportId] = useState("tennis");
  const [sportMin, setSportMin] = useState(60);

  const week7 = lastNDates(7);
  const thisWeekSports = state.logs.sports.filter((s) => isThisWeek(s.date));

  return (
    <div className="app-scroll">
      <h2 className="h-title" style={{ fontSize: 18, marginBottom: 16 }}>記録</h2>

      {/* SLEEP */}
      <div className="sec-label">睡眠</div>
      <Card style={{ padding: 16, marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 16 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(95,120,180,.14)", color: "#8FA6D8", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><IconMoon size={18} /></div>
          <div style={{ flex: 1, fontSize: 13 }}>昨夜の睡眠時間</div>
          <div className="disp" style={{ fontWeight: 900, fontSize: 18 }}>{sleep.toFixed(1)}<span style={{ fontSize: 11, color: "var(--faint)" }}> h</span></div>
        </div>
        <Stepper value={sleep} onChange={setSleep} step={0.5} min={0} max={14} fmt={(v) => v.toFixed(1)} />
        <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => actions.logSleep(sleep)}>
          {sleepToday != null ? "睡眠を更新" : "睡眠を記録"}
        </button>
      </Card>
      {/* 7-day sleep chart */}
      <Card style={{ padding: "14px 16px 12px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 70, gap: 6 }}>
          {week7.map((d) => {
            const v = state.logs.sleep[d];
            const h = v ? Math.min(1, v / 8) : 0;
            const c = v == null ? "#26262C" : v < 6 ? "var(--red)" : v < 7 ? "var(--amber)" : "var(--teal)";
            return <div key={d} style={{ flex: 1, height: (h * 100 || 4) + "%", background: c, borderRadius: "4px 4px 0 0", minHeight: 4 }} />;
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          {week7.map((d) => <span key={d} style={{ flex: 1, textAlign: "center", fontSize: 9.5, color: "var(--faint)" }}>{jpWeekday(d)}</span>)}
        </div>
      </Card>

      {/* STEPS / NEAT */}
      <div className="sec-label">歩数 ・ NEAT</div>
      {neat.strict && neat.remaining > 0 && (
        <Card style={{ padding: "13px 15px", marginBottom: 8, borderColor: "rgba(219,150,90,.4)", background: "linear-gradient(180deg,rgba(219,150,90,.10),var(--surface))" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ color: "var(--amber)", flex: "none", marginTop: 1 }}><IconAlert size={16} /></span>
            <div style={{ fontSize: 11.5, color: "var(--dim)", lineHeight: 1.6 }}>今日は筋トレをしたため、身体が無意識に<b style={{ color: "var(--tx)" }}>省エネモード</b>に入っています。目標まであと <b style={{ color: "var(--tx)" }}>{neat.remaining.toLocaleString()}歩</b>。</div>
          </div>
        </Card>
      )}
      <Card style={{ padding: 16, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(219,150,90,.14)", color: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><IconFoot size={18} /></div>
          <div style={{ flex: 1 }}>
            <div className="disp" style={{ fontWeight: 900, fontSize: 20, color: neat.strict ? "var(--amber)" : "var(--tx)" }}>{neat.steps.toLocaleString()}<span style={{ fontSize: 12, color: "var(--faint)" }}> / {neat.target.toLocaleString()} 歩</span></div>
            {workoutToday && <div style={{ fontSize: 10.5, color: "var(--amber)", marginTop: 1 }}>筋トレ日 ・ 厳格監視</div>}
          </div>
        </div>
        <Bar value={neat.steps} max={neat.target} color={neat.strict ? "var(--amber)" : "var(--teal)"} height={8} />
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {[1000, 2000, 5000].map((n) => (
            <button key={n} className="btn btn-ghost2" style={{ flex: 1, padding: 11 }} onClick={() => actions.addSteps(n)}>+{n.toLocaleString()}</button>
          ))}
        </div>
        <button className="btn" style={{ width: "100%", marginTop: 8, background: "none", color: "var(--faint)", fontSize: 12, padding: 6 }} onClick={() => actions.logSteps(0)}>リセット</button>
      </Card>

      {/* SPORTS */}
      <div className="sec-label">スポーツ連動</div>
      <Card style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          {SPORTS.map((s) => (
            <button key={s.id} className={"chip2" + (sportId === s.id ? " on" : "")} onClick={() => setSportId(s.id)}>{s.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "var(--faint)", marginBottom: 6, textAlign: "center" }}>時間 (分)</div>
            <Stepper value={sportMin} onChange={setSportMin} step={15} min={15} />
          </div>
        </div>
        <div style={{ fontSize: 11, color: "var(--faint)", marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <IconTennis size={13} /> 酷使部位：{(findSport(sportId)?.parts || []).join("・")} → 翌日の筋トレ疲労管理に反映
        </div>
        <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={() => actions.addSport({ id: sportId, minutes: sportMin })}>
          <IconPlus size={16} /> スポーツを記録（有酸素に合算）
        </button>
      </Card>

      {thisWeekSports.length > 0 && (
        <Card style={{ padding: "6px 4px" }}>
          {thisWeekSports.map((s, i) => (
            <div key={s.key}>
              {i > 0 && <div className="divider" style={{ margin: "0 14px" }} />}
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{findSport(s.id)?.label}</div>
                  <div style={{ fontSize: 11, color: "var(--faint)", marginTop: 1 }}>{jpWeekday(s.date)} ・ {s.minutes}分 ・ {(findSport(s.id)?.parts || []).join("・")}</div>
                </div>
                <span className="pill" style={{ color: "var(--teal)", border: "1px solid rgba(95,176,165,.4)" }}>有酸素+{s.minutes}</span>
                <button onClick={() => actions.removeSport(s.key)} style={{ background: "none", border: "none", color: "var(--faint)", cursor: "pointer", fontSize: 17 }} aria-label="削除">×</button>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
