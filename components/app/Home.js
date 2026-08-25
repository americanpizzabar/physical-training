"use client";

import { useStore } from "@/lib/store";
import { protectionState, neatState, weeklyVolume, proteinTarget, isWorkoutDay, MUSCLES } from "@/lib/logic";
import { jpShortDate, todayISO } from "@/lib/date";
import { Card, Bar, Ring } from "./ui";
import { IconShield, IconDumbbell, IconRun, IconLock, IconMoon, IconArrow } from "./icons";

export default function Home({ go }) {
  const { state } = useStore();
  const name = state.profile.name || "あなた";
  const prot = protectionState(state);
  const neat = neatState(state);
  const vol = weeklyVolume(state);
  const protein = proteinTarget(state);
  const workoutToday = isWorkoutDay(state);
  const todaysCardio = (state.logs.workouts.find((w) => w.date === todayISO())?.cardio) || { done: false };

  return (
    <div className="app-scroll">
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div className="app-wm">PRIME</div>
          <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 10 }}>{jpShortDate(todayISO())}</div>
          <div className="h-title" style={{ fontSize: 20, marginTop: 2 }}>こんにちは、{name} さん</div>
        </div>
      </div>

      {/* protection status */}
      {prot.known ? (
        <Card
          style={{
            marginBottom: 16, padding: "16px",
            borderColor: prot.on ? "rgba(219,150,90,.35)" : "rgba(95,176,165,.3)",
            background: prot.on ? "linear-gradient(180deg,rgba(219,150,90,.10),var(--surface))" : "linear-gradient(180deg,rgba(95,176,165,.08),var(--surface))",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, flex: "none", display: "flex", alignItems: "center", justifyContent: "center",
              background: prot.on ? "rgba(219,150,90,.16)" : "rgba(95,176,165,.16)", color: prot.on ? "var(--amber)" : "var(--teal)" }}>
              <IconShield size={19} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="h-title" style={{ fontSize: 15 }}>筋肉保護モード</span>
                <span className="pill" style={{ color: "#0B0B0D", background: prot.on ? "var(--amber)" : "var(--teal)" }}>{prot.on ? "ON" : "OFF"}</span>
              </div>
              <div style={{ fontSize: 11.5, color: "var(--dim)", marginTop: 3, lineHeight: 1.5 }}>
                直近睡眠 平均{prot.avg.toFixed(1)}時間。減量ペースは <b style={{ color: "var(--tx)" }}>週{prot.pace}%</b>
                {prot.on ? " ・ 本日は筋トレ優先" : " ・ 通常運用"}
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card style={{ marginBottom: 16, padding: "16px", display: "flex", alignItems: "center", gap: 11, cursor: "pointer", borderColor: "rgba(255,255,255,.12)" }} onClick={() => go("record")}>
          <div style={{ width: 34, height: 34, borderRadius: 10, flex: "none", background: "var(--surface2)", color: "var(--dim)", display: "flex", alignItems: "center", justifyContent: "center" }}><IconMoon size={18} /></div>
          <div style={{ flex: 1, fontSize: 12.5, color: "var(--dim)", lineHeight: 1.5 }}>睡眠を記録すると<b style={{ color: "var(--tx)" }}>筋肉保護モード</b>が働きます</div>
          <IconArrow size={16} />
        </Card>
      )}

      {/* today's plan */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "0 2px 10px" }}>
        <div className="h-title">今日のプラン</div>
        <button onClick={() => go("plan")} style={{ background: "none", border: "none", color: "var(--gold)", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>開く ›</button>
      </div>
      <Card style={{ padding: "6px 4px", marginBottom: 16 }}>
        <Row
          icon={<IconDumbbell size={20} />} tint="var(--gold)"
          title="① 筋トレ" sub={workoutToday ? "記録中 — 続きを入力" : "種目を選んで開始"}
          action={<button onClick={() => go("plan")} className="btn btn-outline">{workoutToday ? "続ける" : "開始"}</button>}
        />
        <div className="divider" style={{ margin: "0 14px" }} />
        <Row
          icon={workoutToday ? <IconRun size={20} /> : <IconLock size={18} />} tint={workoutToday ? "var(--teal)" : "var(--faint)"}
          dim={!workoutToday}
          title="② 有酸素" sub={todaysCardio.done ? `完了 ・ ${todaysCardio.minutes}分` : workoutToday ? "筋トレ後に解放されています" : "筋トレ完了で解放されます"}
          action={workoutToday && !todaysCardio.done ? <button onClick={() => go("plan")} className="btn btn-outline" style={{ borderColor: "rgba(95,176,165,.45)", color: "var(--teal)" }}>記録</button> : null}
        />
      </Card>

      {/* NEAT + protein */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Card style={{ flex: 1, padding: "16px 14px", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Ring value={neat.steps} max={neat.target} color={neat.strict ? "var(--amber)" : "var(--teal)"} size={104}>
              <div className="disp" style={{ fontSize: 21, fontWeight: 900, lineHeight: 1 }}>{neat.steps.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: "var(--faint)" }}>/ {neat.target.toLocaleString()} 歩</div>
            </Ring>
          </div>
          <div style={{ marginTop: 11, fontSize: 11, fontWeight: 700, display: "inline-block", padding: "4px 9px", borderRadius: 7,
            color: neat.strict ? "var(--amber)" : "var(--teal)", background: neat.strict ? "rgba(219,150,90,.12)" : "rgba(95,176,165,.12)" }}>
            {neat.strict ? "筋トレ日・厳格監視" : "本日の歩数"}
          </div>
        </Card>
        <Card style={{ flex: 1, padding: "16px 15px" }}>
          <div style={{ fontSize: 12, color: "var(--dim)", marginBottom: 2 }}>週間ボリューム</div>
          <div style={{ fontSize: 10, color: "var(--faint)", marginBottom: 12 }}>目標 10〜20 set</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MUSCLES.slice(0, 4).map((m) => {
              const v = vol[m];
              const c = v >= 10 ? "var(--teal)" : v >= 5 ? "var(--amber)" : "var(--faint)";
              return (
                <div key={m}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}><span>{m}</span><span style={{ color: c }}>{v}</span></div>
                  <Bar value={v} max={20} color={c} height={5} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* protein target */}
      <Card style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 12.5, color: "var(--dim)", flex: 1 }}>本日のたんぱく質目標</div>
        <div className="disp" style={{ fontWeight: 900, fontSize: 20, color: "var(--gold)" }}>{protein}<span style={{ fontSize: 12, color: "var(--faint)" }}> g</span></div>
      </Card>
    </div>
  );
}

function Row({ icon, tint, title, sub, action, dim }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 13, padding: "13px 14px", opacity: dim ? 0.62 : 1 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", color: tint, background: dim ? "var(--surface2)" : "rgba(203,163,90,.14)" }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
        <div style={{ fontSize: 11.5, color: "var(--dim)", marginTop: 2 }}>{sub}</div>
      </div>
      {action}
    </div>
  );
}
