export function read(key: string, fallback: unknown): unknown {
  try { return JSON.parse(localStorage.getItem("atlas." + key) ?? "null") ?? fallback; }
  catch { return fallback; }
}
export function save(key: string, value: unknown) {
  try { localStorage.setItem("atlas." + key, JSON.stringify(value)); } catch {}
}
export function savedPosition(stepCounts: number[]): [number, number] {
  const stored = read("position", []);
  if (!Array.isArray(stored)) return [0, 0];
  const [lesson, step] = stored;
  if (!Number.isInteger(lesson) || lesson < 0 || lesson >= stepCounts.length) return [0, 0];
  return [lesson, Number.isInteger(step) && step >= 0 && step < stepCounts[lesson] ? step : 0];
}
