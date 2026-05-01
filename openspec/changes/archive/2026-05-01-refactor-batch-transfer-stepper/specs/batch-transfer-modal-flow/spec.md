## MODIFIED Requirements

### Requirement: Open and complete batch transfer in modal stepper
The system SHALL provide a Batch Transfer modal with three ordered steps (Transfer Details, Review Records, Summary), SHALL keep the user on the home page while the workflow is active, and SHALL render progression using a visual shared stepper indicator instead of plain step-count text.

#### Scenario: Open modal from home page
- **WHEN** the user clicks the Batch Transfer button on the home page
- **THEN** the system opens the stepper modal at Step 1 (Transfer Details)

#### Scenario: Navigate between steps without leaving page
- **WHEN** the user advances or goes back within the stepper
- **THEN** the modal remains open and the home page context is preserved in the background

#### Scenario: Step header reflects current progress state
- **WHEN** the user transitions between Step 1, Step 2, and Step 3
- **THEN** the modal stepper updates to mark prior steps as completed, current step as active, and remaining steps as waiting
