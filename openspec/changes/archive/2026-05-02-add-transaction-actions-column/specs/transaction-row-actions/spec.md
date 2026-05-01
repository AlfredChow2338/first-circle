## ADDED Requirements

### Requirement: Provide status-based row actions
The system SHALL render row actions based on transaction status. For `Pending` rows, the available actions SHALL be `View` and `Settle`. For `Failed` and `Settled` rows, the available action SHALL be `View` only.

#### Scenario: Render actions for a pending transaction
- **WHEN** a transaction row has status `Pending`
- **THEN** the row shows `View` and `Settle` actions

#### Scenario: Render actions for non-pending transactions
- **WHEN** a transaction row has status `Failed` or `Settled`
- **THEN** the row shows only the `View` action and does not show `Settle`

### Requirement: View action opens transaction details
The system SHALL open a transaction details modal when the user triggers `View` from any transaction row.

#### Scenario: Open details modal from actions column
- **WHEN** the user clicks `View` for a transaction row
- **THEN** a modal opens and displays that transaction's details

### Requirement: Settle action updates pending transaction after mock delay
The system SHALL trigger a mock settlement operation that completes after 2 seconds and SHALL update the selected `Pending` transaction status to `Settled` on completion.

#### Scenario: Complete settlement for pending transaction
- **WHEN** the user clicks `Settle` on a `Pending` transaction row
- **THEN** the system waits 2 seconds and updates that transaction status to `Settled`

#### Scenario: Prevent duplicate settlement while pending
- **WHEN** a `Settle` operation is already in progress for a row
- **THEN** the `Settle` action for that row is disabled or shown as loading until completion
