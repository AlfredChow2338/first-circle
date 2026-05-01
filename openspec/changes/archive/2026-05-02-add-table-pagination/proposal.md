## Why

The shared table currently renders all rows at once, which reduces scanability and makes larger datasets harder to navigate. Adding default pagination improves readability and interaction performance without requiring consumers to reimplement paging logic.

## What Changes

- Add built-in pagination behavior to the shared `Table` component in `src/components/shared/Table/Table.tsx`.
- Set the default page size to 10 rows.
- Add page navigation controls to move between table pages.
- Keep the table API backwards compatible so existing table consumers continue to work.
- Ensure the transaction table experience reflects pagination when row count exceeds 10.

## Capabilities

### New Capabilities
- `shared-table-pagination`: Provide default 10-row pagination and navigation controls for shared table rendering.

### Modified Capabilities
- `transaction-table-and-status`: Update transaction table behavior to support paginated rendering over the shared table component.

## Impact

- Affected UI components: `src/components/shared/Table/*`, `src/components/TransactionTable/*`, and possibly other shared table consumers.
- Affected styles: table control styling in `src/styles/table.css.ts` (or equivalent shared style files).
- Affected tests: shared table and app/table interaction tests to validate page slicing and navigation.
- No new external dependencies are required.
