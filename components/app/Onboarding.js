"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { DIAGNOSIS_QUESTIONS, computeDiagnosis } from "@/lib/logic";
import { Card, Bar, Back } from "./ui";

export default function Onboarding() {
  const { actions } = useStore();
  const [step, setStep] = useState(0); // 0..Q-1 questions, then profile, then result
  const [answers, setAnswers] = useState({});
  const [profile, setProfile] = useState({ name: "", weightKg: 70, goalBodyFat: 18 });

  const Q = DIAGNOSIS_QUESTIONS.length;
  const isProfile = step === Q;
  const isResult = step === Q + 1;
  const diagnosis = isResult ? computeDiagnosis(answers) : null;

  const pick = (key, score) => {
    setAnswers((a) => ({ ...a, [key]: score }));
    setTimeout(() => setStep((s) => s + 1), 140);
  };

  const progress = Math.min(step, Q + 1) / (Q + 1);

  return (
    <div className="app-scroll" style={{ paddingTop: 30 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        {step > 0 && !isResult && <Back onClick={() => setStep((s) => s - 1)} />}
        <div className="app-wm">PRIME</div>
      </div>

      {!isResult && (
        <div style={{ margin: "14px 2px 26px" }}>
          <Bar value={progress} max={1} color="var(--gold)" height={5} />
          <div style={{ fontSize: 11, color: "var(--faint)", marginTop: 8 }}>
            {isProfile ? "あと少し" : `質問 ${step + 1} / ${Q}`}
          </div>
        </div>
      )}

      {/* Questions */}
      {step < Q && (
        <div>
          <h2 className="h-title" style={{ fontSize: 22, lineHeight: 1.5, marginBottom: 22 }}>
            {DIAGNOSIS_QUESTIONS[step].q}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {DIAGNOSIS_QUESTIONS[step].options.map((o) => (
              <button
                key={o.label}
                className={"opt" + (answers[DIAGNOSIS_QUESTIONS[step].key] === o.score ? " on" : "")}
                onClick={() => pick(DIAGNOSIS_QUESTIONS[step].key, o.score)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Profile */}
      {isProfile && (
        <div>
          <h2 className="h-title" style={{ fontSize: 22, marginBottom: 22 }}>基本情報</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <label style={{ display: "block" }}>
              <div style={{ fontSize: 12, color: "var(--dim)", marginBottom: 8 }}>ニックネーム</div>
              <input className="field" value={profile.name} placeholder="例）Ken" onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </label>
            <label style={{ display: "block" }}>
              <div style={{ fontSize: 12, color: "var(--dim)", marginBottom: 8 }}>体重 (kg)</div>
              <input className="field" type="number" inputMode="decimal" value={profile.weightKg}
                onChange={(e) => setProfile({ ...profile, weightKg: parseFloat(e.target.value) || 0 })} />
            </label>
            <label style={{ display: "block" }}>
              <div style={{ fontSize: 12, color: "var(--dim)", marginBottom: 8 }}>目標体脂肪率 (%)</div>
              <input className="field" type="number" inputMode="decimal" value={profile.goalBodyFat}
                onChange={(e) => setProfile({ ...profile, goalBodyFat: parseFloat(e.target.value) || 0 })} />
            </label>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 28 }} onClick={() => setStep(step + 1)}>
            診断結果を見る
          </button>
        </div>
      )}

      {/* Result */}
      {isResult && diagnosis && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <div style={{ fontSize: 12, color: "var(--dim)", marginBottom: 8 }}>あなたが痩せない主因は</div>
            <div className="h-title" style={{ fontSize: 27, lineHeight: 1.3,
              background: "linear-gradient(180deg,#F0D9A8,var(--gold))", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              {diagnosis.type}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--dim)", marginTop: 12, lineHeight: 1.7 }}>{diagnosis.desc}</div>
          </div>

          <div className="sec-label">落ちない要因スコア</div>
          <Card style={{ padding: "18px 16px", marginBottom: 18, display: "flex", flexDirection: "column", gap: 15 }}>
            {Object.entries(diagnosis.scores).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
              <div key={k}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                  <span style={{ fontWeight: 700 }}>{k}</span>
                  <span className="disp" style={{ fontWeight: 900, color: v >= 70 ? "var(--red)" : v >= 50 ? "var(--amber)" : "var(--teal)" }}>{Math.round(v)}</span>
                </div>
                <Bar value={v} max={100} color={v >= 70 ? "var(--red)" : v >= 50 ? "var(--amber)" : "var(--teal)"} />
              </div>
            ))}
          </Card>

          <div className="sec-label">あなた専用の処方</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
            {diagnosis.rx.map((r, i) => (
              <Card key={i} style={{ padding: "13px 15px", display: "flex", gap: 11, alignItems: "center" }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, flex: "none", background: "rgba(203,163,90,.14)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12 }} className="disp">{i + 1}</div>
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>{r}</div>
              </Card>
            ))}
          </div>

          <button className="btn btn-primary" onClick={() => actions.finishOnboarding(profile, diagnosis)}>
            このプランで始める
          </button>
        </div>
      )}
    </div>
  );
}
