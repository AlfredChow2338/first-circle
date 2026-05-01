import { describe, expect, it } from "vitest";

import { sanitizeCsvTextFieldForExcel } from "./sanitizeCsvTextFieldForExcel";

describe("sanitizeCsvTextFieldForExcel", () => {
  it("leaves normal text unchanged", () => {
    expect(sanitizeCsvTextFieldForExcel("John Doe")).toBe("John Doe");
    expect(sanitizeCsvTextFieldForExcel("000-123456789-01")).toBe("000-123456789-01");
    expect(sanitizeCsvTextFieldForExcel("2025-02-20")).toBe("2025-02-20");
    expect(sanitizeCsvTextFieldForExcel("")).toBe("");
  });

  it("prefixes leading formula triggers with a single quote", () => {
    expect(sanitizeCsvTextFieldForExcel("=1+1")).toBe("'=1+1");
    expect(sanitizeCsvTextFieldForExcel("+123")).toBe("'+123");
    expect(sanitizeCsvTextFieldForExcel("-sum(A1)")).toBe("'-sum(A1)");
    expect(sanitizeCsvTextFieldForExcel("@SUM(A1)")).toBe("'@SUM(A1)");
    expect(sanitizeCsvTextFieldForExcel("\t=cmd")).toBe("'\t=cmd");
    expect(sanitizeCsvTextFieldForExcel("\r=1")).toBe("'\r=1");
    expect(sanitizeCsvTextFieldForExcel("|danger")).toBe("'|danger");
  });

  it("prefixes when trigger follows BOM or leading spaces", () => {
    expect(sanitizeCsvTextFieldForExcel("\uFEFF=1+1")).toBe("'\uFEFF=1+1");
    expect(sanitizeCsvTextFieldForExcel("  =1+1")).toBe("'  =1+1");
  });

  it("does not strip or alter safe hyphenated tokens mid-string", () => {
    expect(sanitizeCsvTextFieldForExcel("Smith-Jones")).toBe("Smith-Jones");
  });
});
