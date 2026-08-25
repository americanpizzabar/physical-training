"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { protectionState, proteinTarget } from "@/lib/logic";
import { Card } from "./ui";

export default function Profile() {
  const { state, actions } = useStore();
  const [p, setP] = useState({
    name: state.profile.name || "",
    weightKg: state.profile.weightKg || 70,
    goalBodyFat: state.profile.goalBodyFat ?? 18,
  });
  const [saved, setSaved] = useState(false);
  const prot = protectionState(state);

  const save = () => {
    actions.setProfile({ name: p.name, weightKg: parseFloat(p.weightKg) || 0, goalBodyFat: parseFloat(p.goalBodyFat) || 0 });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="app-scroll">
      <h2 className="h-title" style={{ fontSize: 18, marginBottom: 16 }}>マイ</h2>

      {state.diagnosis && (
        <Card style={{ padding: 16, marginBottom: 18, borderColor: "rgba(203,163,90,.28)" }}>
          <div style={{ fontSize: 11, color: "var(--faint)", marginBottom: 4 }}>あなたのタイプ</div>
          <div className="h-title" style={{ fontSize: 17, color: "var(--gold)" }}>{state.diagnosis.type}</div>
        </Card>
      )}

      <div className="sec-label">プロフィール</div>
      <Card style={{ padding: 16, marginBottom: 18, display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="ニックネーム">
          <input className="field" value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} placeholder="例）Ken" />
        </Field>
        <Field label="体重 (kg)">
          <input className="field" type="number" inputMode="decimal" value={p.weightKg} onChange={(e) => setP({ ...p, weightKg: e.target.value })} />
        </Field>
        <Field label="目標体脂肪率 (%)">
          <input className="field" type="number" inputMode="decimal" value={p.goalBodyFat} onChange={(e) => setP({ ...p, goalBodyFat: e.target.value })} />
        </Field>
        <button className="btn btn-primary" onClick={save}>{saved ? "保存しました ✓" : "保存する"}</button>
      </Card>

      <div className="sec-label">現在の設定（自動）</div>
      <Card style={{ padding: "6px 4px", marginBottom: 18 }}>
        <KV k="減量ペース" v={`週 ${prot.pace}%`} />
        <div className="divider" style={{ margin: "0 14px" }} />
        <KV k="筋肉保護モード" v={prot.known ? (prot.on ? "ON" : "OFF") : "睡眠未記録"} />
        <div className="divider" style={{ margin: "0 14px" }} />
        <KV k="たんぱく質目標" v={`${proteinTarget(state)} g / 日`} />
      </Card>

      <button className="btn btn-ghost2" style={{ width: "100%", marginBottom: 10, padding: 13 }} onClick={() => actions.redoDiagnosis()}>体質診断をやり直す</button>
      <button className="btn" style={{ width: "100%", padding: 13, background: "none", color: "var(--red)", border: "1px solid rgba(210,106,96,.3)" }}
        onClick={() => { if (confirm("すべての記録を消去します。よろしいですか？")) actions.resetAll(); }}>
        すべてのデータを消去
      </button>

      <div style={{ fontSize: 10.5, color: "var(--faint)", textAlign: "center", marginTop: 20, lineHeight: 1.7 }}>
        データはこの端末のブラウザに保存されます。<br />医療行為ではありません。健康上の判断は専門家にご相談ください。
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "block" }}>
      <div style={{ fontSize: 12, color: "var(--dim)", marginBottom: 8 }}>{label}</div>
      {children}
    </label>
  );
}
function KV({ k, v }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "13px 14px", fontSize: 13 }}>
      <span style={{ color: "var(--dim)" }}>{k}</span>
      <span className="disp" style={{ fontWeight: 700 }}>{v}</span>
    </div>
  );
}
