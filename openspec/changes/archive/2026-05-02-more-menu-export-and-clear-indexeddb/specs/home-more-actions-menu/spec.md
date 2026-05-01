## ADDED Requirements

### Requirement: Home page exposes secondary actions via More menu
The system SHALL replace the dedicated export button with a `More` button that opens a menu containing secondary data actions.

#### Scenario: Open More menu
- **WHEN** the user clicks the `More` button on the home page
- **THEN** a menu is shown with `Export Transactions` and `Clear Local Data` options

### Requirement: Menu-triggered export action
The system SHALL allow users to trigger transaction export from the `More` menu.

#### Scenario: Export from More menu
- **WHEN** the user selects `Export Transactions` from the More menu
- **THEN** the export workflow runs and a transactions CSV file download is started

### Requirement: Menu-triggered local data clear action
The system SHALL allow users to clear local persisted transaction data from the `More` menu after explicit confirmation.

#### Scenario: Clear local data from More menu
- **WHEN** the user selects `Clear Local Data` and confirms the action
- **THEN** all persisted transaction data in IndexedDB is removed and the in-memory transaction table state is reset
