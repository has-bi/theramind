// utils/dateTime.js

// The UTC+7 timezone offset in milliseconds
export const UTC7_OFFSET = 7 * 60 * 60 * 1000; // 7 hours in milliseconds

/**
 * Converts a date to UTC+7 timezone
 * @param {Date} date - The date to convert
 * @returns {Date} - The date in UTC+7 timezone
 */
export function convertToUTC7(date) {
  return new Date(date.getTime() + UTC7_OFFSET);
}

/**
 * Gets the start of day in UTC+7 timezone, then converts back to UTC for database queries
 * @param {Date} date - The date to get the start of day for
 * @returns {Date} - The start of day in UTC
 */
export function getUTC7StartOfDay(date) {
  // Convert to UTC+7
  const utc7Date = convertToUTC7(date);

  // Get start of day in UTC+7
  const startOfDay = new Date(utc7Date);
  startOfDay.setHours(0, 0, 0, 0);

  // Convert back to UTC for database operations
  return new Date(startOfDay.getTime() - UTC7_OFFSET);
}

/**
 * Gets the end of day in UTC+7 timezone, then converts back to UTC for database queries
 * @param {Date} date - The date to get the end of day for
 * @returns {Date} - The end of day in UTC
 */
export function getUTC7EndOfDay(date) {
  // Convert to UTC+7
  const utc7Date = convertToUTC7(date);

  // Get end of day in UTC+7
  const endOfDay = new Date(utc7Date);
  endOfDay.setHours(23, 59, 59, 999);

  // Convert back to UTC for database operations
  return new Date(endOfDay.getTime() - UTC7_OFFSET);
}

/**
 * Formats a date to a friendly date string in UTC+7 timezone
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted date string like "March 14, 2025"
 */
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

/**
 * Formats a date to a time string in UTC+7 timezone
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted time string like "2:30 PM"
 */
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
