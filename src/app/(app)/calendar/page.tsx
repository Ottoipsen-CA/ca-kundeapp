"use client";

import { useState } from "react";
import { useAppData } from "@/lib/store";
import { CheckIcon } from "@/components/icons";

const WEEK_DAYS = [
  { weekday: "MAN", date: 24 },
  { weekday: "TIR", date: 25 },
  { weekday: "ONS", date: 26 },
  { weekday: "TOR", date: 27 },
  { weekday: "FRE", date: 28 },
  { weekday: "LØR", date: 29 },
  { weekday: "SØN", date: 30 },
] as const;

const WEEKS = ["UGE 35", "UGE 36", "UGE 37"];

export default function CalendarPage() {
  const { selectedChild, children, sessions, toggleSignup } = useAppData();
  const [weekIndex, setWeekIndex] = useState(0);

  const event = sessions.find((s) => s.type === "event" && s.childId === selectedChild.id);

  return (
    <div className="flex flex-col gap-5 px-5 py-6 md:px-8 md:py-8">
      <div className="flex flex-wrap items-center gap-2">
        {WEEKS.map((label, i) => (
          <button
            key={label}
            onClick={() => setWeekIndex(i)}
            className={
              "font-display px-3 py-1.5 text-[13px] font-bold tracking-[.08em] transition-colors " +
              (i === weekIndex
                ? "bg-accent text-canvas"
                : "border border-border-strong text-text-muted hover:text-text")
            }
          >
            {label}
          </button>
        ))}
      </div>

      {weekIndex === 0 && event && (
        <section className="flex flex-col items-start gap-4 border border-accent/40 bg-accent-soft p-5 md:flex-row md:items-center">
          <div className="font-display text-3xl font-extrabold uppercase leading-[.95] text-accent">
            Champions
            <br />
            Cup
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-text">
              Kvalifikationsstævne · alle U10–U12 hold
            </div>
            <div className="text-[13px] text-text-muted">
              Lørdag 29. august · {event.time} · {event.location} · {event.price} kr pr. hold
              {event.capacity ? ` · ${event.capacity} hold` : ""}
            </div>
          </div>
          <button
            onClick={() => toggleSignup(event.id)}
            className={
              "font-display h-10 px-5 text-sm font-bold tracking-[.12em] transition-colors " +
              (event.signedUp
                ? "border border-accent text-accent"
                : "bg-accent text-canvas")
            }
          >
            {event.signedUp ? "TILMELDT" : "TILMELD"}
          </button>
        </section>
      )}

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-7">
        {WEEK_DAYS.map((day) => {
          if (weekIndex !== 0) {
            return (
              <div key={day.weekday} className="flex flex-col gap-2.5">
                <DayHeader weekday={day.weekday} date={day.date} muted />
                <div className="border border-dashed border-border-strong p-3.5 text-center text-xs text-text-dim">
                  Ingen træning
                </div>
              </div>
            );
          }

          const daySessions = sessions.filter((s) => s.date === day.date);
          const isSunday = day.weekday === "SØN";

          return (
            <div key={day.weekday} className="flex flex-col gap-2.5">
              <DayHeader
                weekday={day.weekday}
                date={day.date}
                accent={daySessions.some((s) => s.childId === selectedChild.id)}
              />
              {daySessions.length === 0 ? (
                <div className="border border-dashed border-border-strong p-3.5 text-center text-xs text-text-dim">
                  {isSunday ? "Hviledag" : "Ingen træning"}
                </div>
              ) : (
                daySessions.map((session) => {
                  const isSelf = session.childId === selectedChild.id;
                  const owner = children.find((c) => c.id === session.childId);
                  if (!isSelf) {
                    return (
                      <div
                        key={session.id}
                        className="flex flex-col gap-2 border border-border bg-surface p-3.5 opacity-55"
                      >
                        <div className="text-[15px] font-semibold leading-tight text-text">
                          {session.title}
                        </div>
                        <div className="text-xs leading-relaxed text-text-muted">
                          {session.time}
                          <br />
                          {session.location}
                        </div>
                        <div className="text-[11px] text-text-muted">{owner?.name.split(" ")[0]}s hold</div>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={session.id}
                      className={
                        "flex flex-col gap-2 border p-3.5 " +
                        (session.type === "event"
                          ? "border-accent/50 bg-gradient-to-b from-accent-soft to-transparent"
                          : "border-accent bg-surface")
                      }
                    >
                      {session.type === "event" && (
                        <span className="self-start bg-accent px-1.5 py-0.5 font-display text-[11px] font-bold tracking-[.14em] text-canvas">
                          TURNERING
                        </span>
                      )}
                      <div className="text-[15px] font-semibold leading-tight text-text">
                        {session.title.toUpperCase()}
                      </div>
                      <div className="text-xs leading-relaxed text-text-muted">
                        {session.time}
                        <br />
                        {session.location}
                      </div>
                      <button
                        onClick={() => toggleSignup(session.id)}
                        className="flex items-center gap-1.5 border-t border-border pt-2 text-left"
                      >
                        {session.signedUp ? (
                          <>
                            <CheckIcon color="var(--color-accent)" size={12} />
                            <span className="font-display text-[11px] font-bold tracking-[.1em] text-accent">
                              TILMELDT
                            </span>
                          </>
                        ) : (
                          <span className="font-display text-xs font-bold tracking-[.1em] text-accent">
                            {session.price ? `TILMELD · ${session.price} KR` : "TILMELD"}
                          </span>
                        )}
                      </button>
                      {session.price !== undefined && session.paymentStatus && (
                        <span
                          className={
                            "self-start font-display text-[10px] font-bold tracking-[.1em] " +
                            (session.paymentStatus === "betalt"
                              ? "text-accent"
                              : "text-text-muted")
                          }
                        >
                          {session.paymentStatus === "betalt" ? "BETALT" : "AFVENTER BETALING"}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-4 text-xs text-text-dim md:flex-row md:items-center md:justify-between">
        <span>
          Tirsdagshold og Fredag · BK Union fornys automatisk hver holdperiode · Søndag
          Workshop betales pr. gang
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 bg-accent" /> Tilmeldt
          <span className="ml-2.5 inline-block h-2.5 w-2.5 border border-border-strong" /> Ledig
          plads
        </span>
      </div>
    </div>
  );
}

function DayHeader({
  weekday,
  date,
  accent,
  muted,
}: {
  weekday: string;
  date: number;
  accent?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-1.5 border-b border-border pb-2">
      <span
        className={
          "font-display text-[13px] font-bold tracking-[.14em] " +
          (accent ? "text-accent" : "text-text-muted")
        }
      >
        {weekday}
      </span>
      <span
        className={
          "font-display text-lg font-extrabold " + (muted ? "text-text-dim" : "text-text")
        }
      >
        {date}
      </span>
    </div>
  );
}
