"use client";

import { useState } from "react";
import { StoreProvider, useStore } from "@/lib/store";
import Onboarding from "@/components/app/Onboarding";
import Home from "@/components/app/Home";
import Session from "@/components/app/Session";
import Record from "@/components/app/Record";
import Analytics from "@/components/app/Analytics";
import Profile from "@/components/app/Profile";
import { IconHome, IconPlan, IconRecord, IconChart, IconUser } from "@/components/app/icons";

const TABS = [
  { id: "home", label: "ホーム", Icon: IconHome },
  { id: "plan", label: "プラン", Icon: IconPlan },
  { id: "record", label: "記録", Icon: IconRecord },
  { id: "analytics", label: "分析", Icon: IconChart },
  { id: "profile", label: "マイ", Icon: IconUser },
];

export default function Page() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}

function Shell() {
  const { state, hydrated } = useStore();
  const [tab, setTab] = useState("home");

  if (!hydrated) {
    return (
      <div className="app-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div className="app-wm" style={{ opacity: 0.6 }}>PRIME</div>
      </div>
    );
  }

  if (!state.onboarding.done) {
    return (
      <div className="app-root">
        <Onboarding />
      </div>
    );
  }

  const views = {
    home: <Home go={setTab} />,
    plan: <Session />,
    record: <Record />,
    analytics: <Analytics />,
    profile: <Profile />,
  };

  return (
    <div className="app-root">
      {views[tab]}
      <nav className="tabbar">
        {TABS.map(({ id, label, Icon }) => (
          <button key={id} className={"tab" + (tab === id ? " on" : "")} onClick={() => setTab(id)}>
            <Icon size={22} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
