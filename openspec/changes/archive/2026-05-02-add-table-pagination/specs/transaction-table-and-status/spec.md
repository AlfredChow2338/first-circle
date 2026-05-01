## MODIFIED Requirements

### Requirement: Render home-page transaction table
The system SHALL render a transaction table on the home page with columns `Transaction Date`, `Account Number`, `Account Holder Name`, `Amount`, `Status`, and `Actions`. The `Actions` column SHALL render status-driven controls for each row. The table SHALL paginate rows using the shared table pagination default of 10 rows per page.

#### Scenario: Show required columns and values
- **WHEN** transaction data is available in the home-page state
- **THEN** each row displays values under the required six-column structure and the `Actions` column shows controls allowed by the row status

#### Scenario: Render paginated transaction rows
- **WHEN** the transaction dataset contains more than 10 records
- **THEN** the home-page transaction table initially shows only the first 10 rows and allows navigation to remaining rows via pagination controls
