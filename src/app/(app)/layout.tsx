"use client";

import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { useAppData } from "@/lib/store";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { loading, selectedChild } = useAppData();

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col">
      <AppHeader />
      <main className="flex-1">
        {loading ? (
          <p className="p-8 text-sm text-text-muted">Indlæser…</p>
        ) : !selectedChild.id ? (
          <p className="p-8 text-sm text-text-muted">
            Ingen børn er tilknyttet din konto endnu. Kontakt Copenhagen Academy, hvis det ikke
            stemmer.
          </p>
        ) : (
          children
        )}
      </main>
      <BottomNav />
    </div>
  );
}
