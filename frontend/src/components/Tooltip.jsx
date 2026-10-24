/** Tooltip accesible al hover/focus (usar en botones e iconos). */
export default function Tooltip({ label, children, placement = "top" }) {
  const pos =
    placement === "bottom"
      ? "top-full mt-2 left-1/2 -translate-x-1/2"
      : "bottom-full mb-2 left-1/2 -translate-x-1/2";

  return (
    <span className="group/tip relative inline-flex max-w-full align-middle">
      {children}
      <span
        role="tooltip"
        aria-hidden="true"
        className={`pointer-events-none absolute z-50 ${pos} hidden whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white shadow-lg group-hover/tip:inline-block group-focus-within/tip:inline-block`}
      >
        {label}
      </span>
    </span>
  );
}
