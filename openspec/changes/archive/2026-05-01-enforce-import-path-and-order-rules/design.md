## Context

The codebase has grown with mixed import styles: third-party packages, deep relative paths, and implicit cross-layer references. This causes readability issues, brittle path rewrites during refactors, and inconsistent diffs between contributors and AI-assisted edits.

The requested change defines two concrete constraints: avoid deep relative imports beyond `../../..` by preferring `src/...` absolute imports, and enforce deterministic import group order (`libraries` -> `src/...` -> `relative`). The implementation must align ESLint and Prettier so formatting and linting do not conflict.

## Goals / Non-Goals

**Goals:**
- Enforce a lint rule that disallows relative imports deeper than `../../..`.
- Enforce grouped import order: external libraries first, then `src/...` absolute imports, then relative imports.
- Keep lint/format behavior deterministic across local development and CI.
- Provide an autofix/migration path for existing files with old import style.

**Non-Goals:**
- Redesigning module boundaries or folder structure.
- Introducing path aliases beyond `src/...` for this change.
- Enforcing domain-specific layer constraints (e.g., UI cannot import state) in this iteration.

## Decisions

1. **Use ESLint as the source of truth for import policy.**
   - Decision: Implement path depth and group-order rules through ESLint plugins/rules.
   - Rationale: ESLint provides reliable static analysis and CI gating for import behavior.
   - Alternative considered: Prettier-only sorting plugin; rejected because it cannot robustly enforce relative depth policy.

2. **Add explicit `src` resolver support for linting and TypeScript.**
   - Decision: Configure parser/resolver to recognize `src/...` imports as internal modules.
   - Rationale: Prevents false positives and ensures rules classify imports correctly.
   - Alternative considered: Keep purely relative imports; rejected due to readability and refactor costs.

3. **Use ordered import groups with strict boundaries.**
   - Decision: Define order as `builtin+external`, then `src/**`, then `relative` with required blank lines between groups.
   - Rationale: Improves scanability and reduces noisy reordering in reviews.
   - Alternative considered: Alphabetical-only sorting; rejected because group semantics are required by the request.

4. **Keep Prettier focused on formatting, not policy.**
   - Decision: Use Prettier for stylistic formatting while ESLint handles import policy and optional autofixes.
   - Rationale: Avoids rule overlap and unstable behavior from competing tools.
   - Alternative considered: combine multiple import sort tools; rejected to minimize tooling conflict.

## Risks / Trade-offs

- [Large one-time import churn in existing files] -> Mitigation: stage migration with `eslint --fix` and focused follow-up cleanups.
- [False positives for resolver/path settings] -> Mitigation: add resolver config tests via sample files and run lint in CI.
- [Team friction from stricter rules] -> Mitigation: document rationale and migration commands in README/contributing notes.
- [Tool overlap between formatter and linter] -> Mitigation: keep policy in ESLint only, keep Prettier minimal and compatible.
