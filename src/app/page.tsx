"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const [step, setStep] = useState<"form" | "submitted" | "error">("form");
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [club, setClub] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPhone, setParentPhone] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from("applications").insert({
      player_name: name,
      birth_year: birthYear,
      current_club: club || null,
      parent_email: parentEmail || null,
      parent_phone: parentPhone || null,
    });
    setSubmitting(false);
    setStep(error ? "error" : "submitted");
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, #101A24 0 12px, #0B121A 12px 24px)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(11,15,20,.35) 0%, rgba(11,15,20,.92) 46%, #0B0F14 62%)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-end gap-8 px-7 pb-10 pt-24">
        {step === "form" || step === "error" ? (
          <>
            <div className="flex flex-col gap-3">
              <div className="flex h-11 w-11 items-center justify-center bg-accent font-display text-xl font-extrabold text-canvas">
                CA.
              </div>
              <div className="font-display text-sm font-semibold tracking-[.3em] text-accent uppercase">
                Optagelse 2026/27
              </div>
              <h1 className="font-display text-[46px] font-extrabold uppercase leading-[.98] text-text">
                Ansøg om en plads på akademiet
              </h1>
              <p className="max-w-[32ch] text-sm leading-relaxed text-text-muted">
                Vi optager løbende spillere i årgang 2010–2018 efter en prøvetræning.
                Ansøgningen tager to minutter.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
              <label className="flex flex-col gap-1.5 border border-border bg-surface px-4 py-3">
                <span className="font-display text-[11px] font-semibold tracking-[.18em] text-text-muted uppercase">
                  Spillerens navn
                </span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Oscar Nørgaard"
                  className="bg-transparent text-[15px] text-text placeholder:text-text-dim focus:outline-none"
                />
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <label className="flex flex-col gap-1.5 border border-border bg-surface px-4 py-3">
                  <span className="font-display text-[11px] font-semibold tracking-[.18em] text-text-muted uppercase">
                    Årgang
                  </span>
                  <input
                    required
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    placeholder="2015"
                    inputMode="numeric"
                    className="bg-transparent text-[15px] text-text placeholder:text-text-dim focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1.5 border border-border bg-surface px-4 py-3">
                  <span className="font-display text-[11px] font-semibold tracking-[.18em] text-text-muted uppercase">
                    Nuværende klub
                  </span>
                  <input
                    value={club}
                    onChange={(e) => setClub(e.target.value)}
                    placeholder="B93"
                    className="bg-transparent text-[15px] text-text placeholder:text-text-dim focus:outline-none"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1.5 border border-border bg-surface px-4 py-3">
                <span className="font-display text-[11px] font-semibold tracking-[.18em] text-text-muted uppercase">
                  Forælders email
                </span>
                <input
                  required
                  type="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="mette@eksempel.dk"
                  className="bg-transparent text-[15px] text-text placeholder:text-text-dim focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1.5 border border-border bg-surface px-4 py-3">
                <span className="font-display text-[11px] font-semibold tracking-[.18em] text-text-muted uppercase">
                  Forælders telefon
                </span>
                <input
                  type="tel"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="+45 20 12 34 56"
                  className="bg-transparent text-[15px] text-text placeholder:text-text-dim focus:outline-none"
                />
              </label>

              {step === "error" && (
                <p className="text-sm text-red-400">
                  Noget gik galt — prøv igen, eller skriv til kontakt@copenhagenacademy.dk.
                </p>
              )}

              <div className="mt-3 flex flex-col gap-3.5">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex h-[54px] items-center justify-center bg-accent font-display text-[17px] font-bold tracking-[.14em] text-canvas uppercase transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Sender…" : "Start ansøgning"}
                </button>
                <div className="text-center text-[13px] text-text-muted">
                  Allerede medlem?{" "}
                  <Link href="/login" className="font-semibold text-accent">
                    Log ind
                  </Link>
                </div>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex h-11 w-11 items-center justify-center bg-accent font-display text-xl font-extrabold text-canvas">
              CA.
            </div>
            <div className="font-display text-sm font-semibold tracking-[.3em] text-accent uppercase">
              Ansøgning modtaget
            </div>
            <h1 className="font-display text-[38px] font-extrabold uppercase leading-[1.02] text-text">
              Tak, {name.split(" ")[0] || "spiller"}. Vi vender tilbage inden for 3 hverdage.
            </h1>
            <p className="max-w-[32ch] text-sm leading-relaxed text-text-muted">
              Vi kontakter dig på {parentEmail || "din email"} for at booke en prøvetræning for{" "}
              {name || "spilleren"}
              {birthYear ? `, årgang ${birthYear}` : ""}.
            </p>
            <div className="text-center text-[13px] text-text-muted">
              Allerede medlem?{" "}
              <Link href="/login" className="font-semibold text-accent">
                Log ind
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
