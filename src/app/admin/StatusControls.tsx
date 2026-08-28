"use client";

import { useTransition } from "react";
import {
  setEnrollmentStatus,
  setSessionPaymentStatus,
  updateApplicationStatus,
} from "./actions";
import type { ApplicationStatus, PaymentStatusDb } from "@/lib/supabase/types";

const PAYMENT_STATUSES: PaymentStatusDb[] = ["afventer", "betalt", "gratis"];
const APPLICATION_STATUSES: ApplicationStatus[] = ["ny", "kontaktet", "optaget", "afvist"];

function StatusButton({
  active,
  label,
  onClick,
  pending,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  pending: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={pending || active}
      className={
        "font-display px-2.5 py-1 text-[11px] font-bold tracking-[.08em] uppercase transition-colors disabled:cursor-default " +
        (active
          ? "bg-accent text-canvas"
          : "border border-border-strong text-text-muted hover:text-text")
      }
    >
      {label}
    </button>
  );
}

export function EnrollmentStatusControls({
  id,
  status,
}: {
  id: string;
  status: PaymentStatusDb;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex gap-1.5">
      {PAYMENT_STATUSES.map((s) => (
        <StatusButton
          key={s}
          label={s}
          active={s === status}
          pending={pending}
          onClick={() => startTransition(() => setEnrollmentStatus(id, s))}
        />
      ))}
    </div>
  );
}

export function SessionPaymentStatusControls({
  id,
  status,
}: {
  id: string;
  status: PaymentStatusDb;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex gap-1.5">
      {PAYMENT_STATUSES.map((s) => (
        <StatusButton
          key={s}
          label={s}
          active={s === status}
          pending={pending}
          onClick={() => startTransition(() => setSessionPaymentStatus(id, s))}
        />
      ))}
    </div>
  );
}

export function ApplicationStatusControls({
  id,
  status,
}: {
  id: string;
  status: ApplicationStatus;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex flex-wrap gap-1.5">
      {APPLICATION_STATUSES.map((s) => (
        <StatusButton
          key={s}
          label={s}
          active={s === status}
          pending={pending}
          onClick={() => startTransition(() => updateApplicationStatus(id, s))}
        />
      ))}
    </div>
  );
}
