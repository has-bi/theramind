// utils/serialization.js

export function serializeBigInt(data) {
  if (data === null || data === undefined) {
    return data;
  }

  // First convert to JSON to handle BigInt
  const jsonString = JSON.stringify(data, (key, value) =>
    typeof value === "bigint" ? Number(value) : value
  );

  // Then parse back, but convert date strings back to Date objects
  return JSON.parse(jsonString, (key, value) => {
    // Check if the value is a string and looks like an ISO date
    if (
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z$/.test(value)
    ) {
      return new Date(value);
    }
    return value;
  });
}

export async function safeDbQuery(queryFn) {
  try {
    const result = await queryFn();
    return serializeBigInt(result);
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}
