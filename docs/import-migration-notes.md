# Import Migration Notes

## Commands used

- `pnpm lint:fix` for import ordering autofix.
- `pnpm lint` for final validation.

## Results

- Import ordering violations were automatically fixed by ESLint.
- No remaining lint violations for deep relative imports beyond `../../..`.

## Manual follow-up guidance

- If future files hit the deep-relative rule, convert those imports to `src/...`.
- Keep new files aligned with grouped imports: libraries -> `src/...` -> relative.
