export type RoutineType = "AM" | "PM";
export type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Task = {
  id: string;
  title: string;
  order: number;
  enabled: boolean;
};

export type RoutinesV1 = {
  version: 1;
  defaults: Record<RoutineType, Task[]>;
  overrides: Record<RoutineType, Partial<Record<Day, Task[]>>>;
};

export type DateKey = string; // FORMAT: "YYYY-MM-DD"

export type CompletionV1 = {
  version: 1;
  byDate: Record<
    DateKey,
    Record<RoutineType, string[]> // completed tasks (ids)
  >;
};

export type SettingsV1 = {
  version: 1;
  sameEveryDay: Record<RoutineType, boolean>; // by default true for both
  dayBoundaryHour: number;
};
