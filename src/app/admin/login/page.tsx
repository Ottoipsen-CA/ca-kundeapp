"use client";

import { useActionState } from "react";
import { adminLogin, type AdminLoginState } from "./actions";

const initialState: AdminLoginState = { error: null };

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLogin, initialState);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 py-16">
      <form action={formAction} className="flex w-full max-w-xs flex-col gap-3">
        <h1 className="font-display mb-2 text-xl font-extrabold uppercase text-text">
          Admin
        </h1>
        <label className="flex flex-col gap-1.5 border border-border bg-surface px-4 py-3">
          <span className="font-display text-[11px] font-semibold tracking-[.18em] text-text-muted uppercase">
            Adgangskode
          </span>
          <input
            required
            type="password"
            name="password"
            autoFocus
            className="bg-transparent text-[15px] text-text focus:outline-none"
          />
        </label>
        {state.error && <p className="text-sm text-red-400">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="mt-1 flex h-[46px] items-center justify-center bg-accent font-display text-sm font-bold tracking-[.12em] text-canvas uppercase disabled:opacity-50"
        >
          {pending ? "Logger ind…" : "Log ind"}
        </button>
      </form>
    </div>
  );
}
