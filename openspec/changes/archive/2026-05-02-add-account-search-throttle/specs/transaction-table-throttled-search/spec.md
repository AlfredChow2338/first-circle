## ADDED Requirements

### Requirement: Filter transactions by account columns
The system SHALL provide transaction search filtering based on `Account Number` and `Account Holder Name` values.

#### Scenario: Match account number by partial query
- **WHEN** the user enters part of an account number
- **THEN** the table shows only transactions whose account number contains the query text

#### Scenario: Match account holder name by partial query
- **WHEN** the user enters part of an account holder name
- **THEN** the table shows only transactions whose account holder name contains the query text

### Requirement: Apply throttled search update
The system SHALL apply search filtering with a throttle delay of 0.5 seconds after typing activity.

#### Scenario: Delay filtering until throttle interval
- **WHEN** the user types in the search input
- **THEN** the visible filtered table results update no more frequently than once every 0.5 seconds

### Requirement: Keep existing table interactions functional with filtered data
The system SHALL preserve existing transaction table interactions while search filtering is active.

#### Scenario: Use row actions on filtered results
- **WHEN** search filtering is applied and matching rows are shown
- **THEN** row status indicators and actions remain available for the filtered rows
