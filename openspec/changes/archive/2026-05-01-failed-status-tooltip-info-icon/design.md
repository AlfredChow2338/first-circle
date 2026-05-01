## Context

The transaction table already surfaces failed payment reasons through a tooltip on failed status cells. The current trigger styling is subtle, so users can miss that error details are available. The change must preserve existing behavior while making the failed-state tooltip easier to discover and interact with using pointer and keyboard input.

## Goals / Non-Goals

**Goals:**
- Add a clear info-icon affordance next to `Failed` status text in the status column.
- Keep tooltip content source unchanged (row `errorMessage`) and preserve accessibility semantics.
- Update styling so the failed-tooltip interaction is visually clearer without changing table data flow.

**Non-Goals:**
- Changing transaction validation, status mapping, or error message generation logic.
- Introducing new tooltip dependencies or replacing existing tooltip primitives.
- Redesigning non-failed status cells.

## Decisions

1. **Render an inline info icon only for failed rows in the status cell.**
   - Rationale: Meets discoverability goal while keeping pending/settled rows visually simple.
   - Alternative considered: always showing icon for all statuses; rejected to avoid noisy UI.

2. **Use the icon (or icon+status wrapper) as the tooltip trigger with keyboard focus support.**
   - Rationale: Keeps hover and focus interaction explicit and consistent with accessibility expectations.
   - Alternative considered: keep tooltip attached to whole status cell; rejected because affordance remains ambiguous.

3. **Apply focused styling updates in existing table/modal style layers.**
   - Rationale: Minimal scoped change with low regression risk and no new dependency overhead.
   - Alternative considered: broader table theme refresh; rejected as out of scope.

## Risks / Trade-offs

- [Icon may add visual clutter in dense rows] -> Mitigation: use compact size and failed-only rendering.
- [Tooltip trigger target could become too small] -> Mitigation: ensure wrapper has adequate hit area and focus ring.
- [Style regressions in status alignment] -> Mitigation: add/adjust UI tests for failed row rendering and tooltip visibility.
