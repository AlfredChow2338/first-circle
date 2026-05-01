const BACKOFF_MS = [1000, 2000, 4000] as const;
const MAX_ATTEMPTS = 4;

/** Shown after all read attempts fail; instructs user to upload again. */
export const CSV_READ_TERMINAL_ERROR =
  "Could not read the file after several tries. Please upload your CSV again.";

export type ReadFileAsTextWithRetryOptions = {
  readFile?: (file: File) => Promise<string>;
  sleep?: (ms: number) => Promise<void>;
  /** Called before waiting to retry, with the zero-based index of the attempt that just failed. */
  onRetry?: (failedAttemptIndex: number) => void;
};

function defaultReadFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read uploaded file"));
    reader.readAsText(file);
  });
}

function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Reads a file as text with up to four attempts and backoff 1s, 2s, 4s after failures.
 */
export async function readFileAsTextWithRetry(
  file: File,
  options: ReadFileAsTextWithRetryOptions = {},
): Promise<string> {
  const readFile = options.readFile ?? defaultReadFileAsText;
  const sleep = options.sleep ?? defaultSleep;

  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      return await readFile(file);
    } catch (error) {
      lastError = error;
      if (attempt >= MAX_ATTEMPTS - 1) {
        break;
      }
      options.onRetry?.(attempt);
      await sleep(BACKOFF_MS[attempt]);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Unable to read uploaded file");
}
