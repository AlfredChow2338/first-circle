## ADDED Requirements

### Requirement: Run batch confirmation computation in Web Worker
The system SHALL execute batch confirmation computation in a Web Worker when confirming parsed batch rows.

#### Scenario: Confirm large batch without main-thread compute blocking
- **WHEN** the user confirms a batch containing many parsed rows
- **THEN** transaction mapping and summary-related computation run in a worker context before store commit

### Requirement: Preserve deterministic confirmation outputs
The system SHALL produce the same deterministic transaction outputs and summary inputs as the prior synchronous implementation.

#### Scenario: Worker computes expected transaction payload
- **WHEN** parsed rows are sent to the worker
- **THEN** returned transactions and computed values match deterministic rules used by existing batch confirmation behavior

### Requirement: Handle worker failure with safe fallback
The system SHALL recover from worker execution failures by using a deterministic fallback compute path.

#### Scenario: Worker throws during confirmation
- **WHEN** worker initialization or execution fails
- **THEN** batch confirmation still completes using fallback computation and commits valid transaction results
