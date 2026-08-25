"use client";

export function Card({ children, style, className = "", ...rest }) {
  return (
    <div className={"acard " + className} style={{ padding: 16, ...style }} {...rest}>
      {children}
    </div>
  );
}

export function Bar({ value, max = 1, color = "var(--teal)", track = "#26262C", height = 7 }) {
  const pct = Math.max(0, Math.min(1, max ? value / max : 0)) * 100;
  return (
    <div className="bar-track" style={{ height, background: track }}>
      <div className="bar-fill" style={{ width: pct + "%", background: color }} />
    </div>
  );
}

export function Ring({ value, max, size = 108, stroke = 9, color = "var(--teal)", children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, max ? value / max : 0));
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#26262C" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset .5s ease" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}

export function Stepper({ value, onChange, step = 1, min = 0, max = Infinity, fmt = (v) => v }) {
  return (
    <div className="stepper">
      <button type="button" onClick={() => onChange(Math.max(min, +(value - step).toFixed(2)))} aria-label="減らす">−</button>
      <div className="val">{fmt(value)}</div>
      <button type="button" onClick={() => onChange(Math.min(max, +(value + step).toFixed(2)))} aria-label="増やす">+</button>
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="modal-wrap" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div className="h-title">{title}</div>
          <button onClick={onClose} className="btn btn-ghost2" style={{ padding: "6px 12px" }} aria-label="閉じる">閉じる</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Back({ onClick }) {
  return (
    <button onClick={onClick} className="btn" style={{ background: "none", color: "var(--dim)", padding: 4 }} aria-label="戻る">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M15 5l-7 7 7 7" /></svg>
    </button>
  );
}
