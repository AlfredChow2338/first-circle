## MODIFIED Requirements

### Requirement: Append uploaded transactions to home-page data source
The system SHALL persist uploaded transaction records to durable client-side storage and make them visible on the home-page table after completion and across page reload, and SHALL support user-triggered clearing of that persisted dataset.

#### Scenario: Complete batch transfer and update home page
- **WHEN** the user confirms the batch transfer in the modal flow
- **THEN** uploaded transactions are added to the existing home-page transaction list

#### Scenario: Preserve transactions after application reload
- **WHEN** transactions have been previously added and the user reloads the page
- **THEN** the home-page transaction table is hydrated from persisted client-side storage with the same transaction dataset

#### Scenario: Preserve transactions after offline reload
- **WHEN** transactions were previously persisted, the app shell is already cached, and the user reloads while offline
- **THEN** the app initializes and hydrates the home-page transaction table from IndexedDB with the same transaction dataset

#### Scenario: Clear persisted dataset on demand
- **WHEN** the user invokes clear local data and confirms
- **THEN** persisted IndexedDB transaction data is removed and the home-page transaction table reflects the cleared state
