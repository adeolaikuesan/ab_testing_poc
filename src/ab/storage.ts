const USER_ID_KEY = 'ab.userId';
const ENABLED_KEY = 'ab.enabled';
const FORCED_KEY = 'ab.forced';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode / storage full — the app still works, it just won't persist.
  }
}

/**
 * Stable per-browser id used as the assignment seed. In a real app this is
 * your logged-in user id or an existing anonymous analytics id — replace this
 * function rather than adding another id to the page.
 */
export function getUserId(): string {
  const existing = read<string | null>(USER_ID_KEY, null);
  if (existing) return existing;

  const userId = `anon-${Math.random().toString(36).slice(2, 10)}`;
  write(USER_ID_KEY, userId);
  return userId;
}

/** Demo-only overrides. Both are keyed by experiment name. */
export const loadEnabled = () => read<Record<string, boolean>>(ENABLED_KEY, {});
export const saveEnabled = (value: Record<string, boolean>) => write(ENABLED_KEY, value);

export const loadForced = () => read<Record<string, string | null>>(FORCED_KEY, {});
export const saveForced = (value: Record<string, string | null>) => write(FORCED_KEY, value);
