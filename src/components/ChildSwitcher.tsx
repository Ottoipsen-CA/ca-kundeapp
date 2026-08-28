"use client";

import { useAppData } from "@/lib/store";

export function ChildSwitcher() {
  const { children, selectedChildId, selectChild } = useAppData();

  return (
    <div className="flex gap-2">
      {children.map((child) => {
        const active = child.id === selectedChildId;
        return (
          <button
            key={child.id}
            onClick={() => selectChild(child.id)}
            className={
              "px-3.5 py-2 font-display font-bold text-sm tracking-wide transition-colors " +
              (active
                ? "bg-accent text-canvas"
                : "border border-border-strong text-text-muted hover:text-text hover:border-text-muted")
            }
          >
            {child.name.split(" ")[0].toUpperCase()} · {child.ageGroup}
          </button>
        );
      })}
    </div>
  );
}
