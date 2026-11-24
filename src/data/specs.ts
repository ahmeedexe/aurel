export const ENGINEERING_STATS = [
  { label: "System output", value: "947", unit: "CV", note: "AUREL parallel vector drive" },
  { label: "0 — 100", value: "2.4", unit: "s", note: "Launch control enabled" },
  { label: "Range", value: "612", unit: "km", note: "WLTP fictional cycle" },
  { label: "Cd", value: "0.19", unit: "", note: "Active aero suite" },
] as const;

export const NAV_ITEMS = [
  { href: "#work", label: "Work" },
  { href: "#machine", label: "The Machine" },
  { href: "#engineering", label: "Engineering" },
  { href: "#experience", label: "Experience" },
] as const;