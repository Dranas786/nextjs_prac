function isBrowser(): boolean {
  return typeof window !== "undefined";
}
// do not need to check if window.localstorage exists as it does for almost all cases

export function safeParseJson<T>(
  raw: string | null
): { ok: true; value: T } | { ok: false; error: Error } {
  if (raw === null) {
    return { ok: false, error: new Error("No value") };
  }

  try {
    return { ok: true, value: JSON.parse(raw) as T };
  } catch (err) {
    return { ok: false, error: err as Error };
  }
}

export function getItem<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    const parsed = safeParseJson<T>(raw);
    return parsed.ok ? parsed.value : fallback;
  } catch {
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // Likely QuotaExceededError or serialization issue — ignore or surface a toast later
  }
}

export function removeItem(key: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

// TODO: withVersioning
/*
Inputs: key, read, write

Returns { read(): T, write(value: T): void }

read():
read stored version (from LOCAL_STORAGE_KEYS.version)
if missing → treat as current version, return read()
if < SCHEMA_VERSION → read raw value for key, call migrate(raw, fromVersion, SCHEMA_VERSION), save migrated result and bump stored version, return migrated

write(value):
call write(value) and set stored version to SCHEMA_VERSION
 */
