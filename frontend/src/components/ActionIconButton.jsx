import Tooltip from "./Tooltip";

const tones = {
  edit: "bg-blue-600 hover:bg-blue-700 text-white",
  delete: "bg-red-600 hover:bg-red-700 text-white",
  deactivate: "bg-amber-500 hover:bg-amber-600 text-white",
  activate: "bg-emerald-600 hover:bg-emerald-700 text-white",
  neutral: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
};

function IconEdit({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function IconTrash({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function IconBan({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  );
}

function IconCheck({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

const icons = {
  edit: IconEdit,
  delete: IconTrash,
  deactivate: IconBan,
  activate: IconCheck,
};

export default function ActionIconButton({
  variant = "edit",
  label,
  onClick,
  disabled = false,
  className = "",
  type = "button",
}) {
  const Icon = icons[variant] || IconEdit;
  const tone = tones[variant] || tones.edit;

  return (
    <Tooltip label={label}>
      <button
        type={type}
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition disabled:cursor-not-allowed disabled:opacity-40 ${tone} ${className}`}
      >
        <Icon />
      </button>
    </Tooltip>
  );
}

export function IconBack({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}
