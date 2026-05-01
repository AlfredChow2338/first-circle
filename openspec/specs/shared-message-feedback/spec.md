## ADDED Requirements

### Requirement: Shared transient message component
The system SHALL provide a shared message mechanism that can display transient user feedback messages across the app with at least `success` and `error` variants.

#### Scenario: Show success feedback
- **WHEN** an action completes successfully and triggers a message
- **THEN** a success-styled transient message is rendered in the shared message container

### Requirement: Message lifecycle behavior
The system SHALL auto-dismiss messages after a configured duration and support multiple messages in sequence without UI breakage.

#### Scenario: Auto dismiss message
- **WHEN** a transient message is displayed
- **THEN** it is automatically removed after its configured duration

### Requirement: Message API ergonomics
The system SHALL expose a reusable invocation API that allows action handlers to trigger message display without inline status markup duplication.

#### Scenario: Trigger message from action handler
- **WHEN** a UI action handler invokes the shared message API
- **THEN** the corresponding message appears in the shared message container
