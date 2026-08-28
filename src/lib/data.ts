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

// Note: Child/Session/Enrollment/PaymentRecord instance data used to live
// here as in-memory mock arrays. It's now real data in Supabase — see
// supabase/migrations/ for the schema and scripts/seed-demo.mjs for the demo
// dataset (same two players, same fixtures). src/lib/store.tsx fetches and
// maps the live rows into these same shapes, so pages need no changes.

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

export type PaymentRecord = {
  id: string;
  label: string;
  date: string;
  amount: number;
  method: string;
};
