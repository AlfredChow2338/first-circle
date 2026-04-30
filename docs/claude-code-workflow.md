# Claude Code Workflow (TDD-first)

## Prompt pattern per slice
1. Reference one OpenSpec requirement and one task ID.
2. Ask for tests first, limited to specific files.
3. Ask for minimal implementation only after tests fail.
4. Ask for refactor with no behavior changes.

## Example prompt (tests first)
```
Implement task 2.3 only.
Spec: csv-record-validation.
Step 1: write failing tests for date, account format, name, and positive amount validation.
Touch only: src/domain/validation.test.ts.
Do not modify implementation files yet.
```

## Short-loop execution
- Loop A: tests generation -> run `pnpm test`.
- Loop B: minimal implementation -> run `pnpm test`.
- Loop C: refactor cleanup -> run `pnpm test && pnpm lint`.

## Review gates
- Architecture rules pass (`docs/implementation-rules.md`).
- Accessibility checks pass for dialog/tooltip behavior.
- Test + lint + build pass before moving to next slice.
