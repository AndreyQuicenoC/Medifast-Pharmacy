import { createContext, useCallback, useContext, useMemo, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [cfg, setCfg] = useState(null);

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setCfg({ ...options, resolve });
    });
  }, []);

  const close = (value) => {
    cfg?.resolve(value);
    setCfg(null);
  };

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      <ConfirmDialog
        open={!!cfg}
        title={cfg?.title}
        message={cfg?.message}
        confirmLabel={cfg?.confirmLabel}
        cancelLabel={cfg?.cancelLabel}
        destructive={cfg?.destructive}
        onConfirm={() => close(true)}
        onCancel={() => close(false)}
      />
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm debe usarse dentro de ConfirmProvider");
  return ctx.confirm;
}
