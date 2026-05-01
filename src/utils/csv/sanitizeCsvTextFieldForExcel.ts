/**
 * Reduces CSV / spreadsheet formula injection when an exported file is opened in Excel,
 * Google Sheets, or similar tools that interpret cells starting with =, +, -, @, tab, CR, or |.
 *
 * Prefixes a single ASCII apostrophe so the cell is treated as text; the apostrophe is not
 * displayed as content in typical Excel behavior. See OWASP CSV Injection guidance.
 *
 * @see https://owasp.org/www-community/attacks/CSV_Injection
 */
const FORMULA_TRIGGER = /^[\s\uFEFF]*[=+\-@\t\r|]/;

export function sanitizeCsvTextFieldForExcel(value: string): string {
  const s = value ?? "";
  if (FORMULA_TRIGGER.test(s)) {
    return `'${s}`;
  }
  return s;
}
