"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarIcon, HomeIcon, PaymentIcon, ProfileIcon } from "./icons";

const items = [
  { href: "/dashboard", label: "Hjem", Icon: HomeIcon },
  { href: "/calendar", label: "Kalender", Icon: CalendarIcon },
  { href: "/profile", label: "Profil", Icon: ProfileIcon },
  { href: "/payment", label: "Betaling", Icon: PaymentIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden sticky bottom-0 left-0 right-0 flex border-t border-border bg-base px-2.5 pt-3 pb-6">
      {items.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center gap-1"
          >
            <Icon color={active ? "var(--color-accent)" : "var(--color-text-muted)"} />
            <span
              className={
                "text-[10px] " +
                (active ? "font-semibold text-accent" : "text-text-muted")
              }
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
