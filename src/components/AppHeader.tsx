"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChildSwitcher } from "./ChildSwitcher";
import { BellIcon, CalendarIcon, HomeIcon, PaymentIcon, ProfileIcon } from "./icons";

const navItems = [
  { href: "/dashboard", label: "Hjem", Icon: HomeIcon },
  { href: "/calendar", label: "Kalender", Icon: CalendarIcon },
  { href: "/profile", label: "Profil", Icon: ProfileIcon },
  { href: "/payment", label: "Betaling", Icon: PaymentIcon },
] as const;

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4 md:px-8">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="flex h-9 w-9 items-center justify-center bg-accent font-display text-lg font-extrabold text-canvas"
        >
          CA.
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={
                  "flex items-center gap-2 px-3 py-2 font-display text-sm font-semibold tracking-wide transition-colors " +
                  (active ? "text-accent" : "text-text-muted hover:text-text")
                }
              >
                <Icon color={active ? "var(--color-accent)" : "currentColor"} />
                {label.toUpperCase()}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <ChildSwitcher />
        <div className="hidden h-9 w-9 items-center justify-center border border-border-strong md:flex">
          <BellIcon color="var(--color-text)" />
        </div>
      </div>
    </header>
  );
}
