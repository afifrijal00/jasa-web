export function Star({ className = "", fill = "#FF7A66" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 1 C13 8 16 11 23 12 C16 13 13 16 12 23 C11 16 8 13 1 12 C8 11 11 8 12 1Z"
        fill={fill}
        stroke="#1E1B3A"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Squiggle({ className = "", color = "#FF7A66" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 120 16" className={className} aria-hidden="true">
      <path
        d="M2 8 Q12 -2 22 8 T42 8 T62 8 T82 8 T102 8 T118 8"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}