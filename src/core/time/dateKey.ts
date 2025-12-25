export function getLocalDateKey(d = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Decide what counts as today for routines
 * such as if dayBoundaryHour = 4, then 2am is correlated to the previous day
 */
export function getRoutineDateKey(dayBoundaryHour: number, d = new Date()): string {
  const shifted = new Date(d);
  if (shifted.getHours() < dayBoundaryHour) {
    shifted.setDate(shifted.getDate() - 1);
  }
  return getLocalDateKey(shifted);
}
