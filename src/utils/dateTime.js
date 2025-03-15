// utils/dateTime.js

/**
 * Correctly converts a date to UTC+7 timezone
 * This is critical for Thailand/Jakarta local time
 */
export function convertToUTC7(date) {
  const inputDate = new Date(date);

  // Use the actual UTC methods to get the UTC components
  const utcYear = inputDate.getUTCFullYear();
  const utcMonth = inputDate.getUTCMonth();
  const utcDate = inputDate.getUTCDate();
  const utcHours = inputDate.getUTCHours();
  const utcMinutes = inputDate.getUTCMinutes();
  const utcSeconds = inputDate.getUTCSeconds();
  const utcMs = inputDate.getUTCMilliseconds();

  // Add 7 hours for UTC+7
  const utc7Hours = utcHours + 7;

  // Create a new UTC date with the adjusted hours
  // This correctly handles day boundary crossings
  return new Date(Date.UTC(utcYear, utcMonth, utcDate, utc7Hours, utcMinutes, utcSeconds, utcMs));
}

/**
 * Gets the start of day (00:00:00.000) in UTC+7 timezone, returned as UTC time
 */
export function getUTC7StartOfDay(date) {
  // First convert to UTC+7
  const utc7Date = convertToUTC7(date);

  // Get the date components in UTC+7
  const year = utc7Date.getUTCFullYear();
  const month = utc7Date.getUTCMonth();
  const day = utc7Date.getUTCDate();

  // Create midnight in UTC+7, then subtract 7 hours to get UTC time
  const startOfDayUTC7 = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
  return new Date(startOfDayUTC7.getTime() - 7 * 60 * 60 * 1000);
}

/**
 * Gets the end of day (23:59:59.999) in UTC+7 timezone, returned as UTC time
 */
export function getUTC7EndOfDay(date) {
  // First convert to UTC+7
  const utc7Date = convertToUTC7(date);

  // Get the date components in UTC+7
  const year = utc7Date.getUTCFullYear();
  const month = utc7Date.getUTCMonth();
  const day = utc7Date.getUTCDate();

  // Create 23:59:59.999 in UTC+7, then subtract 7 hours to get UTC time
  const endOfDayUTC7 = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
  return new Date(endOfDayUTC7.getTime() - 7 * 60 * 60 * 1000);
}

/**
 * Format a date in UTC+7 timezone with a nice human readable format
 */
export function formatUTC7Date(date) {
  const utc7Date = convertToUTC7(date);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC", // Use UTC and our manual adjustment instead of relying on browser timezone
  };

  return new Intl.DateTimeFormat("en-US", options).format(utc7Date);
}

/**
 * Format a time in UTC+7 timezone
 */
export function formatUTC7Time(date) {
  const utc7Date = convertToUTC7(date);
  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "UTC", // Use UTC and our manual adjustment
  };

  return new Intl.DateTimeFormat("en-US", options).format(utc7Date);
}

/**
 * Returns just the date (day of month) in UTC+7
 */
export function getCurrentUTC7Date() {
  const now = new Date();
  const utc7Date = convertToUTC7(now);
  return utc7Date.getUTCDate();
}

/**
 * Returns just the month (0-11) in UTC+7
 */
export function getCurrentUTC7Month() {
  const now = new Date();
  const utc7Date = convertToUTC7(now);
  return utc7Date.getUTCMonth();
}

/**
 * Returns just the year in UTC+7
 */
export function getCurrentUTC7Year() {
  const now = new Date();
  const utc7Date = convertToUTC7(now);
  return utc7Date.getUTCFullYear();
}

/**
 * Format a date to YYYY-MM-DD string in UTC+7 timezone
 * This is critical for correct date comparisons
 */
export function formatDateStringUTC7(date) {
  const utc7Date = convertToUTC7(date);
  const year = utc7Date.getUTCFullYear();
  const month = String(utc7Date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(utc7Date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Debug function to log timezone information
 */
export function debugTimezone(date, label = "Date") {
  const inputDate = new Date(date);
  const utc7Date = convertToUTC7(inputDate);

  console.log(`[TIMEZONE DEBUG] ${label}`);
  console.log(`  Original:     ${inputDate.toString()}`);
  console.log(`  ISO:          ${inputDate.toISOString()}`);
  console.log(`  UTC+7:        ${utc7Date.toUTCString()}`);
  console.log(
    `  UTC+7 Date:   ${utc7Date.getUTCFullYear()}-${
      utc7Date.getUTCMonth() + 1
    }-${utc7Date.getUTCDate()}`
  );
  console.log(
    `  UTC+7 Time:   ${utc7Date.getUTCHours()}:${utc7Date.getUTCMinutes()}:${utc7Date.getUTCSeconds()}`
  );
  console.log(`  Formatted:    ${formatDateStringUTC7(inputDate)}`);

  return { inputDate, utc7Date };
}
