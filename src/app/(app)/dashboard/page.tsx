"use client";

import Link from "next/link";
import { useAppData } from "@/lib/store";
import { cycleTotal, teamById } from "@/lib/data";
import { CheckIcon } from "@/components/icons";

const TODAY_DATE = 26;

function daysUntilLabel(date: number) {
  const diff = date - TODAY_DATE;
  if (diff === 0) return "I dag";
  if (diff === 1) return "I morgen";
  if (diff > 1) return `Om ${diff} dage`;
  return "Overstået";
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 10) return "God morgen";
  if (hour < 17) return "God eftermiddag";
  return "God aften";
}

export default function DashboardPage() {
  const { selectedChild, sessions, enrollments, toggleSignup } = useAppData();

  const childSessions = sessions
    .filter((s) => s.childId === selectedChild.id)
    .sort((a, b) => a.date - b.date);

  const nextSession =
    childSessions.find((s) => s.date >= TODAY_DATE) ?? childSessions[0];

  const childEnrollments = enrollments.filter((e) => e.childId === selectedChild.id);
  const pendingEnrollment = childEnrollments.find((e) => e.status === "afventer");
  const freeEnrollment = childEnrollments.find((e) => e.status === "gratis");
  const latestBadge = [...selectedChild.badges].reverse().find((b) => b.unlocked);

  return (
    <div className="flex flex-col gap-6 px-5 py-6 md:px-8 md:py-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] text-text-muted">Onsdag 26. august</div>
          <h1 className="font-display text-[26px] font-extrabold uppercase leading-none text-text md:text-[32px]">
            {greeting()}, Mette
          </h1>
        </div>
      </div>

      {nextSession && (
        <section className="flex flex-col gap-3.5 border border-border bg-surface p-5">
          <div className="flex items-baseline justify-between">
            <span className="font-display text-xs font-semibold tracking-[.22em] text-accent uppercase">
              Næste træning
            </span>
            <span className="font-display text-xs font-semibold tracking-[.1em] text-text-muted uppercase">
              {daysUntilLabel(nextSession.date)}
            </span>
          </div>
          <div className="flex items-end gap-3.5">
            <div className="font-display text-[44px] font-extrabold leading-[.9] text-text md:text-[52px]">
              {nextSession.weekday}
              <br />
              <span className="text-accent">
                {nextSession.time ? nextSession.time.split("–")[0] : "--:--"}
              </span>
            </div>
            <div className="flex flex-col gap-1 pb-1">
              <div className="text-[15px] font-semibold text-text">{nextSession.title}</div>
              <div className="text-[13px] text-text-muted">
                {nextSession.location}
                {nextSession.coach ? ` · Træner ${nextSession.coach}` : ""}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => toggleSignup(nextSession.id)}
              className={
                "flex h-[42px] flex-1 items-center justify-center gap-2 border transition-colors " +
                (nextSession.signedUp
                  ? "border-accent text-accent"
                  : "border-border-strong bg-accent text-canvas")
              }
            >
              {nextSession.signedUp && <CheckIcon color="var(--color-accent)" />}
              <span className="font-display text-sm font-bold tracking-[.1em]">
                {nextSession.signedUp ? "TILMELDT" : "TILMELD"}
              </span>
            </button>
            {nextSession.signedUp && (
              <button
                onClick={() => toggleSignup(nextSession.id)}
                className="flex h-[42px] items-center justify-center px-4 text-[13px] text-text-muted"
              >
                Afmeld
              </button>
            )}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-2.5">
        <Link
          href="/payment"
          className="flex flex-col gap-2 border border-border bg-surface p-4"
        >
          <span className="font-display text-[11px] font-semibold tracking-[.2em] text-text-muted uppercase">
            Betaling
          </span>
          {pendingEnrollment ? (
            <>
              <span className="font-display text-2xl font-extrabold leading-none text-text md:text-[26px]">
                {cycleTotal(teamById(pendingEnrollment.teamId).billing).toLocaleString("da-DK")} kr
              </span>
              <span className="text-xs text-text-muted">
                {teamById(pendingEnrollment.teamId).name} · forfalder {pendingEnrollment.cycleEnd}
              </span>
            </>
          ) : freeEnrollment ? (
            <>
              <span className="font-display text-2xl font-extrabold leading-none text-accent md:text-[26px]">
                Gratis
              </span>
              <span className="text-xs text-text-muted">
                {teamById(freeEnrollment.teamId).name} indtil {freeEnrollment.cycleEnd}
              </span>
            </>
          ) : (
            <>
              <span className="font-display text-2xl font-extrabold leading-none text-text md:text-[26px]">
                Alt betalt
              </span>
              <span className="text-xs text-text-muted">Ingen forfaldne betalinger</span>
            </>
          )}
          <span className="self-start border-b border-accent pb-px font-display text-[11px] font-bold tracking-[.12em] text-accent">
            SE BETALING
          </span>
        </Link>
        <Link
          href="/profile"
          className="flex flex-col gap-2 border border-border bg-surface p-4"
        >
          <span className="font-display text-[11px] font-semibold tracking-[.2em] text-text-muted uppercase">
            Streak
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-extrabold leading-none text-accent md:text-[26px]">
              {selectedChild.streakWeeks}
            </span>
            <span className="text-xs text-text-muted">uger i træk</span>
          </span>
          <span className="text-xs text-text-muted">
            {latestBadge ? `Nyt badge: ${latestBadge.label}` : "Ingen nye badges"}
          </span>
          <span className="self-start border-b border-accent pb-px font-display text-[11px] font-bold tracking-[.12em] text-accent">
            SE PROFIL
          </span>
        </Link>
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-sm font-bold tracking-[.2em] text-text uppercase">
            Denne uge
          </h2>
          <Link href="/calendar" className="text-xs font-semibold text-accent">
            Åbn kalender
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {childSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => toggleSignup(session.id)}
              className={
                "flex items-center gap-3.5 border bg-surface px-4 py-3 text-left transition-colors " +
                (session.type === "event"
                  ? "border-accent/35"
                  : "border-border")
              }
            >
              <div className="min-w-9 text-center">
                <div className="font-display text-[11px] font-bold tracking-[.1em] text-text-muted">
                  {session.weekday}
                </div>
                <div className="font-display text-xl font-extrabold leading-none text-text">
                  {session.date}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-text">{session.title}</div>
                <div className="text-xs text-text-muted">
                  {session.time} · {session.location}
                </div>
              </div>
              {session.type === "event" ? (
                <span className="bg-accent px-2 py-1 font-display text-[11px] font-bold tracking-[.12em] text-canvas">
                  EVENT
                </span>
              ) : session.signedUp ? (
                <CheckIcon color="var(--color-accent)" />
              ) : (
                <span className="text-xs text-text-muted">Tilmeld</span>
              )}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
