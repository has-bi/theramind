// utils/dateTime.js

// The UTC+7 timezone offset in milliseconds
export const UTC7_OFFSET = 7 * 60 * 60 * 1000; // 7 hours in milliseconds

export function convertToUTC7(date) {
  return new Date(date.getTime() + UTC7_OFFSET);
}

export function getUTC7StartOfDay(date) {
  // Convert to UTC+7
  const utc7Date = convertToUTC7(date); // Now in UTC+7

  // Get start of day in UTC+7
  const startOfDay = new Date(utc7Date);
  startOfDay.setHours(0, 0, 0, 0); // Set to 00:00:00 in UTC+7

  // Convert back to UTC for database operations
  return new Date(startOfDay.getTime() - UTC7_OFFSET); // Back to UTC
}

export function getUTC7EndOfDay(date) {
  // Convert to UTC+7
  const utc7Date = convertToUTC7(date);

  // Get end of day in UTC+7
  const endOfDay = new Date(utc7Date);
  endOfDay.setHours(23, 59, 59, 999);

  // Convert back to UTC for database operations
  return new Date(endOfDay.getTime() - UTC7_OFFSET);
}

export function formatUTC7Date(date) {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  const utc7Date = convertToUTC7(dateObj);

  return utc7Date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatUTC7Time(date) {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  const utc7Date = convertToUTC7(dateObj);

  return utc7Date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
