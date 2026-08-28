"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  initialChildren,
  initialEnrollments,
  initialPaymentHistory,
  initialSessions,
  type Child,
  type Enrollment,
  type PaymentRecord,
  type Session,
} from "./data";

type AppData = {
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
  const [childrenList] = useState<Child[]>(initialChildren);
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [enrollments] = useState<Enrollment[]>(initialEnrollments);
  const [paymentHistory] = useState(initialPaymentHistory);
  const [selectedChildId, setSelectedChildId] = useState(childrenList[0].id);

  const selectChild = useCallback((id: string) => setSelectedChildId(id), []);

  const toggleSignup = useCallback((sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, signedUp: !s.signedUp } : s))
    );
  }, []);

  const selectedChild = useMemo(
    () => childrenList.find((c) => c.id === selectedChildId) ?? childrenList[0],
    [childrenList, selectedChildId]
  );

  const value: AppData = {
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
