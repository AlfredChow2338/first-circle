## Why

Current import statements are inconsistent and include deep relative paths that reduce readability and make refactoring brittle. Standardizing import path boundaries and order now improves maintainability and keeps lint/format behavior predictable across contributors and AI-generated edits.

## What Changes

- Add lint rules to discourage deep relative imports beyond `../../..` and prefer `src/...` absolute imports for cross-module access.
- Add import ordering rules that enforce groups in this order: third-party libraries, `src/...` internal absolute imports, then relative imports (`./...`, `../...`).
- Update formatter/linter integration so rule violations are surfaced consistently in local development and CI.
- Provide migration guidance and autofix commands for existing code that violates new import rules.

## Capabilities

### New Capabilities
- `import-path-boundary-enforcement`: Enforce limits on deep relative imports and standardize use of `src/...` absolute imports.
- `import-order-grouping`: Enforce deterministic import grouping order of libraries, `src/...`, then relative imports.
- `lint-format-workflow-alignment`: Align ESLint and Prettier configuration to prevent conflicting behavior for import organization.

### Modified Capabilities
- None.

## Impact

- Affects ESLint and Prettier configuration files plus project scripts for lint/format checks.
- May require one-time import path updates across existing source files.
- No runtime API behavior changes; impact is limited to code quality tooling and developer workflow.
