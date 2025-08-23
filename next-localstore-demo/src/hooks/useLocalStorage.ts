"use client";

import { useState, useEffect, useCallback } from "react";
import { getItem, setItem, removeItem, safeParseJson } from "@/lib/storage";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [
  value: T,
  setValue: (next: T | ((curr: T) => T)) => void,
  clear: () => void
] {
  const [value, setValueState] = useState<T>(
    () => getItem<T>(key, initialValue) // as getItem already checks for window
  );

  const setValue = useCallback(
    (next: T | ((curr: T) => T)) => {
      setValueState((curr) => {
        const nextValue =
          typeof next === "function" ? (next as (c: T) => T)(curr) : next;
        // (next as (c: T) => T)(curr) is next(curr) but also asserts next as a function
        setItem<T>(key, nextValue);
        return nextValue;
      });
    },
    [key]
  );

  const clear = useCallback(() => {
    removeItem(key);
    setValueState(initialValue);
  }, [key, initialValue]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      if (e.newValue === null) {
        setValueState(initialValue);
        return;
      }
      const parsed = safeParseJson<T>(e.newValue);
      if (parsed.ok) setValueState(parsed.value);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key, initialValue]);

  return [value, setValue, clear];
}
