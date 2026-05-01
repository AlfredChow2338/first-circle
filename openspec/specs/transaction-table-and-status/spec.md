## ADDED Requirements

### Requirement: Render home-page transaction table
The system SHALL render a transaction table on the home page with columns `Transaction Date`, `Account Number`, `Account Holder Name`, `Amount`, and `Status`.

#### Scenario: Show required columns and values
- **WHEN** transaction data is available in the home-page state
- **THEN** each row displays values under the required five-column structure

### Requirement: Display status labels with consistent colors
The system SHALL render status labels with the required mapping: `Pending` as yellow, `Settled` as green, and `Failed` as red.

#### Scenario: Render mapped status appearance
- **WHEN** a row has status value Pending, Settled, or Failed
- **THEN** the UI applies the corresponding label text and mapped color treatment

### Requirement: Provide failed status error tooltip
The system SHALL show the associated error message as tooltip content for rows with `Failed` status.

#### Scenario: View failed reason from status cell
- **WHEN** the user hovers or focuses on a Failed status indicator
- **THEN** the tooltip presents the row's associated error message
