import { describe, expect, it } from "vitest";

import {
  assertCsvFileSizeAllowed,
  CSV_FILE_TOO_LARGE_MESSAGE,
  CSV_MAX_FILE_BYTES,
} from "./csvUploadLimits";

describe("assertCsvFileSizeAllowed", () => {
  it("allows files at or under the limit", () => {
    expect(() => assertCsvFileSizeAllowed({ size: 0 } as File)).not.toThrow();
    expect(() => assertCsvFileSizeAllowed({ size: CSV_MAX_FILE_BYTES } as File)).not.toThrow();
  });

  it("rejects files over the limit", () => {
    expect(() => assertCsvFileSizeAllowed({ size: CSV_MAX_FILE_BYTES + 1 } as File)).toThrow(
      CSV_FILE_TOO_LARGE_MESSAGE,
    );
  });
});
