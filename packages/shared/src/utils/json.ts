export function safeJsonParse<T>(value: string): T {
  return JSON.parse(value) as T;
}

export function safeJsonStringify(value: unknown): string {
  return JSON.stringify(value);
}