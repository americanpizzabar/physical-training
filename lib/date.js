// Date helpers (local time, ISO YYYY-MM-DD keys)

export function todayISO(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDaysISO(iso, delta) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + delta);
  return todayISO(d);
}

export function lastNDates(n, endISO = todayISO()) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) out.push(addDaysISO(endISO, -i));
  return out;
}

// Monday-based week start for a given ISO date
export function weekStartISO(iso = todayISO()) {
  const d = new Date(iso + "T00:00:00");
  const dow = (d.getDay() + 6) % 7; // Mon=0 .. Sun=6
  d.setDate(d.getDate() - dow);
  return todayISO(d);
}

export function isThisWeek(iso, ref = todayISO()) {
  return weekStartISO(iso) === weekStartISO(ref);
}

export function jpWeekday(iso) {
  const names = ["日", "月", "火", "水", "木", "金", "土"];
  return names[new Date(iso + "T00:00:00").getDay()];
}

export function jpShortDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getMonth() + 1}月${d.getDate()}日 (${jpWeekday(iso)})`;
}
