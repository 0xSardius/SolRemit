/** The Onramp v1 API returns snake_case; our client wants camelCase. */

const toCamelCase = (str: string) =>
  str.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());

export function convertSnakeToCamelCase<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertSnakeToCamelCase(item)) as unknown as T;
  }
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj as Record<string, unknown>).reduce((acc, key) => {
      (acc as Record<string, unknown>)[toCamelCase(key)] = convertSnakeToCamelCase(
        (obj as Record<string, unknown>)[key],
      );
      return acc;
    }, {} as Record<string, unknown>) as T;
  }
  return obj;
}
