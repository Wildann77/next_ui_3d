interface GridCrosshairProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
  size?: number;
}

export function GridCrosshair({
  position = "top-left",
  className = "",
  size = 9,
}: GridCrosshairProps) {
  const positionClasses = {
    "top-left": "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
    "top-right": "top-0 right-0 translate-x-1/2 -translate-y-1/2",
    "bottom-left": "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
    "bottom-right": "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
  };

  return (
    <span
      aria-hidden="true"
      className={`absolute z-20 pointer-events-none select-none flex items-center justify-center transition-transform duration-300 ease-[var(--ease-brutalist)] group-hover:rotate-90 text-[var(--color-editorial-bone)]/40 ${positionClasses[position]} ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 9 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <line x1="4.5" y1="0" x2="4.5" y2="9" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="4.5" x2="9" y2="4.5" stroke="currentColor" strokeWidth="1" />
      </svg>
    </span>
  );
}

export default GridCrosshair;
