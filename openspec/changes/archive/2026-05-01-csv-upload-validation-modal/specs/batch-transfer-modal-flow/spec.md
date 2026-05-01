## MODIFIED Requirements

### Requirement: Open and complete batch transfer in modal stepper
The system SHALL provide a Batch Transfer modal with three ordered steps (Transfer Details, Review Records, Summary) and SHALL keep the user on the home page while the workflow is active.

#### Scenario: Open modal from home page
- **WHEN** the user clicks the Batch Transfer button on the home page
- **THEN** the system opens the stepper modal at Step 1 (Transfer Details)

#### Scenario: Navigate between steps without leaving page
- **WHEN** the user advances or goes back within the stepper
- **THEN** the modal remains open and the home page context is preserved in the background

#### Scenario: Block step advance when upload file is invalid
- **WHEN** the user attempts to continue from Step 1 with a non-CSV file or malformed CSV upload
- **THEN** the system stays on Step 1 and displays a clear upload validation error message

### Requirement: Preserve state across step navigation
The system SHALL preserve all entered batch transfer values across forward and backward navigation until the modal is closed or the flow is submitted.

#### Scenario: Preserve transfer details after review and back navigation
- **WHEN** the user enters batch name, uploads a file, selects an approver, proceeds to Step 2, and navigates back to Step 1
- **THEN** the previously entered batch name, selected file state, and approver remain populated

#### Scenario: Preserve review data while moving to summary and back
- **WHEN** parsed records are displayed in Step 2 and the user goes to Step 3 then returns to Step 2
- **THEN** the same parsed records and validation outcomes remain available without re-uploading the file
