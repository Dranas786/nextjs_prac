Next JS Practise 1

src
├─ app
│ ├─ layout.tsx
│ ├─ page.tsx // Home: task list
│ ├─ settings
│ │ └─ page.tsx // Settings screen
│ └─ not-found.tsx
├─ components
│ ├─ Header.tsx
│ ├─ TaskForm.tsx
│ ├─ TaskList.tsx
│ ├─ TaskItem.tsx
│ ├─ FiltersBar.tsx
│ ├─ ThemeToggle.tsx
│ └─ Toast.tsx
├─ hooks
│ ├─ useLocalStorage.ts
│ ├─ useTasks.ts
│ ├─ useDebouncedValue.ts
│ └─ useTheme.ts
├─ lib
│ ├─ storage.ts
│ ├─ schema.ts
│ ├─ validators.ts
│ └─ exportImport.ts
├─ styles
│ └─ globals.css
└─ types
│ │─ task.ts
