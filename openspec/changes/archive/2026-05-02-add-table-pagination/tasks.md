## 1. Shared Table Pagination Core

- [x] 1.1 Add pagination state to shared `Table` with a default page size of 10 rows.
- [x] 1.2 Slice table row rendering by current page while keeping existing column and row-key behavior.
- [x] 1.3 Clamp/reset current page when incoming data length changes and current page becomes invalid.

## 2. Pagination Controls and Styling

- [x] 2.1 Add pagination controls (previous/next and page indicator) to shared table markup.
- [x] 2.2 Disable navigation controls at first/last page boundaries.
- [x] 2.3 Add shared table styles for pagination controls and responsive layout behavior.

## 3. Consumer Verification and Tests

- [x] 3.1 Verify `TransactionTable` behavior with >10 rows using shared table pagination.
- [x] 3.2 Add/adjust shared table tests for default first-page rendering and page navigation.
- [x] 3.3 Add/adjust app/table integration tests for paginated transaction visibility.
- [x] 3.4 Run lint and targeted tests, then fix regressions introduced by pagination.
