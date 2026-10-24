import { useEffect } from "react";

export default function ConfirmDialog({
  open,
  title = "Confirmar",
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm animate-fade-in"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-dialog-title" className="text-lg font-semibold text-[var(--color-text)]">
          {title}
        </h2>
        {message ? (
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{message}</p>
        ) : null}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button type="button" className="btn-secondary min-h-[2.75rem] min-w-[7rem] py-2.5" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`min-h-[2.75rem] min-w-[7rem] rounded-lg px-5 py-2.5 text-sm font-semibold text-white ${
              destructive ? "bg-red-700 hover:bg-red-800" : "btn-primary"
            }`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
