"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-11 w-11 items-center justify-center bg-accent font-display text-xl font-extrabold text-canvas">
            CA.
          </div>
          <h1 className="font-display text-2xl font-extrabold uppercase leading-none text-text">
            Log ind
          </h1>
          <p className="text-sm text-text-muted">Log ind for at se dit barns hold og betaling.</p>
        </div>

        <form action={formAction} className="flex flex-col gap-2.5">
          <label className="flex flex-col gap-1.5 border border-border bg-surface px-4 py-3">
            <span className="font-display text-[11px] font-semibold tracking-[.18em] text-text-muted uppercase">
              Email
            </span>
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              className="bg-transparent text-[15px] text-text placeholder:text-text-dim focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5 border border-border bg-surface px-4 py-3">
            <span className="font-display text-[11px] font-semibold tracking-[.18em] text-text-muted uppercase">
              Kodeord
            </span>
            <input
              required
              type="password"
              name="password"
              autoComplete="current-password"
              className="bg-transparent text-[15px] text-text placeholder:text-text-dim focus:outline-none"
            />
          </label>

          {state.error && <p className="text-sm text-red-400">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 flex h-[54px] items-center justify-center bg-accent font-display text-[15px] font-bold tracking-[.14em] text-canvas uppercase transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Logger ind…" : "Log ind"}
          </button>
        </form>

        <p className="text-center text-xs text-text-dim">
          Har du glemt dit kodeord, eller mangler du en konto?{" "}
          <Link href="mailto:kontakt@copenhagenacademy.dk" className="text-accent">
            Kontakt os
          </Link>
          .
        </p>

        <p className="text-center text-xs text-text-dim">
          Ny hos Copenhagen Academy?{" "}
          <Link href="/" className="text-accent">
            Ansøg om en plads
          </Link>
        </p>
      </div>
    </div>
  );
}
