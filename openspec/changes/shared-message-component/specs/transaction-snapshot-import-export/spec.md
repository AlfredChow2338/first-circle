## MODIFIED Requirements

### Requirement: Export transactions as versioned snapshot file
The system SHALL allow users to export the current transaction dataset as a CSV file containing `Transaction Date`, `Account Number`, `Account Holder Name`, and `Amount` columns, and SHALL present export outcome feedback through the shared transient message mechanism.

#### Scenario: Export current transaction data
- **WHEN** the user triggers the export action on the home page
- **THEN** the system downloads a CSV file with the current transaction rows and expected column headers and shows a success transient message

### Requirement: Import snapshot with strict contract validation
The system SHALL validate imported snapshot files against the versioned contract and SHALL reject malformed or unsupported payloads with explicit error messaging through the shared transient message mechanism.

#### Scenario: Reject malformed snapshot file
- **WHEN** the user imports a snapshot with invalid JSON or missing required contract fields
- **THEN** the system does not mutate transaction state and displays an error transient message

### Requirement: Replace transaction dataset on valid import
The system SHALL replace the existing transaction list with imported transactions after a valid snapshot import.

#### Scenario: Replace-all import success
- **WHEN** the user imports a valid versioned snapshot file
- **THEN** the home page table reflects the imported transaction list as the new persisted dataset and a success transient message is shown
