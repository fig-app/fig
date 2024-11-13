/**
 * Generate a small id.
 */
export function useId(): string {
  return crypto.randomUUID().split("-")[0];
}

/**
 * Generate an id.
 */
export function useLongId(): string {
  return crypto.randomUUID();
}
