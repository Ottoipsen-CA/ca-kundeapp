"use client";

import { useAppData } from "@/lib/store";
import { cycleTotal, teamById, type Enrollment, type PaymentStatus } from "@/lib/data";

export default function PaymentPage() {
  const { selectedChild, enrollments, sessions, paymentHistory } = useAppData();

  const childEnrollments = enrollments.filter((e) => e.childId === selectedChild.id);
  const workshopSessions = sessions.filter(
    (s) => s.childId === selectedChild.id && s.teamId === "soendag-workshop"
  );
  const upcomingEvents = sessions.filter(
    (s) => s.childId === selectedChild.id && s.type === "event" && s.signedUp
  );
  const history = paymentHistory[selectedChild.id] ?? [];
  const workshopBilling = teamById("soendag-workshop").billing;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5 px-5 py-6 md:px-8 md:py-8">
      <h1 className="font-display text-[28px] font-extrabold uppercase leading-none text-text">
        Betaling
      </h1>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-sm font-bold tracking-[.2em] text-text uppercase">
          Faste hold
        </h2>
        {childEnrollments.length === 0 ? (
          <p className="text-sm text-text-muted">{selectedChild.name.split(" ")[0]} er ikke tilmeldt et fast hold.</p>
        ) : (
          childEnrollments.map((enrollment) => (
            <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
          ))
        )}
      </section>

      {workshopSessions.length > 0 && (
        <section className="flex flex-col gap-2.5">
          <h2 className="font-display text-sm font-bold tracking-[.2em] text-text uppercase">
            Søndag Workshop
          </h2>
          <p className="text-xs text-text-muted">
            Intet abonnement — {workshopBilling.kind === "per-session" ? workshopBilling.frequency : ""}
            , betales pr. gang.
          </p>
          <div className="flex flex-col gap-2">
            {workshopSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center gap-3.5 border border-border bg-surface px-4 py-3.5"
              >
                <div className="flex-1">
                  <div className="text-sm font-semibold text-text">
                    {session.weekday} {session.date}. {session.month.toLowerCase()}
                  </div>
                  <div className="text-xs text-text-muted">
                    {session.signedUp ? "Tilmeldt" : "Ikke tilmeldt"} · {session.time}
                  </div>
                </div>
                <div className="font-display text-[15px] font-bold text-text">
                  {session.price?.toLocaleString("da-DK")} kr
                </div>
                <StatusPill status={session.paymentStatus ?? "afventer"} />
              </div>
            ))}
          </div>
        </section>
      )}

      {upcomingEvents.length > 0 && (
        <section className="flex flex-col gap-2.5">
          <h2 className="font-display text-sm font-bold tracking-[.2em] text-text uppercase">
            Events
          </h2>
          <div className="flex flex-col gap-2">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3.5 border border-accent/40 bg-surface px-4 py-3.5"
              >
                <div className="flex-1">
                  <div className="text-sm font-semibold text-text">{event.title}</div>
                  <div className="text-xs text-text-muted">
                    {event.weekday} {event.date}. {event.month.toLowerCase()} · {event.location}
                  </div>
                </div>
                <div className="font-display text-[15px] font-bold text-text">
                  {event.price?.toLocaleString("da-DK")} kr
                </div>
                <StatusPill status={event.paymentStatus ?? "afventer"} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-2.5">
        <h2 className="font-display text-sm font-bold tracking-[.2em] text-text uppercase">
          Historik
        </h2>
        {history.length === 0 ? (
          <p className="text-sm text-text-muted">Ingen tidligere betalinger endnu.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {history.map((record) => (
              <div
                key={record.id}
                className="flex items-center gap-3.5 border border-border bg-surface px-4 py-3.5"
              >
                <div className="flex-1">
                  <div className="text-sm font-semibold text-text">{record.label}</div>
                  <div className="text-xs text-text-muted">
                    Betalt {record.date} · {record.method}
                  </div>
                </div>
                <div className="font-display text-[15px] font-bold text-text">
                  {record.amount.toLocaleString("da-DK")} kr
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="text-xs leading-relaxed text-text-dim">
        Betaling foregår via MobilePay til boks 12345 — skriv barnets navn og hold i
        kommentarfeltet. Vi opdaterer status her i appen, så snart betalingen er registreret.
        Spørgsmål: kontakt@copenhagenacademy.dk.
      </p>
    </div>
  );
}

function EnrollmentCard({ enrollment }: { enrollment: Enrollment }) {
  const team = teamById(enrollment.teamId);
  const billing = team.billing;

  return (
    <section className="flex flex-col gap-3.5 border border-border bg-surface p-5">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="font-display text-[11px] font-semibold tracking-[.22em] text-text-muted uppercase">
            Hold
          </span>
          <span className="font-display text-2xl font-extrabold uppercase leading-[1.05] text-text">
            {team.name}
          </span>
          <span className="text-xs text-text-muted">
            {team.weekday} · {team.time} · {team.location}
          </span>
        </div>
        <StatusPill status={enrollment.status} />
      </div>

      {billing.kind === "recurring" && (
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-4xl font-extrabold leading-none text-text">
            {cycleTotal(billing).toLocaleString("da-DK")}
          </span>
          <span className="text-sm text-text-muted">
            kr / {billing.cycleMonths} mdr ({billing.pricePerMonth} kr/md)
          </span>
        </div>
      )}

      {billing.kind === "recurring-promo" && (
        <div className="flex items-baseline gap-1.5">
          {enrollment.status === "gratis" ? (
            <>
              <span className="font-display text-4xl font-extrabold leading-none text-accent">
                Gratis
              </span>
              <span className="text-sm text-text-muted">
                indtil {billing.freeUntil}, derefter {billing.pricePerMonth} kr/md
              </span>
            </>
          ) : (
            <>
              <span className="font-display text-4xl font-extrabold leading-none text-text">
                {cycleTotal(billing).toLocaleString("da-DK")}
              </span>
              <span className="text-sm text-text-muted">
                kr / {billing.cycleMonths} mdr ({billing.pricePerMonth} kr/md)
              </span>
            </>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2 border-t border-border pt-3.5 text-[13px]">
        <Row label="Periode" value={`${enrollment.cycleStart} – ${enrollment.cycleEnd}`} />
        {billing.kind === "recurring-promo" && (
          <Row label="Gratis periode udløber" value={billing.freeUntil} />
        )}
        {team.coach && <Row label="Træner" value={team.coach} />}
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: PaymentStatus }) {
  const label = status === "betalt" ? "BETALT" : status === "gratis" ? "GRATIS" : "AFVENTER";
  return (
    <span
      className={
        "font-display shrink-0 border px-2 py-1 text-[11px] font-bold tracking-[.12em] " +
        (status === "betalt"
          ? "border-accent text-accent"
          : status === "gratis"
            ? "border-accent/50 text-accent"
            : "border-border-strong text-text-muted")
      }
    >
      {label}
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-text-muted">{label}</span>
      <span className="font-semibold text-text">{value}</span>
    </div>
  );
}
