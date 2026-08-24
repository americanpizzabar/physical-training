"use client";

import { useState } from "react";
import Link from "next/link";
import { screens } from "@/lib/screens";

export default function AppPrototype() {
  const [active, setActive] = useState("concept");
  const current = screens.find((s) => s.id === active) || screens[0];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* header */}
      <div className="nav">
        <div className="wrap nav-inner">
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--dim)" strokeWidth="1.9">
              <path d="M15 5l-7 7 7 7" />
            </svg>
            <span className="wm" style={{ fontSize: 15 }}>PRIME</span>
          </Link>
          <span style={{ fontSize: 12, letterSpacing: ".14em", color: "var(--faint)" }}>PROTOTYPE</span>
        </div>
      </div>

      {/* body */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          maxWidth: 1120,
          width: "100%",
          margin: "0 auto",
          padding: "28px 24px 60px",
          gap: 32,
        }}
        className="proto-grid"
      >
        {/* screen picker */}
        <aside>
          <div style={{ fontSize: 12, letterSpacing: ".16em", color: "var(--faint)", textTransform: "uppercase", marginBottom: 14 }}>
            画面 ・ 9 screens
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }} className="proto-list">
            {screens.map((s, i) => {
              const on = s.id === active;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    textAlign: "left",
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: on ? "rgba(203,163,90,.5)" : "var(--line)",
                    background: on ? "rgba(203,163,90,.10)" : "var(--surface)",
                    color: on ? "var(--gold)" : "var(--tx)",
                    borderRadius: 12,
                    padding: "12px 14px",
                    fontFamily: "inherit",
                    fontSize: 13.5,
                    fontWeight: on ? 700 : 500,
                    transition: "all .15s",
                  }}
                >
                  <span
                    className="disp"
                    style={{
                      width: 24,
                      height: 24,
                      flex: "none",
                      borderRadius: 7,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 800,
                      background: on ? "var(--gold)" : "var(--surface2)",
                      color: on ? "#0B0B0D" : "var(--faint)",
                    }}
                  >
                    {i + 1}
                  </span>
                  {s.title}
                </button>
              );
            })}
          </div>
        </aside>

        {/* phone */}
        <main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", gap: 18 }}>
          <div className="phone">
            <div className="phone-screen" style={{ height: "min(824px, calc(100vh - 200px))" }}>
              <iframe
                key={active}
                srcDoc={current.html}
                title={current.title}
                scrolling="yes"
                sandbox="allow-same-origin"
                style={{ height: "min(824px, calc(100vh - 200px))" }}
              />
            </div>
          </div>
          <div style={{ fontSize: 12, color: "var(--faint)" }}>
            画面内はスクロールできます ・ 数値はサンプルです
          </div>
        </main>
      </div>

      <style>{`
        @media (max-width:820px){
          .proto-grid{grid-template-columns:1fr !important}
          .proto-list{flex-direction:row !important;flex-wrap:wrap}
        }
      `}</style>
    </div>
  );
}
