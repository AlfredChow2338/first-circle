## MODIFIED Requirements

### Requirement: Menu-triggered export action
The system SHALL allow users to trigger transaction export from the `More` menu and SHALL surface outcome feedback using the shared transient message mechanism.

#### Scenario: Export from More menu
- **WHEN** the user selects `Export Transactions` from the More menu
- **THEN** the export workflow runs, a transactions CSV file download is started, and a success transient message is shown

### Requirement: Menu-triggered local data clear action
The system SHALL allow users to clear local persisted transaction data from the `More` menu after explicit confirmation and SHALL surface clear outcome feedback using the shared transient message mechanism.

#### Scenario: Clear local data from More menu
- **WHEN** the user selects `Clear Local Data` and confirms the action
- **THEN** all persisted transaction data in IndexedDB is removed, in-memory transaction state is reset, and a success transient message is shown
