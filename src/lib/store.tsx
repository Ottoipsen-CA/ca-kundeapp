"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  Badge as BadgeRow,
  Child as ChildRow,
  Enrollment as EnrollmentRow,
  PaymentHistory as PaymentHistoryRow,
  Session as SessionRow,
} from "@/lib/supabase/types";
import type {
  Badge,
  Child,
  Enrollment,
  PaymentRecord,
  PaymentStatus,
  Session,
  SessionType,
  TeamId,
} from "./data";

const DA_MONTHS = [
  "januar", "februar", "marts", "april", "maj", "juni",
  "juli", "august", "september", "oktober", "november", "december",
];
const DA_MONTH_ABBR = [
  "JAN", "FEB", "MAR", "APR", "MAJ", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEC",
];
const DA_MONTH_ABBR_LOWER = DA_MONTH_ABBR.map((m) => m.toLowerCase());

function parseIsoDate(iso: string) {
  return new Date(`${iso}T00:00:00`);
}

function formatDanishDateLong(iso: string) {
  const d = parseIsoDate(iso);
  return `${d.getDate()}. ${DA_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDanishDateShort(iso: string) {
  const d = parseIsoDate(iso);
  return `${d.getDate()}. ${DA_MONTH_ABBR_LOWER[d.getMonth()]}`;
}

function mapBadge(row: BadgeRow["Row"]): Badge {
  return {
    id: row.key,
    label: row.label,
    unlocked: row.unlocked,
    kind: row.kind,
    value: row.value,
  };
}

function mapChild(row: ChildRow["Row"], badges: BadgeRow["Row"][]): Child {
  return {
    id: row.id,
    name: row.name,
    initials: row.initials,
    ageGroup: row.age_group,
    position: row.position ?? "",
    club: row.club ?? "",
    streakWeeks: row.streak_weeks,
    attendancePct: row.attendance_pct,
    sessionsCount: row.sessions_count,
    development: {
      technique: { score: row.technique_score, delta: row.technique_delta },
      tactics: { score: row.tactics_score, delta: row.tactics_delta },
      physical: { score: row.physical_score, delta: row.physical_delta },
    },
    developmentHistory: row.development_history,
    developmentMonths: row.development_months,
    badges: badges.filter((b) => b.child_id === row.id).map(mapBadge),
  };
}

function mapEnrollment(row: EnrollmentRow["Row"]): Enrollment {
  return {
    id: row.id,
    childId: row.child_id,
    teamId: row.team_id as TeamId,
    cycleStart: formatDanishDateLong(row.cycle_start),
    cycleEnd: formatDanishDateLong(row.cycle_end),
    status: row.status as PaymentStatus,
  };
}

function mapSession(row: SessionRow["Row"]): Session {
  const d = parseIsoDate(row.session_date);
  return {
    id: row.id,
    childId: row.child_id,
    teamId: (row.team_id as TeamId) ?? undefined,
    weekday: row.weekday,
    date: d.getDate(),
    month: DA_MONTH_ABBR[d.getMonth()],
    title: row.title,
    time: row.time,
    location: row.location,
    type: row.type as SessionType,
    signedUp: row.signed_up,
    price: row.price ?? undefined,
    paymentStatus: (row.payment_status as PaymentStatus | null) ?? undefined,
    capacity: row.capacity ?? undefined,
    coach: row.coach ?? undefined,
  };
}

function mapPaymentRecord(row: PaymentHistoryRow["Row"]): PaymentRecord {
  return {
    id: row.id,
    label: row.label,
    date: formatDanishDateShort(row.paid_on),
    amount: row.amount,
    method: row.method,
  };
}

const EMPTY_CHILD: Child = {
  id: "",
  name: "",
  initials: "",
  ageGroup: "",
  position: "",
  club: "",
  streakWeeks: 0,
  attendancePct: 0,
  sessionsCount: 0,
  development: {
    technique: { score: 0, delta: 0 },
    tactics: { score: 0, delta: 0 },
    physical: { score: 0, delta: 0 },
  },
  developmentHistory: [],
  developmentMonths: [],
  badges: [],
};

type AppData = {
  loading: boolean;
  children: Child[];
  sessions: Session[];
  enrollments: Enrollment[];
  paymentHistory: Record<string, PaymentRecord[]>;
  selectedChildId: string;
  selectedChild: Child;
  selectChild: (id: string) => void;
  toggleSignup: (sessionId: string) => void;
};

const AppDataContext = createContext<AppData | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<Record<string, PaymentRecord[]>>({});
  const [selectedChildId, setSelectedChildId] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (!cancelled) setLoading(false);
        return;
      }

      const { data: childRows } = await supabase
        .from("children")
        .select("*")
        .eq("parent_id", user.id);

      const childIds = (childRows ?? []).map((c) => c.id);
      if (childIds.length === 0) {
        if (!cancelled) setLoading(false);
        return;
      }

      const [{ data: badgeRows }, { data: enrollmentRows }, { data: sessionRows }, { data: paymentRows }] =
        await Promise.all([
          supabase.from("badges").select("*").in("child_id", childIds),
          supabase.from("enrollments").select("*").in("child_id", childIds),
          supabase.from("sessions").select("*").in("child_id", childIds),
          supabase.from("payment_history").select("*").in("child_id", childIds),
        ]);

      if (cancelled) return;

      const mappedChildren = (childRows ?? []).map((row) => mapChild(row, badgeRows ?? []));
      const mappedSessions = (sessionRows ?? [])
        .map(mapSession)
        .sort((a, b) => a.date - b.date);
      const mappedEnrollments = (enrollmentRows ?? []).map(mapEnrollment);
      const historyByChild: Record<string, PaymentRecord[]> = {};
      for (const row of paymentRows ?? []) {
        const record = mapPaymentRecord(row);
        (historyByChild[row.child_id] ??= []).push(record);
      }

      setChildrenList(mappedChildren);
      setSessions(mappedSessions);
      setEnrollments(mappedEnrollments);
      setPaymentHistory(historyByChild);
      setSelectedChildId(mappedChildren[0]?.id ?? "");
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectChild = useCallback((id: string) => setSelectedChildId(id), []);

  const toggleSignup = useCallback((sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, signedUp: !s.signedUp } : s))
    );

    const supabase = createClient();
    supabase.rpc("toggle_session_signup", { p_session_id: sessionId }).then(({ error }) => {
      if (error) {
        // Roll back the optimistic flip if the write was rejected.
        setSessions((prev) =>
          prev.map((s) => (s.id === sessionId ? { ...s, signedUp: !s.signedUp } : s))
        );
      }
    });
  }, []);

  const selectedChild = useMemo(
    () => childrenList.find((c) => c.id === selectedChildId) ?? childrenList[0] ?? EMPTY_CHILD,
    [childrenList, selectedChildId]
  );

  const value: AppData = {
    loading,
    children: childrenList,
    sessions,
    enrollments,
    paymentHistory,
    selectedChildId,
    selectedChild,
    selectChild,
    toggleSignup,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
