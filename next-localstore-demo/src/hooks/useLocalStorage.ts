"use client";

import { useState, useEffect, useCallback } from "react";
// You wrote these in lib/storage.ts
import { getItem, setItem, removeItem, safeParseJson } from "@/lib/storage";

/**
 * useLocalStorage
 * Keeps a state value in sync with localStorage.
 *
 * API:
 *   const [value, setValue, clear] = useLocalStorage<T>(key, initialValue)
 *
 * - Reads initial value from localStorage on mount (SSR-safe)
 * - Writes through to localStorage when value changes via setValue
 * - Listens to 'storage' events to sync across tabs
 * - clear() removes key from localStorage and resets to initialValue
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [
  value: T,
  setValue: (next: T | ((curr: T) => T)) => void,
  clear: () => void
] {
  // 1) State init (SSR-safe): use a lazy initializer
  const [value, setValueState] = useState<T>(() => {
    // TODO: If not in browser, return initialValue.
    // TODO: Otherwise, return getItem<T>(key, initialValue).
    return initialValue; // placeholder
  });

  // 2) Setter: supports direct value or updater function
  const setValue = useCallback(
    (next: T | ((curr: T) => T)) => {
      // TODO: Compute nextValue (if function, call with current state)
      // TODO: setValueState(nextValue)
      // TODO: setItem<T>(key, nextValue)
    },
    [key]
  );

  // 3) Clear: remove from localStorage and reset state
  const clear = useCallback(() => {
    // TODO: removeItem(key)
    // TODO: setValueState(initialValue)
  }, [key, initialValue]);

  // 4) Cross-tab sync: handle 'storage' events
  useEffect(() => {
    // Guard: only run in browser
    if (typeof window === "undefined") return;

    const onStorage = (e: StorageEvent) => {
      // TODO: ignore events for other keys
      // TODO: if e.newValue === null → setValueState(initialValue)
      // TODO: else parse e.newValue via safeParseJson<T>(e.newValue)
      //       - if ok → setValueState(parsed.value)
      //       - if not ok → ignore (keep current state)
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key, initialValue]);

  // 5) Return API
  return [value, setValue, clear];
}
