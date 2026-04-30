# Implementation Rules

## Architecture
- Keep logic in three layers: `src/domain`, `src/state`, and `src/ui`.
- Domain functions MUST be pure and deterministic.
- UI components MUST not implement business validation logic directly.

## Validation
- CSV input MUST use the exact expected header.
- Each row validation MUST return field-specific errors.
- Date validation MUST enforce `YYYY-MM-DD` and real calendar validity.

## Status Rendering
- Status mappings MUST be centralized in `src/domain/status.ts`.
- Failed status MUST expose an accessible tooltip message.

## Accessibility
- Dialog and tooltip interactions MUST be keyboard accessible.
- Failed rows MUST include semantic labels for assistive technologies.

## Testing
- Follow Red-Green-Refactor for each feature slice.
- Each new behavior MUST include tests before implementation.
- Maintain at least 80% line coverage for `src/domain`.
