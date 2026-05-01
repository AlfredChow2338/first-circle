## Context

The shared `Table` component is reused across transaction and modal review UIs, and it currently renders all rows without pagination. As row counts grow, this makes scanning and interaction cumbersome, especially on smaller screens where many rows increase scrolling effort.

## Goals / Non-Goals

**Goals:**
- Add default pagination behavior to the shared table with 10 rows per page.
- Render deterministic navigation controls for moving between pages.
- Keep existing consumers functional without requiring prop changes.
- Ensure page navigation resets safely when table data changes.

**Non-Goals:**
- Server-side pagination or API-driven page fetching.
- Sorting/filtering feature additions.
- Custom page-size selection in this iteration.

## Decisions

- **Decision: Implement pagination inside the shared `Table` component.**  
  This ensures all table consumers get a consistent baseline experience and avoids duplicating paging logic in each feature component.  
  *Alternative considered:* consumer-level pagination wrappers, rejected because it fragments behavior across screens.

- **Decision: Use internal component state for current page with a fixed default page size of 10.**  
  This keeps the API backwards-compatible and meets the requested default behavior without introducing additional required props.  
  *Alternative considered:* making page size mandatory via props, rejected due to unnecessary migration overhead.

- **Decision: Clamp or reset page index when data shrinks.**  
  When rows are deleted/filtered/rehydrated, current page could become invalid; clamping prevents blank views caused by out-of-range page numbers.  
  *Alternative considered:* preserving raw page index even when invalid, rejected due to poor UX.

- **Decision: Add lightweight pagination controls below the table container.**  
  Controls include previous/next navigation and page indicators with disabled states at boundaries.  
  *Alternative considered:* only numeric page buttons, deferred to keep first iteration simple and low-risk.

## Risks / Trade-offs

- **[Risk] Pagination may affect tests that assume all rows render at once** -> **Mitigation:** update table and app tests to assert visible page slices and navigation behavior.
- **[Risk] Shared component change impacts modal review tables unintentionally** -> **Mitigation:** verify modal table usage and add focused tests where row count crosses page boundary.
- **[Trade-off] Fixed 10-row page size may not fit all contexts** -> **Mitigation:** design implementation so optional page-size configurability can be added in a follow-up without breaking API.

## Migration Plan

1. Add spec deltas for shared table pagination and transaction table behavior updates.
2. Implement shared table row slicing and navigation controls with default 10 rows per page.
3. Add/update styles for pagination controls in shared table styles.
4. Update table and app tests for paginated rendering and navigation expectations.
5. Run lint and targeted tests.

Rollback is straightforward: remove pagination state/controls and return to full-row rendering in shared table.

## Open Questions

- Should pagination controls be hidden entirely when row count is less than or equal to page size, or always visible in disabled state?
