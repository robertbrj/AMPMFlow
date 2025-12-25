import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { loadOrInitCompletion, loadOrInitRoutines, loadOrInitSettings } from "../storage/bootstrap";
import { saveJson } from "../storage/jsonStorage";
import { STORAGE_KEYS } from "../storage/keys";
import type { CompletionV1, RoutinesV1, RoutineType, SettingsV1, Task } from "../types/routine";

type AppState = {
  hydrated: boolean;
  routines: RoutinesV1 | null;
  completion: CompletionV1 | null;
  settings: SettingsV1 | null;

  hydrate: () => Promise<void>;

  toggleTaskComplete: (dateKey: string, type: RoutineType, taskId: string) => void;
  setSameEveryDay: (type: RoutineType, value: boolean) => void;

  addTaskToDefault: (type: RoutineType, title: string) => void;
  // TO DO: addTaskToOverride(type, day, title), resetOverride(type, day), etc.
};

export const useAppStore = create<AppState>((set, get) => ({
  hydrated: false,
  routines: null,
  completion: null,
  settings: null,

  hydrate: async () => {
    const [routines, completion, settings] = await Promise.all([
      loadOrInitRoutines(),
      loadOrInitCompletion(),
      loadOrInitSettings(),
    ]);

    set({ routines, completion, settings, hydrated: true });
  },

  toggleTaskComplete: (dateKey, type, taskId) => {
    const { completion } = get();
    if (!completion) return;

    const dayEntry = completion.byDate[dateKey] ?? { AM: [], PM: [] };
    const arr = dayEntry[type];
    const exists = arr.includes(taskId);
    const nextArr = exists ? arr.filter(id => id !== taskId) : [...arr, taskId];

    const next: CompletionV1 = {
      ...completion,
      byDate: {
        ...completion.byDate,
        [dateKey]: { ...dayEntry, [type]: nextArr },
      },
    };

    set({ completion: next });
    void saveJson(STORAGE_KEYS.completion, next);
  },

  setSameEveryDay: (type, value) => {
    const { settings } = get();
    if (!settings) return;
    const next: SettingsV1 = {
      ...settings,
      sameEveryDay: { ...settings.sameEveryDay, [type]: value },
    };
    set({ settings: next });
    void saveJson(STORAGE_KEYS.settings, next);
  },

  addTaskToDefault: (type, title) => {
    const { routines } = get();
    if (!routines) return;

    const list = routines.defaults[type];
    const maxOrder = list.reduce((m, t) => Math.max(m, t.order), -1);

    const newTask: Task = {
      id: uuidv4(),
      title,
      order: maxOrder + 1,
      enabled: true,
    };

    const next: RoutinesV1 = {
      ...routines,
      defaults: { ...routines.defaults, [type]: [...list, newTask] },
    };

    set({ routines: next });
    void saveJson(STORAGE_KEYS.routines, next);
  },
}));
