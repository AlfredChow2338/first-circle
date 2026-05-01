/** Maximum CSV file size (bytes) before reading into memory. */
export const CSV_MAX_FILE_BYTES = 10 * 1024 * 1024;

/** Maximum data rows (excluding header) after parse. */
export const CSV_MAX_DATA_ROWS = 10_000;

export const CSV_FILE_TOO_LARGE_MESSAGE = `CSV file is too large. Maximum size is ${CSV_MAX_FILE_BYTES / (1024 * 1024)} MB.`;

export const CSV_TOO_MANY_ROWS_MESSAGE = `CSV has too many rows. Maximum is ${CSV_MAX_DATA_ROWS.toLocaleString("en-US")} data rows (excluding the header).`;

export function assertCsvFileSizeAllowed(file: File): void {
  if (file.size > CSV_MAX_FILE_BYTES) {
    throw new Error(CSV_FILE_TOO_LARGE_MESSAGE);
  }
}
