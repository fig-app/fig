export function removeDuplicates<T>(array: T[]) {
  return Array.from(new Set(array));
}

export function removeArrayOfTupleDuplicates(array: [number, number][]) {
  return Array.from(new Set(array.map((e) => JSON.stringify(e)))).map((e) =>
    JSON.parse(e),
  );
}
