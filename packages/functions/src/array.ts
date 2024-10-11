export function removeDuplicates<T>(array: T[]) {
  return Array.from(new Set(array));
}
