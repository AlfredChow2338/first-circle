## ADDED Requirements

### Requirement: Paginate shared table rows by default
The system SHALL paginate rows rendered by the shared table component with a default page size of 10 rows per page.

#### Scenario: Render first page by default
- **WHEN** a table is rendered with more than 10 rows
- **THEN** only rows 1 through 10 are visible on initial render

### Requirement: Provide page navigation controls
The system SHALL provide pagination controls to navigate between pages and SHALL prevent navigation beyond first and last page bounds.

#### Scenario: Navigate to next page
- **WHEN** the user activates the next-page control and a next page exists
- **THEN** the table renders the next 10-row slice

#### Scenario: Block navigation at boundary
- **WHEN** the user is on the first or last page
- **THEN** the corresponding previous or next control is disabled

### Requirement: Keep pagination state valid after data changes
The system SHALL keep the active page index valid when the table data length changes.

#### Scenario: Data shrinks below current page range
- **WHEN** the current page index is out of range after data changes
- **THEN** the active page is clamped to the last available page
