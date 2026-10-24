/** Tooltip accesible al hover/focus (usar en botones e iconos). */
export default function Tooltip({ label, children, placement = "top" }) {
  const pos =
    placement === "bottom"
      ? "top-full mt-2 left-1/2 -translate-x-1/2"
      : "bottom-full mb-2 left-1/2 -translate-x-1/2";

  return (
    <span className="group/tip relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-50 ${pos} whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/tip:opacity-100 group-focus-within/tip:opacity-100`}
      >
        {label}
      </span>
    </span>
  );
}
