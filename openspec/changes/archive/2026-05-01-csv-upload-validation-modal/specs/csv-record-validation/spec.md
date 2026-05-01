## MODIFIED Requirements

### Requirement: Parse uploaded CSV records for review
The system SHALL parse uploaded CSV file content using the header schema `Transaction Date,Account Number,Account Holder Name,Amount` and SHALL display parsed rows in the review step only after file-level validation passes.

#### Scenario: Parse valid CSV rows from uploaded file
- **WHEN** the user selects a `.csv` file matching the expected header and row format
- **THEN** the system converts each data row into a reviewable record in Step 2

#### Scenario: Reject non-csv file selection
- **WHEN** the user selects a file that is not `.csv`
- **THEN** the system rejects the file and displays a file-type validation message

#### Scenario: Reject malformed csv structure
- **WHEN** the uploaded file has missing required headers or inconsistent column counts
- **THEN** the system rejects parsing and displays a strict format error message

### Requirement: Validate transaction date format and validity
The system SHALL mark a row as invalid when `Transaction Date` is not ISO `YYYY-MM-DD` or does not represent a real calendar date.

#### Scenario: Reject non-ISO date
- **WHEN** a row contains a transaction date like `2025/02/21`
- **THEN** the row is flagged invalid with an error message indicating invalid date format

#### Scenario: Reject impossible calendar date
- **WHEN** a row contains a transaction date like `2025-02-30`
- **THEN** the row is flagged invalid with an error message indicating invalid date value

### Requirement: Validate account number pattern
The system SHALL mark a row as invalid when `Account Number` does not match `000-000000000-00`.

#### Scenario: Reject malformed account number
- **WHEN** a row contains an account number like `00012345678901` or includes non-digit suffix characters
- **THEN** the row is flagged invalid with an account-number format error

### Requirement: Validate account holder name presence
The system SHALL mark a row as invalid when `Account Holder Name` is empty after trimming whitespace.

#### Scenario: Reject blank account holder name
- **WHEN** a row contains an empty account holder name cell
- **THEN** the row is flagged invalid with a required-field error

### Requirement: Validate positive decimal amount
The system SHALL mark a row as invalid when `Amount` is not a decimal number greater than zero.

#### Scenario: Reject negative amount
- **WHEN** a row contains amount `-50.00`
- **THEN** the row is flagged invalid with a positive-amount validation error
