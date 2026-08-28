"use client";

import Link from "next/link";
import { useAppData } from "@/lib/store";
import { CheckIcon } from "@/components/icons";
import type { Badge } from "@/lib/data";
import { logout } from "@/app/login/actions";

export default function ProfilePage() {
  const { selectedChild } = useAppData();
  const c = selectedChild;

  const points = c.developmentHistory
    .map((y, i) => `${i * (300 / (c.developmentHistory.length - 1))},${y}`)
    .join(" ");
  const lastPoint = c.developmentHistory[c.developmentHistory.length - 1];

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5 px-5 py-6 md:px-8 md:py-8">
      <section className="relative flex flex-col gap-4 overflow-hidden border border-accent/45 p-5"
        style={{ background: "linear-gradient(160deg, #1A2530 0%, #0E141C 70%)" }}
      >
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-40 w-40"
          style={{
            background: "radial-gradient(circle, rgba(200,255,46,.16), transparent 70%)",
          }}
        />
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="font-display text-[11px] font-semibold tracking-[.26em] text-accent uppercase">
              Copenhagen Academy
            </span>
            <span className="font-display mt-1 text-[34px] font-extrabold uppercase leading-[1] text-text md:text-[38px]">
              {c.name.split(" ")[0]}
              <br />
              {c.name.split(" ").slice(1).join(" ")}
            </span>
            <span className="font-display mt-1.5 text-[13px] font-semibold tracking-[.14em] text-text-muted uppercase">
              {c.club} · {c.position}
            </span>
          </div>
          <div className="flex h-[92px] w-[76px] items-center justify-center border border-border-strong text-center font-mono text-[9px] leading-relaxed text-text-muted"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, #1B2836 0 8px, #141E29 8px 16px)",
            }}
          >
            spiller-
            <br />
            foto
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 border-t border-border pt-3.5">
          <Stat value={String(c.streakWeeks)} label="UGERS STREAK" accent />
          <Stat value={`${c.attendancePct}%`} label="FREMMØDE" />
          <Stat value={String(c.sessionsCount)} label="TRÆNINGER" />
        </div>
      </section>

      <section className="flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-sm font-bold tracking-[.2em] text-text uppercase">
            Badges
          </h2>
          <span className="text-xs text-text-muted">
            {c.badges.filter((b) => b.unlocked).length} af {c.badges.length} låst op
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {c.badges.map((badge) => (
            <BadgeTile key={badge.id} badge={badge} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-sm font-bold tracking-[.2em] text-text uppercase">
            Udvikling
          </h2>
          <span className="text-xs text-text-muted">Vurderet af træner · aug</span>
        </div>
        <div className="flex flex-col gap-3 border border-border bg-surface p-4">
          <DevRow label="Teknik" score={c.development.technique.score} delta={c.development.technique.delta} />
          <DevRow label="Taktik" score={c.development.tactics.score} delta={c.development.tactics.delta} />
          <DevRow label="Fysik" score={c.development.physical.score} delta={c.development.physical.delta} />
          <div className="border-t border-border pt-3">
            <svg width="100%" height="64" viewBox="0 0 300 64" preserveAspectRatio="none">
              <polyline points={points} fill="none" stroke="var(--color-accent)" strokeWidth="2" />
              <circle
                cx={300}
                cy={lastPoint}
                r="3.5"
                fill="var(--color-accent)"
              />
            </svg>
            <div className="font-display flex justify-between text-[10px] font-semibold tracking-[.1em] text-text-dim">
              {c.developmentMonths.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-between border-t border-border pt-4 text-xs">
        <Link href="/account" className="font-semibold text-text-muted hover:text-text">
          Konto · skift kodeord
        </Link>
        <form action={logout}>
          <button type="submit" className="font-semibold text-text-muted hover:text-text">
            Log ud
          </button>
        </form>
      </section>
    </div>
  );
}

function Stat({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className={
          "font-display text-[30px] font-extrabold leading-none " +
          (accent ? "text-accent" : "text-text")
        }
      >
        {value}
      </span>
      <span className="font-display text-[11px] font-semibold tracking-[.14em] text-text-muted">
        {label}
      </span>
    </div>
  );
}

function BadgeTile({ badge }: { badge: Badge }) {
  return (
    <div
      className={
        "flex flex-col items-center gap-1.5 p-3 " +
        (badge.unlocked
          ? "border border-accent/40 bg-surface"
          : "border border-dashed border-border-strong bg-surface opacity-50")
      }
    >
      <div
        className={
          "flex h-[34px] w-[34px] items-center justify-center font-display text-[15px] font-extrabold " +
          (badge.unlocked ? "bg-accent text-canvas" : "border border-border-strong text-text-muted")
        }
      >
        {badge.kind === "check" ? (
          <CheckIcon color={badge.unlocked ? "#0B0F14" : "var(--color-text-muted)"} size={16} />
        ) : (
          badge.value
        )}
      </div>
      <span className="text-center text-[10px] leading-tight text-text-body">{badge.label}</span>
    </div>
  );
}

function DevRow({ label, score, delta }: { label: string; score: number; delta: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between">
        <span className="text-[13px] font-semibold text-text">{label}</span>
        <span className="font-display text-sm font-bold text-accent">
          {score} <span className="font-semibold text-text-muted">+{delta}</span>
        </span>
      </div>
      <div className="h-[5px] bg-white/8">
        <div className="h-full bg-accent" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
