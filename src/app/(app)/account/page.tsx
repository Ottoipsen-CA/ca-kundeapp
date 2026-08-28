"use client";

import { useActionState } from "react";
import { changePassword, type ChangePasswordState } from "./actions";

const initialState: ChangePasswordState = { error: null, success: false };

export default function AccountPage() {
  const [state, formAction, pending] = useActionState(changePassword, initialState);

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-5 py-10">
      <h1 className="font-display text-2xl font-extrabold uppercase leading-none text-text">
        Skift kodeord
      </h1>

      <form action={formAction} className="flex flex-col gap-2.5">
        <label className="flex flex-col gap-1.5 border border-border bg-surface px-4 py-3">
          <span className="font-display text-[11px] font-semibold tracking-[.18em] text-text-muted uppercase">
            Nyt kodeord
          </span>
          <input
            required
            type="password"
            name="password"
            minLength={8}
            autoComplete="new-password"
            className="bg-transparent text-[15px] text-text placeholder:text-text-dim focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5 border border-border bg-surface px-4 py-3">
          <span className="font-display text-[11px] font-semibold tracking-[.18em] text-text-muted uppercase">
            Gentag kodeord
          </span>
          <input
            required
            type="password"
            name="confirm"
            minLength={8}
            autoComplete="new-password"
            className="bg-transparent text-[15px] text-text placeholder:text-text-dim focus:outline-none"
          />
        </label>

        {state.error && <p className="text-sm text-red-400">{state.error}</p>}
        {state.success && <p className="text-sm text-accent">Kodeord opdateret.</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 flex h-[50px] items-center justify-center bg-accent font-display text-sm font-bold tracking-[.14em] text-canvas uppercase transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Gemmer…" : "Gem nyt kodeord"}
        </button>
      </form>
    </div>
  );
}
