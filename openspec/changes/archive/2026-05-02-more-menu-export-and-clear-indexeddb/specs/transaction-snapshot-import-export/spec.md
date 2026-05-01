## MODIFIED Requirements

### Requirement: Export transactions as versioned snapshot file
The system SHALL allow users to export the current transaction dataset as a CSV file containing `Transaction Date`, `Account Number`, `Account Holder Name`, and `Amount` columns.

#### Scenario: Export current transaction data
- **WHEN** the user triggers the export action on the home page
- **THEN** the system downloads a CSV file with the current transaction rows and expected column headers
