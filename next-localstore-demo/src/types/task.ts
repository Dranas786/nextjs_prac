// Union type of allowed priorities
export type Priority = "low" | "medium" | "high";

// Task type definition
export type Task = {
  id: string;
  title: string;
  notes?: string;
  done: boolean;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
};

// Helper constant (useful for rendering dropdowns)
export const PRIORITY_LEVELS: Priority[] = ["low", "medium", "high"];
