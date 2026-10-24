export function LoadingState({ message = "Cargando..." }) {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center py-16"
      role="status"
      aria-live="polite"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
      <p className="mt-4 text-[var(--color-text-muted)]">{message}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="mx-auto max-w-lg flex-1 px-4 py-12 text-center" role="alert">
      <h2 className="text-xl font-semibold text-[var(--color-danger)]">
        No se pudo completar la operacion
      </h2>
      <p className="mt-3 text-[var(--color-text-muted)]">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-white hover:opacity-90"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message = "No hay datos para mostrar." }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-12 text-[var(--color-text-muted)]">
      <p>{message}</p>
    </div>
  );
}

export function PageShell({ loading, error, onRetry, loadingMessage, children }) {
  if (loading) {
    return <LoadingState message={loadingMessage} />;
  }
  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }
  return children;
}
