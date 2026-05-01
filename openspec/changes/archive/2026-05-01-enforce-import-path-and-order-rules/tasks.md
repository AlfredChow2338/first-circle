## 1. Tooling setup and resolver alignment

- [x] 1.1 Confirm current ESLint flat config supports TypeScript and import plugins needed for path-depth and group-order rules.
- [x] 1.2 Add or update resolver settings so `src/...` imports are classified as internal and linted correctly.
- [x] 1.3 Add or verify Prettier config to avoid overlapping import-order behavior with ESLint.

## 2. Import path boundary enforcement

- [x] 2.1 Implement ESLint rule configuration to disallow relative imports deeper than `../../..`.
- [x] 2.2 Verify allowed relative imports (`./`, `../`, `../../`, `../../../`) do not trigger violations.
- [x] 2.3 Ensure violations include clear remediation guidance to use `src/...` absolute imports.

## 3. Import group ordering enforcement

- [x] 3.1 Configure import ordering groups as libraries -> `src/...` -> relative imports.
- [x] 3.2 Enforce blank lines between groups and stable alphabetization within groups where supported.
- [x] 3.3 Add or update lint autofix command usage to correct sortable import-order issues.

## 4. Migration and workflow integration

- [x] 4.1 Run lint autofix across source files and inspect remaining non-fixable import path violations.
- [x] 4.2 Update project documentation with examples of compliant and non-compliant imports.
- [x] 4.3 Ensure CI/local scripts run format then lint in a non-conflicting sequence.

## 5. Verification

- [x] 5.1 Add targeted fixture or sample files demonstrating pass/fail behavior for both rules.
- [x] 5.2 Run full lint and test/build checks to ensure tooling changes do not break existing workflows.
- [x] 5.3 Capture final migration notes, including any unresolved files requiring manual import path edits.
