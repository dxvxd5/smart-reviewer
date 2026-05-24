import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * When `active`, Tab/Shift+Tab cycle focus inside `ref`'s descendants.
 * On activation, focuses the first focusable. On deactivation, restores
 * focus to whatever had it before — important for screen-reader users
 * returning from a closed modal.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean): void {
  useEffect(() => {
    if (!active || !ref.current) return;
    const node = ref.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    // Only restore focus on cleanup if the opener was keyboard-focused; restoring
    // after a mouse opener would surface an unwanted focus ring (the Esc keystroke
    // flips :focus-visible's modality to keyboard before we re-focus).
    const shouldRestoreFocus = !!previouslyFocused?.matches?.(":focus-visible");

    const getFocusable = (): HTMLElement[] =>
      Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("hidden") && el.offsetParent !== null,
      );

    const first = getFocusable()[0];
    if (first) first.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = getFocusable();
      if (focusables.length === 0) return;
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    node.addEventListener("keydown", onKey);

    return () => {
      node.removeEventListener("keydown", onKey);
      if (
        shouldRestoreFocus &&
        previouslyFocused &&
        typeof previouslyFocused.focus === "function"
      ) {
        previouslyFocused.focus();
      }
    };
  }, [active, ref]);
}
