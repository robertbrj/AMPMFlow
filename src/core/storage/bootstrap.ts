import { v4 as uuidv4 } from "uuid";
import type { CompletionV1, RoutinesV1, SettingsV1, Task } from "../types/routine";
import { loadJson, saveJson } from "./jsonStorage";
import { STORAGE_KEYS } from "./keys";

function makeTask(title: string, order: number): Task {
  return { id: uuidv4(), title, order, enabled: true };
}

export async function loadOrInitRoutines(): Promise<RoutinesV1> {
  const existing = await loadJson<RoutinesV1>(STORAGE_KEYS.routines);
  if (existing?.version === 1) return existing;

  const routines: RoutinesV1 = {
    version: 1,
    defaults: {
      AM: [makeTask("Drink water", 0), makeTask("Brush teeth", 1)],
      PM: [makeTask("Plan tomorrow", 0), makeTask("Skincare", 1)],
    },
    overrides: { AM: {}, PM: {} },
  };

  await saveJson(STORAGE_KEYS.routines, routines);
  return routines;
}

export async function loadOrInitCompletion(): Promise<CompletionV1> {
  const existing = await loadJson<CompletionV1>(STORAGE_KEYS.completion);
  if (existing?.version === 1) return existing;

  const completion: CompletionV1 = { version: 1, byDate: {} };
  await saveJson(STORAGE_KEYS.completion, completion);
  return completion;
}

export async function loadOrInitSettings(): Promise<SettingsV1> {
  const existing = await loadJson<SettingsV1>(STORAGE_KEYS.settings);
  if (existing?.version === 1) return existing;

  const settings: SettingsV1 = {
    version: 1,
    sameEveryDay: { AM: true, PM: true },
    dayBoundaryHour: 4,
  };

  await saveJson(STORAGE_KEYS.settings, settings);
  return settings;
}
