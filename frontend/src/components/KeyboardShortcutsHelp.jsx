export default function KeyboardShortcutsHelp({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
        className="max-w-md rounded-xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="shortcuts-title" className="text-lg font-bold text-[var(--color-text)]">
          Atajos de teclado
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-[var(--color-text-muted)]">
          <li>
            <kbd className="rounded border px-1.5 py-0.5">?</kbd> Mostrar u ocultar esta ayuda
          </li>
          <li>
            <kbd className="rounded border px-1.5 py-0.5">Alt</kbd> +{" "}
            <kbd className="rounded border px-1.5 py-0.5">1</kbd> Ir al contenido principal
          </li>
          <li>
            <kbd className="rounded border px-1.5 py-0.5">Esc</kbd> Cerrar este dialogo
          </li>
        </ul>
        <button
          type="button"
          className="mt-6 w-full rounded-lg bg-[var(--color-primary)] py-2 font-medium text-white hover:opacity-90"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
