export function HomeIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7">
      <path d="M4 11 12 4l8 7v9H4z" />
    </svg>
  );
}

export function CalendarIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7">
      <rect x="3" y="5" width="18" height="16" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="2.5" x2="8" y2="7" />
      <line x1="16" y1="2.5" x2="16" y2="7" />
    </svg>
  );
}

export function ProfileIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 5-5 8-5s6.5 1 8 5" />
    </svg>
  );
}

export function PaymentIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7">
      <rect x="3" y="6" width="18" height="13" />
      <line x1="3" y1="11" x2="21" y2="11" />
    </svg>
  );
}

export function CheckIcon({ color = "currentColor", size = 14 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2">
      <polyline points="4 12.5 10 18 20 6" />
    </svg>
  );
}

export function BellIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}
