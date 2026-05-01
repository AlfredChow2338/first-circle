## ADDED Requirements

### Requirement: Bounded retry when reading selected CSV as text

The system SHALL read the user-selected CSV file as text using up to **four** attempts for that selection. After a failed attempt, the system SHALL wait before the next attempt: **1 second** after the first failure, **2 seconds** after the second failure, and **4 seconds** after the third failure.

#### Scenario: Succeed without retry

- **WHEN** the first read of the selected file completes successfully
- **THEN** the system SHALL use the resulting text as the CSV content for the batch transfer flow and SHALL NOT apply additional backoff delays for that selection

#### Scenario: Succeed after transient failure

- **WHEN** the first read fails and a subsequent read succeeds within the remaining attempts
- **THEN** the system SHALL use the successful read’s text as the CSV content and SHALL NOT treat the earlier failure as a terminal error

#### Scenario: Exhaust retries then roll back

- **WHEN** all four read attempts for the same file selection fail
- **THEN** the system SHALL perform a rollback for that selection and SHALL present a single terminal error outcome to the user

### Requirement: Roll back client upload state after terminal read failure

After a terminal failure (all read attempts exhausted), the system SHALL leave the batch transfer upload area in a state equivalent to **no successful CSV load** for that attempt: in-memory CSV text and selected file name for that flow SHALL be cleared, the file input SHALL be reset when applicable, and the user SHALL be informed with an error message that **explicitly directs them to upload the CSV again** (for example by stating they should choose or upload the file again).

#### Scenario: No stale content after rollback

- **WHEN** reads have failed terminally for a selection
- **THEN** the system SHALL NOT retain partial CSV text or a selected file name from that failed selection in the batch transfer modal state

#### Scenario: User sees upload-again guidance

- **WHEN** rollback occurs after exhausted read retries
- **THEN** the user SHALL see a visible error message that instructs them to upload the CSV again
