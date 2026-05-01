## ADDED Requirements

### Requirement: Render shared multi-step progress indicator
The system SHALL provide a shared stepper component that renders an ordered list of steps with a numeric marker, title label, and optional helper text for each step.

#### Scenario: Render configured steps
- **WHEN** a screen provides the shared stepper with three step definitions
- **THEN** the component renders three ordered step items with visible marker and label content

### Requirement: Reflect step state visually
The system SHALL visually distinguish completed, active, and upcoming steps, including connector progress between adjacent steps.

#### Scenario: Render active middle step state
- **WHEN** the active step index is the second step in a three-step flow
- **THEN** the first step is displayed as completed, the second as active, and the third as upcoming with connector styles reflecting progress to the active step
