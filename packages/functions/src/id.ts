/**
 * Generate a small id.
 */
export function useId(): string {
  return crypto.randomUUID().split("-")[0];
}
