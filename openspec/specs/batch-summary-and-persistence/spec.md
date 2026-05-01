## ADDED Requirements

### Requirement: Present batch summary metrics
The system SHALL display batch transfer name, selected approver, total amount, number of payments, and average payment value in the Summary step.

#### Scenario: Show summary from reviewed records
- **WHEN** the user reaches Step 3 after records are parsed in Step 2
- **THEN** the summary view shows batch name, approver, and computed payment metrics derived from the reviewed records

### Requirement: Compute monetary summary deterministically
The system SHALL compute total amount as the sum of transaction amounts, number of payments as the record count, and average payment value as total divided by count.

#### Scenario: Calculate summary values for valid records
- **WHEN** the reviewed record list contains valid transaction amounts
- **THEN** the displayed total, count, and average match deterministic calculation results

### Requirement: Append uploaded transactions to home-page data source
The system SHALL persist uploaded transaction records to the current application data source (in-memory or local file-backed) and make them visible on the home-page table after completion.

#### Scenario: Complete batch transfer and update home page
- **WHEN** the user confirms the batch transfer in the modal flow
- **THEN** uploaded transactions are added to the existing home-page transaction list
