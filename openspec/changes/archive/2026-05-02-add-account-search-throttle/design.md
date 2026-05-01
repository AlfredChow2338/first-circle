## Context

The transaction table currently supports status/actions and pagination, but users cannot quickly narrow large datasets by account information. Searching by account number and account holder name with throttled input handling provides faster discovery while avoiding aggressive re-renders on every keystroke.

## Goals / Non-Goals

**Goals:**
- Add a search input for transaction data based on `Account Number` and `Account Holder Name`.
- Apply a throttle delay of 0.5 seconds before updating rendered search results.
- Keep existing table functionality (status display, actions, pagination) compatible with filtered rows.
- Ensure matching is partial and case-insensitive for holder names.

**Non-Goals:**
- Full-text search across all columns.
- Backend/server-side search.
- Fuzzy ranking, highlighting, or advanced query syntax.

## Decisions

- **Decision: Implement throttled search in app-level state/hook layer before data is passed into `TransactionTable`.**  
  This keeps shared table generic and allows feature-specific filtering without coupling search logic into reusable table infrastructure.  
  *Alternative considered:* embedding search inside shared `Table`, rejected due to reduced reusability and unclear column semantics.

- **Decision: Use a 500ms throttle window via timer-based hook logic.**  
  The UI updates at most once every 500ms while the user types, balancing responsiveness with stable rendering on larger datasets.  
  *Alternative considered:* debounce behavior, rejected because requirement explicitly asks for throttle.

- **Decision: Normalize search text and searchable fields for case-insensitive matching.**  
  Both query and `accountHolderName` are lowercased before matching; account number remains exact-character partial matching.  
  *Alternative considered:* case-sensitive matching, rejected due to poorer UX.

- **Decision: Reset pagination view implicitly through filtered data updates.**  
  Existing shared table pagination clamping handles reduced row counts after filtering without extra pagination-specific wiring in search logic.

## Risks / Trade-offs

- **[Risk] Users may expect immediate per-keystroke updates** -> **Mitigation:** keep throttle interval short (500ms) and validate UX with real table sizes.
- **[Risk] Timer cleanup bugs can cause stale updates** -> **Mitigation:** clear timers on input changes/unmount in hook implementation.
- **[Trade-off] Throttle allows slightly stale results during active typing** -> **Mitigation:** this is acceptable for improved rendering stability and requirement alignment.

## Migration Plan

1. Add search input UI and throttle-aware query handling in app/hooks.
2. Filter transaction data by account number and account holder name before passing to `TransactionTable`.
3. Update tests to cover throttled update timing and column-specific filtering behavior.
4. Run lint and targeted app/table tests.

Rollback path: remove search UI/hook and pass original transaction list directly to table.

## Open Questions

- Should empty-result state messaging be included now (e.g., “No matching transactions”), or defer to a separate UX enhancement?
