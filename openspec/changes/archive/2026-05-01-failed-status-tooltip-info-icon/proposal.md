## Why

The current failed-status tooltip is functional but has weak affordance, making it easy to miss that additional error details are available. Adding a dedicated info icon improves discoverability and accessibility for error inspection in the table.

## What Changes

- Update failed status cell UI to include an adjacent info icon when `status === Failed`.
- Anchor tooltip interaction to the icon and preserve keyboard/focus accessibility behavior.
- Refine tooltip visual presentation for clearer failed-reason readability while keeping existing error content semantics.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `transaction-table-and-status`: Failed-status tooltip trigger and presentation requirements are updated to include an info-icon affordance in the status column.

## Impact

- Affects table status cell rendering in the transaction table UI.
- Affects tooltip trigger composition and related styles for failed status rows.
- No backend/API changes and no data model changes.
