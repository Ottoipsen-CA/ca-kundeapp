export type Child = {
  id: string;
  name: string;
  initials: string;
  ageGroup: string;
  position: string;
  club: string;
  streakWeeks: number;
  attendancePct: number;
  sessionsCount: number;
  development: {
    technique: { score: number; delta: number };
    tactics: { score: number; delta: number };
    physical: { score: number; delta: number };
  };
  developmentHistory: number[];
  developmentMonths: string[];
  badges: Badge[];
};

export type Badge = {
  id: string;
  label: string;
  unlocked: boolean;
  kind: "number" | "check" | "text";
  value: string;
};

export const initialChildren: Child[] = [
  {
    id: "oscar",
    name: "Oscar Nørgaard",
    initials: "ON",
    ageGroup: "U11",
    position: "Midtbane",
    club: "U11 Performance",
    streakWeeks: 14,
    attendancePct: 92,
    sessionsCount: 47,
    development: {
      technique: { score: 78, delta: 6 },
      tactics: { score: 64, delta: 9 },
      physical: { score: 71, delta: 4 },
    },
    developmentHistory: [52, 48, 44, 38, 30, 22, 14],
    developmentMonths: ["MAR", "APR", "MAJ", "JUN", "JUL", "AUG"],
    badges: [
      { id: "streak10", label: "10 uger i træk", unlocked: true, kind: "number", value: "10" },
      { id: "iron", label: "Jernvilje", unlocked: true, kind: "check", value: "" },
      { id: "firstcamp", label: "Første camp", unlocked: true, kind: "text", value: "1." },
      { id: "streak20", label: "20 uger i træk", unlocked: false, kind: "number", value: "20" },
    ],
  },
  {
    id: "alma",
    name: "Alma Nørgaard",
    initials: "AN",
    ageGroup: "U9",
    position: "Angriber",
    club: "U9 Udvikling",
    streakWeeks: 6,
    attendancePct: 85,
    sessionsCount: 21,
    development: {
      technique: { score: 61, delta: 8 },
      tactics: { score: 49, delta: 5 },
      physical: { score: 66, delta: 7 },
    },
    developmentHistory: [58, 53, 48, 42, 37, 33, 30],
    developmentMonths: ["MAR", "APR", "MAJ", "JUN", "JUL", "AUG"],
    badges: [
      { id: "streak5", label: "5 uger i træk", unlocked: true, kind: "number", value: "5" },
      { id: "firsttraining", label: "Første træning", unlocked: true, kind: "text", value: "1." },
      { id: "iron", label: "Jernvilje", unlocked: false, kind: "check", value: "" },
      { id: "streak10", label: "10 uger i træk", unlocked: false, kind: "number", value: "10" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Teams & billing
//
// A child is enrolled in one or more concrete teams (not a frequency-based
// package). Each team has its own weekday, its own price and its own billing
// cycle — these are real, independent business terms, not tiers of one plan.
// ---------------------------------------------------------------------------

export type TeamId = "tirsdag" | "fredag-bk-union" | "soendag-workshop";

export type TeamBilling =
  | {
      // Fixed price per month, invoiced every `cycleMonths` months.
      kind: "recurring";
      pricePerMonth: number;
      cycleMonths: number;
    }
  | {
      // Free until a given date, then becomes a normal recurring cycle.
      kind: "recurring-promo";
      freeUntil: string;
      pricePerMonth: number;
      cycleMonths: number;
    }
  | {
      // No subscription at all — a flat charge each time it runs.
      kind: "per-session";
      pricePerSession: number;
      frequency: string;
    };

export type Team = {
  id: TeamId;
  name: string;
  weekday: string;
  time: string;
  location: string;
  coach?: string;
  billing: TeamBilling;
};

export const teams: Team[] = [
  {
    id: "tirsdag",
    name: "Tirsdagshold",
    weekday: "TIR",
    time: "17:00–18:15",
    location: "Fælledparken",
    coach: "Mikkel",
    billing: { kind: "recurring", pricePerMonth: 1000, cycleMonths: 3 },
  },
  {
    id: "fredag-bk-union",
    name: "Fredag · BK Union",
    weekday: "FRE",
    time: "16:30–17:45",
    location: "Kløvermarken, bane 4",
    coach: "Mikkel",
    billing: {
      kind: "recurring-promo",
      freeUntil: "18. september 2026",
      pricePerMonth: 500,
      cycleMonths: 3.5,
    },
  },
  {
    id: "soendag-workshop",
    name: "Søndag Workshop",
    weekday: "SØN",
    time: "10:00–12:00",
    location: "Valby Idrætspark",
    coach: "Sofie",
    billing: { kind: "per-session", pricePerSession: 600, frequency: "1× om måneden" },
  },
];

export function teamById(id: TeamId): Team {
  const team = teams.find((t) => t.id === id);
  if (!team) throw new Error(`Unknown team: ${id}`);
  return team;
}

export function cycleTotal(billing: TeamBilling): number {
  if (billing.kind === "per-session") return billing.pricePerSession;
  return billing.pricePerMonth * billing.cycleMonths;
}

// ---------------------------------------------------------------------------
// Enrollments — which child belongs to which team, and the current billing
// cycle's status for that membership. Only meaningful for recurring/
// recurring-promo teams; the per-session workshop is billed per attended
// Session instead (see below).
// ---------------------------------------------------------------------------

export type PaymentStatus = "betalt" | "afventer" | "gratis";

export type Enrollment = {
  id: string;
  childId: string;
  teamId: TeamId;
  cycleStart: string;
  cycleEnd: string;
  status: PaymentStatus;
};

export const initialEnrollments: Enrollment[] = [
  {
    id: "e1",
    childId: "oscar",
    teamId: "tirsdag",
    cycleStart: "1. august 2026",
    cycleEnd: "1. november 2026",
    status: "afventer",
  },
  {
    id: "e2",
    childId: "oscar",
    teamId: "fredag-bk-union",
    cycleStart: "1. august 2026",
    cycleEnd: "18. september 2026",
    status: "gratis",
  },
  {
    id: "e3",
    childId: "alma",
    teamId: "fredag-bk-union",
    cycleStart: "1. august 2026",
    cycleEnd: "18. september 2026",
    status: "gratis",
  },
];

// ---------------------------------------------------------------------------
// Sessions — one calendar occurrence of a team (or a standalone event like
// Champions Cup). Attendance (signedUp) is tracked per child per date,
// independent of the underlying team enrollment/billing cycle.
// ---------------------------------------------------------------------------

export type SessionType = "training" | "event";

export type Session = {
  id: string;
  childId: string;
  teamId?: TeamId;
  weekday: string;
  date: number;
  month: string;
  title: string;
  time: string;
  location: string;
  type: SessionType;
  signedUp: boolean;
  price?: number;
  paymentStatus?: PaymentStatus;
  capacity?: number;
  coach?: string;
};

export const initialSessions: Session[] = [
  {
    id: "s1",
    childId: "oscar",
    teamId: "tirsdag",
    weekday: "TIR",
    date: 25,
    month: "AUG",
    title: "Tirsdagshold",
    time: "17:00–18:15",
    location: "Fælledparken",
    type: "training",
    signedUp: true,
    coach: "Mikkel",
  },
  {
    id: "s2",
    childId: "oscar",
    teamId: "fredag-bk-union",
    weekday: "FRE",
    date: 28,
    month: "AUG",
    title: "Fredag · BK Union",
    time: "16:30–17:45",
    location: "Kløvermarken, bane 4",
    type: "training",
    signedUp: true,
    coach: "Mikkel",
  },
  {
    id: "s3",
    childId: "alma",
    teamId: "fredag-bk-union",
    weekday: "FRE",
    date: 28,
    month: "AUG",
    title: "Fredag · BK Union",
    time: "16:30–17:45",
    location: "Kløvermarken, bane 4",
    type: "training",
    signedUp: false,
    coach: "Mikkel",
  },
  {
    id: "s4",
    childId: "oscar",
    teamId: "soendag-workshop",
    weekday: "SØN",
    date: 30,
    month: "AUG",
    title: "Søndag Workshop",
    time: "10:00–12:00",
    location: "Valby Idrætspark",
    type: "training",
    signedUp: true,
    price: 600,
    paymentStatus: "afventer",
    coach: "Sofie",
  },
  {
    id: "s5",
    childId: "oscar",
    weekday: "LØR",
    date: 29,
    month: "AUG",
    title: "Champions Cup",
    time: "09:00–14:00",
    location: "Valby Idrætspark",
    type: "event",
    signedUp: false,
    price: 1000,
    capacity: 40,
    coach: "Alle U10–U12 hold",
  },
  {
    id: "s6",
    childId: "alma",
    weekday: "LØR",
    date: 29,
    month: "AUG",
    title: "Champions Cup",
    time: "09:00–14:00",
    location: "Valby Idrætspark",
    type: "event",
    signedUp: true,
    price: 1000,
    capacity: 40,
    coach: "Alle U10–U12 hold",
  },
];

export type PaymentRecord = {
  id: string;
  label: string;
  date: string;
  amount: number;
  method: string;
};

export const initialPaymentHistory: Record<string, PaymentRecord[]> = {
  oscar: [
    { id: "p1", label: "Tirsdagshold · 3 mdr (maj–jul)", date: "1. maj", amount: 3000, method: "MobilePay" },
    { id: "p2", label: "Sommercamp · uge 27", date: "12. jun", amount: 1850, method: "MobilePay" },
  ],
  alma: [],
};
