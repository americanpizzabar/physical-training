"use client";

function Svg({ size = 22, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export const IconHome = (p) => <Svg {...p}><path d="M4 11l8-7 8 7" /><path d="M6 10v9h12v-9" /></Svg>;
export const IconPlan = (p) => <Svg {...p}><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M4 9h16M8 3v4M16 3v4" /></Svg>;
export const IconRecord = (p) => <Svg {...p}><path d="M12 20h9M3 20l1-4 11-11a2 2 0 0 1 3 3L7 19z" /></Svg>;
export const IconChart = (p) => <Svg {...p}><path d="M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-3" /></Svg>;
export const IconUser = (p) => <Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" /></Svg>;
export const IconShield = (p) => <Svg {...p}><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></Svg>;
export const IconDumbbell = (p) => <Svg {...p}><path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11" /></Svg>;
export const IconRun = (p) => <Svg {...p}><circle cx="13" cy="5" r="2" /><path d="M7 21l3-6 4-2-2-4-4 2-2 3M13 13l3 2 1 5" /></Svg>;
export const IconLock = (p) => <Svg {...p}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Svg>;
export const IconCheck = (p) => <Svg {...p}><path d="M5 12l4 4 10-11" /></Svg>;
export const IconBolt = (p) => <Svg {...p}><path d="M13 2L4.5 13H11l-1 9 8.5-11H12z" /></Svg>;
export const IconMoon = (p) => <Svg {...p}><path d="M20 14a8 8 0 1 1-9.9-9.9A7 7 0 0 0 20 14z" /></Svg>;
export const IconFoot = (p) => <Svg {...p}><path d="M13 4l-2 8h5l-7 8 2-8H9z" /></Svg>;
export const IconAlert = (p) => <Svg {...p}><path d="M12 3l9 16H3z" /><path d="M12 9v4M12 16v.3" /></Svg>;
export const IconTennis = (p) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M5 5c4 3 5 11 2 14M19 5c-4 3-5 11-2 14" /></Svg>;
export const IconPlus = (p) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>;
export const IconArrow = (p) => <Svg {...p}><path d="M5 12h13M13 6l6 6-6 6" /></Svg>;
