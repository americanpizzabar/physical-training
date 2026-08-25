"use client";

import { useStore } from "@/lib/store";
import { weeklyVolume, aerobicThisWeek, fatigueByPart, MUSCLES, SPORTS } from "@/lib/logic";
import { Card, Bar } from "./ui";

const LEVEL = { high: { c: "var(--red)", t: "疲労 高" }, med: { c: "var(--amber)", t: "疲労 中" }, low: { c: "var(--teal)", t: "回復" } };
const SPORT_COLORS = ["var(--gold)", "var(--amber)", "var(--teal)", "#8FA6D8", "#B98AD0", "#D2685E"];

export default function Analytics() {
  const { state } = useStore();
  const vol = weeklyVolume(state);
  const aero = aerobicThisWeek(state);
  const fatigue = fatigueByPart(state);
  const fatigueList = Object.entries(fatigue).sort((a, b) => b[1].load - a[1].load);

  const sportSegs = Object.entries(aero.bySport);

  return (
    <div className="app-scroll">
      <h2 className="h-title" style={{ fontSize: 18, marginBottom: 16 }}>分析</h2>

      {/* weekly volume */}
      <div className="sec-label">週間ボリューム（部位別セット数）</div>
      <Card style={{ padding: 18, marginBottom: 18, display: "flex", flexDirection: "column", gap: 14 }}>
        {MUSCLES.map((m) => {
          const v = vol[m];
          const c = v >= 10 && v <= 20 ? "var(--teal)" : v > 20 ? "var(--amber)" : v >= 5 ? "var(--amber)" : "var(--faint)";
          return (
            <div key={m}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 12.5 }}>
                <span style={{ fontWeight: 700 }}>{m}</span>
                <span style={{ color: c }}>{v} <span style={{ color: "var(--faint)", fontSize: 11 }}>/ 10〜20</span></span>
              </div>
              <div style={{ position: "relative" }}>
                <Bar value={v} max={24} color={c} />
                {/* target zone marker 10-20 of 24 */}
                <div style={{ position: "absolute", top: -1, left: `${(10 / 24) * 100}%`, width: `${(10 / 24) * 100}%`, height: 9, border: "1px dashed rgba(255,255,255,.18)", borderRadius: 3, pointerEvents: "none" }} />
              </div>
            </div>
          );
        })}
      </Card>

      {/* aerobic minutes */}
      <div className="sec-label">今週の有酸素（スポーツ合算）</div>
      <Card style={{ padding: 18, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <span className="disp" style={{ fontWeight: 900, fontSize: 24, color: aero.total >= aero.min ? "var(--teal)" : "var(--amber)" }}>{aero.total}<span style={{ fontSize: 12, color: "var(--faint)" }}> 分</span></span>
          <span style={{ fontSize: 11, color: "var(--faint)" }}>目標 {aero.min}〜{aero.max} 分</span>
        </div>
        <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden", background: "#26262C" }}>
          {aero.cardio > 0 && <div style={{ width: `${Math.min(100, (aero.cardio / aero.max) * 100)}%`, background: "var(--teal)" }} />}
          {sportSegs.map(([id, min], i) => (
            <div key={id} style={{ width: `${Math.min(100, (min / aero.max) * 100)}%`, background: SPORT_COLORS[i % SPORT_COLORS.length] }} />
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12, fontSize: 11, color: "var(--dim)" }}>
          {aero.cardio > 0 && <Legend c="var(--teal)" label={`有酸素 ${aero.cardio}分`} />}
          {sportSegs.map(([id, min], i) => <Legend key={id} c={SPORT_COLORS[i % SPORT_COLORS.length]} label={`${SPORTS.find((s) => s.id === id)?.label || id} ${min}分`} />)}
          {aero.total === 0 && <span style={{ color: "var(--faint)" }}>まだ記録がありません</span>}
        </div>
      </Card>

      {/* fatigue by part */}
      <div className="sec-label">部位別 疲労（スポーツ＋筋トレ）</div>
      <Card style={{ padding: 18 }}>
        {fatigueList.length === 0 ? (
          <div style={{ fontSize: 12.5, color: "var(--faint)", textAlign: "center", padding: "8px 0" }}>直近の高負荷はありません</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {fatigueList.map(([p, v]) => (
              <div key={p}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 12.5 }}>
                  <span style={{ fontWeight: 700 }}>{p}</span>
                  <span style={{ color: LEVEL[v.level].c }}>{LEVEL[v.level].t}</span>
                </div>
                <Bar value={v.load} max={2} color={LEVEL[v.level].c} />
              </div>
            ))}
          </div>
        )}
        <div style={{ fontSize: 11, color: "var(--faint)", marginTop: 14, lineHeight: 1.6 }}>
          「疲労 高」の部位は、セッション画面で安全なマシン種目への置換が自動提案されます。
        </div>
      </Card>
    </div>
  );
}

function Legend({ c, label }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 9, height: 9, borderRadius: 2, background: c }} />{label}
    </span>
  );
}
