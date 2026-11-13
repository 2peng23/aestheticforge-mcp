const secretKey =
  /^(?:password|passwd|secret|token|access[_-]?token|refresh[_-]?token|api[_-]?key|authorization|cookie|set-cookie)$/i;
export function redact(value: string): string {
  return value
    .replace(/\bBearer\s+[a-z0-9._~+/-]+/gi, "Bearer [REDACTED]")
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[EMAIL REDACTED]")
    .replace(
      /(?:sk-[a-z0-9_-]{12,}|(?:api[_-]?key|secret|password|token)\s*[=:]\s*["']?[^\s"';,]{4,})/gi,
      "[REDACTED]",
    )
    .replace(/https?:\/\/[^\s"<>\\]+/g, (raw) => {
      try {
        const url = new URL(raw);
        url.username = "";
        url.password = "";
        if (url.search) url.search = "?redacted";
        url.hash = "";
        return url.href;
      } catch {
        return raw;
      }
    });
}
export function sanitize(value: unknown): any {
  if (typeof value === "string")
    return value.startsWith("data:image/")
      ? "[IMAGE DATA OMITTED]"
      : redact(value);
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== "html" && key !== "snippet")
        .map(([key, entry]) => [
          key,
          secretKey.test(key) ? "[REDACTED]" : sanitize(entry),
        ]),
    );
  return value;
}
