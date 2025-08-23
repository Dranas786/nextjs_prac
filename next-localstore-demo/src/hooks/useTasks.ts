"use client";

import { useMemo, useState, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "@/lib/schema";
import type { Task, Priority } from "@/types/task";

type Filter = "all" | "active" | "completed";
type PriorityFilter = "all" | Priority;

export function useTasks() {
  const [tasks, setTasks, clearTasks] = useLocalStorage<Task[]>(
    LOCAL_STORAGE_KEYS.tasks,
    []
  );

  const [filter, setFilter] = useState<Filter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [search, setSearch] = useState<string>("");

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.done).length;
    const active = total - completed;
    return { total, active, completed };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let list = tasks;

    if (filter === "active") list = list.filter((t) => !t.done);
    else if (filter === "completed") list = list.filter((t) => t.done);

    if (priorityFilter !== "all") {
      list = list.filter((t) => t.priority === priorityFilter);
    }

    const q = search.trim().toLowerCase();
    if (q.length > 0) {
      list = list.filter((t) => {
        const inTitle = t.title.toLowerCase().includes(q);
        const inNotes = (t.notes ?? "").toLowerCase().includes(q);
        return inTitle || inNotes;
      });
    }

    return list;
  }, [tasks, filter, priorityFilter, search]);

  const addTask = useCallback(
    (draft: { title: string; notes?: string; priority?: Priority }) => {
      const title = draft.title.trim();
      if (!title) {
        return { ok: false as const, message: "Title cannot be empty." };
      }

      const priority: Priority =
        draft.priority === "low" ||
        draft.priority === "medium" ||
        draft.priority === "high"
          ? draft.priority
          : "low";

      const now = new Date().toISOString();
      const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        notes: draft.notes?.trim() ? draft.notes.trim() : undefined,
        done: false,
        priority,
        createdAt: now,
        updatedAt: now,
      };

      setTasks((prev) => [...prev, newTask]);
      return { ok: true as const };
    },
    [setTasks]
  );

  const toggleDone = useCallback(
    (id: string) => {
      const now = new Date().toISOString();
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, done: !t.done, updatedAt: now } : t
        )
      );
    },
    [setTasks]
  );

  const updateTask = useCallback(
    (
      id: string,
      patch: Partial<Pick<Task, "title" | "notes" | "priority">>
    ) => {
      if (patch.title !== undefined && !patch.title.trim()) {
        return { ok: false as const, message: "Title cannot be empty." };
      }
      if (
        patch.priority !== undefined &&
        patch.priority !== "low" &&
        patch.priority !== "medium" &&
        patch.priority !== "high"
      ) {
        return { ok: false as const, message: "Invalid priority." };
      }

      let found = false;
      const now = new Date().toISOString();
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          found = true;
          return {
            ...t,
            title: patch.title !== undefined ? patch.title.trim() : t.title,
            notes:
              patch.notes !== undefined
                ? patch.notes.trim() || undefined
                : t.notes,
            priority:
              patch.priority !== undefined ? patch.priority : t.priority,
            updatedAt: now,
          };
        })
      );

      if (!found) return { ok: false as const, message: "Task not found." };
      return { ok: true as const };
    },
    [setTasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    },
    [setTasks]
  );

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.done));
  }, [setTasks]);

  const replaceAll = useCallback(
    (next: Task[]) => {
      setTasks(next);
    },
    [setTasks]
  );

  return {
    tasks,
    filteredTasks,
    stats,

    filter,
    setFilter,
    priorityFilter,
    setPriorityFilter,
    search,
    setSearch,

    addTask,
    toggleDone,
    updateTask,
    deleteTask,
    clearCompleted,
    replaceAll,

    clearTasks,
  };
}
