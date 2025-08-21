export const SCHEMA_VERSION = 1;

export const LOCAL_STORAGE_KEYS = {
  tasks: "nlstore:tasks",
  theme: "nlstore:theme",
  version: "nlstore:version",
};

export function getSchemaVersion(): number {
  return SCHEMA_VERSION;
}

// TODO: Add migration logic when SCHEMA_VERSION changes
export function migrate(
  old_value: unknown,
  fromVersion: number,
  toVersion: number
): unknown {
  // no migrations yet, just return the value unchanged
  return old_value;
}
