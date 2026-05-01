## ADDED Requirements

### Requirement: Keep lint and formatter responsibilities non-conflicting
The tooling configuration SHALL define import policy in ESLint while keeping Prettier focused on formatting so import order/depth rules are not duplicated or contradictory.

#### Scenario: Run lint and format in sequence
- **WHEN** developers run formatting and lint checks locally or in CI
- **THEN** import rules are enforced by ESLint without conflicting changes from Prettier

### Requirement: Provide migration and autofix workflow
The project scripts/documentation SHALL provide a clear command path to detect and fix import-order violations and identify remaining path-depth issues.

#### Scenario: Migrate existing files to new import rules
- **WHEN** maintainers run the documented lint autofix workflow
- **THEN** sortable violations are automatically corrected and unresolved depth violations remain clearly reported
