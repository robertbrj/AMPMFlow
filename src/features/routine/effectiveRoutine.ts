import type { Day, RoutineType, RoutinesV1, Task } from "../../core/types/routine";

export function getEffectiveTasks(
  routines: RoutinesV1,
  type: RoutineType,
  day: Day
): Task[] {
  const override = routines.overrides[type][day];
  const list = override ?? routines.defaults[type];
  return list
    .filter(t => t.enabled)
    .slice()
    .sort((a, b) => a.order - b.order);
}
