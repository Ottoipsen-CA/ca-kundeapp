import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <BottomNav />
    </div>
  );
}
