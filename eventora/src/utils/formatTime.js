export function formatTimeLabel(value) {
  if (value == null) return value;
  const raw = String(value).trim();
  if (!raw) return raw;

  const normalized = raw.replace(/\s+/g, " ");
  const explicitMatch = normalized.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
  if (explicitMatch) {
    let hours = Number(explicitMatch[1]);
    const minutes = explicitMatch[2] || "00";
    return `${hours}:${minutes} ${explicitMatch[3].toLowerCase()}`;
  }

  const numericMatch = normalized.match(/^(\d{1,2})(?::(\d{2}))?$/);
  if (!numericMatch) return normalized;

  let hours = Number(numericMatch[1]);
  const minutes = numericMatch[2] || "00";
  const suffix = hours >= 12 ? "pm" : "am";

  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
  }

  return `${hours}:${minutes} ${suffix}`;
}
