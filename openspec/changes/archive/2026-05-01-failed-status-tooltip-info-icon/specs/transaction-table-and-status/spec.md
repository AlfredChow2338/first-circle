## MODIFIED Requirements

### Requirement: Provide failed status error tooltip
The system SHALL show an info icon next to the `Failed` status label and SHALL present the associated error message as tooltip content for rows with `Failed` status.

#### Scenario: View failed reason from status cell
- **WHEN** the user hovers or focuses on the info icon adjacent to a Failed status indicator
- **THEN** the tooltip presents the row's associated error message
