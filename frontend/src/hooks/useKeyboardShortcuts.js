import { useEffect, useState } from "react";

export function useKeyboardShortcuts({ onFocusMain, enabled = true }) {
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;

    const isTypingTarget = (target) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target.isContentEditable
      );
    };

    const onKeyDown = (event) => {
      if (isTypingTarget(event.target)) return;

      if (event.key === "?" && !event.altKey && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        setHelpOpen((open) => !open);
        return;
      }

      if (event.key === "Escape") {
        setHelpOpen(false);
        return;
      }

      if (event.altKey && event.key === "1") {
        event.preventDefault();
        onFocusMain?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, onFocusMain]);

  return { helpOpen, setHelpOpen };
}
